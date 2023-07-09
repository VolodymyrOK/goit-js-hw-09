import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const refs = {
  input: document.querySelector('#datetime-picker'),
  button: document.querySelector('button[data-start]'),
  field: document.querySelector('.field'),
  restart: document.querySelector('.restart'),
};
const { input, button, field, restart } = refs;
let endTime = null;

// Options for flatpickr with call to timer handler function
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  enableSeconds: false,
  minuteIncrement: 1,
  onClose(selectedDates) {
    endTime = selectedDates[0].getTime();
    const currentTime = Date.now();
    let deltaTime = endTime - currentTime;
    let checkSeconds = Math.floor(deltaTime / 1000);
    if (checkSeconds < 0) {
      button.setAttribute('disabled', 'disabled');
      Notiflix.Report.failure(
        'Please choose a date in the future',
        'Press the button to continue',
        'Button'
      );
    } else {
      button.hasAttribute('disabled')
        ? button.toggleAttribute('disabled')
        : button.removeAttribute('disabled');
      timerHandler(endTime);
    }
  },
};

// Date picker interface initialization
// const fp = flatpickr(input, options);
flatpickr(input, options);

// Timer handler function
function timerHandler(endTime) {
  class Timer {
    constructor({ onTick }) {
      this.intervalId = null;
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

      button.setAttribute('disabled', 'disabled');
      input.setAttribute('disabled', 'disabled');
      restart.textContent = 'To restart the timer, you need to reload the page';

      restart.style.backgroundColor = 'teal';
      restart.style.fontSize = '24px';
      restart.style.textAlign = 'center';
      restart.style.maxWidth = '310px';
      restart.style.color = 'white';

      this.isActive = true;

      this.intervalId = setInterval(() => {
        const currentTime = Date.now();
        let deltaTime = endTime - currentTime;
        let checkSeconds = Math.round(deltaTime / 1000);
        if (checkSeconds < 0 && !this.isActive) {
          this.isActive = false;
          Notiflix.Report.failure(
            'Please reload the page',
            'To start the timer',
            ''
          );
        } else if (checkSeconds > 0 && this.isActive) {
          this.isActive = true;
          const time = this.convertMs(deltaTime);
          this.onTick(time);
        } else {
          this.isActive = true;
          this.init();
          Notiflix.Report.success(
            'Timer stopped',
            'Press the button to continue',
            'Button'
          );
          return;
        }
      }, 1000);
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

  button.addEventListener('click', timer.start.bind(timer));
}
