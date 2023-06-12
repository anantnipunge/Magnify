chrome.runtime.sendMessage({ action: 'getStats' }, function (response) {
    var statsDiv = document.getElementById('stats');
    var stats = response.stats;
    var statsObj = JSON.parse(stats);
    var statsHTML = '';

    for (var key in statsObj) {
        if (statsObj.hasOwnProperty(key)) {
            var time = statsObj[key];
            var timeDisplay = time >= 60 ? time + ' seconds' : 'less than 1 minute';
            statsHTML += '<p>' + key + ': ' + timeDisplay + '</p>';
        }
    }

    statsDiv.innerHTML = statsHTML;

    var totalTodayDiv = document.getElementById('total-today');
    var totalToday = response.totalToday;
    var totalTodayDisplay = totalToday >= 1 ? totalToday + ' minutes' : 'less than 1 minute';
    totalTodayDiv.innerText = 'Total time today: ' + totalTodayDisplay;
});
