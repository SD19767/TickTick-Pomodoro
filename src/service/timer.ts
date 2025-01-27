type TimerCallback = (timeRemaining: number) => void;
enum TimerState {
  Idle = 'IDLE', // 計時器閒置
  Running = 'RUNNING', // 計時中
  Paused = 'PAUSED', // 暫停中
  Completed = 'COMPLETED', // 計時完成
}

const DEFAULT_DURATION = Math.floor(25 * 60); // 預設 25 分鐘

class Timer {
  private defaultDuration: number; // 預設時間 (單位: 秒)
  private timeRemaining: number; // 剩餘時間 (單位: 秒)
  private timerInterval: number | null; // 計時器 ID
  private state: TimerState; // 是否正在運行

  constructor(defaultDuration: number = DEFAULT_DURATION) {
    this.defaultDuration = defaultDuration;
    this.timeRemaining = defaultDuration;
    this.timerInterval = null;
    this.state = TimerState.Idle;
  }

  // 啟動計時器
  start(callback?: TimerCallback) {
    if (this.state === TimerState.Running) return;

    this.state = TimerState.Running;

    this.timerInterval = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
      } else {
        this.pause(); // 時間到後自動暫停
        this.state = TimerState.Completed;
      }
      if (callback) callback(this.timeRemaining);
    }, 1000);
  }

  // 暫停計時器
  pause() {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
      this.state = TimerState.Paused;
    }
  }

  // 重置計時器
  reset(newDuration?: number) {
    this.pause();
    this.timeRemaining =
      newDuration !== undefined ? newDuration : this.defaultDuration;
    this.state = TimerState.Idle;
  }

  changeTime(newDuration: number) {
    if (this.state == TimerState.Running) return;
    this.defaultDuration = newDuration;
    this.timeRemaining = newDuration;
  }
  // 獲取剩餘時間
  getRemainingTime(): number {
    return this.timeRemaining;
  }

  // 獲取是否正在運行
  GetTimerState(): TimerState {
    return this.state;
  }
}

export { Timer, TimerState };
