import { createMarker } from './map.js';
import { applyFilter } from './filters.js';
import { resetForm } from './form.js';
import { toggleDisabledState } from './form.js';
import { ALERT_SHOW_TIME } from './consts.js';
import { ApiEndpoint } from './consts.js';

const onSubmitSuccess = () => {
  document.querySelector('.success').classList.remove('hidden');
  resetForm();
};

const onSubmitError = () => {
  document.querySelector('.error').classList.remove('hidden');

  const adFormErrorButton = document.querySelector('.error__button');
  adFormErrorButton.addEventListener('click', () => {
    document.querySelector('.error').classList.add('hidden');
  });
};

const sendDataToServer = (adForm) => {
  const formData = new FormData(adForm);
  //console.log(adForm);
  fetch(
    ApiEndpoint['POST_AD'],
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
      }
    })
    .catch(onSubmitError);
};

const onLoadSuccess = (similarObjects) => {
  similarObjects.forEach((similarElement) => {
    createMarker(similarElement);
  });
  toggleDisabledState(document.querySelector('.map__filters'), false, 'map__filters--disabled');
};

const onLoadError = (errorMessage) => {
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
    onLoadSuccess(getFilteredData(data, countCreateObject));
  })
  .catch(onLoadError);

export { sendDataToServer };
export { loadObjectsListFromServer };
