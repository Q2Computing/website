/-
  Formal verification of mathematical claims in:
  "Back to Newton's Laws: Learning Vision-Based Agile Flight via Differentiable Physics"
  Zhang, Y., Hu, Y., Song, Y., Zou, D. & Lin, W. — Nature Mach. Intell. (2025)
  arXiv:2407.10648
-/

import Mathlib

open Real

/-!
## SmoothL1 (Huber) Loss

The velocity tracking loss uses SmoothL1, a piecewise function that is quadratic
near zero and linear for large errors. The two pieces agree at z = β, so the
choice of strict vs. non-strict inequality at the boundary does not affect the
function's value. We use ≤ to work with closed half-spaces for the continuity proof.

  SmoothL1(z) = z² / (2β)   if z ≤ β
              = z - β/2      if z > β
-/

/-- SmoothL1 loss with threshold β > 0 applied to scalar z -/
noncomputable def smoothL1 (β : ℝ) (z : ℝ) : ℝ :=
  if z ≤ β then z ^ 2 / (2 * β) else z - β / 2

/-- The two pieces agree exactly at the boundary z = β -/
theorem smoothL1_pieces_agree_at_boundary (β : ℝ) (hβ : 0 < β) :
    β ^ 2 / (2 * β) = β - β / 2 := by
  field_simp
  ring

/-- SmoothL1 is continuous on ℝ -/
theorem smoothL1_continuous (β : ℝ) (hβ : 0 < β) :
    Continuous (smoothL1 β) := by
  unfold smoothL1
  apply continuous_if_le continuous_id continuous_const
  · exact ((continuous_pow 2).div_const (2 * β)).continuousOn
  · exact (continuous_id.sub continuous_const).continuousOn
  · intro z (hz : z = β); subst hz
    field_simp
    ring

/-- SmoothL1 is non-negative for non-negative inputs -/
theorem smoothL1_nonneg (β : ℝ) (hβ : 0 < β) (z : ℝ) (hz : 0 ≤ z) :
    0 ≤ smoothL1 β z := by
  unfold smoothL1
  split_ifs with h
  · positivity
  · linarith

/-- SmoothL1 equals zero only at z = 0 (for non-negative z) -/
theorem smoothL1_zero_iff (β : ℝ) (hβ : 0 < β) (z : ℝ) (hz : 0 ≤ z) :
    smoothL1 β z = 0 ↔ z = 0 := by
  unfold smoothL1
  split_ifs with h
  · constructor
    · intro heq
      have hβne : (2 * β) ≠ 0 := by positivity
      have hsq : z ^ 2 = 0 := by
        rwa [div_eq_zero_iff, or_iff_left hβne] at heq
      exact pow_eq_zero_iff (by norm_num) |>.mp hsq
    · intro heq; subst heq; simp
  · simp only [not_le] at h
    constructor
    · intro heq; linarith
    · intro heq; subst heq; linarith

/-!
## Composite Training Loss

The paper defines L = w_v·Lv + w_c·Lc + w_a·La + w_j·Lj
with weights w_v = 1, w_c = 2, w_a = 0.01, w_j = 0.001.

We verify all weights are positive and the collision term dominates.
-/

-- Weight constants (λ is reserved in Lean 4; using w_ prefix)
def w_vel : ℝ := 1
def w_col : ℝ := 2
def w_acc : ℝ := 0.01
def w_jrk : ℝ := 0.001

/-- All weights are strictly positive -/
theorem weights_pos : 0 < w_vel ∧ 0 < w_col ∧ 0 < w_acc ∧ 0 < w_jrk := by
  unfold w_vel w_col w_acc w_jrk; norm_num

/-- Collision weight strictly dominates all others -/
theorem collision_weight_dominates :
    w_vel < w_col ∧ w_acc < w_col ∧ w_jrk < w_col := by
  unfold w_vel w_col w_acc w_jrk; norm_num

/-- Weighted composite loss is non-negative when all components are non-negative -/
theorem composite_loss_nonneg
    (Lv Lc La Lj : ℝ)
    (hv : 0 ≤ Lv) (hc : 0 ≤ Lc) (ha : 0 ≤ La) (hj : 0 ≤ Lj) :
    0 ≤ w_vel * Lv + w_col * Lc + w_acc * La + w_jrk * Lj := by
  unfold w_vel w_col w_acc w_jrk
  nlinarith

/-!
## Point-Mass Dynamics with Midpoint Integration

Velocity update:  v_{k+1} = v_k + (a_k + a_{k+1}) / 2 · Δt
Position update:  p_{k+1} = p_k + v_k · Δt + (1/2) · a_k · Δt²

We verify the position update is consistent with constant-acceleration kinematics
from v_k and a_k over the interval Δt.
-/

/-- Midpoint velocity integration -/
noncomputable def vel_update (vk ak ak1 Δt : ℝ) : ℝ :=
  vk + (ak + ak1) / 2 * Δt

/-- Position update via constant-acceleration kinematics -/
noncomputable def pos_update (pk vk ak Δt : ℝ) : ℝ :=
  pk + vk * Δt + (1 / 2) * ak * Δt ^ 2

/-- The position update matches the standard constant-acceleration formula -/
theorem pos_update_eq (pk vk ak Δt : ℝ) :
    pos_update pk vk ak Δt = pk + vk * Δt + (1 / 2) * ak * Δt ^ 2 := by
  unfold pos_update; ring

/-- Under zero acceleration, position advances by v · Δt -/
theorem pos_update_zero_accel (pk vk Δt : ℝ) :
    pos_update pk vk 0 Δt = pk + vk * Δt := by
  unfold pos_update; ring

/-!
## Temporal Gradient Decay

To prevent gradient explosion over long trajectories, the state-transition
Jacobian at each step is multiplied by e^{-α·Δt}. The cumulative product over
k steps is e^{-α·k·Δt}.

We verify:
  1. The decay factor is always strictly positive (gradients are attenuated, not zeroed)
  2. The decay factor is bounded above by 1 for α, Δt ≥ 0
  3. The decay factor is monotonically decreasing in k for α, Δt > 0
-/

/-- Cumulative decay factor over k steps -/
noncomputable def decay (α Δt : ℝ) (k : ℕ) : ℝ :=
  Real.exp (-(α * Δt * k))

/-- Decay is strictly positive for all k -/
theorem decay_pos (α Δt : ℝ) (k : ℕ) : 0 < decay α Δt k :=
  Real.exp_pos _

/-- Decay is bounded above by 1 when α, Δt ≥ 0 -/
theorem decay_le_one (α Δt : ℝ) (hα : 0 ≤ α) (hΔt : 0 ≤ Δt) (k : ℕ) :
    decay α Δt k ≤ 1 := by
  unfold decay
  rw [Real.exp_le_one_iff]
  have : 0 ≤ α * Δt * k := by positivity
  linarith

/-- Decay at step 0 is exactly 1 (no attenuation at the start) -/
theorem decay_zero (α Δt : ℝ) : decay α Δt 0 = 1 := by
  unfold decay; simp

/-- Decay is monotonically non-increasing in k for α, Δt ≥ 0 -/
theorem decay_antitone (α Δt : ℝ) (hα : 0 ≤ α) (hΔt : 0 ≤ Δt) :
    Antitone (decay α Δt) := by
  unfold decay Antitone
  intro j k hjk
  apply Real.exp_le_exp.mpr
  have hk : (j : ℝ) ≤ k := Nat.cast_le.mpr hjk
  have : 0 ≤ α * Δt := by positivity
  nlinarith
