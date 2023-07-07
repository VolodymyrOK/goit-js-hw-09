import Notiflix from 'notiflix';
const refs = {
  form: document.querySelector('.form'),
  inputDelay: document.querySelector('input[name=delay]'),
  inputStep: document.querySelector('input[name=step]'),
  inputAmount: document.querySelector('input[name=amount]'),
};

const { form, inputDelay, inputStep, inputAmount } = refs;

form.addEventListener('submit', event => {
  event.preventDefault();

  let delay = Number(inputDelay.value);
  const stepDelay = Number(inputStep.value);
  const amount = Number(inputAmount.value);

  const createPromise = (position, delay) => {
    const shouldResolve = Math.random() > 0.3;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldResolve) {
          resolve(`✅ Fulfilled promise ${position} in ${delay}ms`);
        }
        reject(`❌ Rejected promise ${position} in ${delay}ms`);
      }, delay);
    });
  };

  for (let position = 1; position <= amount; position += 1) {
    createPromise(position, delay)
      .then(resolve => {
        Notiflix.Notify.success(resolve);
      })
      .catch(reject => {
        Notiflix.Notify.failure(reject);
      });

    delay += stepDelay;
  }
});
