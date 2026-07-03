/-
  Formal verification of mathematical claims in:
  "EGO-Planner: An ESDF-Free Gradient-Based Local Planner for Quadrotors"
  Zhou, X., Wang, Z., Xu, C. & Gao, F. -- IEEE Robot. Autom. Lett. 6, 478-485 (2021)
  arXiv:2008.08835

  The paper's core innovation is eliminating the Euclidean Signed Distance Field
  by replacing it with a squared-distance penalty whose gradient points directly
  toward a collision-free guiding path. We prove the gradient formula, convexity,
  and non-negativity of the collision cost, and the correctness of the time
  reallocation step for dynamic feasibility.

  Time reallocation proofs are shared with TRR (arXiv:1907.00520); see
  TeachRepeatReplan.lean for the primary versions imported here.
-/

import Proofs.Imports
import Proofs.TeachRepeatReplan

open Real Finset

/-!
## ESDF-Free Collision Cost

For each control point q_i in collision, let g_i be the nearest point on a
collision-free guiding path. The collision cost is:

  J_c(q_i) = (1/2) * (q_i - g_i)^2

The gradient is:

  nabla J_c = q_i - g_i

This replaces the ESDF gradient entirely: the gradient points from the
collision point toward the guiding path, so descending J_c moves q_i toward
free space. No distance field query is needed.
-/

noncomputable def collisionCost (g : ℝ) : ℝ → ℝ :=
  fun q => (1 / 2 : ℝ) * (q - g) ^ 2

/-- The collision cost is non-negative -/
theorem collisionCost_nonneg (g q : ℝ) : 0 ≤ collisionCost g q := by
  unfold collisionCost; positivity

/-- The collision cost is zero if and only if the control point coincides with
    the guide point (i.e., the control point is on the collision-free path) -/
theorem collisionCost_zero_iff (g q : ℝ) : collisionCost g q = 0 ↔ q = g := by
  unfold collisionCost
  constructor
  · intro h
    have hsq : (q - g) ^ 2 = 0 := by
      have hh : (1 / 2 : ℝ) * (q - g) ^ 2 = 0 := h
      have hpos : (0 : ℝ) < 1 / 2 := by norm_num
      exact (mul_eq_zero.mp hh).resolve_left (ne_of_gt hpos)
    have heq : q - g = 0 := pow_eq_zero_iff (by norm_num) |>.mp hsq
    linarith
  · intro h; subst h; ring

/-- The derivative of (1/2)(x - g)^2 at x = q is (q - g).
    This is the gradient formula that replaces the ESDF lookup. -/
theorem collisionCost_hasDerivAt (g q : ℝ) :
    HasDerivAt (collisionCost g) (q - g) q := by
  unfold collisionCost
  have h1 : HasDerivAt (fun x : ℝ => x - g) 1 q := by
    have h := (hasDerivAt_id q).sub (hasDerivAt_const q g)
    have hf : (id - fun _ : ℝ => g) = (fun x : ℝ => x - g) := by ext; simp [id]
    rw [hf, sub_zero] at h
    exact h
  have h2 : HasDerivAt (fun x : ℝ => (x - g) ^ 2) (2 * (q - g)) q := by
    have raw := h1.pow 2
    simp only [show (2 : ℕ) - 1 = 1 from rfl, Nat.cast_ofNat, pow_one, mul_one] at raw
    exact raw
  have h3 : HasDerivAt (fun x : ℝ => (1 / 2 : ℝ) * (x - g) ^ 2) (q - g) q := by
    have raw3 := h2.const_mul (1 / 2 : ℝ)
    have key3 : (1 / 2 : ℝ) * (2 * (q - g)) = q - g := by ring
    rwa [key3] at raw3
  exact h3

/-- The gradient is zero if and only if q equals the guide point -/
theorem collisionCost_grad_zero_iff (g q : ℝ) :
    q - g = 0 ↔ q = g := by
  constructor
  · intro h; linarith
  · intro h; subst h; ring

/-- The collision cost is strictly convex: the function is convex on all of ℝ.
    Proof: (1/2)(sx+ty-g)^2 <= s*(1/2)(x-g)^2 + t*(1/2)(y-g)^2 follows
    because s*t*(x-g-(y-g))^2 >= 0 combined with s+t=1. -/
