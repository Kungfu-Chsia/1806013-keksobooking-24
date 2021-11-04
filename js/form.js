import './map.js';
import {deleteMarker} from './map.js';
import {sendDataToServer} from './callserver.js';
import {loadObjectsListFromServer} from './callserver.js';

const ID_PALACE = '100';
const PREVIEW_HEIGHT = 70;
const PREVIEW_WIDTH = 70;
const OBJECTS_COUNT = 10; //количество показываемых объектов

const NODE_NAMES = {
  IMG:'IMG',
  INPUT:'INPUT',
  SELECT:'SELECT',
};

const HOUSE_COST = {
  palace: 10000,
  flat: 1000,
  bungalow: 0,
  house: 5000,
  hotel: 3000,
};

//селекторы
const adFormTitle = document.querySelector('.ad-form__title');
const adFormPrice = document.querySelector('.ad-form__price');
const adFormType = document.querySelector('.ad-form__type');
const adFormRooms = document.querySelector('.ad-form__rooms');
const adFormCapacity = document.querySelector('.ad-form__capacity');
const adFormTimein = document.querySelector('.ad-form__timein');
const adFormTimeout = document.querySelector('.ad-form__timeout');
const adForm = document.querySelector('.ad-form');
const mapFilters = document.querySelector('.map__filters');
const adFormPreview = document.querySelector('.ad-form-header__preview');
const successForm = document.querySelector('.success');
const errorForm =document.querySelector('.error');

/***********Title*************/
const minTitleName = adFormTitle.getAttribute('minlength');
const maxTitleName = adFormTitle.getAttribute('maxlength');

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
adFormPrice.addEventListener('invalid', () => {

  if (adFormPrice.validity.rangeOverflow) {
    adFormPrice.setCustomValidity(`Цена должна быть меньше  ${ adFormPrice.max }`);
  } else {
    adFormPrice.setCustomValidity('');
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


/***********Type*************/
const checkPrice = function() {

  const minPrice = HOUSE_COST[adFormType.value];

  adFormPrice.setAttribute('placeholder', minPrice);
  adFormPrice.setAttribute('min', minPrice);

  if (adFormPrice.value > 0 && adFormPrice.value < adFormPrice.min) {
    adFormPrice.setCustomValidity(`Цена должна быть не меньше  ${ adFormPrice.min }`);
  }
  else {
    adFormPrice.setCustomValidity('');
  }

  adFormPrice.reportValidity();
};

adFormType.addEventListener('change', checkPrice);
adFormPrice.addEventListener('change', checkPrice);


/***********Rooms*************/
adFormCapacity.addEventListener('change', () => {
  adFormCapacity.setCustomValidity('');
});

adFormRooms.addEventListener('change', () => {
  const currentValue = adFormRooms.value;

  const optionCapacity = document.getElementById('capacity').getElementsByTagName('option');
  for (let i = 0; i < optionCapacity.length; i++) {
    optionCapacity[i].disabled = true;
  }

  if (currentValue === ID_PALACE) {
    optionCapacity[optionCapacity.length-1].disabled = false;
  }else {
    for (let ind = 0; ind < currentValue; ind++) {
      optionCapacity[ind].disabled = false;
    }
  }

  adFormCapacity.setCustomValidity('');
  for (let i = 0; i < optionCapacity.length; i++) {
    if (adFormCapacity[i].disabled && adFormCapacity[i].selected) {
      adFormCapacity.setCustomValidity('Выбрано не корректное значение');
    }
  }

  adFormCapacity.reportValidity();
});


/***********Time*************/
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
const inputAvatar = document.getElementById('avatar');
inputAvatar.setAttribute('accept', 'image/png, image/jpeg');
inputAvatar.addEventListener('change', () => {
  for (let i = 0; i < adFormPreview.childNodes.length; i++) {
    if (adFormPreview.childNodes[i].nodeName === NODE_NAMES.IMG) {
      adFormPreview.childNodes[i].setAttribute('src',URL.createObjectURL(inputAvatar.files[0]));
    }
  }
});

const inputImage = document.getElementById('images');
inputImage.setAttribute('accept', 'image/png, image/jpeg');
inputImage.addEventListener('change', () => {
  const elem = document.createElement('img');
  elem.setAttribute('src', URL.createObjectURL(inputImage.files[0]));
  elem.setAttribute('height', PREVIEW_HEIGHT);
  elem.setAttribute('width', PREVIEW_WIDTH);
  document.querySelector('.ad-form__photo').appendChild(elem);
});


/***********Active*************/
const toggleDisabledState = function(formElement, isDisabled, disabledClassName) {
  if (isDisabled === true) {
    formElement.classList.add(disabledClassName);
  }
  else {
    formElement.classList.remove(disabledClassName);
  }

  const elements = formElement.elements;
  for (let i = 0; i < elements.length; i++) {
    //elements[i].setAttribute('disabled', isDisabled); // через setAttribute нельзя снять свойство disabled
    elements[i].disabled = isDisabled;
  }
};

//функция установки активного состояния
const setDocumentActiveOn = function () {
  toggleDisabledState(adForm, false, 'ad-form--disabled');
  loadObjectsListFromServer(OBJECTS_COUNT);
};

//функция установки неактивного состояния
const setDocumentActiveOff = function () {
  toggleDisabledState(adForm, true, 'ad-form--disabled');
  toggleDisabledState(mapFilters, true, 'map__filters--disabled');
};


/***********Filter*************/
const applyFilterOnForm = function () {
  deleteMarker();
  loadObjectsListFromServer(OBJECTS_COUNT);
};

mapFilters.addEventListener('change', () => {
  applyFilterOnForm();
});


//процедура сброса данных формы, фильтров, карты и т.д.
const resetForm = function () {
  // все заполненные поля возвращаются в изначальное состояние;
  // фильтрация (состояние фильтров и отфильтрованные метки) сбрасывается;
  // метка адреса возвращается в исходное положение;
  // значение поля адреса корректируется соответственно исходному положению метки;
  // если на карте был показан балун, то он должен быть скрыт.
  adForm.reset();
  mapFilters.reset();
  //очистка слоя меток
  deleteMarker();

  toggleDisabledState(mapFilters, true, 'map__filters--disabled');
  loadObjectsListFromServer(OBJECTS_COUNT);

};


//событие сброса формы отправления
adForm.addEventListener('reset', resetForm);

//отлов события отправки формы
adForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  sendDataToServer(adForm);
});

const createFormSuccessError = function () {

  const successFormTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');

  const successFormCreated = successFormTemplate.cloneNode(true);
  document.body.appendChild(successFormCreated);
  successFormCreated.classList.add('hidden');

  const errorFormTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

  const errorFormCreated = errorFormTemplate.cloneNode(true);
  document.body.appendChild(errorFormCreated);
  errorFormCreated.classList.add('hidden');
};

const hideModalForm = function (modalForm,classHide) {
  if (!modalForm.classList.contains(classHide)) {
    modalForm.classList.add(classHide);}
};

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    hideModalForm(successForm,'hidden');
    hideModalForm(errorForm,'hidden');
  }
});

document.addEventListener('click', () => {
  hideModalForm(successForm,'hidden');
  hideModalForm(errorForm,'hidden');
});


createFormSuccessError();
setDocumentActiveOff();

export {setDocumentActiveOn};
export {resetForm};
export {toggleDisabledState};
export {mapFilters};
