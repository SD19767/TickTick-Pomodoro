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

function notifyUser() {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon.png',
    title: 'Pomodoro Finished!',
    message: 'Time to take a break!',
  });
}

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
      notifyUser();
    }
  });
}

function stopTimer() {
  timer.pause();
  updateStorage();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === 'start') {
    const duration = request.duration || 25 * 60; // 預設時長
    timer.reset(duration);
    startTimer();
    sendResponse({ message: 'Timer started', duration });
  } else if (request.command === 'stop') {
    stopTimer();
    sendResponse({ message: 'Timer stopped' });
  }
});
