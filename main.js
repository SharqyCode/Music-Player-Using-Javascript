let element = document.querySelector(".dot");
let player = document.querySelector(".player");
// dot.addEventListener("pointerdown", () => {
//   console.log("pointer down");
//   dot.addEventListener("pointermove", (e) => {
//     console.log("pointer moved");
//     console.log(dot.offsetLeft);
//   });
// });

// var element = document.getElementById("myElement");
// var element = document.getElementById("myElement");
let pos1 = 0,
  pos3 = 0;
element.onmousedown = dragMouseDown;

function dragMouseDown(e) {
  e.preventDefault();
  // get the mouse cursor position at startup:
  pos3 = e.clientX;
  // call a function whenever the cursor moves:
  document.onmousemove = elementDrag;
  // call a function when the cursor is released:
  document.onmouseup = closeDragElement;
}

function elementDrag(e) {
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
  // stop moving when mouse button is released:
  document.onmouseup = null;
  document.onmousemove = null;
}
