chrome.runtime.sendMessage({ action: 'getStats' }, function (response) {
    var statsDiv = document.getElementById('stats');
    var stats = response.stats;
    var statsObj = JSON.parse(stats);
    var statsHTML = '';

    for (var key in statsObj) {
        if (statsObj.hasOwnProperty(key)) {
            statsHTML += '<p>' + key + ': ' + statsObj[key] + ' seconds</p>';
        }
    }

    statsDiv.innerHTML = statsHTML;

    var totalTodayDiv = document.getElementById('total-today');
    var totalToday = response.totalToday;
    totalTodayDiv.innerText = 'Total time today: ' + totalToday + ' minutes';

    
});
