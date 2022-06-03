vidContainer = document.getElementById("vidContainer");
vidPlayer = document.getElementById("vidPlayer");
vidSources = document.getElementById("vidSources");

audioSource = undefined;
videoSource = undefined;

//currently just get the first source
vidSources.childNodes.forEach(el=>{
	if (el.nodeName != "SOURCE"){return;}
	contents = el.getAttribute("content").toUpperCase().split(" ");
	if (
		contents.includes("AUDIO") &&
		contents.includes("VIDEO") &&
		audioSource === undefined &&
		videoSource === undefined
	){
		videoSource = el.getAttribute("src");
		audioSource = "";
	}
	else if (contents.includes("VIDEO") && videoSource === undefined){
		videoSource = el.getAttribute("src");
	}
	else if (contents.includes("AUDIO") && audioSource === undefined){
		audioSource = el.getAttribute("src");
	}
})
vidPlayer.setAttribute("src",videoSource);
// if (audioSource !== null){
vidAudioPlayer = new Audio(audioSource);
// }
vidPlayer.addEventListener('playing', (event) => {
	vidAudioPlayer.currentTime = event.srcElement.currentTime;
	vidAudioPlayer?.play();
});
vidPlayer.addEventListener('pause', (event) => {
	console.log(vidAudioPlayer.currentTime);
	console.log(event.srcElement.currentTime);
	vidAudioPlayer?.pause();
});