chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    var currentTime = Date.now();

    if (changeInfo.url) {
        chrome.storage.local.get(null,function (obj){
            var gameEndUrl = obj["gameEndUrl"];

            if (obj["gameStartUrl"] && obj["gameEndUrl"] && obj["gameStartTime"] && !obj["gameTimeSpent"]) {
                var gameUrlSequence = obj["gameUrlSequence"];

                if (!gameUrlSequence) {
                    gameUrlSequence = [];
                } else {
                    gameUrlSequence = JSON.parse(gameUrlSequence);
                }

                if (changeInfo.url != gameUrlSequence[gameUrlSequence.length-1]) {
                    gameUrlSequence.push(changeInfo.url);
                    chrome.storage.local.set({"gameUrlSequence": JSON.stringify(gameUrlSequence)});
                }

                if (changeInfo.url === gameEndUrl) {
                    gameFinished = true;

                    chrome.storage.local.get(null,function (obj){
                        startTime = parseInt(obj["gameStartTime"], 10);
                        const timeSpent = Math.round(10*(currentTime-startTime)/60000)/10;
                        chrome.storage.local.set({"gameTimeSpent": timeSpent});
                    });
                }
            }
        });
    }
});

