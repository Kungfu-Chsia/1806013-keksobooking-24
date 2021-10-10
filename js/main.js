const getRandomIntInclusive = function(min, max) {
  if (min === max) {
    return min;
  }
  if (max > min && min >=0) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  } else {
    return 'Некорректный диапазон чисел!';
  }
};

const getRandomFloat = function(min, max, precision) {
  if (min === max) {
    return min;
  }
  if (max > min && min >=0) {
    const number = Math.random() * (max - min) + min;
    return number.toFixed(precision);
  } else {
    return 'Некорректный диапазон чисел!';
  }
};

//console.log(getRandomIntInclusive(20, 30));
//console.log(getRandomFloat(10.3, 10.4, 5));

const avatars = [
  'img/avatars/user01.png',
  'img/avatars/user02.png',
  'img/avatars/user03.png',
  'img/avatars/user04.png',
  'img/avatars/user05.png',
  'img/avatars/user06.png',
  'img/avatars/user07.png',
  'img/avatars/user08.png',
  'img/avatars/user09.png',
  'img/avatars/user10.png',
];

const titles = [
  'Дом для отпуска на берегу озера Маслозеро',
  'Отель Карелия',
  'Гостевой дом Онежский берег',
  'Эко Отель Большая Медведица',
  'Гостиница Петрозаводск',
  'Марциальные ключи',
  'Гостиница Северная',
  'Общежитие Карелреспотребсоюза',
  'Отель Онежский замок',
  'Дом для хороших гостей',
];

const types = [
  'palace',
  'flat',
  'house',
  'bungalow',
  'hotel',
];

const checkins = [
  '12:00',
  '13:00',
  '14:00',
];

const checkouts = [
  '12:00',
  '13:00',
  '14:00',
];


const descriptions = [
  'Семейный дом — Дуплекс',
  'Дом с 2 спальнями',
  'Стандартный номер-студио',
  'Люкс',
  'Лофт',
  'Классический четырехместный номер',
  'Номер-студио с видом на озеро',
  'Двухуровневые апартаменты',
  'Дом с 1 спальней',
  'Дом для отпуска',
];

const photos = [
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/duonguyen-8LrGtIxxa4w.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/brandon-hoogenboom-SNxQGWxZQi0.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/claire-rendall-b6kAwr1i0Iw.jpg',
];

const featuresList = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner',
];

const getRandomArrayElement = (elements) =>
  elements[getRandomIntInclusive(0, elements.length - 1)];

function getRandomArrayElementWithDelete(elementsxxx) {
  const indexElement= getRandomIntInclusive(0, elementsxxx.length - 1);
  const elementReturn = elementsxxx[indexElement];
  elementsxxx = elementsxxx.splice (indexElement, 1);
  return elementReturn;
}

function getRandomArrayFromArray(sourceArray) {

  const featuresCount = getRandomIntInclusive(1, sourceArray.length);
  const array = [];

  for(let ind = 0; ind < featuresCount; ind++) {
    const el = getRandomArrayElement(sourceArray);

    if (!array.includes(el)) {
      array.push(el);
    }
  }
  return array;
}

function getLocationList() {
  const locationList = {
    lat: getRandomFloat (35.65000, 35.70000, 5),
    lng: getRandomFloat (139.70000, 139.80000, 5),
  };

  return locationList;
}


const createObject = () => {
  const locationAddress = getLocationList();

  return {
    author: getRandomArrayElementWithDelete(avatars),

    offer: {
      title: getRandomArrayElement(titles),
      address: `${locationAddress.lat}, ${locationAddress.lng}`,

      price: getRandomIntInclusive (10, 10000000),
      type: getRandomArrayElement(types),
      rooms: getRandomIntInclusive (1, 100),
      guests: getRandomIntInclusive (1, 10000),
      checkin: getRandomArrayElement(checkins),
      checkout: getRandomArrayElement(checkouts),
      features: getRandomArrayFromArray(featuresList),
      description: getRandomArrayElement(descriptions),
      photos: getRandomArrayFromArray(photos),
    },
    location: locationAddress,
  };
};

const generateObjectsList = function (countCreateObject) {
  const objects = [];

  for (let ind = 0; ind < countCreateObject; ind++ ) {
    objects.push(createObject());
  }

  return objects;
};

generateObjectsList (10);
//console.log(createObject());
