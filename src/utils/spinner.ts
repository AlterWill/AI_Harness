export default class Spinner {
  frames: string[];
  framesLength: number;
  currentFrame: number;
  intervalGapTime: number;
  intervalId: NodeJS.Timeout | null = null;
  onTick!: (frame: string) => void;

  constructor() {
    this.frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    this.framesLength = this.frames.length;
    this.currentFrame = 0;
    this.intervalGapTime = 80;
  }

  start(): void {
    if (this.intervalId) return;
    this.currentFrame = 0;

    this.onTick(this.frames[this.currentFrame]!);

    this.intervalId = setInterval(() => {
      this.currentFrame = (this.currentFrame + 1) % this.framesLength;
      this.onTick(this.frames[this.currentFrame]!);
    }, this.intervalGapTime);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
