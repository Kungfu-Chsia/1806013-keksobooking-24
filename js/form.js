import './map.js';
import { deleteMarker } from './map.js';
import { sendDataToServer } from './data-server.js';
import { loadObjectsListFromServer } from './data-server.js';
import { NodeName } from './consts.js';
import { HouseCost } from './consts.js';
import { ID_PALACE } from './consts.js';
import { PREVIEW_HEIGHT } from './consts.js';
import { PREVIEW_WIDTH } from './consts.js';
import { OBJECTS_COUNT } from './consts.js';

const formTitle = document.querySelector('.ad-form__title');
const formPrice = document.querySelector('.ad-form__price');
const formType = document.querySelector('.ad-form__type');
const formRooms = document.querySelector('.ad-form__rooms');
const formCapacity = document.querySelector('.ad-form__capacity');
const formTimein = document.querySelector('.ad-form__timein');
const formTimeout = document.querySelector('.ad-form__timeout');
const mainForm = document.querySelector('.ad-form');
const mapFilters = document.querySelector('.map__filters');
const formPreview = document.querySelector('.ad-form-header__preview');

const minTitleName = formTitle.getAttribute('minlength');
const maxTitleName = formTitle.getAttribute('maxlength');

formTitle.addEventListener('invalid', () => {
  if (formTitle.validity.tooShort) {
    formTitle.setCustomValidity(`Заголовок должен состоять минимум из ${minTitleName} символов`);
  } else if (formTitle.validity.tooLong) {
    formTitle.setCustomValidity(`Заголовок не должен превышать ${maxTitleName} символов`);
  } else if (formTitle.validity.valueMissing) {
    formTitle.setCustomValidity('Обязательное поле');
  } else {
    formTitle.setCustomValidity('');
  }
});

formTitle.addEventListener('input', () => {
  const valueLength = formTitle.value.length;
  if (valueLength < minTitleName) {
    formTitle.setCustomValidity(`Ещё ${minTitleName - valueLength} симв.`);
  } else if (valueLength > maxTitleName) {
    formTitle.setCustomValidity(`Удалите лишние ${valueLength - maxTitleName} симв.`);
  } else {
    formTitle.setCustomValidity('');
  }
  formTitle.reportValidity();
});

formPrice.addEventListener('invalid', () => {
  if (formPrice.validity.rangeOverflow) {
    formPrice.setCustomValidity(`Цена должна быть меньше  ${formPrice.max}`);
  } else {
    formPrice.setCustomValidity('');
  }
});

formPrice.addEventListener('input', () => {
  const currentValue = formPrice.value;
  if (currentValue > formPrice.max) {
    formPrice.setCustomValidity(`Цена должна быть меньше  ${formPrice.max}`);
  } else if (currentValue < formPrice.min) {
    formPrice.setCustomValidity(`Цена должна быть больше  ${formPrice.min}`);
  } else {
    formPrice.setCustomValidity('');
  }
  formPrice.reportValidity();
});

const checkPrice = () => {
  const minPrice = HouseCost[formType.value];
  formPrice.setAttribute('placeholder', minPrice);
  formPrice.setAttribute('min', minPrice);

  if (formPrice.value > 0 && formPrice.value < formPrice.min) {
    formPrice.setCustomValidity(`Цена должна быть не меньше  ${formPrice.min}`);
  }
  else {
    formPrice.setCustomValidity('');
  }
  formPrice.reportValidity();
};

formType.addEventListener('change', checkPrice);
formPrice.addEventListener('change', checkPrice);

formCapacity.addEventListener('change', () => {
  formCapacity.setCustomValidity('');
});

formRooms.addEventListener('change', () => {
  const currentValue = formRooms.value;

  const optionCapacity = document.getElementById('capacity').getElementsByTagName('option');
  optionCapacity.forEach((currentOption) => {
    currentOption.disabled = true;
  });
  if (currentValue === ID_PALACE) {
    optionCapacity[optionCapacity.length - 1].disabled = false;
  } else {
    for (let index = 0; index < currentValue; index++) {
      optionCapacity[index].disabled = false;
    }
  }

  formCapacity.setCustomValidity('');
  optionCapacity.forEach((currentOption) => {
    if (currentOption.disabled && currentOption.selected) {
      formCapacity.setCustomValidity('Выбрано не корректное значение');
    }
  });

  formCapacity.reportValidity();
});

formTimein.addEventListener('change', () => {
  const currentValue = formTimein.value;

  const optionTimeout = document.getElementById('timeout').getElementsByTagName('option');
  optionTimeout.forEach((currentTimeout) => {
    if (currentTimeout.value === currentValue) {
      currentTimeout.selected = true;
    }
  });
});

formTimeout.addEventListener('change', () => {
  const currentValue = formTimeout.value;
  const optionTimein = document.getElementById('timein').getElementsByTagName('option');
  optionTimein.forEach((currentTimein) => {
    if (currentTimein.value === currentValue) {
      currentTimein.selected = true;
    }
  });
});


document.getElementById('address').setAttribute('readonly', true);

const inputAvatar = document.getElementById('avatar');
inputAvatar.setAttribute('accept', 'image/png, image/jpeg');
inputAvatar.addEventListener('change', () => {
  formPreview.childNodes.forEach((currentAvatar) => {
    if (currentAvatar.nodeName === NodeName.IMG) {
      currentAvatar.setAttribute('src', URL.createObjectURL(inputAvatar.files[0]));
    }
  });
});

const inputImage = document.getElementById('images');
inputImage.setAttribute('accept', 'image/png, image/jpeg');
inputImage.addEventListener('change', () => {
  const picture = document.createElement('img');
  picture.setAttribute('src', URL.createObjectURL(inputImage.files[0]));
  picture.setAttribute('height', PREVIEW_HEIGHT);
  picture.setAttribute('width', PREVIEW_WIDTH);
  document.querySelector('.ad-form__photo').appendChild(picture);
});


const toggleDisabledState = (formElement, isDisabled, disabledClassName) => {
  if (isDisabled === true) {
    formElement.classList.add(disabledClassName);
  }
  else {
    formElement.classList.remove(disabledClassName);
  }

  const elements = [...formElement.elements];
  elements.forEach((currentElement) => {
    currentElement.disabled = isDisabled;
  });
};

const setDocumentActiveOn = () => {
  toggleDisabledState(mainForm, false, 'ad-form--disabled');
  loadObjectsListFromServer(OBJECTS_COUNT);
};

const setDocumentActiveOff = () => {
  toggleDisabledState(mainForm, true, 'ad-form--disabled');
  toggleDisabledState(mapFilters, true, 'map__filters--disabled');
};

const applyFilterOnForm = () => {
  deleteMarker();
  loadObjectsListFromServer(OBJECTS_COUNT);
};

mapFilters.addEventListener('change', () => {
  applyFilterOnForm();
});

const resetForm = () => {
  mainForm.reset();
  mapFilters.reset();
  inputImage.setAttribute('src', ' ');
  deleteMarker();

  toggleDisabledState(mapFilters, true, 'map__filters--disabled');
  loadObjectsListFromServer(OBJECTS_COUNT);
};

mainForm.addEventListener('reset', resetForm);

mainForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  sendDataToServer(mainForm);
});

const createFormSuccessError = () => {
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

createFormSuccessError();
const successForm = document.querySelector('.success');
const errorForm = document.querySelector('.error');

const hideModalForm = (modalForm, classHide) => {
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

setDocumentActiveOff();

export { setDocumentActiveOn };
export { resetForm };
export { toggleDisabledState };
export { mapFilters };
