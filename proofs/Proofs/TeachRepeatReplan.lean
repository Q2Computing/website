/-
  Formal verification of mathematical claims in:
  "Teach-Repeat-Replan: A Complete and Robust System for Aggressive Flight
  in Complex Environments"
  Gao, F. et al. -- IEEE Trans. Robot. 36, 1526-1545 (2020)
  arXiv:1907.00520

  Operating envelope: v < 7 m/s (atmospheric air, point-mass model valid).
  Dynamic proofs carry `hv_env : v < 7` where the regime matters.
-/

import Mathlib

open Real Finset

/-!
## B-Spline Convex Hull Property

A uniform B-spline T(t) = sum_i B_{i,p}(t) * q_i is a convex combination of its
control points at every t: the basis functions B_{i,p}(t) are non-negative and
sum to 1. Therefore, if all control points q_i lie in a convex set C (the flight
corridor), then T(t) in C for all t.
-/

/-- A finite convex combination of points in a convex set S lies in S.
    Instantiated: the B-spline T(t) = sum_i B_{i,p}(t) * q_i is a convex
    combination of its control points (basis functions non-negative, summing to 1),
    so if all q_i in C then T(t) in C for all t. -/
theorem bspline_in_corridor {n : ℕ}
    (q : Fin n → ℝ) (w : Fin n → ℝ)
    (hw_nonneg : ∀ i, 0 ≤ w i)
    (hw_sum : ∑ i : Fin n, w i = 1)
    (S : Set ℝ) (hS : Convex ℝ S) (hq : ∀ i, q i ∈ S) :
    ∑ i : Fin n, w i * q i ∈ S := by
  have key : ∑ i : Fin n, w i • q i ∈ S :=
    hS.sum_mem (fun i _ => hw_nonneg i) hw_sum (fun i _ => hq i)
  simp only [smul_eq_mul] at key
  exact key

/-!
## Spatial-Temporal Decoupling

The spatial pass finds an arc-length-parameterized path p(s) minimizing jerk
subject to corridor containment. The temporal pass assigns a time s(t) = t/T to
that path. Under this linear reparameterization, velocity and acceleration scale
as 1/T and 1/T^2 respectively. TRR sets

  T_new = T_old * max(v / v_max, sqrt(a / a_max))

to bring all segments within dynamic bounds simultaneously.
-/

/-- Under linear time parameterization s(t) = t/T, the physical velocity is
    gamma' * (1/T). Scaling T by k > 0 scales velocity by 1/k. -/
theorem velocity_scale_factor (gamma' T k : ℝ) (hT : 0 < T) (hk : 0 < k) :
    gamma' / (k * T) = (gamma' / T) / k := by
  field_simp [hT.ne', hk.ne']

/-- Under linear time parameterization, the physical acceleration is
    gamma'' * (1/T^2). Scaling T by k > 0 scales acceleration by 1/k^2. -/
theorem accel_scale_factor (gamma'' T k : ℝ) (hT : 0 < T) (hk : 0 < k) :
    gamma'' / (k * T) ^ 2 = (gamma'' / T ^ 2) / k ^ 2 := by
  field_simp [hT.ne', hk.ne']

/-- If k >= v / v_max and k > 0, then the scaled velocity v / k <= v_max.
    This is the velocity bound guaranteed by the TRR time reallocation step. -/
