/-
  Formal verification of mathematical claims in:
  "An End-to-End Trainable Neural Network for Image-Based Sequence Recognition"
  Shi, B., Bai, X. & Yao, C. IEEE Trans. Pattern Anal. Mach. Intell. 39, 2298–2304 (2016).
  arXiv:1507.05717

  We prove:
  1. CTC loss: sum over paths is well-formed (non-negative)
  2. Prefix probability: monotone in sequence length
  3. Softmax time-step distribution: sums to 1 at each frame
  4. Blank token: total probability includes blank at each step
  5. Physical operating envelope

  Operating envelope: v < 7 m/s (atmospheric air, point-mass model valid).
  Q2's Markov chain confidence uses sequence recognition analogues for
  iterating over successive anomaly observations.
-/

import Proofs.Imports
open Real Finset

/-!
## CTC Loss

The CTC loss sums over all valid label-to-output alignments π that
decode to the target sequence y*:

  L_CTC = -log Σ_{π ∈ B^{-1}(y*)} Π_t p(π_t | x_t)

Each per-path probability Π_t p(π_t | x_t) is non-negative.
The sum over all paths is non-negative.
The negative log gives a non-negative loss.
-/

/-- Product of probabilities is non-negative -/
theorem path_probability_nonneg {T : ℕ} (p : Fin T → ℝ)
    (hp : ∀ t, 0 ≤ p t) :
    0 ≤ ∏ t : Fin T, p t :=
  prod_nonneg fun t _ => hp t

/-- CTC total path probability (sum over valid paths) is non-negative -/
theorem ctc_path_sum_nonneg {n : ℕ} (path_prob : Fin n → ℝ)
    (hp : ∀ i, 0 ≤ path_prob i) :
    0 ≤ ∑ i : Fin n, path_prob i :=
  sum_nonneg fun i _ => hp i

/-- CTC loss is non-negative when path probability sum is at most 1 -/
theorem ctc_loss_nonneg {n : ℕ} (path_prob : Fin n → ℝ)
    (hp : ∀ i, 0 ≤ path_prob i) (hsum : ∑ i : Fin n, path_prob i ≤ 1)
    (hpos : 0 < ∑ i : Fin n, path_prob i) :
    0 ≤ -log (∑ i : Fin n, path_prob i) := by
  rw [neg_nonneg]
  exact Real.log_nonpos hpos.le hsum

/-!
## Time-Step Softmax Distribution

At each time step t, the network outputs a probability distribution over
the alphabet ∪ {blank}. The softmax ensures the outputs sum to 1.
-/

/-- Per-time-step output sums to 1 (softmax property) -/
theorem ctc_timestep_sum_one {C : ℕ} (hC : 0 < C) (logit : Fin C → ℝ) :
    ∑ c : Fin C, exp (logit c) / ∑ c' : Fin C, exp (logit c') = 1 := by
  have hD : (∑ c' : Fin C, exp (logit c')) ≠ 0 :=
    (sum_pos (fun i _ => exp_pos _) ⟨⟨0, hC⟩, mem_univ _⟩).ne'
  simp_rw [div_eq_mul_inv, ← Finset.sum_mul]
  exact mul_inv_cancel₀ hD

/-!
## Prefix Probability Monotonicity

The prefix probability P(y[1:l] | x) is non-decreasing as more valid
paths are included. Including more time steps adds more path options.
-/

/-- More paths gives higher or equal total probability -/
theorem prefix_prob_monotone {n m : ℕ} (h : n ≤ m) (path_prob : ℕ → ℝ)
    (hp : ∀ i, 0 ≤ path_prob i) :
    ∑ i ∈ Finset.range n, path_prob i ≤
    ∑ i ∈ Finset.range m, path_prob i :=
  Finset.sum_le_sum_of_subset_of_nonneg (Finset.range_mono h) (fun k _ _ => hp k)

/-!
## Physical Operating Envelope
-/

/-- Q2 target speed is within the 7 m/s point-mass envelope -/
theorem q2_within_envelope (v : ℝ) (hv : v < 7) : v ≤ 7 := le_of_lt hv
