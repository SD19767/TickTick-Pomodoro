import { Timer, TimerState } from './service/timer';
const timer = new Timer();

// Extension 安裝時初始化預設值
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension Installed');
  chrome.storage.local.set({
    timeRemaining: Math.floor(20 * 0.5), // 預設 25 分鐘
    state: TimerState.Idle, // 預設狀態為 Idle
  });
});

// Extension 啟動時重置計時器狀態
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(['timeRemaining', 'state'], (result) => {
    if (result.timeRemaining && result.timeRemaining > 0) {
      timer.reset(result.timeRemaining);
    }
  });
});

// 更新 local storage 的狀態
function updateStorage() {
  chrome.storage.local.set({
    timeRemaining: timer.getRemainingTime(),
    state: timer.GetTimerState(),
  });
}

// 啟動計時器
function startTimer() {
  timer.start((timeRemaining: number) => {
    updateStorage();
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
