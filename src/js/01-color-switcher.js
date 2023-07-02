const refs = {
  body: document.querySelector('body'),
  buttonStart: document.querySelector('button[data-start]'),
  buttonStop: document.querySelector('button[data-stop]'),
};

const { body, buttonStart, buttonStop } = refs;

let timerId = null;
toggleAttr();

buttonStart.addEventListener('click', () => {
  toggleAttr();
  timerId = setInterval(changeColor, 1000);
});
buttonStop.addEventListener('click', () => {
  toggleAttr();
  clearInterval(timerId);
  body.style.removeProperty('background-color');
});

function changeColor() {
  body.style.backgroundColor = getRandomHexColor();
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}

function toggleAttr() {
  buttonStart.toggleAttribute('disabled');
  buttonStop.toggleAttribute('disabled');
}
