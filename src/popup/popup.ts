import './popup.css';
import { TimerState } from '../service/timer';
document.addEventListener('DOMContentLoaded', () => {
  const timerDisplay = document.getElementById('timer_display') as HTMLElement;
  const playButton = document.getElementById('play_button') as HTMLElement;
  const pauseButton = document.getElementById('pause_button') as HTMLElement;
  const replayButton = document.getElementById('replay_button') as HTMLElement;

  // 更新 UI 顯示時間
  function updateTimerDisplay(timeRemaining: number) {
    const minutes = Math.floor(timeRemaining / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (timeRemaining % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
  }

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
  playButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ command: 'start' }, (response) => {
      console.log(response.message);
    });
  });

  // 暫停計時器
  pauseButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ command: 'stop' }, (response) => {
      console.log(response.message);
    });
  });

  // 重置計時器
  replayButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ command: 'reset' }, (response) => {
      console.log(response.message);
    });
  });

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

  function updateUI(state: TimerState) {
    // 重置所有按鈕的 hidden 樣式
    playButton.classList.add('hidden');
    pauseButton.classList.add('hidden');
    replayButton.classList.add('hidden');

    // 根據當前狀態顯示對應的按鈕
    switch (state) {
      case TimerState.Idle:
        playButton.classList.remove('hidden');
        replayButton.classList.remove('hidden');
        break;
      case TimerState.Running:
        pauseButton.classList.remove('hidden');
        replayButton.classList.remove('hidden');
        break;
      case TimerState.Paused:
        playButton.classList.remove('hidden');
        replayButton.classList.remove('hidden');
        break;
      case TimerState.Completed:
        replayButton.classList.remove('hidden');
        break;
    }
  }
});
