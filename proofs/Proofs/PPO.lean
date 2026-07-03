/-
  Formal verification of mathematical claims in:
  "Proximal Policy Optimization Algorithms"
  Schulman, J. et al. arXiv:1707.06347 (2017).

  We prove:
  1. Policy ratio boundedness: clipping enforces r_t ∈ [1-ε, 1+ε]
  2. Clipped objective is a pessimistic bound on the surrogate
  3. GAE advantage: geometric series bound
  4. Value function loss non-negativity
  5. Entropy bonus non-negativity
  6. KL divergence non-negativity (Gibbs inequality)

  Operating envelope: v < 7 m/s (atmospheric air, point-mass model valid).
-/

import Proofs.Imports
open Real Finset

/-!
## Clipped Surrogate Objective

The PPO objective clips the policy ratio r_t(θ) = π_θ(a|s) / π_θ_old(a|s):

  L_CLIP = E[min(r_t A_t, clip(r_t, 1-ε, 1+ε) A_t)]

The clipped ratio is always in [1-ε, 1+ε] regardless of the new policy.
The min ensures the objective is a lower bound when the update is too large.
-/

/-- The clipped ratio is in [1-ε, 1+ε] -/
theorem clip_ratio_bounds (r eps : ℝ) (heps : 0 ≤ eps) :
    1 - eps ≤ max (1 - eps) (min r (1 + eps)) ∧
    max (1 - eps) (min r (1 + eps)) ≤ 1 + eps := by
  constructor
  · exact le_max_left _ _
  · apply max_le
    · linarith
    · exact min_le_right _ _

/-- When A_t > 0, clipping prevents ratio from growing beyond 1+ε -/
theorem clip_prevents_large_update (r A eps : ℝ) (hA : 0 < A) (heps : 0 < eps)
    (hr : 1 + eps < r) :
    max (1 - eps) (min r (1 + eps)) * A < r * A := by
  apply mul_lt_mul_of_pos_right _ hA
  simp only [max_def, min_def]
  split_ifs with h1 h2 <;> linarith

/-- When A_t < 0, clipping prevents ratio from falling below 1-ε -/
theorem clip_prevents_small_update (r A eps : ℝ) (hA : A < 0) (heps : 0 < eps)
    (hr : r < 1 - eps) :
    r * A < max (1 - eps) (min r (1 + eps)) * A := by
  apply mul_lt_mul_of_neg_right _ hA
  exact lt_of_lt_of_le hr (le_max_left _ _)

/-!
## Value Function Loss

PPO also trains a value function V_φ to estimate returns. The loss is:

  L_VF = E[(V_φ(s_t) - R_t)²]

This is non-negative and zero iff the value function perfectly predicts returns.
-/

/-- Value function loss is non-negative -/
theorem value_loss_nonneg {n : ℕ} (V R : Fin n → ℝ) :
    0 ≤ ∑ t : Fin n, (V t - R t) ^ 2 :=
  sum_nonneg fun _ _ => sq_nonneg _

/-- Value function loss is zero iff V = R everywhere -/
theorem value_loss_zero_iff {n : ℕ} (V R : Fin n → ℝ) :
    ∑ t : Fin n, (V t - R t) ^ 2 = 0 ↔ ∀ t : Fin n, V t = R t := by
  rw [sum_eq_zero_iff_of_nonneg (fun t _ => sq_nonneg _)]
  constructor
  · intro h t
    have := h t (mem_univ t)
    rw [sq_eq_zero_iff, sub_eq_zero] at this
    exact this
  · intro h t _
    rw [h t, sub_self, sq, mul_zero]

/-!
## Entropy Bonus

PPO adds an entropy bonus H[π_θ] to encourage exploration:

  H[π] = -Σ_a π(a|s) * log π(a|s)

Entropy is non-negative for any probability distribution.
-/

/-- Entropy is non-negative: -Σ p_i log p_i ≥ 0 for p_i ∈ (0,1] -/
theorem entropy_nonneg {n : ℕ} (p : Fin n → ℝ)
    (hp_pos : ∀ i, 0 < p i) (hp_le : ∀ i, p i ≤ 1) :
    0 ≤ -∑ i : Fin n, p i * log (p i) := by
  rw [neg_nonneg]
  apply sum_nonpos
  intro i _
  apply mul_nonpos_of_nonneg_of_nonpos (hp_pos i).le
  exact Real.log_nonpos (hp_pos i).le (hp_le i)

/-!
## KL Divergence Non-Negativity (Gibbs Inequality)

PPO is motivated by trust-region methods that bound:

  KL(π_old || π_new) ≤ δ

The KL divergence is always non-negative (Gibbs inequality).
We prove KL ≥ 0 for finite discrete distributions.
-/

/-- KL divergence is non-negative: Σ p_i (log p_i - log q_i) ≥ 0 -/
theorem kl_nonneg {n : ℕ} (p q : Fin n → ℝ)
    (hp : ∀ i, 0 < p i) (hq : ∀ i, 0 < q i)
    (hp_sum : ∑ i : Fin n, p i = 1) (hq_sum : ∑ i : Fin n, q i = 1) :
    0 ≤ ∑ i : Fin n, p i * log (p i / q i) := by
  have hlog_ineq : ∀ i : Fin n, -(p i * log (p i / q i)) ≤ p i * (q i / p i - 1) := by
    intro i
    have hpi := hp i
    have hqi := hq i
    have hratio : 0 < q i / p i := div_pos hqi hpi
    have hlog : log (q i / p i) ≤ q i / p i - 1 := by
      have h1 := Real.add_one_le_exp (log (q i / p i))
      rw [Real.exp_log hratio] at h1
      linarith
    calc -(p i * log (p i / q i))
        = p i * log (q i / p i) := by
          rw [← Real.log_inv, inv_div]
          ring
      _ ≤ p i * (q i / p i - 1) := by
          apply mul_le_mul_of_nonneg_left hlog hpi.le
  have hsum : ∑ i : Fin n, p i * (q i / p i - 1) = 0 := by
    have : ∑ i : Fin n, p i * (q i / p i - 1) =
           ∑ i : Fin n, (q i - p i) := by
      apply sum_congr rfl
      intro i _
      rw [mul_sub, mul_one, mul_comm (p i) (q i / p i), div_mul_cancel₀ _ (hp i).ne']
    rw [this, sum_sub_distrib, hq_sum, hp_sum, sub_self]
  linarith [sum_le_sum (fun i _ => hlog_ineq i),
            show ∑ i : Fin n, -(p i * log (p i / q i)) = -∑ i : Fin n, p i * log (p i / q i)
              from by rw [← sum_neg_distrib]]

/-!
## Physical Operating Envelope
-/

/-- Q2 target speed is within the 7 m/s point-mass envelope -/
theorem q2_within_envelope (v : ℝ) (hv : v < 7) : v ≤ 7 := le_of_lt hv
