let element = document.querySelector(".dot");
let play = document.querySelector(".play");

let audio = new Audio("/music/Kalp Kırıkları - Toygar Işıklı.mp3");

play.addEventListener("click", () => {
  if (play.classList.contains("fa-play")) {
    audio.play();
  } else {
    audio.pause();
  }
  play.classList.toggle("fa-play");
  play.classList.toggle("fa-pause");
});

let count = 0;
audio.addEventListener("progress", () => {
  element.style.left = count + "px";
  count += 2;
});

let pos1 = 0,
  pos3 = 0;
element.onmousedown = dragMouseDown;

function dragMouseDown(e) {
  e.preventDefault();
  // get the mouse cursor position at startup:
  pos3 = e.clientX;
  // call a function whenever the cursor moves:
  document.addEventListener("pointermove", elementDrag);
  // call a function when the cursor is released:
  document.addEventListener("pointerup", closeDragElement);
}

function elementDrag(e) {
  if (play.classList.contains("fa-pause")) {
    audio.pause();
    play.classList.toggle("fa-play");
    play.classList.toggle("fa-pause");
  }

  e.preventDefault();
  // calculate the new cursor position:
  pos1 = pos3 - e.clientX;
  pos3 = e.clientX;
  // set the element's new position:
  let newX = element.offsetLeft - pos1;
  if (newX < 0) {
    newX = 0;
  } else if (newX > element.parentElement.clientWidth) {
    newX = element.parentElement.clientWidth;
  }

  // Set the new position of the element
  element.style.left = newX + "px";
}

function closeDragElement() {
  audio.play();
  play.classList.toggle("fa-play");
  play.classList.toggle("fa-pause");
  // stop moving when mouse button is released:
  document.removeEventListener("pointermove", elementDrag);
  // call a function when the cursor is released:
  document.removeEventListener("pointerup", closeDragElement);
}
