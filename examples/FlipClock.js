window.oldTimeStr = "------";

window.use24hr = false;

var cards = document.getElementsByTagName("flip-card-")

window.setInterval(function(){
	var time = new Date;
	var h = time.getHours()
	var timeStr = ((h>12&&!window.use24hr)?h-12:h).toLocaleString('en-GB', {minimumIntegerDigits: 2, useGrouping:false}) +
	time.getMinutes().toLocaleString('en-GB', {minimumIntegerDigits: 2, useGrouping:false}) +
	time.getSeconds().toLocaleString('en-GB', {minimumIntegerDigits: 2, useGrouping:false});
	for (let i = 0; i < 6; i++) {
		if ([...timeStr][i] != [...window.oldTimeStr][i]){
			cards[i].textContent = [...timeStr][i];
		}
	}

	window.oldTimeStr = timeStr;
}, 500);