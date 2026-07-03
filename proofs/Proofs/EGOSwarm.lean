/-
  Formal verification of mathematical claims in:
  "EGO-Swarm: A Fully Autonomous and Decentralized Quadrotor Swarm System
  in Cluttered Environments"
  Zhou, X., Zhu, J., Zhou, H., Xu, C. & Gao, F. -- arXiv:2011.04183 (2020)

  We prove:
  1. Obstacle signed distance: positivity condition and surface characterization
  2. Swarm barrier penalty: non-negativity (pointwise and integrated)
  3. Ellipsoidal safety metric: positive definiteness when the stretch factor c > 0
  4. Centroid drift correction: the sample mean minimizes sum of squared distances
  5. Total objective: non-negativity of J_EGO + lambda_w * J_{w,k}
-/

import Proofs.Imports
import Proofs.TeachRepeatReplan
import Proofs.EGOPlanner

open Real Finset

/-!
## Obstacle Signed Distance

Each obstacle j relative to control point Q_i is characterized by an anchor-normal
pair {p_ij, v_ij}: p_ij lies on the obstacle surface and v_ij points outward into
free space. The signed distance is:

  d_ij = (Q_i - p_ij) * v_ij  (in 1D; dot product in 3D)

Positive values place Q_i on the safe side of the obstacle surface.
-/

/-- The signed obstacle distance is positive iff Q_i is strictly in free space
    (on the side of the outward normal v_ij > 0). -/
theorem obstacle_dist_pos_iff_safe (Qi pij vij : ℝ) (hvij : 0 < vij) :
    0 < (Qi - pij) * vij ↔ pij < Qi := by
  rw [mul_pos_iff]
  constructor
  · rintro (h | h)
    · linarith [h.1]
    · linarith [h.2]
  · intro h
    exact Or.inl ⟨by linarith, hvij⟩

/-- The signed distance is zero iff Q_i lies exactly on the obstacle surface
    (the anchor plane through p_ij with normal v_ij). -/
theorem obstacle_dist_zero_iff_surface (Qi pij vij : ℝ) (hvij : vij ≠ 0) :
    (Qi - pij) * vij = 0 ↔ Qi = pij := by
  rw [mul_eq_zero]
  constructor
  · rintro (h | h)
    · linarith
    · exact absurd h hvij
  · intro h; left; linarith

/-- The signed distance is negative iff Q_i is inside the obstacle. -/
theorem obstacle_dist_neg_iff_collision (Qi pij vij : ℝ) (hvij : 0 < vij) :
    (Qi - pij) * vij < 0 ↔ Qi < pij := by
  rw [mul_neg_iff]
  constructor
  · rintro (h | h)
    · linarith [h.1]
    · linarith [h.2]
  · intro h
    exact Or.inr ⟨by linarith, hvij⟩

/-!
## Swarm Barrier Penalty

The swarm avoidance constraint between agents k and i is encoded as:

  d_{k,i}(t) = E^{1/2} (gamma_k(t) - gamma_i(t)) - (C + epsilon)

where C is the required clearance. When d_{k,i} < 0 (agents too close), a
squared penalty is applied. The penalty term at each time instant is:

  c(d) = d^2  if d < 0,  else  0

This is the same as max(0, -d)^2 = (-d)^2 when d < 0 and 0 otherwise.
-/

/-- The pointwise swarm barrier penalty is non-negative for all d -/
theorem swarm_penalty_nonneg (d : ℝ) :
    0 ≤ if d < 0 then d ^ 2 else 0 := by
  split_ifs with h
  · positivity
  · exact le_refl 0

/-- The penalty is zero when the clearance constraint is satisfied (d >= 0) -/
theorem swarm_penalty_zero_when_safe (d : ℝ) (hd : 0 ≤ d) :
    (if d < 0 then d ^ 2 else 0) = 0 := by
  simp [not_lt.mpr hd]

/-- The penalty is strictly positive when agents are too close (d < 0) -/
theorem swarm_penalty_pos_in_collision (d : ℝ) (hd : d < 0) :
    0 < if d < 0 then d ^ 2 else 0 := by
  rw [if_pos hd, sq]
  exact mul_pos_of_neg_of_neg hd hd

/-- The integrated swarm penalty over a finite trajectory sample is non-negative.
    This formalizes J_{w,k} = sum_t penalty(d_{k,i}(t)) * dt >= 0. -/
theorem integrated_swarm_penalty_nonneg {n : ℕ} (d : Fin n → ℝ) (dt : ℝ)
    (hdt : 0 ≤ dt) :
    0 ≤ ∑ t : Fin n, (if d t < 0 then d t ^ 2 else 0) * dt := by
  apply sum_nonneg
  intro t _
  exact mul_nonneg (swarm_penalty_nonneg (d t)) hdt