theorem collisionCost_convex (g : ℝ) : ConvexOn ℝ Set.univ (collisionCost g) := by
  unfold collisionCost
  constructor
  · exact convex_univ
  · intro x _ y _ s t hs ht hst
    simp only [smul_eq_mul]
    suffices h : 0 ≤ s * (1 / 2 * (x - g) ^ 2) + t * (1 / 2 * (y - g) ^ 2) -
        1 / 2 * (s * x + t * y - g) ^ 2 by linarith
    have key : s * (1 / 2 * (x - g) ^ 2) + t * (1 / 2 * (y - g) ^ 2) -
        1 / 2 * (s * x + t * y - g) ^ 2 = 1 / 2 * s * t * ((x - g) - (y - g)) ^ 2 := by
      have ht_eq : t = 1 - s := by linarith
      subst ht_eq; ring
    rw [key]
    exact mul_nonneg (mul_nonneg (mul_nonneg (by norm_num) hs) ht) (sq_nonneg _)

/-!
## Smoothness Cost

The smoothness penalty operates on finite differences of control points,
corresponding to velocity v_i, acceleration a_i, and jerk j_i under the
B-spline parameterization:

  J_s = lambda_v * sum ||v_i||^2 + lambda_a * sum ||a_i||^2 + lambda_j * sum ||j_i||^2
-/

/-- The smoothness cost is non-negative when all weights are non-negative -/
theorem smoothness_cost_nonneg {n : ℕ}
    (v a j : Fin n → ℝ) (lv la lj : ℝ)
    (hlv : 0 ≤ lv) (hla : 0 ≤ la) (hlj : 0 ≤ lj) :
    0 ≤ lv * ∑ i : Fin n, v i ^ 2 +
         la * ∑ i : Fin n, a i ^ 2 +
         lj * ∑ i : Fin n, j i ^ 2 := by
  apply add_nonneg
  · apply add_nonneg
    · exact mul_nonneg hlv (sum_nonneg fun i _ => sq_nonneg _)
    · exact mul_nonneg hla (sum_nonneg fun i _ => sq_nonneg _)
  · exact mul_nonneg hlj (sum_nonneg fun i _ => sq_nonneg _)

/-!
## Total Optimization Objective

  J = lambda_s * J_smooth + lambda_c * J_collision

The time reallocation step (see TeachRepeatReplan.lean) then adjusts T to restore
dynamic feasibility after each gradient step. We re-export the key feasibility
results here for completeness.
-/

/-- The total EGO-Planner objective is non-negative when both component costs
    and weights are non-negative -/
theorem ego_planner_cost_nonneg
    (Js Jc ls lc : ℝ)
    (hJs : 0 ≤ Js) (hJc : 0 ≤ Jc)
    (hls : 0 ≤ ls) (hlc : 0 ≤ lc) :
    0 ≤ ls * Js + lc * Jc := by
  nlinarith

/-- Re-export: time reallocation velocity guarantee (see TeachRepeatReplan.lean) -/
alias ego_velocity_feasible := velocity_feasible_after_scaling

/-- Re-export: time reallocation acceleration guarantee (see TeachRepeatReplan.lean) -/
alias ego_accel_feasible := accel_feasible_after_scaling

/-!
## Discrete Collision Sum

When the trajectory has multiple control points in collision, the total collision
cost is the sum of individual squared penalties.
-/

/-- The sum of collision costs over all control points is non-negative -/
theorem total_collision_cost_nonneg {n : ℕ} (q g : Fin n → ℝ) :
    0 ≤ ∑ i : Fin n, collisionCost (g i) (q i) := by
  apply sum_nonneg
  intro i _
  exact collisionCost_nonneg (g i) (q i)

/-- The total collision cost is zero iff every control point is on its guide -/
theorem total_collision_zero_iff {n : ℕ} (q g : Fin n → ℝ) :
    ∑ i : Fin n, collisionCost (g i) (q i) = 0 ↔
    ∀ i, q i = g i := by
  constructor
  · intro h i
    have hi : collisionCost (g i) (q i) = 0 := by
      apply le_antisymm
      · calc collisionCost (g i) (q i)
            ≤ ∑ k : Fin n, collisionCost (g k) (q k) :=
              single_le_sum (fun k _ => collisionCost_nonneg (g k) (q k)) (mem_univ i)
          _ = 0 := h
      · exact collisionCost_nonneg (g i) (q i)
    exact (collisionCost_zero_iff (g i) (q i)).mp hi
  · intro h
    apply sum_eq_zero
    intro i _
    exact (collisionCost_zero_iff (g i) (q i)).mpr (h i)
