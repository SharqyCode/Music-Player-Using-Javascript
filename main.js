let myAudios = [
  {
    file: "./music/Joachim Heinrich - Flying Kites.m4a",
    artist: function () {
      return this.file.split(" - ")[0].substring(8);
    },
    title: function () {
      return this.file.split(" - ")[1].split(".")[0];
    },
  },
  {
    file: "./music/Kalp Kırıkları - Toygar Işıklı.mp3",
    artist: function () {
      return this.file.split(" - ")[0].substring(8);
    },
    title: function () {
      return this.file.split(" - ")[1].split(".")[0];
    },
  },
  {
    file: "./music/Lost - Giles Lamb.m4a",
    artist: function () {
      return this.file.split(" - ")[0].substring(8);
    },
    title: function () {
      return this.file.split(" - ")[1].split(".")[0];
    },
  },
  {
    file: "./music/Max Ritcher - On The Nature of Daylight.mp3",
    artist: function () {
      return this.file.split(" - ")[0].substring(8);
    },
    title: function () {
      return this.file.split(" - ")[1].split(".")[0];
    },
  },
];

let audio = new Audio();
let currentAudioIndex = 0;
let isPlaying = false;
let isRepeat = false;
let isShuffle = false;

const playBtn = document.querySelector(".play");
const pauseBtn = document.querySelector(".pause");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".back");
const repeatBtn = document.querySelector(".repeat");
const shuffleBtn = document.querySelector(".shuffle");
const record = document.querySelector("img");
const player = document.querySelector(".player");
const dot = document.querySelector(".dot");
const trackList = document.querySelector(".tracks");

function playAudio() {
  if (!isPlaying) {
    const currentAudio = myAudios[currentAudioIndex];
    const songTitle = document.querySelector(".card .info h2");
    const songArtist = document.querySelector(".card .info p");

    audio.src = currentAudio.file;
    songTitle.textContent = currentAudio.title();
    songArtist.textContent = currentAudio.artist();
    dot.style.left = 0;
  }

  Array.from(trackList.children).forEach((track) => {
    track.style.backgroundColor = "#ff5da6";
  });

  trackList.children[currentAudioIndex].style.backgroundColor = "#fff";

  record.style.animationPlayState = "running";
  playBtn.style.display = "none";
  pauseBtn.style.display = "flex";

  isPlaying = true;
  audio.play();
}

function pauseAudio() {
  playBtn.style.display = "flex";
  pauseBtn.style.display = "none";

  record.style.animationPlayState = "paused";

  audio.pause();
}

function nextTrack() {
  nextBtn.style.backgroundColor = "#9a98ff";
  setTimeout(() => {
    nextBtn.style.backgroundColor = "white";
  }, 200);

  if (!isRepeat) {
    currentAudioIndex++;
    if (currentAudioIndex >= myAudios.length) {
      currentAudioIndex = 0;
    }
  }
  if (isShuffle) {
    currentAudioIndex = Math.floor(Math.random() * 4);
  }
  isPlaying = false;
  playAudio();
}

function prevTrack() {
  prevBtn.style.backgroundColor = "#9a98ff";
  setTimeout(() => {
    prevBtn.style.backgroundColor = "white";
  }, 200);
  currentAudioIndex--;
  if (currentAudioIndex < 0) {
    currentAudioIndex = myAudios.length - 1;
  }
  isPlaying = false;
  playAudio();
}

function toggleRepeat() {
  repeatBtn.classList.toggle("repeat-on");
  if (repeatBtn.classList.contains("repeat-on")) {
    isRepeat = true;
  } else {
    isRepeat = false;
  }
}

function toggleShuffle() {
  shuffleBtn.classList.toggle("shuffle-on");
  if (shuffleBtn.classList.contains("shuffle-on")) {
    isShuffle = true;
  } else {
    isShuffle = false;
  }
}

function updateDotlocation() {
  const duration = audio.duration;
  let currentTime = audio.currentTime;
  dot.style.left = `${(currentTime / duration) * 100}%`;
}

let mousePos = 0,
  dotPos = 0;
function dragDot(e) {
  mousePos = e.clientX;
  dotPos = dot.offsetLeft;
  document.addEventListener("pointermove", dragEffect);
  document.addEventListener("pointerup", leaveEffect);
}

function dragEffect(e) {
  e.preventDefault();
  pauseAudio();
  dot.style.cursor = "grab";

  let deltaPos = e.clientX - mousePos;
  let newPos = dotPos + deltaPos;

  if (newPos > dot.parentElement.clientWidth) {
    newPos = dot.parentElement.clientWidth;
  } else if (newPos < 0) {
    newPos = 0;
  }
  dot.style.left = newPos + "px";
}

function leaveEffect() {
  document.removeEventListener("pointerup", leaveEffect);
  document.removeEventListener("pointermove", dragEffect);

  const distanceRatio = dot.offsetLeft / dot.parentElement.clientWidth;
  const currentTime = Math.round(audio.duration * distanceRatio);
  audio.currentTime = currentTime.toPrecision(2);
  if (distanceRatio == 1) {
    nextTrack();
  } else if (distanceRatio == 0) {
    prevTrack();
  } else {
    isPlaying = true;
    playAudio();
  }
}

function scrub(e) {
  let rect = e.target.getBoundingClientRect();
  dot.style.left = e.clientX - rect.left + "px";
  // console.log(dot.style.left);
  leaveEffect();
}

function setLastTrack() {
  const currentAudio = myAudios[currentAudioIndex];
  const songTitle = document.querySelector(".card .info h2");
  const songArtist = document.querySelector(".card .info p");

  audio.src = currentAudio.file;
  songTitle.textContent = currentAudio.title();
  songArtist.textContent = currentAudio.artist();
  dot.style.left = 0;
}

function loadTracks() {
  myAudios.forEach((audio) => {
    let track = document.createElement("li");
    let trackImg = document.createElement("img");
    trackImg.src = "images/pngimg.com - vinyl_PNG102.png";
    trackImg.alt = "";
    let trackInfo = document.createElement("div");
    trackInfo.classList.add("info");
    let songName = document.createElement("h3");
    songName.textContent = audio.title();
    let songArtist = document.createElement("p");
    songArtist.textContent = audio.artist();
    trackInfo.appendChild(songName);
    trackInfo.appendChild(songArtist);
    track.appendChild(trackImg);
    track.appendChild(trackInfo);
    trackList.appendChild(track);
  });
}

function clickTrack(e) {
  const indexNow = currentAudioIndex;
  const tracks = Array.from(trackList.children);

  currentAudioIndex = tracks.indexOf(getTrackLi(e.target));

  isPlaying = !(indexNow == currentAudioIndex) ? false : true;
  playAudio();
}

function getTrackLi(target) {
  while (target.tagName != "LI") {
    target = target.parentElement;
  }
  return target;
}

playBtn.addEventListener("click", playAudio);
pauseBtn.addEventListener("click", pauseAudio);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);
repeatBtn.addEventListener("click", toggleRepeat);
shuffleBtn.addEventListener("click", toggleShuffle);

player.addEventListener("click", scrub);

audio.addEventListener("ended", nextTrack);
audio.addEventListener("timeupdate", updateDotlocation);

window.addEventListener("load", loadTracks);
window.addEventListener("load", setLastTrack);

trackList.addEventListener("click", clickTrack);

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowRight") {
    nextTrack();
  } else if (e.code === "ArrowLeft") {
    prevTrack();
  }
});
