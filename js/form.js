import './map.js';
import { deleteMarker } from './map.js';
import { sendDataToServer } from './callserver.js';
import { loadObjectsListFromServer } from './callserver.js';
import { NodeNames } from './vocab.js';
import { HouseCost } from './vocab.js';
import { ID_PALACE } from './vocab.js';
import { PREVIEW_HEIGHT } from './vocab.js';
import { PREVIEW_WIDTH } from './vocab.js';
import { OBJECTS_COUNT } from './vocab.js';

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
const errorForm = document.querySelector('.error');

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
    adFormTitle.setCustomValidity(`Ещё ${minTitleName - valueLength} симв.`);
  } else if (valueLength > maxTitleName) {
    adFormTitle.setCustomValidity(`Удалите лишние ${valueLength - maxTitleName} симв.`);
  } else {
    adFormTitle.setCustomValidity('');
  }
  adFormTitle.reportValidity();
});

adFormPrice.addEventListener('invalid', () => {
  if (adFormPrice.validity.rangeOverflow) {
    adFormPrice.setCustomValidity(`Цена должна быть меньше  ${adFormPrice.max}`);
  } else {
    adFormPrice.setCustomValidity('');
  }
});

adFormPrice.addEventListener('input', () => {
  const currentValue = adFormPrice.value;
  if (currentValue > adFormPrice.max) {
    adFormPrice.setCustomValidity(`Цена должна быть меньше  ${adFormPrice.max}`);
  } else if (currentValue < adFormPrice.min) {
    adFormPrice.setCustomValidity(`Цена должна быть больше  ${adFormPrice.min}`);
  } else {
    adFormPrice.setCustomValidity('');
  }
  adFormPrice.reportValidity();
});

const checkPrice = function () {
  const minPrice = HouseCost[adFormType.value];
  adFormPrice.setAttribute('placeholder', minPrice);
  adFormPrice.setAttribute('min', minPrice);

  if (adFormPrice.value > 0 && adFormPrice.value < adFormPrice.min) {
    adFormPrice.setCustomValidity(`Цена должна быть не меньше  ${adFormPrice.min}`);
  }
  else {
    adFormPrice.setCustomValidity('');
  }
  adFormPrice.reportValidity();
};

adFormType.addEventListener('change', checkPrice);
adFormPrice.addEventListener('change', checkPrice);

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
    optionCapacity[optionCapacity.length - 1].disabled = false;
  } else {
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

adFormTimein.addEventListener('change', () => {
  const currentValue = adFormTimein.value;

  const optionTimeout = document.getElementById('timeout').getElementsByTagName('option');
  for (let i = 0; i < optionTimeout.length; i++) {
    if (optionTimeout[i].value === currentValue) {
      optionTimeout[i].selected = true;
    }
  }
});

adFormTimeout.addEventListener('change', () => {
  const currentValue = adFormTimeout.value;
  const optionTimein = document.getElementById('timein').getElementsByTagName('option');
  for (let i = 0; i < optionTimein.length; i++) {
    if (optionTimein[i].value === currentValue) {
      optionTimein[i].selected = true;
    }
  }
});


document.getElementById('address').setAttribute('readonly', true);

const inputAvatar = document.getElementById('avatar');
inputAvatar.setAttribute('accept', 'image/png, image/jpeg');
inputAvatar.addEventListener('change', () => {
  for (let i = 0; i < adFormPreview.childNodes.length; i++) {
    if (adFormPreview.childNodes[i].nodeName === NodeNames.IMG) {
      adFormPreview.childNodes[i].setAttribute('src', URL.createObjectURL(inputAvatar.files[0]));
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


const toggleDisabledState = function (formElement, isDisabled, disabledClassName) {
  if (isDisabled === true) {
    formElement.classList.add(disabledClassName);
  }
  else {
    formElement.classList.remove(disabledClassName);
  }

  const elements = formElement.elements;
  for (let i = 0; i < elements.length; i++) {
    elements[i].disabled = isDisabled;
  }
};

const setDocumentActiveOn = function () {
  toggleDisabledState(adForm, false, 'ad-form--disabled');
  loadObjectsListFromServer(OBJECTS_COUNT);
};

const setDocumentActiveOff = function () {
  toggleDisabledState(adForm, true, 'ad-form--disabled');
  toggleDisabledState(mapFilters, true, 'map__filters--disabled');
};

const applyFilterOnForm = function () {
  deleteMarker();
  loadObjectsListFromServer(OBJECTS_COUNT);
};

mapFilters.addEventListener('change', () => {
  applyFilterOnForm();
});

const resetForm = function () {
  adForm.reset();
  mapFilters.reset();
  inputImage.setAttribute('src', ' ');
  deleteMarker();

  toggleDisabledState(mapFilters, true, 'map__filters--disabled');
  loadObjectsListFromServer(OBJECTS_COUNT);
};

adForm.addEventListener('reset', resetForm);

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

const hideModalForm = function (modalForm, classHide) {
  if (modalForm !== null && !modalForm.classList.contains(classHide)) {
    modalForm.classList.add(classHide);
  }
};

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    hideModalForm(successForm, 'hidden');
    hideModalForm(errorForm, 'hidden');
  }
});

document.addEventListener('click', () => {
  hideModalForm(successForm, 'hidden');
  hideModalForm(errorForm, 'hidden');
});

createFormSuccessError();
setDocumentActiveOff();

export { setDocumentActiveOn };
export { resetForm };
export { toggleDisabledState };
export { mapFilters };
