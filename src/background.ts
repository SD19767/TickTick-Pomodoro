import Timer from './service/timer';
const timer = new Timer();

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension Installed');
});

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

function updateStorage() {
  chrome.storage.local.set({
    timeRemaining: timer.getRemainingTime(),
    isRunning: timer.isTimerRunning(),
  });
}

function startTimer() {
  timer.start((timeRemaining: number) => {
    updateStorage();
    if (timeRemaining <= 0) {
      stopTimer();
      console.log(`simulate notification when timer reaches 0`);
    }
  });
}

function stopTimer() {
  timer.pause();
}
function resetTimer() {
  timer.reset();
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.command) {
    case 'start':
      startTimer();
      sendResponse({ message: 'Timer started' });
      break;
    case 'stop':
      stopTimer();
      sendResponse({ message: 'Timer stopped' });
    case 'reset':
      resetTimer();
      sendResponse({ message: 'Timer reset' });
    default:
      break;
  }
});