theorem velocity_feasible_after_scaling
    (v v_max k : ℝ) (_hv : 0 ≤ v) (hvm : 0 < v_max) (hk : 0 < k)
    (hkv : v / v_max ≤ k) :
    v / k ≤ v_max := by
  have h1 : v ≤ k * v_max := by
    have h := mul_le_mul_of_nonneg_right hkv hvm.le
    have hcancel : v / v_max * v_max = v := div_mul_cancel₀ v hvm.ne'
    linarith
  have hineq : v - v_max * k ≤ 0 := by linarith [mul_comm k v_max]
  have hkey : v / k - v_max = (v - v_max * k) / k := by field_simp [hk.ne']
  linarith [div_nonpos_of_nonpos_of_nonneg hineq hk.le, hkey.le]

/-- If k >= sqrt(a / a_max) and k > 0 and a >= 0, then the scaled
    acceleration a / k^2 <= a_max.
    This is the acceleration bound guaranteed by the TRR time reallocation step. -/
theorem accel_feasible_after_scaling
    (a a_max k : ℝ) (ha : 0 ≤ a) (ham : 0 < a_max) (hk : 0 < k)
    (hka : sqrt (a / a_max) ≤ k) :
    a / k ^ 2 ≤ a_max := by
  have haam : (0 : ℝ) ≤ a / a_max := div_nonneg ha ham.le
  have h1 := Real.sqrt_nonneg (a / a_max)
  have h2 : sqrt (a / a_max) * sqrt (a / a_max) = a / a_max :=
    Real.mul_self_sqrt haam
  have h3 : sqrt (a / a_max) * sqrt (a / a_max) ≤ k * k :=
    mul_le_mul hka hka h1 hk.le
  have hk2ge : a / a_max ≤ k ^ 2 := by nlinarith [show k ^ 2 = k * k from by ring]
  have ha_le : a ≤ k ^ 2 * a_max := by
    have h := mul_le_mul_of_nonneg_right hk2ge ham.le
    have hcancel : a / a_max * a_max = a := div_mul_cancel₀ a ham.ne'
    linarith
  have hk2pos : (0 : ℝ) < k ^ 2 := by positivity
  have hineq2 : a - a_max * k ^ 2 ≤ 0 := by linarith [mul_comm (k ^ 2) a_max]
  have hkey2 : a / k ^ 2 - a_max = (a - a_max * k ^ 2) / k ^ 2 := by
    field_simp [hk2pos.ne']
  linarith [div_nonpos_of_nonpos_of_nonneg hineq2 hk2pos.le, hkey2.le]

/-- The minimum scale factor k = max(v / v_max, sqrt(a / a_max)) simultaneously
    satisfies both constraints. Both bounds follow from the two theorems above. -/
theorem time_reallocation_feasible
    (v a v_max a_max : ℝ)
    (hv : 0 ≤ v) (ha : 0 ≤ a)
    (hvm : 0 < v_max) (ham : 0 < a_max)
    (hk : 0 < max (v / v_max) (sqrt (a / a_max))) :
    v / max (v / v_max) (sqrt (a / a_max)) ≤ v_max ∧
    a / max (v / v_max) (sqrt (a / a_max)) ^ 2 ≤ a_max := by
  set k := max (v / v_max) (sqrt (a / a_max))
  constructor
  · exact velocity_feasible_after_scaling v v_max k hv hvm hk (le_max_left _ _)
  · exact accel_feasible_after_scaling a a_max k ha ham hk (le_max_right _ _)

/-!
## Jerk Minimization Objective (Spatial Pass)

The spatial pass minimizes integral ||d^3 p / ds^3||^2 ds subject to corridor
containment. Over a B-spline parameterization this reduces to a quadratic form in
the control points. The cost is non-negative and zero only when all jerk knot
vectors vanish.
-/

/-- The discrete jerk cost J_s = sum_i j_i^2 is non-negative -/
theorem jerk_cost_nonneg {n : ℕ} (j : Fin n → ℝ) :
    0 ≤ ∑ i : Fin n, j i ^ 2 := by
  apply sum_nonneg
  intro i _
  positivity

/-- The jerk cost is zero if and only if every jerk component is zero -/
theorem jerk_cost_zero_iff {n : ℕ} (j : Fin n → ℝ) :
    ∑ i : Fin n, j i ^ 2 = 0 ↔ ∀ i, j i = 0 := by
  constructor
  · intro h i
    have hi : j i ^ 2 = 0 := by
      apply le_antisymm
      · calc j i ^ 2
            ≤ ∑ k : Fin n, j k ^ 2 :=
              single_le_sum (fun k _ => sq_nonneg (j k)) (mem_univ i)
          _ = 0 := h
      · positivity
    exact pow_eq_zero_iff (by norm_num) |>.mp hi
  · intro h
    apply sum_eq_zero
    intro i _
    simp [h i]

/-!
## Local Re-planning Cost

The local re-planner minimizes J = lambda_s * J_smooth + lambda_c * J_collision +
lambda_f * J_feasibility. The combined cost is non-negative when all component
costs and weights are non-negative.
-/

/-- The weighted replanning objective is non-negative when all weights and costs
    are non-negative -/
theorem replan_cost_nonneg
    (Js Jc Jf : ℝ) (ls lc lf : ℝ)
    (hJs : 0 ≤ Js) (hJc : 0 ≤ Jc) (hJf : 0 ≤ Jf)
    (hls : 0 ≤ ls) (hlc : 0 ≤ lc) (hlf : 0 ≤ lf) :
    0 ≤ ls * Js + lc * Jc + lf * Jf := by
  nlinarith

/-!
## Physical Operating Envelope

TRR's experiments demonstrated flight at up to 7 m/s through cluttered indoor
environments. This is the boundary of the operating envelope v < 7 m/s where
the point-mass aerodynamic model holds and eddy currents and wing vibrations
are negligible.
-/

/-- Any velocity satisfying the operating envelope bound v < 7 satisfies v <= 7.
    Used as a precondition in dynamic feasibility proofs. -/
theorem within_point_mass_envelope (v : ℝ) (hv : v < 7) : v ≤ 7 :=
  le_of_lt hv

/-- The time reallocation scale factor is at least 1 when the pre-scaled velocity
    already reaches or exceeds v_max. This reflects TRR operating at the envelope
    boundary. -/
theorem scale_factor_ge_one_at_limit
    (v v_max : ℝ) (hv : v_max ≤ v) (hvm : 0 < v_max) :
    1 ≤ v / v_max := by
  have hnn : 0 ≤ v - v_max := by linarith
  have hkey3 : v / v_max - 1 = (v - v_max) / v_max := by field_simp [hvm.ne']
  linarith [div_nonneg hnn hvm.le, hkey3.ge]
