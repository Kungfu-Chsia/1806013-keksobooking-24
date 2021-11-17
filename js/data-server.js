import { createMarker } from './map.js';
import { applyFilter } from './filters.js';
import { resetForm } from './form.js';
import { switchDisabledState } from './form.js';
import { ALERT_SHOW_TIME } from './consts.js';
import { ApiEndpoint } from './consts.js';

const SubmitSuccess = () => {
  document.querySelector('.success').classList.remove('hidden');
  resetForm();
};

const SubmitError = () => {
  document.querySelector('.error').classList.remove('hidden');

  const adFormErrorButton = document.querySelector('.error__button');
  adFormErrorButton.addEventListener('click', () => {
    document.querySelector('.error').classList.add('hidden');
  });
};

const sendDataToServer = (adForm) => {
  const formData = new FormData(adForm);
  fetch(
    ApiEndpoint['POST_AD'],
    {
      method: 'POST',
      body: formData,
    },
  )
    .then((response) => {
      if (response.ok) {
        SubmitSuccess();
      }
      else {
        SubmitError();
      }
    })
    .catch(SubmitError);
};

const LoadSuccess = (similarObjects) => {
  similarObjects.forEach((similarElement) => {
    createMarker(similarElement);
  });
  switchDisabledState(document.querySelector('.map__filters'), false, 'map__filters--disabled');
};

const LoadError = (errorMessage) => {
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

const getFilteredData = (data, countCreateObject) => data
  .filter(applyFilter)
  .slice(0, countCreateObject);

const loadObjectsListFromServer = (countCreateObject) => fetch(
  ApiEndpoint['GET_AD'],
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
    LoadSuccess(getFilteredData(data, countCreateObject));
  })
  .catch(LoadError);

export { sendDataToServer };
export { loadObjectsListFromServer };
