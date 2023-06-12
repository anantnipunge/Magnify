var websiteTimes = {};
var activeTabId = null;
var lastActivatedTime = null;
var totalChromeTime = 0;
var currentDay = new Date().getDay(); // Get the current day

// Function to reset the websiteTimes and totalChromeTime at the start of a new day
function resetStatsAtNewDay() {
    var today = new Date().getDay();
    if (today !== currentDay) {
        websiteTimes = {};
        totalChromeTime = 0;
        currentDay = today;
    }
    setTimeout(resetStatsAtNewDay, 60 * 60 * 1000); // Check every hour for new day
}

resetStatsAtNewDay(); // Start the reset timer

// Function to update the time spent on a website
function updateWebsiteTime(hostname, timeSpent) {
    if (!websiteTimes[hostname]) {
        websiteTimes[hostname] = 0;
    }
    websiteTimes[hostname] += timeSpent;
}

// Function to calculate the time spent on a website
function calculateTimeSpent() {
    if (activeTabId !== null && lastActivatedTime !== null) {
        var currentTime = new Date().getTime();
        var timeSpent = Math.round((currentTime - lastActivatedTime) / 1000); // in seconds
        chrome.tabs.get(activeTabId, function (tab) {
            var hostname = new URL(tab.url).hostname;
            updateWebsiteTime(hostname, timeSpent);
        });
    }
}

// Function to calculate the total time spent on Chrome for the current day
function calculateTotalChromeTime() {
    var today = new Date().toLocaleDateString();
    var totalSeconds = Object.values(websiteTimes).reduce((acc, val) => acc + val, 0);
    totalChromeTime = Math.round(totalSeconds / 60); // Convert to minutes
}

chrome.tabs.onActivated.addListener(function (activeInfo) {
    calculateTimeSpent();
    activeTabId = activeInfo.tabId;
    lastActivatedTime = new Date().getTime();
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tabId === activeTabId) {
        calculateTimeSpent();
        lastActivatedTime = new Date().getTime();
    }
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
    if (tabId === activeTabId) {
        calculateTimeSpent();
        activeTabId = null;
        lastActivatedTime = null;
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'getStats') {
        calculateTotalChromeTime();
        var stats = JSON.stringify(websiteTimes);
        sendResponse({ stats: stats, totalChromeTime: totalChromeTime });
    }
});
