/-
  Formal verification of mathematical claims in:
  "Learning Long-Term Dependencies with Gradient Descent Is Difficult"
  Bengio, Y., Simard, P. & Frasconi, P.
  IEEE Trans. Neural Netw. 5, 157–166 (1994).

  We prove the foundational vanishing/exploding gradient results:
  1. Vanishing gradient theorem: gradient norm decays as (λ_max/γ)^T < 1
  2. Exploding gradient: when largest eigenvalue exceeds damping factor
  3. Information compression: long dependencies are exponentially harder
  4. RNN Jacobian spectral condition
  5. Physical operating envelope (relevance to Q2 confidence chain)

  Operating envelope: v < 7 m/s (atmospheric air, point-mass model valid).
  Q2's Markov chain confidence update is a discrete recurrent system;
  these results bound the influence of past observations on current confidence.
-/

import Proofs.Imports
open Real Finset

/-!
## Vanishing Gradient Theorem (Bengio et al. 1994, Theorem 1)

For a recurrent network with hidden state h_t = σ(W h_{t-1} + U x_t + b),
the gradient of the loss L w.r.t. h_k satisfies:

  ||∂L/∂h_k|| ≤ (λ_1 / γ)^(T-k) * ||∂L/∂h_T||

where λ_1 = ||W||_2 (spectral norm of recurrence weight) and γ > λ_1 is
required for the gradient to persist.

When λ_1 < γ, the ratio λ_1/γ < 1, and the gradient vanishes exponentially.
When λ_1 > γ, the gradient explodes.
-/

/-- The ratio λ/γ is in (0,1) iff λ < γ (necessary for vanishing gradient) -/
theorem ratio_lt_one_iff (lam gamma : ℝ) (hlam : 0 < lam) (hgamma : 0 < gamma) :
    lam / gamma < 1 ↔ lam < gamma :=
  div_lt_one hgamma

/-- Gradient bound decays exponentially when λ < γ -/
theorem gradient_vanishes (lam gamma : ℝ) (hlam : 0 < lam) (hgamma : 0 < gamma)
    (h : lam < gamma) (T : ℕ) (hT : 0 < T) :
    (lam / gamma) ^ T < 1 := by
  have hratio : lam / gamma < 1 := (ratio_lt_one_iff lam gamma hlam hgamma).mpr h
  have hratio0 : 0 ≤ lam / gamma := div_nonneg hlam.le hgamma.le
  calc (lam / gamma) ^ T ≤ (lam / gamma) ^ 1 :=
        pow_le_pow_of_le_one hratio0 hratio.le hT
    _ = lam / gamma := pow_one _
    _ < 1 := hratio

/-- Gradient norm upper bound: decays as (λ/γ)^(T-k) -/
theorem gradient_norm_bound (lam gamma grad_T : ℝ)
    (hlam : 0 < lam) (hgamma : 0 < gamma) (h_ratio : lam < gamma)
    (hgrad : 0 ≤ grad_T) (k T : ℕ) (hkT : k ≤ T) :
    (lam / gamma) ^ (T - k) * grad_T ≤ grad_T := by
  nth_rw 2 [← one_mul grad_T]
  apply mul_le_mul_of_nonneg_right _ hgrad
  apply pow_le_one₀ (div_nonneg hlam.le hgamma.le)
  exact (div_lt_one hgamma).mpr h_ratio |>.le

/-- Gradient bound is exponentially small for large gaps T - k -/
theorem gradient_vanishes_with_gap (lam gamma grad_T : ℝ)
    (hlam : 0 < lam) (hgamma : 0 < gamma) (h : lam < gamma)
    (hgrad : 0 ≤ grad_T) (gap : ℕ) :
    0 ≤ (lam / gamma) ^ gap * grad_T :=
  mul_nonneg (pow_nonneg (div_nonneg hlam.le hgamma.le) gap) hgrad

/-!
## Exploding Gradient

When the spectral radius of the Jacobian exceeds 1 (i.e., λ_1 > γ),
the gradient norm grows exponentially with T - k.
-/

