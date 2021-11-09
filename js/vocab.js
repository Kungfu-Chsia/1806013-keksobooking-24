const NodeNames = {
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


const priceTypes = {
  [PriceFilterValues.LOW]: 10000,
  [PriceFilterValues.HIGH]: 50000,
};

const HouseCost = {
  palace: 10000,
  flat: 1000,
  bungalow: 0,
  house: 5000,
  hotel: 3000,
};

const ID_PALACE = '100';
const PREVIEW_HEIGHT = 70;
const PREVIEW_WIDTH = 70;
const OBJECTS_COUNT = 10;

const ALERT_SHOW_TIME = 5000;

const API_URL = 'https://24.javascript.pages.academy/keksobooking';

const ApiEndpoints = {
  GET_AD: `${API_URL}/data`,
  POST_AD: `${API_URL}/`,
};

const START_LAT = 35.6895;
const START_LNG = 139.692;
const PRECISION = 5;

export {NodeNames};
export {FilterNames};
export {TypeFilterValues};
export {houseTypes};
export {PriceFilterValues};
export {FeatureFilterValues};
export {RoomsFilterValues};
export {GuestsFilterValues};
export {priceTypes};
export {HouseCost};
export {ID_PALACE};
export {PREVIEW_HEIGHT};
export {PREVIEW_WIDTH};
export {OBJECTS_COUNT};
export {ALERT_SHOW_TIME};
export {API_URL};
export {ApiEndpoints};
export {START_LAT};
export {START_LNG};
export {PRECISION};
