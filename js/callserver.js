import {createMarker} from './map.js';
import {compareObjects} from './generate.js';
import {resetForm} from './form.js';
import {toggleDisabledState} from './form.js';

const ALERT_SHOW_TIME = 5000;
const AD_FORM = document.querySelector('.ad-form');


const API_URL = 'https://24.javascript.pages.academy/keksobooking';
const ApiEndpoints = {
  GET_AD: `${API_URL}/data`,
  POST_AD: `${API_URL}/`,
};


//обработка события отправки успех
const onSubmitSuccess = function () {
  document.querySelector('.success').classList.remove('hidden');
  resetForm();
};

//обработка события отправки ошибка
const onSubmitError = function () {
  document.querySelector('.error').classList.remove('hidden');

  const adFormErrorButton = document.querySelector('.error__button');
  adFormErrorButton.addEventListener('click', () => {
    //document.getElementById('error').remove();
    document.querySelector('.error').classList.add('hidden');
  });
};


//отправка данных формы на сервер
const sendDataToServer = function () {
  const formData = new FormData(AD_FORM);

  fetch(
    ApiEndpoints['POST_AD'],
    {
      method: 'POST',
      body: formData,
    },
  )
    .then((response) => {
      if (response.ok) {
        onSubmitSuccess();
      }
      else {
        onSubmitError();
      }})
    .catch(() => {
      onSubmitError();
    });
};


//обработка события получения успех
const onLoadSuccess = function (similarObjects) {

  for (let ind = 0; ind < similarObjects.length; ind++ ) {
    createMarker(similarObjects[ind]);
  }
  toggleDisabledState(document.querySelector('.map__filters'), false, 'map__filters--disabled');
};

//обработка события получения ошибка
const onLoadError = function (errorMessage) {

  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = 100;
  alertContainer.style.position = 'absolute';
  alertContainer.style.left = 0;
  alertContainer.style.top = 0;
  alertContainer.style.right = 0;
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '30px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = 'red';

  alertContainer.textContent = `Ошибка загрузки данных ${errorMessage}`;

  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_SHOW_TIME);
};


//загрузка с сервера
const loadObjectsListFromServer = function(countCreateObject) {
  return fetch(
    ApiEndpoints['GET_AD'],
    {
      method: 'GET',
      credentials: 'same-origin',
    },
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`${response.status} ${response.statusText}`);
    })
    .then((data) => {
      onLoadSuccess(data
        .slice()
        .sort(compareObjects)
        .slice(0, countCreateObject));
    })
    .catch((err) => {
      onLoadError(err);
    });
};

export {sendDataToServer};
export {loadObjectsListFromServer};