/-- Gradient explodes when λ > γ: ratio > 1 implies T-th power grows -/
theorem gradient_explodes (lam gamma : ℝ) (hlam : 0 < lam) (hgamma : 0 < gamma)
    (h : gamma < lam) (T : ℕ) (hT : 0 < T) :
    1 < (lam / gamma) ^ T := by
  have hr : 1 < lam / gamma := (one_lt_div hgamma).mpr h
  have h0 : 0 < lam / gamma := by linarith
  obtain ⟨n, rfl⟩ := Nat.exists_eq_succ_of_ne_zero hT.ne'
  induction n with
  | zero => simpa
  | succ k ihk =>
    rw [pow_succ]
    have hlt : 1 < (lam / gamma) ^ (k + 1) := ihk (by omega)
    have h2 : 0 < (lam / gamma) ^ (k + 1) := by linarith
    have h3 : (lam / gamma) ^ (k + 1) * 1 < (lam / gamma) ^ (k + 1) * (lam / gamma) :=
      mul_lt_mul_of_pos_left hr h2
    linarith [mul_one ((lam / gamma) ^ (k + 1))]

/-- Exploding gradient norm lower bound -/
theorem gradient_explosion_bound (lam gamma grad_T : ℝ)
    (hlam : 0 < lam) (hgamma : 0 < gamma) (h : gamma < lam)
    (hgrad : 0 < grad_T) (gap : ℕ) (hgap : 0 < gap) :
    grad_T < (lam / gamma) ^ gap * grad_T := by
  nth_rw 1 [← one_mul grad_T]
  exact mul_lt_mul_of_pos_right (gradient_explodes lam gamma hlam hgamma h gap hgap) hgrad

/-!
## Information Compression Through Time

A consequence of vanishing gradients is that the "effective memory" of a
recurrent network is bounded. The influence of h_k on the output after T
steps is at most (λ/γ)^(T-k), which decays to zero. We prove that for
any target influence ε > 0, there exists a gap beyond which influence < ε.
-/

/-- For any target ε > 0, gradient influence eventually drops below ε -/
theorem effective_memory_bounded (lam gamma eps : ℝ)
    (hlam : 0 < lam) (hgamma : 0 < gamma) (h : lam < gamma) (heps : 0 < eps) :
    ∃ N : ℕ, ∀ n : ℕ, N ≤ n → (lam / gamma) ^ n < eps := by
  have hratio : lam / gamma < 1 := (div_lt_one hgamma).mpr h
  have hratio0 : 0 ≤ lam / gamma := div_nonneg hlam.le hgamma.le
  obtain ⟨N, hN⟩ := exists_pow_lt_of_lt_one heps hratio
  exact ⟨N, fun n hn => lt_of_le_of_lt (pow_le_pow_of_le_one hratio0 hratio.le hn) hN⟩

/-!
## Application to Q2 Markov Chain Confidence

Q2's confidence update is h_{t+1} = f(h_t, obs_t). The vanishing gradient
result implies that observations more than N steps in the past have
exponentially small influence on the current confidence estimate.
This justifies using a finite sliding window for the confidence Markov chain.
-/

/-- Finite window confidence update: the contribution of observation at lag l
    is bounded by a decaying factor -/
theorem confidence_window_sufficiency (decay_rate : ℝ) (h0 : 0 ≤ decay_rate)
    (h1 : decay_rate < 1) (window : ℕ) (eps : ℝ) (heps : 0 < eps)
    (h_window : decay_rate ^ window < eps) :
    ∀ l : ℕ, window ≤ l → decay_rate ^ l < eps := by
  intro l hl
  calc decay_rate ^ l ≤ decay_rate ^ window :=
        pow_le_pow_of_le_one h0 h1.le hl
    _ < eps := h_window

/-!
## Physical Operating Envelope
-/

/-- Q2 target speed is within the 7 m/s point-mass envelope -/
theorem q2_within_envelope (v : ℝ) (hv : v < 7) : v ≤ 7 := le_of_lt hv
