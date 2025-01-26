import './popup.css';

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
  chrome.storage.local.get(['timeRemaining', 'isRunning'], (result) => {
    let timeRemaining = result.timeRemaining;
    if (timeRemaining === undefined) {
      timeRemaining = 1500; // 預設 25 分鐘
      chrome.storage.local.set({ timeRemaining, isRunning: false });
    }
    updateTimerDisplay(timeRemaining);
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
  });
});
