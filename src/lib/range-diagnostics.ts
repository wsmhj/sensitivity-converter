export type TimingSummary = {
  frames: number;
  frameP95: number;
  frameMax: number;
  drawP95: number;
  drawMax: number;
  framesOver50ms: number;
  shots: number;
  shotMax: number;
};

// Opt-in, bounded local measurements. Never passed to analytics or profile storage.
// Frame interval includes browser scheduling; draw duration excludes GPU presentation.
export class RangeDiagnostics {
  private intervals = new Float64Array(4096);
  private draws = new Float64Array(4096);
  private frames = 0;
  private frameMax = 0;
  private drawMax = 0;
  private framesOver50ms = 0;
  private shots = 0;
  private shotMax = 0;

  frame(interval: number, draw: number) {
    const index = this.frames % this.intervals.length;
    this.intervals[index] = interval;
    this.draws[index] = draw;
    this.frames++;
    this.frameMax = Math.max(this.frameMax, interval);
    this.drawMax = Math.max(this.drawMax, draw);
    if (interval > 50) this.framesOver50ms++;
  }

  shot(duration: number) {
    this.shots++;
    this.shotMax = Math.max(this.shotMax, duration);
  }

  snapshot(): TimingSummary {
    const size = Math.min(this.frames, this.intervals.length);
    const percentile = (values: Float64Array) => {
      if (!size) return 0;
      const sorted = values.slice(0, size).sort();
      return sorted[Math.ceil(size * 0.95) - 1];
    };
    return {
      frames: this.frames,
      frameP95: percentile(this.intervals),
      frameMax: this.frameMax,
      drawP95: percentile(this.draws),
      drawMax: this.drawMax,
      framesOver50ms: this.framesOver50ms,
      shots: this.shots,
      shotMax: this.shotMax,
    };
  }
}
