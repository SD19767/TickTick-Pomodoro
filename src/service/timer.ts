type TimerCallback = (timerRemaining: number) => void;

class Timer {
  private defaultDuration: number; // 預設時間(單位:秒)
  private timeRemaining: number; // 剩餘時間(單位:秒)
  private timerInterval: number | null; // 計時器 ID
  private isRunning: boolean; //是否正在運行

  constructor(defaultDuration: number = 25 * 60) {
    this.defaultDuration = defaultDuration;
    this.timeRemaining = defaultDuration;
    this.timerInterval = null;
    this.isRunning = false;
  }

  start(callback?: TimerCallback) {
    if (this.isRunning) return;

    this.isRunning = true;

    this.timerInterval = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
        if (callback) callback(this.timeRemaining);
      } else {
        this.pause(); // 時間到後自動暫停
        if (callback) callback(0);
      }
    }, 1000);
  }

  // 暫停計時器
  pause() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
      this.isRunning = false;
    }
  }

  // 重置計時器
  reset(newDuration?: number) {
    this.pause();
    this.timeRemaining =
      newDuration !== undefined ? newDuration : this.defaultDuration;
    this.isRunning = false;
  }

  // 獲取剩餘時間
  getRemainingTime(): number {
    return this.timeRemaining;
  }

  // 獲取是否正在運行
  isTimerRunning(): boolean {
    return this.isRunning;
  }
}

export default Timer;
