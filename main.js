let myAudios = [
  {
    file: "/music/Bang boys - Explosion Sound Effect.mpeg",
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
];
let audio = new Audio();
let currentAudioIndex = 0;
let isPlaying = false;
let isRepeat = false;

const playBtn = document.querySelector(".play");
const pauseBtn = document.querySelector(".pause");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".back");
const repeatBtn = document.querySelector(".repeat");

const dot = document.querySelector(".dot");

function playAudio() {
  if (!isPlaying) {
    const currentAudio = myAudios[currentAudioIndex];
    const songTitle = document.querySelector(".info h2");
    const songArtist = document.querySelector(".info p");
    // const dot = document.querySelector(".dot");

    audio.src = currentAudio.file;
    songTitle.textContent = currentAudio.title();
    songArtist.textContent = currentAudio.artist();
    dot.style.left = 0;
  }
  playBtn.style.display = "none";
  pauseBtn.style.display = "flex";

  isPlaying = true;
  audio.play();
}

function pauseAudio() {
  playBtn.style.display = "flex";
  pauseBtn.style.display = "none";

  audio.pause();
}

function nextTrack() {
  if (!isRepeat) {
    currentAudioIndex++;
    if (currentAudioIndex >= myAudios.length) {
      currentAudioIndex = 0;
    }
  }
  isPlaying = false;
  playAudio();
}

function prevTrack() {
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

function updateDotlocation() {
  const duration = audio.duration;
  let currentTime = audio.currentTime;
  dot.style.left = `${(currentTime / duration) * 100}%`;
}

function setLastTrack() {
  const currentAudio = myAudios[currentAudioIndex];
  const songTitle = document.querySelector(".info h2");
  const songArtist = document.querySelector(".info p");

  audio.src = currentAudio.file;
  songTitle.textContent = currentAudio.title();
  songArtist.textContent = currentAudio.artist();
  dot.style.left = 0;
}

let firstPos = 0;
let currentPos = 0;
function dragDot(e) {
  firstPos = e.clientX;
  document.addEventListener("pointermove", dragEffect);
  document.addEventListener("pointerup", leaveEffect);
}

function dragEffect(e) {
  audio.pause();
  e.preventDefault();

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
    audio.play();
  }
  document.removeEventListener("pointermove", dragEffect);
  document.removeEventListener("pointerup", leaveEffect);
}

playBtn.addEventListener("click", playAudio);
pauseBtn.addEventListener("click", pauseAudio);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);
repeatBtn.addEventListener("click", toggleRepeat);

dot.addEventListener("pointerdown", dragDot);

audio.addEventListener("ended", nextTrack);
audio.addEventListener("timeupdate", updateDotlocation);

window.addEventListener("load", setLastTrack);
