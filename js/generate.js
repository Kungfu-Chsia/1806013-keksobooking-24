import {mapFilters} from './form.js';

const NODE_NAMES = {
  IMG:'IMG',
  INPUT:'INPUT',
  SELECT:'SELECT',
};

const FilterNames = {
  TYPE: 'housing-type',
  PRICE: 'housing-price',
  ROOMS: 'housing-rooms',
  GUESTS: 'housing-guests',
  FEATURES: 'features',
};

const TypeFilterValues = {
  ANY: 'any',
  BUNGALOW: 'bungalow',
  PALACE: 'palace',
  FLAT: 'flat',
  HOTEL: 'hotel',
  HOUSE: 'house',
};

const houseTypes = {
  [TypeFilterValues.ANY]: 'any',
  [TypeFilterValues.PALACE]: 'Дворец',
  [TypeFilterValues.FLAT]: 'Квартира',
  [TypeFilterValues.BUNGALOW]: 'Бунгало',
  [TypeFilterValues.HOUSE]: 'Дом',
  [TypeFilterValues.HOTEL]: 'Отель',
};

const PriceFilterValues = {
  ANY: 'any',
  LOW: 'low',
  MIDDLE: 'middle',
  HIGH: 'high',
};

const FeatureFilterValues = {
  WIFI: 'wifi',
  DISHWASHER: 'dishwasher',
  PARKING: 'parking',
  WASHER: 'washer',
  ELEVATOR: 'elevator',
  CONDITIONER: 'conditioner',
};

const RoomsFilterValues = {
  ANY: 'any',
  ONE: '1',
  TWO: '2',
  THREE: '3',
};

const GuestsFilterValues = {
  ANY: 'any',
  ONE: '1',
  TWO: '2',
  NOT_FOR_GUESTS: '0',
};

const FilterValuesByName = {
  [FilterNames.TYPE]: TypeFilterValues,
  [FilterNames.PRICE]: PriceFilterValues,
  [FilterNames.GUESTS]: GuestsFilterValues,
  [FilterNames.ROOMS]: RoomsFilterValues,
  [FilterNames.FEATURES]: FeatureFilterValues,
};

const priceTypes = {
  [PriceFilterValues.LOW]: 10000,
  [PriceFilterValues.HIGH]: 50000,
};

//больше не требуется считать рейтинг
// const AdRanksByFilterType = {
//   [FilterNames.TYPE]: 10,
//   [FilterNames.PRICE]: 7,
//   [FilterNames.ROOMS]: 9,
//   [FilterNames.GUESTS]: 9,
//   [FilterNames.FEATURES]: 1,
// };

//можно убрать - сделали импорт из data.js
//const mapFilters = document.querySelector('.map__filters');

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


//если цена совпадает с условиями - разрешим показ, иначе нет
const getPriceAllow = (adPrice, priceFilterValue) => {
  if (
    adPrice >= priceTypes.high && priceFilterValue === PriceFilterValues.HIGH ||
    adPrice <= priceTypes.low && priceFilterValue === PriceFilterValues.LOW ||
    (adPrice >= priceTypes.low && priceFilterValue <= priceTypes.high && priceFilterValue === PriceFilterValues.MIDDLE)) {
    //return AdRanksByFilterType[FilterNames.PRICE];
    return true; //разрешим показ
  }
  //return 0;
  return false;
};

//сравниваем количество комнат или гостей в объекте и выбранных фильтрах
const getGuestsOrRoomsAllow = (adValue, filterValue, filterType) => {

  if (filterValue !== FilterValuesByName[filterType].ANY && String(adValue) !== filterValue) {  //приводим значение количества комнат (число) к строке, так как в фильтре это строка
    return false; //запретим показ
  }
  return true; //разрешим показ
};


const getAllowFromSelect = (adObject, selectEl,allow) => {
  const optionsList = Array.from(selectEl.children);
  optionsList.forEach((option) => {
    if (option.selected) {
      //определяем свойство
      if (allow &&
        selectEl.name === FilterNames.TYPE &&
        option.value !== FilterValuesByName[selectEl.name].ANY &&
        adObject.offer.type !== option.value) {
        //rank += AdRanksByFilterType[selectEl.name];
        allow = false && allow; //если не выбран пункт эни и значения отборов не совпадают, то запретим загрузку (false)
      }

      if (allow &&
        selectEl.name === FilterNames.PRICE &&
        option.value !== FilterValuesByName[selectEl.name].ANY) {
        // const priceRank = getPriceRank(adObject.offer.price, option.value);
        // rank += priceRank;
        allow = getPriceAllow(adObject.offer.price, option.value) && allow; // гет прайс вернет можно ли показывать объявление или нет
      }

      if (allow &&
        selectEl.name === FilterNames.ROOMS) {
        //rank += getGuestsOrRoomsRank(adObject.offer.rooms, option.value, FilterNames.ROOMS);
        allow = getGuestsOrRoomsAllow(adObject.offer.rooms, option.value, FilterNames.ROOMS) && allow;
      }

      if (allow &&
        selectEl.name === FilterNames.GUESTS) {
        //rank += getGuestsOrRoomsRank(adObject.offer.guests, option.value, FilterNames.GUESTS);
        allow = getGuestsOrRoomsAllow(adObject.offer.guests, option.value, FilterNames.GUESTS) && allow;
      }
    }
  });

  return allow;
};


const getAllowFromCheckboxes = ((adObject, checkboxEl) => {
  const featuresList = checkIncomingArray(adObject.offer.features);
  if (checkboxEl.checked && !featuresList.includes(checkboxEl.value)){ //если выбран чек в фильтре, но нет в объекте таких фич то запретим вывод
    return false;
  }

  return true; //в других случаях (либо не чекнута фича в отборе, либо чекнута но фича есть и в объекте) покажем

});


//больше не используется
//поиск похожих объявлений в фильтре
// const getObjectRank = (adObject) => {
//   //let rank = 0;
//   let rank = false;

//   const formElements = [...mapFilters.elements];
//   formElements.forEach((formElement) => {
//     if (formElement.nodeName === NODE_NAMES.SELECT) {
//       //rank += getRankFromSelect(adObject, formElement);
//       rank = getRankFromSelect(adObject, formElement,rank) || rank;
//     }

//     if (formElement.nodeName === NODE_NAMES.INPUT){
//       //rank += getRankFromCheckboxes(adObject, formElement);
//       rank =getRankFromCheckboxes(adObject, formElement) || rank ;
//     }
//   });

//   return rank;
// };

//больше не используется
// const compareObjects = (objectA, objectB) => {
//   const rankA = getObjectRank(objectA);
//   const rankB = getObjectRank(objectB);
//   //debugger;
//   return rankB - rankA;
// };

//определяет для каждого объекта нужно его выводить или нет (применяет фильтр)
const applyFilter = (adObject) => {

  let allow = true; //по умолчанию разрешаем показ и начинаем проверять фильтры

  //если хоть один из фильтров ответит false, то показа не будет
  const formElements = [...mapFilters.elements];
  formElements.forEach((formElement) => {
    if (allow && formElement.nodeName === NODE_NAMES.SELECT) {
      allow =  getAllowFromSelect(adObject, formElement,allow) && allow; //логическое И. Если хоть один false - то вся кострукция false
    }

    if (allow && formElement.nodeName === NODE_NAMES.INPUT){
      allow = getAllowFromCheckboxes(adObject, formElement) && allow;
    }
  });
  return allow;
};

//export {compareObjects};
export {createCustomPopup};
export {applyFilter};
