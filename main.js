let myAudios = [
  {
    file: "/music/Joachim Heinrich - Flying Kites.m4a",
    artist: function () {
      return this.file.split(" - ")[0].substring(7);
    },
    title: function () {
      return this.file.split(" - ")[1].split(".")[0];
    },
  },
  {
    file: "/music/Kalp Kırıkları - Toygar Işıklı.mp3",
    artist: function () {
      return this.file.split(" - ")[0].substring(7);
    },
    title: function () {
      return this.file.split(" - ")[1].split(".")[0];
    },
  },
  {
    file: "/music/Lost - Giles Lamb.m4a",
    artist: function () {
      return this.file.split(" - ")[0].substring(7);
    },
    title: function () {
      return this.file.split(" - ")[1].split(".")[0];
    },
  },
  {
    file: "/music/Max Ritcher - On The Nature of Daylight.mp3",
    artist: function () {
      return this.file.split(" - ")[0].substring(7);
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

let firstPos = 0;
let currentPos = 0;
function dragDot(e) {
  firstPos = e.clientX;
  document.addEventListener("pointermove", dragEffect);
  document.addEventListener("pointerup", leaveEffect);
}

function dragEffect(e) {
  pauseAudio();
  e.preventDefault();

  dot.style.cursor = "grab";

  currentPos = firstPos - e.clientX;
  firstPos = e.clientX;

  if (dot.offsetLeft - currentPos > dot.parentElement.clientWidth) {
    dot.style.left = dot.parentElement.clientWidth;
  } else if (dot.offsetLeft - currentPos < 0) {
    dot.style.left = 0;
  } else {
    dot.style.left = dot.offsetLeft - currentPos + "px";
  }
}

function leaveEffect() {
  const distanceRatio = dot.offsetLeft / dot.parentElement.clientWidth;
  const currentTime = audio.duration * distanceRatio;

  audio.currentTime = currentTime.toPrecision(2);
  if (distanceRatio == 1) {
    nextTrack();
  } else if (distanceRatio == 0) {
    prevTrack();
  } else {
    playAudio();
  }
  document.removeEventListener("pointermove", dragEffect);
  document.removeEventListener("pointerup", leaveEffect);
}

function scrub(e) {
  let rect = e.target.getBoundingClientRect();
  dot.style.left = e.clientX - rect.left + "px";
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
    trackImg.src = "/images/pngimg.com - vinyl_PNG102.png";
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
  currentAudioIndex = Array.from(trackList.children).indexOf(
    getTrackLi(e.target)
  );
  console.log(indexNow);
  console.log(currentAudioIndex);
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
dot.addEventListener("pointerdown", dragDot);

audio.addEventListener("ended", nextTrack);
audio.addEventListener("timeupdate", updateDotlocation);

window.addEventListener("load", loadTracks);
window.addEventListener("load", setLastTrack);

trackList.addEventListener("click", clickTrack);
