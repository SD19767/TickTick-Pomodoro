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
    if (result.timeRemaining !== undefined) {
      updateTimerDisplay(result.timeRemaining);
    } else {
      updateTimerDisplay(25 * 60); // 預設為 25 分鐘
    }

    // if (result.isRunning) {
    //   playButton.parentElement.style.display = 'none';
    //   pauseButton.parentElement.style.display = 'inline-block';
    // } else {
    //   playButton.parentElement.style.display = 'inline-block';
    //   pauseButton.parentElement.style.display = 'none';
    // }
  });

  // 啟動計時器
  playButton.addEventListener('click', () => {
    chrome.runtime.sendMessage(
      { command: 'start', duration: 25 * 60 },
      (response) => {
        console.log(response.message);
        // playButton.parentElement.style.display = 'none';
        // pauseButton.parentElement.style.display = 'inline-block';
      },
    );
  });

  // 暫停計時器
  pauseButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ command: 'stop' }, (response) => {
      console.log(response.message);
      // playButton.parentElement.style.display = 'inline-block';
      // pauseButton.parentElement.style.display = 'none';
    });
  });

  // 重置計時器
  replayButton.addEventListener('click', () => {
    chrome.runtime.sendMessage(
      { command: 'start', duration: 25 * 60 },
      (response) => {
        console.log(response.message);
        updateTimerDisplay(25 * 60);
        // playButton.parentElement.style.display = 'none';
        // pauseButton.parentElement.style.display = 'inline-block';
      },
    );
  });

  // 實時監控時間變化
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.timeRemaining) {
      updateTimerDisplay(changes.timeRemaining.newValue);
    }
  });
});
