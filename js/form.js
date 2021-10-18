const adFormTitle = document.querySelector('.ad-form__title');
const minTitleName = adFormTitle.minlength;
const maxTitleName = adFormTitle.maxlength;

adFormTitle.addEventListener('invalid', () => {

  if (adFormTitle.validity.tooShort) {
    adFormTitle.setCustomValidity(`Заголовок должен состоять минимум из ${minTitleName} символов`);
  } else if (adFormTitle.validity.tooLong) {
    adFormTitle.setCustomValidity(`Заголовок не должен превышать ${maxTitleName} символов`);
  } else if (adFormTitle.validity.valueMissing) {
    adFormTitle.setCustomValidity('Обязательное поле');
  } else {
    adFormTitle.setCustomValidity('');
    adFormTitle.reportValidity();
  }
});

adFormTitle.addEventListener('input', () => {
  const valueLength = adFormTitle.value.length;

  if (valueLength < minTitleName) {
    adFormTitle.setCustomValidity(`Ещё ${ minTitleName - valueLength } симв.`);
  } else if (valueLength > maxTitleName) {
    adFormTitle.setCustomValidity(`Удалите лишние ${ valueLength - maxTitleName } симв.`);
  } else {
    adFormTitle.setCustomValidity('');
  }

  adFormTitle.reportValidity();
});


const adFormPrice = document.querySelector('.ad-form__price');

adFormPrice.addEventListener('invalid', () => {

  if (adFormPrice.validity.rangeOverflow) {
    adFormPrice.setCustomValidity(`Цена должна быть меньше  ${ adFormPrice.max }`);
  } else {
    adFormPrice.setCustomValidity('');
    adFormPrice.reportValidity();
  }
});

adFormPrice.addEventListener('input', () => {
  const currentValue = adFormPrice.value;

  if (currentValue > adFormPrice.max) {
    adFormPrice.setCustomValidity(`Цена должна быть меньше  ${ adFormPrice.max }`);
  }else if (currentValue < adFormPrice.min) {
    adFormPrice.setCustomValidity(`Цена должна быть больше  ${ adFormPrice.min }`);
  }  else {
    adFormPrice.setCustomValidity('');
  }

  adFormPrice.reportValidity();
});

const adFormType = document.querySelector('.ad-form__type');

adFormType.addEventListener('change', () => {
  const currentValue = adFormType.value;
  let minPrice = 0;

  if (currentValue === 'house') {
    minPrice = 5000;
  }else if (currentValue === 'hotel') {
    minPrice = 3000;
  }else if (currentValue === 'palace') {
    minPrice = 10000;
  }else if (currentValue === 'flat') {
    minPrice = 1000;
  }else {
    minPrice = 0;
  }

  adFormPrice.placeholder=minPrice;
  adFormPrice.min=minPrice;
  //console.log(adFormPrice);

  adFormType.reportValidity();
});

