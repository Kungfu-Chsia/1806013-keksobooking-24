export const NodeName = {
  IMG: 'IMG',
  INPUT: 'INPUT',
  SELECT: 'SELECT',
};

export const FilterName = {
  TYPE: 'housing-type',
  PRICE: 'housing-price',
  ROOMS: 'housing-rooms',
  GUESTS: 'housing-guests',
  FEATURES: 'features',
};

export const TypeFilterValue = {
  ANY: 'any',
  BUNGALOW: 'bungalow',
  PALACE: 'palace',
  FLAT: 'flat',
  HOTEL: 'hotel',
  HOUSE: 'house',
};

export const houseType = {
  [TypeFilterValue.ANY]: 'any',
  [TypeFilterValue.PALACE]: 'Дворец',
  [TypeFilterValue.FLAT]: 'Квартира',
  [TypeFilterValue.BUNGALOW]: 'Бунгало',
  [TypeFilterValue.HOUSE]: 'Дом',
  [TypeFilterValue.HOTEL]: 'Отель',
};

export const PriceFilterValue = {
  ANY: 'any',
  LOW: 'low',
  MIDDLE: 'middle',
  HIGH: 'high',
};

export const FeatureFilterValue = {
  WIFI: 'wifi',
  DISHWASHER: 'dishwasher',
  PARKING: 'parking',
  WASHER: 'washer',
  ELEVATOR: 'elevator',
  CONDITIONER: 'conditioner',
};

export const RoomsFilterValue = {
  ANY: 'any',
  ONE: '1',
  TWO: '2',
  THREE: '3',
};

export const GuestsFilterValue = {
  ANY: 'any',
  ONE: '1',
  TWO: '2',
  NOT_FOR_GUESTS: '0',
};

export const priceType = {
  [PriceFilterValue.LOW]: 10000,
  [PriceFilterValue.HIGH]: 50000,
};

export const HouseCost = {
  palace: 10000,
  flat: 1000,
  bungalow: 0,
  house: 5000,
  hotel: 3000,
};

export const ID_PALACE = '100';
export const PREVIEW_HEIGHT = 70;
export const PREVIEW_WIDTH = 70;
export const OBJECTS_COUNT = 10;

export const ALERT_SHOW_TIME = 5000;

export const API_URL = 'https://24.javascript.pages.academy/keksobooking';

export const ApiEndpoint = {
  GET_AD: `${API_URL}/data`,
  POST_AD: `${API_URL}/`,
};

export const START_LAT = 35.6895;
export const START_LNG = 139.692;
export const PRECISION = 5;
