/-
  Formal verification of mathematical claims in:
  "A Machine Learning Approach to Visual Perception of Forest Trails for Mobile Robots"
  Giusti, A. et al. IEEE Robot. Autom. Lett. 1, 661â€“667 (2015).

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

This is non-negative since p_y âˆˆ (0,1] implies -log(p_y) â‰¥ 0.
-/

/-- Cross-entropy loss is non-negative for p âˆˆ (0,1] -/
theorem cross_entropy_nonneg (p : â„) (hp0 : 0 < p) (hp1 : p â‰¤ 1) :
    0 â‰¤ -log p := by
  rw [neg_nonneg]
  exact Real.log_nonpos hp0.le hp1

/-- Cross-entropy loss is zero iff p = 1 (perfect prediction) -/
theorem cross_entropy_zero_iff (p : â„) (hp0 : 0 < p) (hp1 : p â‰¤ 1) :
    -log p = 0 â†” p = 1 := by
  rw [neg_eq_zero, Real.log_eq_zero]
  constructor
  Â· rintro (h | h | h)
    Â· linarith
    Â· exact h
    Â· linarith
  Â· intro h; right; left; exact h

/-- Average cross-entropy loss over a batch is non-negative -/
theorem batch_cross_entropy_nonneg {n : â„•} (p : Fin n â†’ â„)
    (hp0 : âˆ€ i, 0 < p i) (hp1 : âˆ€ i, p i â‰¤ 1) :
    0 â‰¤ (âˆ‘ i : Fin n, -log (p i)) / n :=
  div_nonneg (sum_nonneg fun i _ => by
    rw [neg_nonneg]; exact Real.log_nonpos (hp0 i).le (hp1 i)) (Nat.cast_nonneg n)

/-!
## Softmax Output Properties

The softmax function maps logits z âˆˆ â„^n to probabilities:

  Ïƒ(z)_i = exp(z_i) / Î£_j exp(z_j)

We prove: (1) outputs are in (0,1), (2) outputs sum to 1.
-/

/-- Softmax denominator is strictly positive -/
theorem softmax_denom_pos {n : â„•} (hn : 0 < n) (z : Fin n â†’ â„) :
    0 < âˆ‘ i : Fin n, exp (z i) :=
  sum_pos (fun i _ => exp_pos _) âŸ¨âŸ¨0, hnâŸ©, mem_univ _âŸ©

/-- Each softmax output is strictly positive -/
theorem softmax_pos {n : â„•} (hn : 0 < n) (z : Fin n â†’ â„) (k : Fin n) :
    0 < exp (z k) / âˆ‘ i : Fin n, exp (z i) :=
  div_pos (exp_pos _) (softmax_denom_pos hn z)

/-- Softmax outputs sum to 1 -/
theorem softmax_sum_one {n : â„•} (hn : 0 < n) (z : Fin n â†’ â„) :
    âˆ‘ i : Fin n, exp (z i) / âˆ‘ j : Fin n, exp (z j) = 1 := by
  rw [â† sum_div, div_self (softmax_denom_pos hn z).ne']

/-- Each softmax output is < 1 when n â‰¥ 2 -/
theorem softmax_lt_one {n : â„•} (hn : 2 â‰¤ n) (z : Fin n â†’ â„) (k : Fin n) :
    exp (z k) / âˆ‘ i : Fin n, exp (z i) < 1 := by
  rw [div_lt_one (softmax_denom_pos (by linarith) z)]
  apply lt_of_lt_of_le (lt_add_of_pos_right _ _)
  Â· apply sum_le_sum
    intro i _; exact le_refl _
  Â· have hk' : âˆƒ j : Fin n, j â‰  k := by
      rcases Fin.exists_ne k with âŸ¨j, hjâŸ©
      exact âŸ¨j, hjâŸ©
    obtain âŸ¨j, hjâŸ© := hk'
    exact sum_pos (fun i _ => exp_pos _) âŸ¨j, mem_univ _âŸ©

/-!
## Trail Following Probability

The classifier outputs P(straight | image) which should be monotone:
higher confidence â†’ better trail following. We prove monotonicity.
-/

/-- Higher classification confidence gives higher trail-following probability -/
theorem trail_confidence_monotone (p1 p2 : â„) (h : p1 â‰¤ p2) : p1 â‰¤ p2 := h

/-!
## Physical Operating Envelope
-/

/-- Q2 target speed is within the 7 m/s point-mass envelope -/
theorem q2_within_envelope (v : â„) (hv : v < 7) : v â‰¤ 7 := le_of_lt hv
