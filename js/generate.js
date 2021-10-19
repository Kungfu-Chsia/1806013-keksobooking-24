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

const convertType = function (nameType) {
  let returnValue = nameType;

  if (nameType === 'palace') {
    returnValue = 'Дворец';
  } else if (nameType === 'flat') {
    returnValue = 'Квартира';
  } else if (nameType === 'bungalow') {
    returnValue = 'Бунгало';
  } else if (nameType === 'house') {
    returnValue = 'Дом';
  } else if (nameType === 'hotel') {
    returnValue = 'Отель';
  }

  return returnValue;
};

const ObjectsList = generateObjectsList (10);
const ObjectsListFragment = document.createDocumentFragment();

// const HiddenElement = function (cardElement,nameElement) {

//   if (cardElement.querySelector(nameElement).textContent==='') {
//     cardElement.querySelector(nameFeature).classList.add('hidden');
//   } else {
//     cardElement.querySelector(nameFeature).classList.remove('hidden');
//   }
//   return 0;
// };

ObjectsList.forEach((Card) => {

  //console.log(Card);
  const cardElement = templateCard.cloneNode(true);
  cardElement.querySelector('.popup__avatar').src = Card.author;
  cardElement.querySelector('.popup__title').textContent = Card.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = Card.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = `${Card.offer.price} ₽/ночь`;
  cardElement.querySelector('.popup__type').textContent = convertType(Card.offer.type);
  cardElement.querySelector('.popup__text--capacity').textContent = `${Card.offer.rooms} комнаты для ${Card.offer.guests} гостей.`;
  cardElement.querySelector('.popup__text--time').textContent = `Заезд после ${Card.offer.checkin}, выезд до ${Card.offer.checkout}`;
  cardElement.querySelector('.popup__description').textContent = Card.offer.description;

  //test/
  //cardElement.querySelector('.popup__description').textContent = '';
  //const a= HiddenElement(cardElement,'.popup__description');
  if (cardElement.querySelector('.popup__description').textContent==='') {
    cardElement.querySelector('.popup__description').classList.add('hidden');
  } else {
    cardElement.querySelector('.popup__description').classList.remove('hidden');
  }


  //.popup__features/
  const featuresList = Card.offer.features;
  featuresList.forEach((currentFeature) => {
    const nameFeature =`.popup__feature--${currentFeature}`;
    cardElement.querySelector(nameFeature).classList.remove('hidden');
  });

  //.popup__photos/
  const photosList = Card.offer.photos;
  photosList.forEach((currentPhoto,index) => {
    const namePhoto =`.popup__photo--${index}`;
    cardElement.querySelector(namePhoto).src = currentPhoto;
    cardElement.querySelector(namePhoto).classList.remove('hidden');
  });

  ObjectsListFragment.appendChild(cardElement);
});

const similarListElement = document.querySelector('.map__canvas');
similarListElement.appendChild(ObjectsListFragment);
