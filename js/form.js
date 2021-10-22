/***********Title*************/
const adFormTitle = document.querySelector('.ad-form__title');
// const minTitleName = adFormTitle.minLength;
// const maxTitleName = adFormTitle.maxLength;
const minTitleName = adFormTitle.getAttribute('minlength');
const maxTitleName = adFormTitle.getAttribute('maxlength');
const idPalace = '100';

adFormTitle.addEventListener('invalid', () => {

  if (adFormTitle.validity.tooShort) {
    adFormTitle.setCustomValidity(`Заголовок должен состоять минимум из ${minTitleName} символов`);
  } else if (adFormTitle.validity.tooLong) {
    adFormTitle.setCustomValidity(`Заголовок не должен превышать ${maxTitleName} символов`);
  } else if (adFormTitle.validity.valueMissing) {
    adFormTitle.setCustomValidity('Обязательное поле');
  } else {
    adFormTitle.setCustomValidity('');
  }
  adFormTitle.reportValidity();
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


/***********Price*************/
const adFormPrice = document.querySelector('.ad-form__price');

adFormPrice.addEventListener('invalid', () => {

  if (adFormPrice.validity.rangeOverflow) {
    adFormPrice.setCustomValidity(`Цена должна быть меньше  ${ adFormPrice.max }`);
  } else {
    adFormPrice.setCustomValidity('');
  }

  adFormPrice.reportValidity();
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


/***********Type*************/
const houseCost = {
  palace:   10000,
  flat:     1000,
  bungalow: 0,
  house:    5000,
  hotel:    3000,
};

const adFormType = document.querySelector('.ad-form__type');

adFormType.addEventListener('change', () => {
  const currentValue = adFormType.value;
  const minPrice = houseCost[currentValue];

  adFormPrice.setAttribute('placeholder', minPrice);
  adFormPrice.setAttribute('min', minPrice);

  if (adFormPrice.value < adFormPrice.min) {
    adFormPrice.setCustomValidity(`Цена должна быть не меньше  ${ adFormPrice.min }`);
  }else {
    adFormPrice.setCustomValidity('');
  }

  adFormPrice.reportValidity();
  adFormType.reportValidity();
});


/***********Rooms*************/
const adFormRooms = document.querySelector('.ad-form__rooms');
const adFormCapacity = document.querySelector('.ad-form__capacity');

adFormRooms.addEventListener('change', () => {
  const currentValue = adFormRooms.value;

  const optionCapacity = document.getElementById('capacity').getElementsByTagName('option');
  for (let i = 0; i < optionCapacity.length; i++) {
    optionCapacity[i].disabled = true;
  }

  if (currentValue === idPalace) {
    optionCapacity[optionCapacity.length-1].disabled = false;
  }else {
    for (let ind = 0; ind < currentValue; ind++) {
      optionCapacity[ind].disabled = false;
    }
  }

  for (let i = 0; i < optionCapacity.length; i++) {
    if (adFormCapacity[i].disabled && adFormCapacity[i].selected) {
      adFormCapacity.setCustomValidity('Выбрано не корректное значение');
    }else {
      adFormCapacity.setCustomValidity('');
    }
  }

  adFormCapacity.reportValidity();
});


/***********Time*************/
const adFormTimein = document.querySelector('.ad-form__timein');
const adFormTimeout = document.querySelector('.ad-form__timeout');

adFormTimein.addEventListener('change', () => {
  const currentValue = adFormTimein.value;

  const optionTimeout = document.getElementById('timeout').getElementsByTagName('option');
  for (let i = 0; i < optionTimeout.length; i++) {
    if (optionTimeout[i].value === currentValue ) {
      optionTimeout[i].selected = true;
    }
  }
});

adFormTimeout.addEventListener('change', () => {
  const currentValue = adFormTimeout.value;
  const optionTimein = document.getElementById('timein').getElementsByTagName('option');
  for (let i = 0; i < optionTimein.length; i++) {
    if (optionTimein[i].value === currentValue ) {
      optionTimein[i].selected = true;
    }
  }
});

/***********Address*************/
document.getElementById('address').setAttribute('readonly', true);

/***********Foto*************/
document.getElementById('avatar').setAttribute('accept', 'image/png, image/jpeg');
document.getElementById('images').setAttribute('accept', 'image/png, image/jpeg');

/***********Active*************/
const adForm = document.querySelector('.ad-form');
const mapFilters = document.querySelector('.map__filters');

//процедура сброса данных формы, фильтров, карты и т.д.
const resetForm = function () {
  // все заполненные поля возвращаются в изначальное состояние;
  // фильтрация (состояние фильтров и отфильтрованные метки) сбрасывается;
  // метка адреса возвращается в исходное положение;
  // значение поля адреса корректируется соответственно исходному положению метки;
  // если на карте был показан балун, то он должен быть скрыт.
  //console.log('reset');
};

//событие сброса формы отправления
adForm.addEventListener('reset', () => {
  resetForm();
});

//событие подтверждения формы отправления
adForm.addEventListener('submit', () => {
  resetForm();
});

const setDisabled = function(linkForm, value, nameClass) {
  if (value === true) {
    linkForm.classList.add(nameClass);
  } else{
    linkForm.classList.remove(nameClass);
  }

  const elements = linkForm.elements;
  for (let i = 0; i < elements.length; i++) {
    elements[i].setAttribute('disabled', value);
  }
};

//функция установки активного состояния
const setDocumentActiveOn = function () {

  setDisabled(adForm,     false,  'ad-form--disabled');
  setDisabled(mapFilters, false,  'map__filters--disabled');

};

//функция установки неактивного состояния
const setDocumentActiveOff = function () {

  setDisabled(adForm,     true,   'ad-form--disabled');
  setDisabled(mapFilters, true,   'map__filters--disabled');

//На месте карты отображается серый прямоугольник. ???
};

export {setDocumentActiveOn};
export {setDocumentActiveOff};