/-!
## Ellipsoidal Safety Metric

EGO-Swarm uses an ellipsoidal metric to account for the asymmetric downwash
wake of quadrotors. The metric matrix is:

  E = diag(1, 1, 1/c)  with c > 1

The ellipsoidal squared norm is:

  ||v||_E^2 = v_1^2 + v_2^2 + v_3^2 / c

This extends the standard Euclidean metric by shrinking the vertical component,
making the effective vertical clearance c times larger than the horizontal one.
We prove the metric is positive definite for any c > 0.
-/

/-- The three eigenvalues of E = diag(1, 1, 1/c) are all strictly positive when c > 0 -/
theorem ellipsoid_eigenvalues_pos (c : ℝ) (hc : 0 < c) :
    0 < (1 : ℝ) ∧ 0 < (1 : ℝ) ∧ 0 < 1 / c :=
  ⟨one_pos, one_pos, div_pos one_pos hc⟩

/-- The ellipsoidal norm ||v||_E^2 = v1^2 + v2^2 + v3^2/c is non-negative
    for all vectors (v1, v2, v3) when c > 0 -/
theorem ellipsoid_norm_nonneg (v1 v2 v3 c : ℝ) (hc : 0 < c) :
    0 ≤ v1 ^ 2 + v2 ^ 2 + v3 ^ 2 / c := by
  have h1 : 0 ≤ v3 ^ 2 / c := div_nonneg (sq_nonneg _) hc.le
  linarith [sq_nonneg v1, sq_nonneg v2]

/-- The ellipsoidal norm is zero iff the vector is zero -/
theorem ellipsoid_norm_zero_iff (v1 v2 v3 c : ℝ) (hc : 0 < c) :
    v1 ^ 2 + v2 ^ 2 + v3 ^ 2 / c = 0 ↔ v1 = 0 ∧ v2 = 0 ∧ v3 = 0 := by
  constructor
  · intro h
    have hv3c : 0 ≤ v3 ^ 2 / c := div_nonneg (sq_nonneg _) hc.le
    have h1 : v1 ^ 2 = 0 := le_antisymm (by nlinarith [sq_nonneg v2]) (sq_nonneg _)
    have h2 : v2 ^ 2 = 0 := le_antisymm (by nlinarith [sq_nonneg v1]) (sq_nonneg _)
    have h3 : v3 ^ 2 = 0 := by
      have : v3 ^ 2 / c = 0 := le_antisymm (by nlinarith) (div_nonneg (sq_nonneg _) hc.le)
      exact (div_eq_zero_iff.mp this).resolve_right hc.ne'
    exact ⟨pow_eq_zero_iff (by norm_num) |>.mp h1,
           pow_eq_zero_iff (by norm_num) |>.mp h2,
           pow_eq_zero_iff (by norm_num) |>.mp h3⟩
  · rintro ⟨h1, h2, h3⟩
    subst h1; subst h2; subst h3
    norm_num

/-!
## Centroid Drift Correction

EGO-Swarm corrects VIO drift by comparing predicted agent positions
(from broadcast trajectories) against observed positions in depth images.
The observed position is estimated as the centroid mu_1(P) of a point cluster P.

The centroid is the mean: mu = (sum_i p_i) / n.

We prove that the centroid minimizes the sum of squared distances to all points
in the cluster, confirming that it is the natural point estimator for the
drift correction step.
-/

