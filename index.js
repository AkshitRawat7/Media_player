const speedUp = document.querySelector("#speedUp");
const speedDown = document.querySelector("#speedDown");
const volumeUp = document.querySelector("#volumeUp");
const volumeDown = document.querySelector("#volumeDown");
const videoBtn = document.querySelector("#videoBtn");
const videoInput = document.querySelector("#videoInput");
const videoPlayer = document.querySelector("#main");
const toast = document.querySelector(".toast");
const fullscreen = document.querySelector("#fullscreen");
const pauseplay = document.querySelector("#playpause");
const forward = document.querySelector("#fast-forward");
const backward = document.querySelector("#fast-backward");
const seekBar = document.querySelector("#seek");
const currentTimeDisplay = document.querySelector("#currentTime");
const totalDurationDisplay = document.querySelector("#totalDuration");
const volume = document.querySelector("#volume");



const formatTime=(time)=>{
    const minutes = Math.floor(time/60);
    const seconds = Math.floor(time%60);

    return `${minutes<10? '0' : ''}${minutes}:${seconds<10?'0': ''}${seconds}`;
}

const updatecurrentTime=()=>{
    const video = document.querySelector("video");
    if(video)
    {
        currentTimeDisplay.textContent=formatTime(video.currentTime);
    }
}


const updateTotalDuration=()=>
{
    const video = document.querySelector('video');
    if(video)
    {
        totalDurationDisplay.textContent=formatTime(video.duration);
    }
    else
    {
        totalDurationDisplay.content="--:--";
    }
}

const handleSpeedUp = () => {
    const videoElement = document.querySelector(".main .video");
    if (videoElement == null) return;
    if (videoElement.playbackRate > 3) return;
    const increasedSpeed = videoElement.playbackRate + 0.5;
    videoElement.playbackRate = increasedSpeed;
    showToast(increasedSpeed + "X");
};

const handleSpeedDown = () => {
    const videoElement = document.querySelector(".video");
    if (videoElement == null) return;
    if (videoElement.playbackRate > 0) {
        const decreasedSpeed = videoElement.playbackRate - 0.5;
        videoElement.playbackRate = decreasedSpeed;
        showToast(decreasedSpeed + "X");
    }
};

const handleVolUp = () => {
    const videoElement = document.querySelector("video");
    if (videoElement == null) return;
    if (videoElement.volume >= 0.99) return;
    const increasedVol = videoElement.volume + 0.1;
    videoElement.volume = increasedVol;
    const percentage = (increasedVol * 100) + "%";
    showToast(percentage);
};

const handleVolDown = () => {
    const videoElement = document.querySelector("video");
    if (videoElement == null) return;
    if (videoElement.volume <= 0.1) {
        videoElement.volume = 0;
        return;
    }
    const decreasedVol = videoElement.volume - 0.1;
    videoElement.volume = decreasedVol;
    const percentage = (decreasedVol * 100) + "%";
    showToast(percentage);
};

const handleInput = () => {
    console.log("file button is working");
    videoInput.click();
};

const acceptInputhandler = (file) => {
    videoPlayer.innerHTML = "";
    const link = URL.createObjectURL(file);
    const videoElement = document.createElement("video");
    videoElement.src = link;
    videoElement.setAttribute("class", "video");
    videoPlayer.appendChild(videoElement);
    videoElement.volume = 0.7; // Volume is between 0 and 1
    addVideoEventListeners(videoElement);

    videoElement.addEventListener('loadedmetadata',()=>{
        updateTotalDuration();
    });
};

const handleFileSelect = (event) => {
    const selectedVideo = event.target.files[0];
    acceptInputhandler(selectedVideo);
    updateTotalDuration();
};

const handleDrop = (event) => {
    const dt = event.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('video/')) {
            acceptInputhandler(file);
        } else {
            alert('Please drop a valid video file.');
        }
    }
};

const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
};

function showToast(message) {
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => {
        toast.style.display = "none";
    }, 1000);
}

const highlight = () => videoPlayer.classList.add('highlight');
const unhighlight = () => videoPlayer.classList.remove('highlight');

const handeFullScreen = () => {
    videoPlayer.requestFullscreen();
};

const handlepauseplay = () => {
    const video = document.querySelector("video");
    if (video.paused) {
        video.play();
        pauseplay.src = "pause.png";
    } else {
        video.pause();
        pauseplay.src = "play-button.png";
    }

    // showToast(pauseplay.src);
};

const handleforward = () => {
    const video = document.querySelector("video");
    video.currentTime += 10;
    showToast('+' + 10 + "sec");
};

const handlebackward = () => {
    const video = document.querySelector("video");
    video.currentTime -= 10;
    showToast('-' + 10 + "sec");
};

const handleVideo = () => {
    const video = document.querySelector("video");
    if (video) {
        const percentage = (video.currentTime / video.duration) * 100;
        seekBar.value = percentage;
    }
};

const handleSeek = () => {
    const video = document.querySelector("video");
    if (video) {
        const time = (seekBar.value / 100) * video.duration;
        video.currentTime = time;
        updatecurrentTime();
    }
};

const addVideoEventListeners = (videoElement) => {
    videoElement.addEventListener("timeupdate", handleVideo);
    videoElement.addEventListener("timeupdate", updatecurrentTime);
    seekBar.addEventListener("input", handleSeek);
};


const handleMute=()=>{
    const video =  document.querySelector("video");
    
    if(video.muted)
    {
        video.muted=false;
        volume.src="mute.png";
    }

    else
    {
        video.muted=true;
        volume.src="volume.png";
    }
}

volume.addEventListener("click",handleMute);
videoPlayer.addEventListener('drop', handleDrop);
videoBtn.addEventListener("click", handleInput);
videoInput.addEventListener("change", handleFileSelect);
speedUp.addEventListener("click", handleSpeedUp);
speedDown.addEventListener("click", handleSpeedDown);
volumeUp.addEventListener("click", handleVolUp);
volumeDown.addEventListener("click", handleVolDown);
pauseplay.addEventListener("click", handlepauseplay);
fullscreen.addEventListener("click", handeFullScreen);
forward.addEventListener("click", handleforward);
backward.addEventListener("click", handlebackward);

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    videoPlayer.addEventListener(eventName, preventDefaults);
});

['dragenter', 'dragover'].forEach(eventName => {
    videoPlayer.addEventListener(eventName, highlight);
});

['dragleave', 'drop'].forEach(eventName => {
    videoPlayer.addEventListener(eventName, unhighlight);
});
