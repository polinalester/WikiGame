const inputField = document.getElementById("url-field");

const seqList = document.getElementById("url-seq-start");
const seqListHidden = document.getElementById("url-seq-middle");
const seqListEnd = document.getElementById("url-seq-end")

const gameStartBtn = document.getElementById("game-start-btn");
const clearBtn = document.getElementById("clear-btn");
const startBtn = document.getElementById("start-btn");
const endBtn = document.getElementById("end-btn");

const startUrl = document.getElementById("start-url");
const endUrl = document.getElementById("end-url");

const statusPar = document.getElementById("status");

const coll = document.getElementsByClassName("collapsible");


window.onload = function() {
  render();
}


function render(){
	chrome.storage.local.get(null,function (obj){
		var gameUrlSequence = obj["gameUrlSequence"]
		const gameStartUrl = obj["gameStartUrl"]
		const gameEndUrl = obj["gameEndUrl"]

		if (!gameUrlSequence) {
			gameUrlSequence = [];
		} else {
			gameUrlSequence = JSON.parse(gameUrlSequence);
		}

	  if (gameStartUrl) {
	   	startUrl.innerText = gameStartUrl;
	   	startUrl.href = gameStartUrl;
	  }

	  if (gameEndUrl) {
	   	endUrl.innerText = gameEndUrl;
	   	endUrl.href = gameEndUrl;
	  }

		innerHtml = ''
		innerHtmlHidden = ''
		innerHtmlEnd = ''

		var htmlPart = '';
		for (var i = 0; i < gameUrlSequence.length; i++){

			htmlPart = `<li>
										<a href="${gameUrlSequence[i]}">${gameUrlSequence[i]}</a>
									</li>`

			if (gameUrlSequence.length <= 3){
				innerHtml += htmlPart
			} else {
				if (i < 1) {
					innerHtml += htmlPart
				} else if (1 <= i && i < gameUrlSequence.length - 1) {
					innerHtmlHidden += htmlPart
				} else {
					innerHtmlEnd += htmlPart	
				}
			}
		}
		seqList.innerHTML = innerHtml;
		seqListHidden.innerHTML = innerHtmlHidden;
		seqListEnd.innerHTML = innerHtmlEnd;

		if (obj["gameTimeSpent"]) {
			statusPar.innerText = `Success!
				You've used ${gameUrlSequence.length} clicks and it took ${obj["gameTimeSpent"]} minutes.`;
		}
  });
}


gameStartBtn.addEventListener("click", function(){
	chrome.storage.local.get(null,function (obj){
		const gameUrlSequence = obj["gameUrlSequence"]
		const gameStartUrl = obj["gameStartUrl"]
		const gameEndUrl = obj["gameEndUrl"]

		if (!gameUrlSequence && gameStartUrl && gameEndUrl) {
			var urlSeq = [gameStartUrl];
			chrome.storage.local.set({"gameUrlSequence": JSON.stringify(urlSeq)});
			chrome.storage.local.set({"gameStartTime": Date.now()});
		}
		render();
  });
})


startBtn.addEventListener("click", function(){

  chrome.storage.local.get("gameUrlSequence",function (obj){
    const gameUrlSequence = obj["gameUrlSequence"];

		if (!gameUrlSequence) {
			if (inputField.value) {
				chrome.storage.local.set({"gameStartUrl": inputField.value});
				render();
			} else {
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
					var activeTab = tabs[0];
					chrome.storage.local.set({"gameStartUrl": activeTab.url});
					render();
			  });
			}
		}
  });
})


endBtn.addEventListener("click", function(){
  chrome.storage.local.get(null,function (obj){
  	const gameUrlSequence = obj["gameUrlSequence"];
		if (!gameUrlSequence) {
			if (inputField.value) {
				chrome.storage.local.set({"gameEndUrl": inputField.value});
				render();
			} else {
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			     var activeTab = tabs[0];
			     chrome.storage.local.set({"gameEndUrl": activeTab.url});
			     render();
			  });
			}
		}
  });
})


clearBtn.addEventListener("click", function() {
	chrome.storage.local.clear(function() {
    var error = chrome.runtime.lastError;
    if (!error) {
      console.error(error);
    }
  });
  render();
})


for (var i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
} 