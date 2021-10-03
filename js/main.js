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

//getRandomIntInclusive (20, 30);
//getRandomFloat(10.3, 10.4, 5);

//console.log(getRandomIntInclusive(20, 30));
//console.log(getRandomFloat(10.3, 10.4, 5));

const AVATAR = [
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

const TITLE = [
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

const TYPE = [
  'palace',
  'flat',
  'house',
  'bungalow',
  'hotel',
];

const CHECKIN = [
  '12:00',
  '13:00',
  '14:00',
];

const CHECKOUT = [
  '12:00',
  '13:00',
  '14:00',
];


const DESCRIPTION = [
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

/*const PHOTOS = [
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/duonguyen-8LrGtIxxa4w.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/brandon-hoogenboom-SNxQGWxZQi0.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/claire-rendall-b6kAwr1i0Iw.jpg',
]; */

const PRICE = getRandomIntInclusive (10, 10000000);

const ROOMS = getRandomIntInclusive (1, 100);

const GUESTS = getRandomIntInclusive (1, 10000);

const locationLAT = getRandomFloat (35.65000, 35.70000, 5);

const locationLNG = getRandomFloat (139.70000, 139.80000, 5);

const LOCATION = {
  lat: locationLAT,
  lng: locationLNG,
};

/*const ADDRESS = [
  locationLAT,
  locationLNG,
]; */


const FEATURESList = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner',
];

function getArrayFeatures(featuresCount) {
  // const maxLength = featuresCount.length;
  const lengthOfArray = getRandomIntInclusive(1, featuresCount);
  const array = [];

  for(let ind = 0; ind < lengthOfArray; ind++) {
    const indexOfEl = getRandomIntInclusive(0, 5);
    const el = FEATURESList[indexOfEl];

    if (!array.includes(el)) {
      array.push(el);
    }
  }
  return array;
}

function getArrayPhotos(PHOTOS) {
  const maxLength = PHOTOS.length;
  const lengthOfArray = getRandomIntInclusive(1, maxLength);
  const array = [];

  for(let ind = 0; ind < lengthOfArray; ind++) {
    const indexOfEl = getRandomIntInclusive(0, 2);
    const el = PHOTOS[indexOfEl];

    if (!array.includes(el)) {
      array.push(el);
    }
  }
  return array;
}

const getRandomArrayElement = (elements) =>
  elements[_.random(0, elements.length - 1)];

const createObject = () => ({
  author: getRandomArrayElement(AVATAR),
  offer: {
    title: getRandomArrayElement(TITLE),
    //address: locationLAT + ', ' + locationLNG,
    price: PRICE,
    type: getRandomArrayElement(TYPE),
    rooms: ROOMS,
    guests: GUESTS,
    checkin: getRandomArrayElement(CHECKIN),
    checkout: getRandomArrayElement(CHECKOUT),
    features: getArrayFeatures,
    description: getRandomArrayElement(DESCRIPTION),
    photos: getArrayPhotos,
  },
  location: LOCATION,
});


const generateObjectsList = function (OBJECTS_COUNT) {
  const objects = [];

  for (let ind = 0; ind < OBJECTS_COUNT; ind++ ) {
    objects.push(generateObjectsList(ind));
  }

  return objects;
};

createObject ();
generateObjectsList (10);
