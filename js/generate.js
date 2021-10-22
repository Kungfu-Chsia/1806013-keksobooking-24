import {createObject} from './data.js';

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

const objectsList = generateObjectsList (10);
const objectsListFragment = document.createDocumentFragment();

const setupValueOrHideEmpty = function (element, nameProperty, value) {

  element[nameProperty] = value;

  if (value === '') {
    element.classList.add('hidden');
  } else {
    element.classList.remove('hidden');
  }
  return 0;
};

objectsList.forEach((card) => {

  const cardElement = templateCard.cloneNode(true);

  setupValueOrHideEmpty(cardElement.querySelector('.popup__avatar'),        'src',          card.author);
  setupValueOrHideEmpty(cardElement.querySelector('.popup__title'),         'textContent',  card.offer.title);
  setupValueOrHideEmpty(cardElement.querySelector('.popup__text--address'), 'textContent',  card.offer.address);
  setupValueOrHideEmpty(cardElement.querySelector('.popup__text--price'),   'textContent',  `${card.offer.price} ₽/ночь`);
  setupValueOrHideEmpty(cardElement.querySelector('.popup__type'),          'textContent',  houseTypes[card.offer.type]);
  setupValueOrHideEmpty(cardElement.querySelector('.popup__text--capacity'),'textContent',  `${card.offer.rooms} комнаты для ${card.offer.guests} гостей.`);
  setupValueOrHideEmpty(cardElement.querySelector('.popup__text--time'),    'textContent',  `Заезд после ${card.offer.checkin}, выезд до ${card.offer.checkout}`);
  setupValueOrHideEmpty(cardElement.querySelector('.popup__description'),   'textContent',  card.offer.description);

  //.popup__features/
  cardElement.querySelector('.popup__features').classList.add('hidden');
  const optionFeatures = cardElement.querySelectorAll('.popup__feature');
  for (let i = 0; i < optionFeatures.length; i++) {
    optionFeatures[i].classList.add('hidden');
  }

  const featuresList = card.offer.features;
  featuresList.forEach((currentFeature) => {
    const nameFeature =`.popup__feature--${currentFeature}`;
    cardElement.querySelector(nameFeature).classList.remove('hidden');
    cardElement.querySelector('.popup__features').classList.remove('hidden');
  });

  //.popup__photos/
  const allPhotosList = cardElement.querySelectorAll('.popup__photos');
  for (let i = 0; i < allPhotosList.length; i++) {
    allPhotosList[i].classList.add('hidden');
  }

  const photosList = card.offer.photos;
  photosList.forEach((currentPhoto,index) => {
    const namePhoto =`.popup__photo--${index}`;
    setupValueOrHideEmpty( cardElement.querySelector(namePhoto), 'src', currentPhoto);
    cardElement.querySelector(namePhoto).parentNode.classList.remove('hidden');
  });

  objectsListFragment.appendChild(cardElement);
});

const similarListElement = document.querySelector('.map__canvas');
similarListElement.appendChild(objectsListFragment);
