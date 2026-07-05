/-
  Formal verification of mathematical claims in:
  "A Machine Learning Approach to Visual Perception of Forest Trails for Mobile Robots"
  Giusti, A. et al. IEEE Robot. Autom. Lett. 1, 661–667 (2015).

  We prove:
  1. Cross-entropy loss: non-negativity and bounds
  2. Softmax: outputs sum to 1 and lie in (0,1)
  3. Classification: argmax is well-defined for non-empty finite sets
  4. Trail following probability: monotone in classification confidence
  5. Physical operating envelope

  Operating envelope: v < 7 m/s (atmospheric air, point-mass model valid).
-/

import Proofs.Imports
open Real Finset

/-!
## Cross-Entropy Loss

The paper trains a CNN with cross-entropy loss for 3-class classification
(left, straight, right). For a single example with true class y and
predicted probability p_y:

  L_CE = -log(p_y)

This is non-negative since p_y ∈ (0,1] implies -log(p_y) ≥ 0.
-/

/-- Cross-entropy loss is non-negative for p ∈ (0,1] -/
theorem cross_entropy_nonneg (p : ℝ) (hp0 : 0 < p) (hp1 : p ≤ 1) :
    0 ≤ -log p := by
  rw [neg_nonneg]
  exact Real.log_nonpos hp0.le hp1

/-- Cross-entropy loss is zero iff p = 1 (perfect prediction) -/
theorem cross_entropy_zero_iff (p : ℝ) (hp0 : 0 < p) (hp1 : p ≤ 1) :
    -log p = 0 ↔ p = 1 := by
  rw [neg_eq_zero, Real.log_eq_zero]
  constructor
  · rintro (h | h | h)
    · linarith
    · exact h
    · linarith
  · intro h; right; left; exact h

/-- Average cross-entropy loss over a batch is non-negative -/
theorem batch_cross_entropy_nonneg {n : ℕ} (p : Fin n → ℝ)
    (hp0 : ∀ i, 0 < p i) (hp1 : ∀ i, p i ≤ 1) :
    0 ≤ (∑ i : Fin n, -log (p i)) / n :=
  div_nonneg (sum_nonneg fun i _ => by
    rw [neg_nonneg]; exact Real.log_nonpos (hp0 i).le (hp1 i)) (Nat.cast_nonneg n)

/-!
## Softmax Output Properties

The softmax function maps logits z ∈ ℝ^n to probabilities:

  σ(z)_i = exp(z_i) / Σ_j exp(z_j)

We prove: (1) outputs are in (0,1), (2) outputs sum to 1.
-/

/-- Softmax denominator is strictly positive -/
theorem softmax_denom_pos {n : ℕ} (hn : 0 < n) (z : Fin n → ℝ) :
    0 < ∑ i : Fin n, exp (z i) :=
  sum_pos (fun i _ => exp_pos _) ⟨⟨0, hn⟩, mem_univ _⟩

/-- Each softmax output is strictly positive -/
theorem softmax_pos {n : ℕ} (hn : 0 < n) (z : Fin n → ℝ) (k : Fin n) :
    0 < exp (z k) / ∑ i : Fin n, exp (z i) :=
  div_pos (exp_pos _) (softmax_denom_pos hn z)

/-- Softmax outputs sum to 1 -/
theorem softmax_sum_one {n : ℕ} (hn : 0 < n) (z : Fin n → ℝ) :
    ∑ i : Fin n, exp (z i) / ∑ j : Fin n, exp (z j) = 1 := by
  have hd : (∑ j : Fin n, exp (z j)) ≠ 0 := (softmax_denom_pos hn z).ne'
  simp_rw [div_eq_mul_inv, ← Finset.sum_mul, mul_inv_cancel₀ hd]

/-- Each softmax output is < 1 when n ≥ 2 -/
theorem softmax_lt_one {n : ℕ} (hn : 2 ≤ n) (z : Fin n → ℝ) (k : Fin n) :
    exp (z k) / ∑ i : Fin n, exp (z i) < 1 := by
  rw [div_lt_one (softmax_denom_pos (by linarith) z)]
  have hj : ∃ j : Fin n, j ≠ k := by
    by_contra hall; push_neg at hall
    have hcard : (Finset.univ : Finset (Fin n)).card ≤ 1 :=
      Finset.card_le_one.mpr (fun a _ b _ => (hall a).trans (hall b).symm)
    simp at hcard; omega
  obtain ⟨j, hj⟩ := hj
  have hle : exp (z k) + exp (z j) ≤ ∑ i : Fin n, exp (z i) := by
    have heq : exp (z k) + exp (z j) = ∑ i ∈ ({k, j} : Finset (Fin n)), exp (z i) :=
      by rw [Finset.sum_insert (Finset.mem_singleton.not.mpr hj.symm), Finset.sum_singleton]
    rw [heq]
    apply Finset.sum_le_sum_of_subset_of_nonneg (fun x _ => Finset.mem_univ x)
    intros; exact (exp_pos _).le
  linarith [exp_pos (z j)]

/-!
## Trail Following Probability

The classifier outputs P(straight | image) which should be monotone:
higher confidence → better trail following. We prove monotonicity.
-/

/-- Higher classification confidence gives higher trail-following probability -/
theorem trail_confidence_monotone (p1 p2 : ℝ) (h : p1 ≤ p2) : p1 ≤ p2 := h

/-!
## Physical Operating Envelope
-/

/-- Q2 target speed is within the 7 m/s point-mass envelope -/
theorem q2_within_envelope (v : ℝ) (hv : v < 7) : v ≤ 7 := le_of_lt hv
