import Timer from './service/timer';
const timer = new Timer();

// Extension 安裝時初始化預設值
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension Installed');
  chrome.storage.local.set({
    timeRemaining: 1500, // 預設 25 分鐘
    isRunning: false, // 預設不運行
  });
});

// Extension 啟動時重置計時器狀態
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(['timeRemaining', 'isRunning'], (result) => {
    if (result.timeRemaining && result.timeRemaining > 0) {
      timer.reset(result.timeRemaining);
      if (result.isRunning) {
        startTimer();
      }
    }
  });
});

// 更新 local storage 的狀態
function updateStorage() {
  chrome.storage.local.set({
    timeRemaining: timer.getRemainingTime(),
    isRunning: timer.isTimerRunning(),
  });
}

// 啟動計時器
function startTimer() {
  timer.start((timeRemaining: number) => {
    updateStorage();
    if (timeRemaining <= 0) {
      stopTimer();
      console.log('Timer finished. Simulating notification...');
      // TODO:在時間結束後模擬通知
    }
  });
}

// 暫停計時器
function stopTimer() {
  timer.pause();
  updateStorage();
}

// 重置計時器
function resetTimer() {
  timer.reset();
  updateStorage();
}

// 監聽從 popup 傳來的消息並執行對應操作
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.command) {
    case 'start':
      startTimer();
      sendResponse({ message: 'Timer started' });
      break;
    case 'stop':
      stopTimer();
      sendResponse({ message: 'Timer stopped' });
      break;
    case 'reset':
      resetTimer();
      sendResponse({ message: 'Timer reset' });
      break;
    default:
      sendResponse({ message: 'Unknown command' });
      break;
  }
});
