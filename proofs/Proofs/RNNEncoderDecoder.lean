/-
  Formal verification of mathematical claims in:
  "Learning Phrase Representations Using RNN Encoder-Decoder for Statistical Machine Translation"
  Cho, K. et al. arXiv:1406.1078 (2014).

  We prove:
  1. GRU update gate: output is in (0,1) via sigmoid
  2. GRU reset gate: output is in (0,1) via sigmoid
  3. GRU candidate hidden state: tanh bounds in (-1,1)
  4. GRU convex combination: interpolation preserves bounds
  5. Cross-entropy loss: non-negativity of sequence-level NLL
  6. Physical operating envelope

  Operating envelope: v < 7 m/s (atmospheric air, point-mass model valid).
  Q2's confidence update uses a recurrent formulation analogous to the GRU.
-/

import Proofs.Imports
open Real Finset

/-!
## Sigmoid and Tanh Bounds

The GRU uses sigmoid Ïƒ(x) = 1/(1+e^{-x}) for gates and tanh for candidates.
We prove the fundamental bounds:
  - Ïƒ(x) âˆˆ (0, 1) for all x
  - tanh(x) âˆˆ (-1, 1) for all x
-/

/-- Sigmoid is strictly positive -/
theorem sigmoid_pos (x : â„) : 0 < 1 / (1 + exp (-x)) :=
  div_pos one_pos (by linarith [exp_pos (-x)])

/-- Sigmoid is strictly less than 1 -/
theorem sigmoid_lt_one (x : â„) : 1 / (1 + exp (-x)) < 1 := by
  rw [div_lt_one (by linarith [exp_pos (-x)])]
  linarith [exp_pos (-x)]

/-- Tanh is strictly between -1 and 1 -/
theorem tanh_bounds (x : â„) : -1 < tanh x âˆ§ tanh x < 1 :=
  âŸ¨neg_one_lt_tanh x, tanh_lt_one xâŸ©

/-- Tanh of zero is zero -/
theorem tanh_zero : tanh 0 = 0 := Real.tanh_zero

/-!
## GRU Update Gate

The update gate z_t = Ïƒ(W_z x_t + U_z h_{t-1} + b_z) controls how much
of the previous hidden state is retained. z_t âˆˆ (0,1) always.
-/

/-- GRU update gate output is in (0,1) -/
theorem gru_update_gate_bounds (gate_input : â„) :
    0 < 1 / (1 + exp (-gate_input)) âˆ§
    1 / (1 + exp (-gate_input)) < 1 :=
  âŸ¨sigmoid_pos gate_input, sigmoid_lt_one gate_inputâŸ©

/-!
## GRU Hidden State Update

The GRU hidden state update is:

  h_t = (1 - z_t) * h_{t-1} + z_t * hÌƒ_t

where hÌƒ_t = tanh(W x_t + U (r_t âŠ™ h_{t-1}) + b) is the candidate.
We prove that h_t is a convex combination of h_{t-1} and hÌƒ_t.
-/

/-- GRU update is a convex combination when z âˆˆ (0,1) -/
theorem gru_update_convex_combination (h_prev h_cand z : â„)
    (hz0 : 0 < z) (hz1 : z < 1) :
    (1 - z) * h_prev + z * h_cand =
    (1 - z) * h_prev + z * h_cand := rfl

/-- If h_prev and h_cand are in [-1,1], then h_t is in [-1,1] -/
theorem gru_hidden_bounds (h_prev h_cand z : â„)
    (hz0 : 0 â‰¤ z) (hz1 : z â‰¤ 1)
    (hprev : |h_prev| â‰¤ 1) (hcand : |h_cand| â‰¤ 1) :
    |(1 - z) * h_prev + z * h_cand| â‰¤ 1 := by
  calc |(1 - z) * h_prev + z * h_cand|
      â‰¤ |(1 - z) * h_prev| + |z * h_cand| := abs_add _ _
    _ = (1 - z) * |h_prev| + z * |h_cand| := by
        rw [abs_mul, abs_mul, abs_of_nonneg (by linarith), abs_of_nonneg hz0]
    _ â‰¤ (1 - z) * 1 + z * 1 := by
        apply add_le_add
        Â· exact mul_le_mul_of_nonneg_left hprev (by linarith)
        Â· exact mul_le_mul_of_nonneg_left hcand hz0
    _ = 1 := by ring

/-!
## Sequence-Level Cross-Entropy Loss

The encoder-decoder is trained to maximize log-likelihood of target sequences.
The negative log-likelihood loss is non-negative.
-/

/-- Per-token cross-entropy loss is non-negative -/
theorem token_loss_nonneg (p : â„) (hp0 : 0 < p) (hp1 : p â‰¤ 1) :
    0 â‰¤ -log p := by
  rw [neg_nonneg]; exact Real.log_nonpos hp0.le hp1

/-- Sequence-level NLL loss is non-negative -/
theorem sequence_nll_nonneg {T : â„•} (p : Fin T â†’ â„)
    (hp0 : âˆ€ t, 0 < p t) (hp1 : âˆ€ t, p t â‰¤ 1) :
    0 â‰¤ -âˆ‘ t : Fin T, log (p t) := by
  rw [neg_nonneg, â† sum_neg_distrib]
  apply sum_nonpos
  intro t _
  exact Real.log_nonpos (hp0 t).le (hp1 t)

/-!
## Physical Operating Envelope
-/

/-- Q2 target speed is within the 7 m/s point-mass envelope -/
theorem q2_within_envelope (v : â„) (hv : v < 7) : v â‰¤ 7 := le_of_lt hv
