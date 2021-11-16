import { houseType } from './consts.js';

const setupValueOrHideEmpty = (element, nameProperty, value) => {
  if (value) {
    element[nameProperty] = value;
    element.classList.remove('hidden');
  } else {
    element.classList.add('hidden');
  }
};

const checkIncomingArray = (incomingArray) => incomingArray || [];

const createCustomPopup = (card) => {
  const templateCard = document.querySelector('#card')
    .content
    .querySelector('.popup');

  const cardElement = templateCard.cloneNode(true);
  setupValueOrHideEmpty(cardElement.querySelector('.popup__avatar'), 'src', card.author.avatar);
  setupValueOrHideEmpty(cardElement.querySelector('.popup__title'), 'textContent', card.offer.title);
  setupValueOrHideEmpty(cardElement.querySelector('.popup__text--address'), 'textContent', card.offer.address);
  setupValueOrHideEmpty(cardElement.querySelector('.popup__text--price'), 'textContent', `${card.offer.price} ₽/ночь`);
  setupValueOrHideEmpty(cardElement.querySelector('.popup__type'), 'textContent', houseType[card.offer.type]);
  setupValueOrHideEmpty(cardElement.querySelector('.popup__text--capacity'), 'textContent', `${card.offer.rooms} комнаты для ${card.offer.guests} гостей.`);
  setupValueOrHideEmpty(cardElement.querySelector('.popup__text--time'), 'textContent', `Заезд после ${card.offer.checkin}, выезд до ${card.offer.checkout}`);
  setupValueOrHideEmpty(cardElement.querySelector('.popup__description'), 'textContent', card.offer.description);

  const featuresList = checkIncomingArray(card.offer.features);
  const photosList = checkIncomingArray(card.offer.photos);
  if (featuresList.length === 0) {
    cardElement.querySelector('.popup__features').classList.add('hidden');
  }

  const featuresListOnForm = cardElement.querySelector('.popup__features').getElementsByTagName('li');
  const Features = [...featuresListOnForm];
  Features.forEach((listItem) => {
    const isFeatureActive = featuresList.some((feature) => listItem.classList.contains(`popup__feature--${feature}`));
    if (!isFeatureActive) {
      listItem.style.display = 'none';
    }
  });

  const photosListEl = cardElement.querySelector('div.popup__photos');
  const photoElement = photosListEl.querySelector('img');
  photosListEl.innerHTML = '';

  photosList.forEach((currentPhoto) => {
    const clone = photoElement.cloneNode();
    setupValueOrHideEmpty(clone, 'src', currentPhoto);
    photosListEl.appendChild(clone);
  });
  return cardElement;
};

export { createCustomPopup };
export { checkIncomingArray };
