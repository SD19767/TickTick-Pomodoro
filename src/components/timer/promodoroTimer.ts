import { TimerState } from '../../service/timer';
class PomodoroTimer extends HTMLElement {
  timerDisplayMinutes: HTMLInputElement | null;
  timerDisplaySeconds: HTMLInputElement | null;
  playButton: HTMLElement | null;
  pauseButton: HTMLElement | null;
  replayButton: HTMLElement | null;

  // 外部傳入的時間與函數
  time: number = 0;
  timerState = TimerState.Idle;
  onStart: (() => void) | null = null;
  onPause: (() => void) | null = null;
  onReset: (() => void) | null = null;
  onChangeTime: ((secs: number) => void) | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // 定義 HTML 模板內嵌在程式中
    const template = document.createElement('template');
    template.innerHTML =
      /* HTML */
      ` <style>
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
          /* 全域樣式 */
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f4f4f4; /* 淺灰背景 */
          }
          .timer-container {
            background-color: #f29223; /* 橙色背景 */
            border-radius: 15px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
            width: 300px;
          }

          /* 顯示時間 */
          .timer-display {
            font-size: 48px;
            font-weight: bold;
            color: #fff; /* 白色文字 */
            margin-bottom: 20px;
          }

          /* 按鈕區域樣式 */
          .timer-controllers {
            display: flex;
            justify-content: center; /* 改成讓按鈕居中排列 */
            gap: 10px; /* 增加按鈕間距 */
            width: 100%;
          }

          .control-button {
            background-color: #9d6223; /* 深棕色背景 */
            border: none;
            border-radius: 10px;
            width: 60px;
            height: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
            transition: background-color 0.3s ease;
          }

          .control-button.hidden {
            display: none; /* 隱藏時不佔用空間 */
          }
          .control-button:hover {
            background-color: #d17a1e; /* 懸停時的較亮棕色 */
          }

          /* 列表按鈕樣式 */
          .list-button {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            cursor: pointer;
          }

          /* Material Symbols 標籤樣式 */
          .material-symbols-outlined {
            font-size: 24px;
            color: #fff; /* 白色標籤 */
            user-select: none;
          }
        </style>
        <div class="timer-container">
          <div class="timer-display">
            <input type="number" id="mins" />:<input type="number" id="secs" />
          </div>
          <button class="list-button">
            <span class="material-symbols-outlined">format_list_bulleted</span>
          </button>
          <div class="timer-controllers">
            <button class="control-button" id="play_button">
              <span class="material-symbols-outlined">play_arrow</span>
            </button>
            <button class="control-button" id="pause_button">
              <span class="material-symbols-outlined">pause</span>
            </button>
            <button class="control-button" id="replay_button">
              <span class="material-symbols-outlined">replay</span>
            </button>
          </div>
        </div>`;

    // 附加模板到 shadow DOM
    this.shadowRoot?.appendChild(template.content.cloneNode(true));

    this.timerDisplayMinutes = null;
    this.timerDisplaySeconds = null;
    this.playButton = null;
    this.pauseButton = null;
    this.replayButton = null;
  }

  connectedCallback() {
    if (!this.shadowRoot) return;
    this.timerDisplayMinutes = this.shadowRoot.querySelector('#mins');
    this.timerDisplaySeconds = this.shadowRoot.querySelector('#secs');
    this.playButton = this.shadowRoot.querySelector('#play_button');
    this.pauseButton = this.shadowRoot.querySelector('#pause_button');
    this.replayButton = this.shadowRoot.querySelector('#replay_button');

    // 綁定事件，呼叫外部傳入的函數
    this.playButton?.addEventListener('click', () => this.onStart?.());
    this.pauseButton?.addEventListener('click', () => this.onPause?.());
    this.replayButton?.addEventListener('click', () => this.onReset?.());

    this.timerDisplayMinutes?.addEventListener('change', () =>
      this.updateTimeFromInput(),
    );
    this.timerDisplaySeconds?.addEventListener('change', () =>
      this.updateTimeFromInput(),
    );
  }
  updateTimeFromInput() {
    if (!this.timerDisplayMinutes || !this.timerDisplaySeconds) return;

    // 獲取輸入的值
    const minutes = parseInt(this.timerDisplayMinutes.value, 10) || 0;
    const seconds = parseInt(this.timerDisplaySeconds.value, 10) || 0;

    // 確保範圍合法
    const validMinutes = Math.max(0, Math.min(59, minutes));
    const validSeconds = Math.max(0, Math.min(59, seconds));

    // 更新輸入框顯示（矯正非法值）
    this.timerDisplayMinutes.value = String(validMinutes).padStart(2, '0');
    this.timerDisplaySeconds.value = String(validSeconds).padStart(2, '0');

    // 更新內部時間（秒數）
    this.time = validMinutes * 60 + validSeconds;

    console.log(`promodoroTimer.time = ${this.time}`);
    // 通知外部時間已更改
    this.onChangeTime?.(this.time);
  }

  disconnectedCallback() {
    // 移除事件綁定
    this.playButton?.removeEventListener(
      'click',
      this.onStart as EventListener,
    );
    this.pauseButton?.removeEventListener(
      'click',
      this.onPause as EventListener,
    );
    this.replayButton?.removeEventListener(
      'click',
      this.onReset as EventListener,
    );
  }

  updateDisplay() {
    const minutes = String(Math.floor(this.time / 60)).padStart(2, '0');
    const seconds = String(this.time % 60).padStart(2, '0');
    if (this.timerDisplayMinutes && this.timerDisplayMinutes.value != minutes) {
      this.timerDisplayMinutes.value = minutes;
    }
    if (this.timerDisplaySeconds && this.timerDisplaySeconds.value != seconds) {
      this.timerDisplaySeconds.value = seconds;
    }
  }

  updateButtonsState() {
    if (
      this.playButton == null ||
      this.pauseButton == null ||
      this.replayButton == null
    )
      return;
    // 重置所有按鈕的 hidden 樣式
    this.playButton.classList.add('hidden');
    this.pauseButton.classList.add('hidden');
    this.replayButton.classList.add('hidden');
    // 根據當前狀態顯示對應的按鈕
    switch (this.timerState) {
      case TimerState.Idle:
        this.playButton.classList.remove('hidden');
        this.replayButton.classList.remove('hidden');
        break;
      case TimerState.Running:
        this.pauseButton.classList.remove('hidden');
        this.replayButton.classList.remove('hidden');
        break;
      case TimerState.Paused:
        this.playButton.classList.remove('hidden');
        this.replayButton.classList.remove('hidden');
        break;
      case TimerState.Completed:
        this.replayButton.classList.remove('hidden');
        break;
    }
  }
}

export default PomodoroTimer;
