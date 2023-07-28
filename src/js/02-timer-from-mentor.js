import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  input: document.querySelector('#datetime-picker'),
  btnStart: document.querySelector('[data-start]'),
  outputDays: document.querySelector('[data-days]'),
  outputHours: document.querySelector('[data-hours]'),
  outputMinutes: document.querySelector('[data-minutes]'),
  outputSeconds: document.querySelector('[data-seconds]'),
};
const {
  input,
  btnStart,
  outputDays,
  outputHours,
  outputMinutes,
  outputSeconds,
} = refs;

let timerId = null;
let targetDate = null;

btnStart.setAttribute('disabled', '');
btnStart.addEventListener('click', startTimer);
btnStop.addEventListener('click', stopTimer);

flatpickr(input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < new Date()) {
      Notify.failure('Please choose a date in the future');
    }
    if (selectedDates[0] > new Date() && !btnStart.getAttribute('disabled')) {
      btnStart.removeAttribute('disabled');
    }
    targetDate = selectedDates[0];
  },
});

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );
  return { days, hours, minutes, seconds };
}

function startTimer() {
  input.setAttribute('disabled', '');
  btnStart.setAttribute('disabled', '');
  timerId = setInterval(() => {
    if (String(targetDate) === String(new Date())) {
      stopTimer();
      Notify.success('Done!');
      return;
    }
    let deltaTime = targetDate - new Date();
    viewTime(convertMs(deltaTime));
  }, 1000);
}

function stopTimer() {
  input.removeAttribute('disabled');
  btnStart.removeAttribute('disabled');
  clearInterval(timerId);
}

function viewTime({ days, hours, minutes, seconds }) {
  outputDays.textContent = days;
  outputHours.textContent = hours;
  outputMinutes.textContent = minutes;
  outputSeconds.textContent = seconds;
}
