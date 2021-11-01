
const houseTypes = {
  palace: 'Дворец',
  flat: 'Квартира',
  bungalow: 'Бунгало',
  house: 'Дом',
  hotel: 'Отель',
};

const priceTypes = {
  low: 10000,
  high: 50000,
};

const NODE_NAMES = {
  INPUT:'INPUT',
  SELECT:'SELECT',
};

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
  return IncomingArray || [];
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

//поиск похожих объявлений в фильтре
const getObjectdRank = (object) => {

  const mapFilters = document.querySelector('.map__filters');
  let rank = 0;

  const elements = [...mapFilters.elements];
  for (let i = 0; i < elements.length; i++) {
    //если это селектор
    if (elements[i].nodeName === NODE_NAMES.SELECT){
      const optionList = elements[i].getElementsByTagName('option');
      for (let indexOption = 0; indexOption < optionList.length; indexOption++) {
        if (optionList[indexOption].selected) {

          //определяем свойство
          if (elements[i].name === 'housing-type' && optionList[indexOption].value !== 'any') {
            if (object.offer.type === optionList[indexOption].value) {
              rank += 10;}
          }

          if (elements[i].name === 'housing-price' && optionList[indexOption].value !== 'any') {
            if (object.offer.price >= priceTypes['high'] && optionList[indexOption].value === 'high') {
              rank += 7;
            } else if (object.offer.price <= priceTypes['low'] && optionList[indexOption].value === 'low'){
              rank += 7;
            } else if (object.offer.price >= priceTypes['low'] && object.offer.price <= priceTypes['high'] && optionList[indexOption].value === 'middle'){
              rank += 7;}

          }
          if (elements[i].name === 'housing-rooms' && optionList[indexOption].value !== 'any') {
            if (object.offer.rooms === optionList[indexOption].value) {
              rank += 9;
            }
          }

          if (elements[i].name === 'housing-guests' && optionList[indexOption].value !== 'any') {
            if (object.offer.guests === optionList[indexOption].value) {
              rank += 9;
            }
          }
        }
      }
      //если это фичи
      if(elements[i].nodeName === NODE_NAMES.INPUT){
        if (elements[i].checked) {
          if (object.offer.features.some(elements[i].value)) {
            rank += 1;
          }
        }
      }
    }
  }

  return rank;
};

const compareObjects = (objectA, objectB) => {
  const rankA = getObjectdRank(objectA);
  const rankB = getObjectdRank(objectB);

  return rankB - rankA;
};

export {compareObjects};
export {createCustomPopup};
