/**
 * Lightweight per-step timing tracker.
 *
 * Usage:
 *   const t = newTimer();
 *   const res = t.track('create_voucher', () => http.post(...));
 *   t.summary(__VU, __ITER);
 */

export function newTimer() {
  const steps = [];

  return {
    /**
     * Wraps a function call and records its duration.
     * @param {string} name  - step label
     * @param {Function} fn  - function to call (must return the result)
     */
    track(name, fn) {
      const start  = Date.now();
      const result = fn();
      const ms     = Date.now() - start;
      steps.push({ name, ms });
      return result;
    },

    /** Prints slowest and fastest step for this VU iteration. */
    summary(vu, iter) {
      if (steps.length === 0) return;
      const sorted  = steps.slice().sort((a, b) => b.ms - a.ms);
      const slowest = sorted[0];
      const fastest = sorted[sorted.length - 1];
      console.log(
        `[VU ${vu} ITER ${iter}] SLOWEST: ${slowest.name} ${slowest.ms}ms | ` +
        `FASTEST: ${fastest.name} ${fastest.ms}ms`
      );
      // Full ranked list
      const ranked = sorted.map((s, i) => `  ${i + 1}. ${s.name}: ${s.ms}ms`).join('\n');
      console.log(`[VU ${vu} ITER ${iter}] All steps ranked:\n${ranked}`);
    },
  };
}
