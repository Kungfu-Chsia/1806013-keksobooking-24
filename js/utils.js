import {avatars, titles, types, checkins, checkouts, descriptions, photos, featuresList} from './data.js';
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

export {createObject};