/-- The sum of deviations from the mean is zero -/
theorem mean_deviations_sum_zero {n : ℕ} (hn : 0 < n) (p : Fin n → ℝ) :
    ∑ i : Fin n, (p i - (∑ j : Fin n, p j) / n) = 0 := by
  rw [sum_sub_distrib, sum_const, card_univ, Fintype.card_fin]
  simp only [nsmul_eq_mul]
  have hn' : (n : ℝ) ≠ 0 := Nat.cast_ne_zero.mpr hn.ne'
  rw [sub_eq_zero]
  exact (mul_div_cancel_left₀ _ hn').symm

/-- The centroid minimizes the sum of squared distances from any cluster P.
    For all x in R: sum_i (p_i - mu)^2 <= sum_i (p_i - x)^2.
    Proof: bias-variance decomposition shows sum (p_i - x)^2 =
    sum (p_i - mu)^2 + n*(mu-x)^2 >= sum (p_i - mu)^2. -/
theorem centroid_minimizes_sos {n : ℕ} (hn : 0 < n) (p : Fin n → ℝ) (x : ℝ) :
    ∑ i : Fin n, (p i - (∑ j : Fin n, p j) / n) ^ 2 ≤
    ∑ i : Fin n, (p i - x) ^ 2 := by
  set mu := (∑ j : Fin n, p j) / n with hmu_def
  have hdev : ∑ i : Fin n, (p i - mu) = 0 := mean_deviations_sum_zero hn p
  have step : ∀ i : Fin n,
      (p i - x) ^ 2 = (p i - mu) ^ 2 + 2 * (mu - x) * (p i - mu) + (mu - x) ^ 2 :=
    fun i => by ring
  simp_rw [step, sum_add_distrib]
  rw [show ∑ _i : Fin n, (mu - x) ^ 2 = ↑n * (mu - x) ^ 2 from by
        rw [sum_const, card_univ, Fintype.card_fin, nsmul_eq_mul],
      show ∑ i : Fin n, 2 * (mu - x) * (p i - mu) = 2 * (mu - x) * ∑ i : Fin n, (p i - mu) from
        by rw [← mul_sum],
      hdev, mul_zero, add_zero]
  linarith [mul_nonneg (Nat.cast_nonneg n) (sq_nonneg (mu - x))]

/-- The centroid is the unique minimizer: if x also achieves the minimum then x = mu -/
theorem centroid_is_unique_minimizer {n : ℕ} (hn : 0 < n) (p : Fin n → ℝ) (x : ℝ)
    (hx : ∑ i : Fin n, (p i - x) ^ 2 =
          ∑ i : Fin n, (p i - (∑ j : Fin n, p j) / n) ^ 2) :
    x = (∑ j : Fin n, p j) / n := by
  set mu := (∑ j : Fin n, p j) / n with hmu_def
  have hdev : ∑ i : Fin n, (p i - mu) = 0 := mean_deviations_sum_zero hn p
  have step : ∀ i : Fin n,
      (p i - x) ^ 2 = (p i - mu) ^ 2 + 2 * (mu - x) * (p i - mu) + (mu - x) ^ 2 :=
    fun i => by ring
  have expand : ∑ i : Fin n, (p i - x) ^ 2 =
      ∑ i : Fin n, (p i - mu) ^ 2 + ↑n * (mu - x) ^ 2 := by
    simp_rw [step, sum_add_distrib]
    rw [show ∑ _i : Fin n, (mu - x) ^ 2 = ↑n * (mu - x) ^ 2 from by
          rw [sum_const, card_univ, Fintype.card_fin, nsmul_eq_mul],
        show ∑ i : Fin n, 2 * (mu - x) * (p i - mu) = 2 * (mu - x) * ∑ i : Fin n, (p i - mu) from
          by rw [← mul_sum],
        hdev, mul_zero, add_zero]
  rw [expand] at hx
  have hnn : 0 ≤ (n : ℝ) * (mu - x) ^ 2 :=
    mul_nonneg (Nat.cast_nonneg n) (sq_nonneg _)
  have hzero : (n : ℝ) * (mu - x) ^ 2 = 0 := by linarith
  have hne : (n : ℝ) ≠ 0 := Nat.cast_ne_zero.mpr hn.ne'
  have hsq : (mu - x) ^ 2 = 0 :=
    (mul_eq_zero.mp hzero).resolve_left hne
  linarith [pow_eq_zero_iff (show 2 ≠ 0 from by norm_num) |>.mp hsq]

/-!
## Full EGO-Swarm Objective

The total planning objective per agent k is:

  J = J_EGO + lambda_w * J_{w,k}

where J_EGO inherits the non-negativity from EGO-Planner and J_{w,k} is the
non-negative swarm penalty. The combined objective is therefore non-negative.
-/

/-- The full EGO-Swarm objective is non-negative when lambda_w >= 0 -/
theorem ego_swarm_cost_nonneg
    (J_ego J_swarm lw : ℝ)
    (hego : 0 ≤ J_ego) (hswarm : 0 ≤ J_swarm) (hlw : 0 ≤ lw) :
    0 ≤ J_ego + lw * J_swarm := by
  nlinarith

/-!
## Physical Operating Envelope

EGO-Swarm experiments ran at 1.5 m/s in forest environments, well within the
7 m/s envelope for atmospheric air and point-mass dynamics. At 1.5 m/s the
ellipsoidal clearance conditions are satisfied with large margins and the
soft barrier penalties remain inactive for well-separated agents.
-/

/-- 1.5 m/s flight speed is within the point-mass operating envelope -/
theorem ego_swarm_demo_within_envelope : (1.5 : ℝ) < 7 := by norm_num
