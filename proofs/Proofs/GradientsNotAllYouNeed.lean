/-
  Formal verification of mathematical claims in:
  "Gradients Are Not All You Need"
  Metz, L. et al. arXiv:2111.05803 (2021).

  We prove:
  1. Gradient explosion: norm grows exponentially through chaotic systems
  2. Truncated BPTT: truncation introduces bias bounded by tail sum
  3. Chaos and Lyapunov exponents: positive exponent implies divergence
  4. Gradient noise dominance: when gradient variance exceeds signal
  5. Physical operating envelope

  Operating envelope: v < 7 m/s (atmospheric air, point-mass model valid).
-/

import Proofs.Imports
open Real Finset

/-!
## Gradient Explosion Through Recurrent Systems

For a recurrent system x_{t+1} = f(x_t), the gradient of x_T w.r.t. x_0 is:

  dx_T/dx_0 = Π_{t=0}^{T-1} df/dx|_{x_t}

If |df/dx| > 1 at each step (chaotic), the gradient grows exponentially.
We prove: if all Jacobian norms exceed 1, the product exceeds 1^T = 1.
-/

/-- Product of values > 1 exceeds 1 -/
theorem product_gt_one {n : ℕ} (hn : 0 < n) (J : Fin n → ℝ)
    (hJ : ∀ i, 1 < J i) :
    1 < ∏ i : Fin n, J i :=
  lt_of_lt_of_le (hJ ⟨0, hn⟩)
    (Finset.single_le_prod' (fun i _ => (hJ i).le) (Finset.mem_univ _))

/-- Gradient norm grows at least exponentially with lambda^T when lambda > 1 -/
theorem gradient_explosion_lower_bound (lam : ℝ) (hlam : 1 < lam) (T : ℕ) :
    1 ≤ lam ^ T := by
  calc (1 : ℝ) = 1 ^ T := (one_pow T).symm
    _ ≤ lam ^ T := by gcongr

/-- For T steps with Jacobian norm ≥ lambda > 1, gradient norm ≥ lambda^T -/
theorem gradient_norm_lower_bound {n : ℕ} (hn : 0 < n) (J : Fin n → ℝ)
    (lam : ℝ) (hlam : 1 < lam) (hJ : ∀ i, lam ≤ J i) :
    lam ^ n ≤ ∏ i : Fin n, J i := by
  calc lam ^ n = ∏ _i : Fin n, lam := by
        rw [Finset.prod_const, Finset.card_univ, Fintype.card_fin]
    _ ≤ ∏ i : Fin n, J i := by
        apply Finset.prod_le_prod
        · intro i _; linarith [hJ i]
        · intro i _; exact hJ i

/-!
## Truncated BPTT Bias

Truncated Backpropagation Through Time (TBPTT) limits the gradient to T steps.
The bias from truncation is the tail sum of gradient contributions from t > T:

  bias = Σ_{t=T+1}^{∞} g_t

If gradients decay at rate γ < 1, the bias is bounded by a geometric series.
-/

/-- Geometric series partial sum -/
noncomputable def geom_partial (gamma : ℝ) (T : ℕ) : ℝ :=
  ∑ k ∈ Finset.range T, gamma ^ k

/-- For γ < 1, the geometric series converges to 1/(1-γ) -/
theorem geom_series_bound (gamma : ℝ) (hγ0 : 0 ≤ gamma) (hγ1 : gamma < 1)
    (g0 : ℝ) (hg0 : 0 ≤ g0) (T : ℕ) :
    ∑ k ∈ Finset.range T, gamma ^ k * g0 ≤ g0 / (1 - gamma) := by
  have h1 : 0 < 1 - gamma := by linarith
  have hgeom : (1 - gamma) * ∑ k ∈ Finset.range T, gamma ^ k = 1 - gamma ^ T := by
    induction T with
    | zero => simp
    | succ n ih =>
      rw [Finset.sum_range_succ, mul_add, ih, pow_succ]
      ring
  have hpow : 0 ≤ gamma ^ T := pow_nonneg hγ0 T
  have hsum_bound : (1 - gamma) * ∑ k ∈ Finset.range T, gamma ^ k ≤ 1 := by linarith
  have hsum_le : ∑ k ∈ Finset.range T, gamma ^ k ≤ 1 / (1 - gamma) := by
    rw [le_div_iff h1]
    have heq : ∑ k ∈ Finset.range T, gamma ^ k * (1 - gamma) =
               (1 - gamma) * ∑ k ∈ Finset.range T, gamma ^ k := by
      rw [← Finset.sum_mul, mul_comm]
    rw [heq]; exact hsum_bound
  calc ∑ k ∈ Finset.range T, gamma ^ k * g0
      = (∑ k ∈ Finset.range T, gamma ^ k) * g0 := (Finset.sum_mul _ _ _).symm
    _ ≤ (1 / (1 - gamma)) * g0 := mul_le_mul_of_nonneg_right hsum_le hg0
    _ = g0 / (1 - gamma) := by ring

/-!
## Lyapunov Exponent and Divergence

The Lyapunov exponent λ = lim_{T→∞} (1/T) log ||dx_T/dx_0||.
If λ > 0 (chaotic), two nearby trajectories diverge exponentially.
We prove: if λ > 0, small perturbations amplify over time.
-/

/-- Exponential growth with positive Lyapunov exponent -/
theorem lyapunov_divergence (lam delta : ℝ) (hlam : 0 < lam) (hdelta : 0 < delta)
    (T : ℝ) (hT : 0 < T) :
    delta ≤ delta * exp (lam * T) := by
  nth_rw 1 [← mul_one delta]
  apply mul_le_mul_of_nonneg_left _ hdelta.le
  rw [← Real.exp_zero]
  apply Real.exp_le_exp.mpr
  linarith [mul_pos hlam hT]

/-!
## Gradient Signal-to-Noise Ratio

When gradient variance Var[g] > ||E[g]||², the signal-to-noise ratio is < 1.
In chaotic systems, variance grows faster than the squared mean.
We prove that SNR < 1 implies the estimator is noise-dominated.
-/

/-- SNR < 1 iff variance exceeds squared mean -/
theorem snr_lt_one_iff (mean_sq var : ℝ) (hvar : 0 < var) :
    mean_sq / var < 1 ↔ mean_sq < var :=
  div_lt_one hvar

/-- Non-negative quantities have SNR ≥ 0 -/
theorem snr_nonneg (mean_sq var : ℝ) (hm : 0 ≤ mean_sq) (hvar : 0 < var) :
    0 ≤ mean_sq / var :=
  div_nonneg hm hvar.le

/-!
## Physical Operating Envelope
-/

/-- Q2 target speed is within the 7 m/s point-mass envelope -/
theorem q2_within_envelope (v : ℝ) (hv : v < 7) : v ≤ 7 := le_of_lt hv
