class ClockTimer extends HTMLElement {
  private startTime: number = 0;
  private elapsedTime: number = 0;
  private intervalId: number | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // 設定樣式與結構
    this.shadowRoot!.innerHTML = `
        <style>
          :host {
            display: inline-block;
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            width: 150px;
            user-select: none;
          }
          .time {
            font-size: 1.5rem;
            margin-bottom: 10px;
          }
          button {
            margin: 0 5px;
            padding: 5px 10px;
            font-size: 1rem;
          }
        </style>
        <div class="time">00:00:00</div>
        <button id="start">Start</button>
        <button id="stop">Stop</button>
        <button id="reset">Reset</button>
      `;

    // 綁定按鈕事件
    this.shadowRoot!.querySelector('#start')!.addEventListener('click', () =>
      this.start(),
    );
    this.shadowRoot!.querySelector('#stop')!.addEventListener('click', () =>
      this.stop(),
    );
    this.shadowRoot!.querySelector('#reset')!.addEventListener('click', () =>
      this.reset(),
    );
  }

  // 時間格式化
  private formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      '0',
    );
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  // 啟動計時
  public start(): void {
    if (this.intervalId) return; // 避免重複啟動
    this.startTime = Date.now() - this.elapsedTime;
    this.intervalId = window.setInterval(() => {
      this.elapsedTime = Date.now() - this.startTime;
      this.updateTimeDisplay();
      this.dispatchEvent(
        new CustomEvent('time-update', { detail: this.elapsedTime }),
      );
    }, 100);
  }

  // 停止計時
  public stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // 重置計時
  public reset(): void {
    this.stop();
    this.elapsedTime = 0;
    this.updateTimeDisplay();
  }

  // 更新時間顯示
  private updateTimeDisplay(): void {
    const timeDiv = this.shadowRoot!.querySelector('.time');
    if (timeDiv) {
      timeDiv.textContent = this.formatTime(this.elapsedTime);
    }
  }

  // 獲取目前時間（毫秒）
  public getTime(): number {
    return this.elapsedTime;
  }
}

// 註冊 Web Component（避免重複定義）
if (!customElements.get('clock-timer')) {
  customElements.define('clock-timer', ClockTimer);
}
