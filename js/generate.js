import {mapFilters} from './form.js';
import {NodeNames} from './vocab.js';
import {FilterNames} from './vocab.js';
import {TypeFilterValues} from './vocab.js';
import {houseTypes} from './vocab.js';
import {PriceFilterValues} from './vocab.js';
import {FeatureFilterValues} from './vocab.js';
import {RoomsFilterValues} from './vocab.js';
import {GuestsFilterValues} from './vocab.js';
import {priceTypes} from './vocab.js';


const FilterValuesByName = {
  [FilterNames.TYPE]: TypeFilterValues,
  [FilterNames.PRICE]: PriceFilterValues,
  [FilterNames.GUESTS]: GuestsFilterValues,
  [FilterNames.ROOMS]: RoomsFilterValues,
  [FilterNames.FEATURES]: FeatureFilterValues,
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
const checkIncomingArray = function (incomingArray) {
  return incomingArray || [];
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
    adPrice > priceTypes.high && priceFilterValue === PriceFilterValues.HIGH ||
    adPrice < priceTypes.low && priceFilterValue === PriceFilterValues.LOW ||
    (adPrice >= priceTypes.low && adPrice <= priceTypes.high && priceFilterValue === PriceFilterValues.MIDDLE)) {
    return true; //разрешим показ
  }
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
        allow = false && allow; //если не выбран пункт эни и значения отборов не совпадают, то запретим загрузку (false)
      }

      if (allow &&
        selectEl.name === FilterNames.PRICE &&
        option.value !== FilterValuesByName[selectEl.name].ANY) {
        allow = getPriceAllow(adObject.offer.price, option.value) && allow; // гет прайс вернет можно ли показывать объявление или нет
      }

      if (allow &&
        selectEl.name === FilterNames.ROOMS) {
        allow = getGuestsOrRoomsAllow(adObject.offer.rooms, option.value, FilterNames.ROOMS) && allow;
      }

      if (allow &&
        selectEl.name === FilterNames.GUESTS) {
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

//определяет для каждого объекта нужно его выводить или нет (применяет фильтр)
const applyFilter = (adObject) => {

  let allow = true; //по умолчанию разрешаем показ и начинаем проверять фильтры

  //если хоть один из фильтров ответит false, то показа не будет
  const formElements = [...mapFilters.elements];
  formElements.forEach((formElement) => {
    if (allow && formElement.nodeName === NodeNames.SELECT) {
      allow =  getAllowFromSelect(adObject, formElement,allow);
    }

    if (allow && formElement.nodeName === NodeNames.INPUT){
      allow = getAllowFromCheckboxes(adObject, formElement);
    }
  });
  return allow;
};

export {createCustomPopup};
export {applyFilter};
