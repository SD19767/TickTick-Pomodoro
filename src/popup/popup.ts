// import './popup.css';
import { TimerState } from '../service/timer';
import PomodoroTimer from '../components/timer/promodoroTimer';
document.addEventListener('DOMContentLoaded', () => {
  if (!customElements.get('pomodoro-timer')) {
    customElements.define('pomodoro-timer', PomodoroTimer);
  }
  const pomodoroTimer = document.querySelector(
    'pomodoro-timer',
  ) as PomodoroTimer;

  // 初始化計時器狀態
  chrome.storage.local.get(['timeRemaining', 'state'], (result) => {
    let timeRemaining = result.timeRemaining;
    if (timeRemaining === undefined) {
      timeRemaining = Math.floor(20 * 0.5); // 預設 25 分鐘
      chrome.storage.local.set({ timeRemaining, state: TimerState.Idle });
    }
    updateTimerDisplay(timeRemaining);
    if (result.state) {
      updateUI(result.state);
    }
  });

  // 啟動計時器
  pomodoroTimer.onStart = () => {
    chrome.runtime.sendMessage({ command: 'start' }, (response) => {
      console.log(response.message);
    });
  };
  // 暫停計時器
  pomodoroTimer.onPause = () => {
    chrome.runtime.sendMessage({ command: 'stop' }, (response) => {
      console.log(response.message);
    });
  };
  // 重置計時器
  pomodoroTimer.onReset = () => {
    chrome.runtime.sendMessage({ command: 'reset' }, (response) => {
      console.log(response.message);
    });
  };

  pomodoroTimer.onChangeTime = (secs: number) => {
    chrome.runtime.sendMessage({ command: 'changeTime', secs }, (response) => {
      console.log(response.message);
    });
  };
  // 監聽 storage 變化，實時更新時間顯示
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.timeRemaining) {
      updateTimerDisplay(changes.timeRemaining.newValue);
    }
    if (changes.state) {
      const state = changes.state.newValue as TimerState;
      updateUI(state);
    }
  });
  // 更新 UI 顯示時間
  function updateTimerDisplay(timeRemaining: number) {
    pomodoroTimer.time = timeRemaining;
    pomodoroTimer.updateDisplay();
  }
  function updateUI(state: TimerState) {
    pomodoroTimer.timerState = state;
    pomodoroTimer.updateButtonsState();
  }
});
