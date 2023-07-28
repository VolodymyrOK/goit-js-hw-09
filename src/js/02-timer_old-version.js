import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const refs = {
  input: document.querySelector('#datetime-picker'),
  buttonStart: document.querySelector('button[data-start]'),
  buttonStop: document.querySelector('button[data-stop]'),
  field: document.querySelector('.field'),
};
const { input, buttonStart, buttonStop, field } = refs;
let endTime = null;

// Опции для flatpickr с вызовом обработчика таймера
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
      buttonStart.setAttribute('disabled', 'disabled');
      buttonStop.setAttribute('disabled', 'disabled');
      Notiflix.Report.failure(
        'Please choose a date in the future',
        'Press the button to continue',
        'Button'
      );
    } else {
      buttonStart.hasAttribute('disabled')
        ? buttonStart.toggleAttribute('disabled')
        : buttonStart.removeAttribute('disabled');
      timerHandler(endTime);
    }
  },
};

// Инициализация интерфейса выбора даты
const fp = flatpickr(input, options);

// Вызов функции-обработчика таймера
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

      buttonStart.setAttribute('disabled', 'disabled');
      buttonStop.removeAttribute('disabled');
      this.isActive = true;

      this.intervalId = setInterval(() => {
        const currentTime = Date.now();
        let deltaTime = endTime - currentTime;
        let checkSeconds = Math.round(deltaTime / 1000);
        if (checkSeconds < 0 && !this.isActive) {
          this.isActive = false;
          Notiflix.Report.failure(
            'Please choose a date in the future',
            'Press the button to continue',
            'Button'
          );
          this.stop();
          return;
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
          this.stop();
          return;
        }
      }, 1000);
    }
    stop() {
      buttonStart.setAttribute('disabled', 'disabled');
      buttonStop.setAttribute('disabled', 'disabled');
      clearInterval(this.intervalId);
      this.init();
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
}
