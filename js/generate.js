import {createObject} from './data.js';

const objectsCount = 10;
const templateCard = document.querySelector('#card')
  .content
  .querySelector('.popup');

const generateObjectsList = function (countCreateObject) {
  const objects = [];

  for (let ind = 0; ind < countCreateObject; ind++ ) {
    objects.push(createObject());
  }

  return objects;
};

const houseTypes = {
  palace: 'Дворец',
  flat: 'Квартира',
  bungalow: 'Бунгало',
  house: 'Дом',
  hotel: 'Отель',
};

const objectsList = generateObjectsList (objectsCount);
const objectsListFragment = document.createDocumentFragment();

const setupValueOrHideEmpty = function (element, nameProperty, value) {

  if (value) {
    element[nameProperty] = value;
    element.classList.remove('hidden');
  } else {
    element.classList.add('hidden');
  }
};

objectsList.forEach((card) => {

  const cardElement = templateCard.cloneNode(true);

  setupValueOrHideEmpty(cardElement.querySelector('.popup__avatar'), 'src', card.author);
  setupValueOrHideEmpty(cardElement.querySelector('.popup__title'), 'textContent', card.offer.title);
  setupValueOrHideEmpty(cardElement.querySelector('.popup__text--address'), 'textContent', card.offer.address);
  setupValueOrHideEmpty(cardElement.querySelector('.popup__text--price'), 'textContent', `${card.offer.price} ₽/ночь`);
  setupValueOrHideEmpty(cardElement.querySelector('.popup__type'), 'textContent', houseTypes[card.offer.type]);
  setupValueOrHideEmpty(cardElement.querySelector('.popup__text--capacity'),'textContent', `${card.offer.rooms} комнаты для ${card.offer.guests} гостей.`);
  setupValueOrHideEmpty(cardElement.querySelector('.popup__text--time'), 'textContent', `Заезд после ${card.offer.checkin}, выезд до ${card.offer.checkout}`);
  setupValueOrHideEmpty(cardElement.querySelector('.popup__description'), 'textContent', card.offer.description);

  //.popup__features/
  const featuresList = card.offer.features;

  if (featuresList.length === 0) {
    cardElement.querySelectorAll('.popup__feature').classList.add('hidden');
  }

  //получаем html коллекцию элементов li из формы
  const featuresListOnForm = cardElement.querySelector('.popup__features').getElementsByTagName('li');
  const arrayFeaturesOnForm = [...featuresListOnForm]; //преобразуем в массив
  arrayFeaturesOnForm.forEach((listItem) => {
    const isFeatureActive = card.offer.features.some ((feature) => listItem.classList.contains(`popup__feature--${feature}`));
    if (!isFeatureActive) {
      listItem.style.display = 'none';}
  });

  //.popup__photos/
  const photosListEl = cardElement.querySelector('div.popup__photos');
  const photoEl = photosListEl.querySelector('img');
  photosListEl.innerHTML = ''; // Удаляем все элементы внутри popup__photos

  card.offer.photos.forEach((currentPhoto) => {
    const clone = photoEl.cloneNode();

    setupValueOrHideEmpty(clone, 'src', currentPhoto);
    photosListEl.appendChild(clone);
  });

  objectsListFragment.appendChild(cardElement);
});

const similarListElement = document.querySelector('.map__canvas');
similarListElement.appendChild(objectsListFragment);
