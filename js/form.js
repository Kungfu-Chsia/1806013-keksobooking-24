//import {loadObjectsListFromServer} from './generate.js';
import {createCustomPopup} from './generate.js';


const startLat = 35.6895;
const startLng = 139.692;
const idPalace = '100';
const ALERT_SHOW_TIME=5000;
const PRECISION=5;


/***********Title*************/
const adFormTitle = document.querySelector('.ad-form__title');
// const minTitleName = adFormTitle.minLength;
// const maxTitleName = adFormTitle.maxLength;
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
  //adFormTitle.reportValidity();
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
  palace: 10000,
  flat: 1000,
  bungalow: 0,
  house: 5000,
  hotel: 3000,
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

adFormCapacity.addEventListener('change', () => {
  adFormCapacity.setCustomValidity('');
});

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

  adFormCapacity.setCustomValidity('');
  for (let i = 0; i < optionCapacity.length; i++) {
    if (adFormCapacity[i].disabled && adFormCapacity[i].selected) {
      adFormCapacity.setCustomValidity('Выбрано не корректное значение');
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
const inputAvatar = document.getElementById('avatar');
inputAvatar.setAttribute('accept', 'image/png, image/jpeg');
inputAvatar.addEventListener('change', () => {
  const adFormPreview = document.querySelector('.ad-form-header__preview');
  for (let i = 0; i < adFormPreview.childNodes.length; i++) {
    if (adFormPreview.childNodes[i].nodeType === 1 ) {
      adFormPreview.childNodes[i].setAttribute('src',URL.createObjectURL(inputAvatar.files[0]));
    }
  }
});

const inputImage = document.getElementById('images');
inputImage.setAttribute('accept', 'image/png, image/jpeg');
inputImage.addEventListener('change', () => {
  //console.log(inputImage.files);
  const elem = document.createElement('img');
  elem.setAttribute('src', URL.createObjectURL(inputImage.files[0]));
  elem.setAttribute('height', '70');
  elem.setAttribute('width', '70');
  document.querySelector('.ad-form__photo').appendChild(elem);
});


/***********Active*************/
const adForm = document.querySelector('.ad-form');
const mapFilters = document.querySelector('.map__filters');

const toggleDisabledState = function(formElement, isDisabled, disabledClassName) {
  if (isDisabled === true) {
    formElement.classList.add(disabledClassName);
  } else{
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
  toggleDisabledState(mapFilters, false, 'map__filters--disabled');//TODO фильтры должны стать доступными только после загрузки предложений

};

//функция установки неактивного состояния
const setDocumentActiveOff = function () {

  toggleDisabledState(adForm, true, 'ad-form--disabled');
  toggleDisabledState(mapFilters, true, 'map__filters--disabled');

};

//обработка события отправки успех
const onSubmitSuccess = function () {

  const successFormTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');

  const successForm = successFormTemplate.cloneNode(true);
  document.body.appendChild(successForm);

  setTimeout(() => {
    successForm.remove();
  }, ALERT_SHOW_TIME);

  //TODO Сообщение должно исчезать по нажатию на клавишу Esc и по клику на произвольную область экрана.
};

//обработка события отправки ошибка
const onSubmitError = function () {

  const errorFormTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

  const errorForm = errorFormTemplate.cloneNode(true);
  document.body.appendChild(errorForm);

  setTimeout(() => {
    errorForm.remove();
  }, ALERT_SHOW_TIME);

  //TODO Сообщение должно исчезать по нажатию на клавишу Esc и по клику на произвольную область экрана.
};

//отправка данных формы на сервер
const sendDataToServer = function () {
  const formData = new FormData(adForm);

  fetch(
    'https://24.javascript.pages.academy/keksobooking',
    {
      method: 'POST',
      body: formData,
    },
  )
    .then((response) => {
      if (response.ok) {
        onSubmitSuccess();
      } else {
        onSubmitError();
        const adFormErrorButton = document.querySelector('.error__button');
        adFormErrorButton.addEventListener('click', () => {
          document.getElementById('error').remove();
        });
      }})
    .catch(() => {
      onSubmitError();
      const adFormErrorButton = document.querySelector('.error__button');
      adFormErrorButton.addEventListener('click', () => {
        document.getElementById('error').remove();
      });
    });
};

//отлов события отправки формы
adForm.addEventListener('submit', (evt) => {

  evt.preventDefault();
  sendDataToServer();

});


setDocumentActiveOff();


/***********Filter*************/
const applyFilterOnForm = function () {

  const arrayFi = [];
  const elements = [...mapFilters.elements];
  for (let i = 0; i < elements.length; i++) {
    //если это селектор
    if (elements[i].nodeName === 'SELECT') {
      const optionList = elements[i].getElementsByTagName('option');
      for (let indexOption = 0; indexOption < optionList.length; indexOption++) {
        if (optionList[indexOption].selected) {
          //console.log(optionList[indexOption].value);
        }
      }
    //если это фичи
    } if(elements[i].nodeName==='INPUT'){
      if (elements[i].checked) {
        arrayFi.push(elements[i].value);
      }
    }
  }
  //console.log(arrayFi);
};

mapFilters.addEventListener('change', () => {

  applyFilterOnForm();

});

/***********MAP*************/
const map = L.map('map-canvas')
  .on('load', () => {
    setDocumentActiveOn();
  })
  .setView({
    lat: startLat,
    lng: startLng,
  }, 10);

//слой карты
L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

//слой меток
const markerGroup = L.layerGroup().addTo(map);

//главная иконка
const mainPinIcon = L.icon({
  iconUrl: 'img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

const mainPinMarker = L.marker(
  {
    lat: startLat,
    lng: startLng,
  },
  {
    draggable: true,
    icon: mainPinIcon,
  },
);

const getReadableAddress = function (Location) {
  const Lat = Location.lat;
  const Lng = Location.lng;
  return `Широта: ${Lat.toFixed(PRECISION)} Долгота: ${Lng.toFixed(PRECISION)}`;
};

mainPinMarker.addTo(map);
document.getElementById('address').setAttribute('value', getReadableAddress(mainPinMarker.getLatLng()));

const resetMainPinMarker = function () {
  mainPinMarker.setLatLng({
    lat: startLat,
    lng: startLng,
  });
  document.getElementById('address').setAttribute('value', getReadableAddress(mainPinMarker.getLatLng()));
};

mainPinMarker.on('moveend', () => {
  document.getElementById('address').setAttribute('value', getReadableAddress(mainPinMarker.getLatLng()));
});


const createMarker = (currentPoint) => {
  const lat = currentPoint.location.lat;
  const lng = currentPoint.location.lng;

  const PinIcon = L.icon({
    iconUrl: 'img/pin.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  const marker = L.marker(
    {
      lat,
      lng,
    },
    {
      PinIcon,
    },
  );

  marker
    .addTo(markerGroup)
    .bindPopup(createCustomPopup(currentPoint));
};

export {createMarker};


//процедура сброса данных формы, фильтров, карты и т.д.
const resetForm = function () {
  // все заполненные поля возвращаются в изначальное состояние;
  // фильтрация (состояние фильтров и отфильтрованные метки) сбрасывается;
  // метка адреса возвращается в исходное положение;
  // значение поля адреса корректируется соответственно исходному положению метки;
  // если на карте был показан балун, то он должен быть скрыт.


  //очистка слоя меток
  resetMainPinMarker();
  markerGroup.clearLayers();

};

//событие сброса формы отправления
adForm.addEventListener('reset', () => {
  resetForm();
});

//событие подтверждения формы отправления
adForm.addEventListener('submit', () => {
  resetForm();
});
