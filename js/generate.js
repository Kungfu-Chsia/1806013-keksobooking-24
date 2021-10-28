//import {createObject} from './data.js'; устарела
import {createMarker} from './form.js';

const OBJECTS_COUNT = 10; //количество показываемых объектов
const ALERT_SHOW_TIME=5000;
const houseTypes = {
  palace: 'Дворец',
  flat: 'Квартира',
  bungalow: 'Бунгало',
  house: 'Дом',
  hotel: 'Отель',
};

//обработка события получения успех
const onLoadSuccess = function (similarOblects) {

  for (let ind = 0; ind < similarOblects.length; ind++ ) {
    createMarker(similarOblects[ind]);
  }
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
    'https://24.javascript.pages.academy/keksobooking/data',
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
      onLoadSuccess(data.slice(0, countCreateObject));
    })
    .catch((err) => {
      onLoadError(err);
    });
};

export {loadObjectsListFromServer};

loadObjectsListFromServer(OBJECTS_COUNT);

//устарела
// const generateObjectsList = function (countCreateObject) {
//   const objects = [];

//   for (let ind = 0; ind < countCreateObject; ind++ ) {
//     objects.push(createObject());
//   }

//   return objects;
// };

//export {generateObjectsList};

const setupValueOrHideEmpty = function (element, nameProperty, value) {

  if (value) {
    element[nameProperty] = value;
    element.classList.remove('hidden');
  } else {
    element.classList.add('hidden');
  }
};

//функция проверяет, что у входящего объекта есть массив в указанном свойстве
const checkIncomingArray = function (IncomingArray) {
  if (!IncomingArray) {
    return [];
  } else {
    return IncomingArray;
  }
};


const createCustomPopup = function (card){
  const templateCard = document.querySelector('#card')
    .content
    .querySelector('.popup');

  const cardElement = templateCard.cloneNode(true);

  setupValueOrHideEmpty(cardElement.querySelector('.popup__avatar'), 'src', card.author.avatar);
  setupValueOrHideEmpty(cardElement.querySelector('.popup__title'), 'textContent', card.offer.title);
  setupValueOrHideEmpty(cardElement.querySelector('.popup__text--address'), 'textContent', card.offer.address);
  setupValueOrHideEmpty(cardElement.querySelector('.popup__text--price'), 'textContent', `${card.offer.price} ₽/ночь`);
  setupValueOrHideEmpty(cardElement.querySelector('.popup__type'), 'textContent', houseTypes[card.offer.type]);
  setupValueOrHideEmpty(cardElement.querySelector('.popup__text--capacity'),'textContent', `${card.offer.rooms} комнаты для ${card.offer.guests} гостей.`);
  setupValueOrHideEmpty(cardElement.querySelector('.popup__text--time'), 'textContent', `Заезд после ${card.offer.checkin}, выезд до ${card.offer.checkout}`);
  setupValueOrHideEmpty(cardElement.querySelector('.popup__description'), 'textContent', card.offer.description);

  const featuresList = checkIncomingArray(card.offer.features);
  const photosList = checkIncomingArray(card.offer.photos);

  //.popup__features/
  if (featuresList.length === 0) {
    cardElement.querySelector('.popup__features').classList.add('hidden');
  }

  //получаем html коллекцию элементов li из формы
  const featuresListOnForm = cardElement.querySelector('.popup__features').getElementsByTagName('li');
  const arrayFeaturesOnForm = [...featuresListOnForm]; //преобразуем в массив
  arrayFeaturesOnForm.forEach((listItem) => {
    const isFeatureActive = featuresList.some ((feature) => listItem.classList.contains(`popup__feature--${feature}`));
    if (!isFeatureActive) {
      listItem.style.display = 'none';}
  });

  //.popup__photos/
  const photosListEl = cardElement.querySelector('div.popup__photos');
  const photoEl = photosListEl.querySelector('img');
  photosListEl.innerHTML = ''; // Удаляем все элементы внутри popup__photos

  photosList.forEach((currentPhoto) => {
    const clone = photoEl.cloneNode();

    setupValueOrHideEmpty(clone, 'src', currentPhoto);
    photosListEl.appendChild(clone);
  });

  return cardElement;

};

export {createCustomPopup};
