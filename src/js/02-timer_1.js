import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const refs = {
  input: document.querySelector('#datetime-picker'),
  buttonStart: document.querySelector('[data-start]'),
  buttonStop: document.querySelector('[data-stop]'),
  field: document.querySelector('.field'),
};
const { input, buttonStart, buttonStop, field } = refs;
let targetDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  enableSeconds: false,
  minuteIncrement: 1,
  onClose(selectedDates) {
    const currentDate = Date.now();
    if (selectedDates[0] < currentDate) {
      Notiflix.Report.failure(
        'Please choose a date in the future',
        'Press the button to continue',
        'Button'
      );
    } else {
      buttonStart.hasAttribute('disabled')
        ? buttonStart.toggleAttribute('disabled')
        : buttonStart.removeAttribute('disabled');
    }
    targetDate = selectedDates[0];
  },
};

const fp = flatpickr(input, options);

class Timer {
  constructor({ onTick }) {
    this.timerId = null;
    this.isActive = false;
    this.onTick = onTick;
    this.init();
  }

  init() {
    this.isActive = false;
    const time = this.convertMs(0);
    this.onTick(time);
  }

  start() {
    if (this.isActive) return this.init();

    buttonStart.setAttribute('disabled', '');
    buttonStop.removeAttribute('disabled');
    this.isActive = true;

    this.timerId = setInterval(() => {
      const currentDate = new Date();
      if (String(targetDate) <= String(currentDate) && this.isActive) {
        this.isActive = false;
        this.stop();
        Notiflix.Report.success(
          'Timer stopped',
          'Press the button to continue',
          'Button'
        );
        return;
      }
      this.isActive = true;
      const time = this.convertMs(targetDate - Date.now());
      this.onTick(time);
    }, 1000);
  }
  stop() {
    buttonStart.removeAttribute('disabled', '');
    buttonStop.setAttribute('disabled', '');
    clearInterval(this.timerId);
    if (!this.isActive) {
      this.isActive = true;
      return this.init();
    }
  }
  convertMs(timeMs) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = this.addLeadingZero(hour * 24);
    const days = this.addLeadingZero(Math.floor(timeMs / day));
    const hours = this.addLeadingZero(Math.floor((timeMs % day) / hour));
    const minutes = this.addLeadingZero(
      Math.floor(((timeMs % day) % hour) / minute)
    );
    const seconds = this.addLeadingZero(
      Math.floor((((timeMs % day) % hour) % minute) / 1000)
    );
    return { days, hours, minutes, seconds };
  }

  addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }
}

function updateClock({ days, hours, minutes, seconds }) {
  field.firstElementChild.textContent = days;
  field.nextElementSibling.firstElementChild.textContent = hours;
  field.nextElementSibling.nextElementSibling.firstElementChild.textContent =
    minutes;
  field.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.textContent =
    seconds;
}

const timer = new Timer({
  onTick: updateClock,
});

buttonStart.addEventListener('click', timer.start.bind(timer));
buttonStop.addEventListener('click', timer.stop.bind(timer));
