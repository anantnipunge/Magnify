var websiteTimes = {};
var activeTabId = null;
var lastActivatedTime = null;
var totalTimeToday = 0;

// Function to reset the websiteTimes after 12 hours
function resetWebsiteTimes() {
    websiteTimes = {};
    totalTimeToday = 0;
    setTimeout(resetWebsiteTimes, 12 * 60 * 60 * 1000); // Reset after 12 hours
}

resetWebsiteTimes(); // Start the reset timer

// Function to update the time spent on a website
function updateWebsiteTime(hostname, timeSpent) {
    if (!websiteTimes[hostname]) {
        websiteTimes[hostname] = 0;
    }
    websiteTimes[hostname] += timeSpent;
    totalTimeToday += timeSpent;
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
        var stats = JSON.stringify(websiteTimes);
        var totalToday = Math.round(totalTimeToday / 60); // Convert to minutes
        sendResponse({ stats: stats, totalToday: totalToday });
    }
});
