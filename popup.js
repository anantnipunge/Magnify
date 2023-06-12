chrome.runtime.sendMessage({ action: 'getStats' }, function (response) {
    var statsDiv = document.getElementById('stats');
    var stats = response.stats;
    var statsObj = JSON.parse(stats);
    var statsHTML = '';

    // Convert the statsObj into an array of objects for sorting
    var statsArray = [];
    for (var key in statsObj) {
        if (statsObj.hasOwnProperty(key)) {
            statsArray.push({ website: key, time: statsObj[key] });
        }
    }

    // Sort the statsArray in descending order based on time
    statsArray.sort(function (a, b) {
        return b.time - a.time;
    });

    // Iterate over the sorted array and generate the HTML
    for (var i = 0; i < statsArray.length; i++) {
        var website = statsArray[i].website;
        var time = statsArray[i].time;
        var timeDisplay = formatTime(time);
        statsHTML += '<p>' + website + ': ' + timeDisplay + '</p>';
    }

    statsDiv.innerHTML = statsHTML;

    var totalTodayDiv = document.getElementById('total-today');
    var totalToday = response.totalToday;
    var totalTodayDisplay = formatTime(totalToday);
    totalTodayDiv.innerText = 'Total time today: ' + totalTodayDisplay;
});

function formatTime(time) {
    var hours = Math.floor(time / 3600);
    var minutes = Math.floor((time - hours * 3600) / 60);
    var seconds = time - hours * 3600 - minutes * 60;

    var formattedTime = "";
    if (hours > 0) {
        formattedTime += hours + " hr ";
    }
    if (minutes > 0) {
        formattedTime += minutes + " min ";
    }
    formattedTime += seconds + " sec";

    return formattedTime;
}

// function convertTimeToHMS(seconds) {
//     // Get the number of hours
//     const hours = Math.floor(seconds / 3600);

//     // Get the number of minutes remaining after subtracting the hours from the total seconds
//     const minutes = Math.floor((seconds - hours * 3600) / 60);

//     // Get the number of seconds remaining after subtracting the hours and minutes from the total seconds
//     const seconds = seconds - hours * 3600 - minutes * 60;

//     // Return an object with the hours, minutes, and seconds
//     return {
//         hours,
//         minutes,
//         seconds,
//     };
// }

