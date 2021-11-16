import { mapFilters } from './form.js';
import { NodeName } from './consts.js';
import { priceType } from './consts.js';
import { PriceFilterValue } from './consts.js';
import { FeatureFilterValue } from './consts.js';
import { RoomsFilterValue } from './consts.js';
import { GuestsFilterValue } from './consts.js';
import { FilterName } from './consts.js';
import { TypeFilterValue } from './consts.js';
import { checkIncomingArray } from './popup.js';

const FilterValuesByName = {
  [FilterName.TYPE]: TypeFilterValue,
  [FilterName.PRICE]: PriceFilterValue,
  [FilterName.GUESTS]: GuestsFilterValue,
  [FilterName.ROOMS]: RoomsFilterValue,
  [FilterName.FEATURES]: FeatureFilterValue,
};

const getPriceAllow = (adPrice, priceFilterValue) => {
  if (
    adPrice > priceType.high && priceFilterValue === PriceFilterValue.HIGH ||
    adPrice < priceType.low && priceFilterValue === PriceFilterValue.LOW ||
    (adPrice >= priceType.low && adPrice <= priceType.high && priceFilterValue === PriceFilterValue.MIDDLE)) {
    return true;
  }
  return false;
};

const getGuestsOrRoomsAllow = (adValue, filterValue, filterType) => {
  if (filterValue !== FilterValuesByName[filterType].ANY && String(adValue) !== filterValue) {
    return false;
  }
  return true;
};

const getAllowFromSelect = (adObject, selectEl, allow) => {
  const optionsList = Array.from(selectEl.children);
  optionsList.forEach((option) => {
    if (option.selected) {
      if (allow &&
        selectEl.name === FilterName.TYPE &&
        option.value !== FilterValuesByName[selectEl.name].ANY &&
        adObject.offer.type !== option.value) {
        allow = false;
      }
      if (allow &&
        selectEl.name === FilterName.PRICE &&
        option.value !== FilterValuesByName[selectEl.name].ANY) {
        allow = getPriceAllow(adObject.offer.price, option.value);
      }
      if (allow &&
        selectEl.name === FilterName.ROOMS) {
        allow = getGuestsOrRoomsAllow(adObject.offer.rooms, option.value, FilterName.ROOMS);
      }
      if (allow &&
        selectEl.name === FilterName.GUESTS) {
        allow = getGuestsOrRoomsAllow(adObject.offer.guests, option.value, FilterName.GUESTS);
      }
    }
  });
  return allow;
};

const getAllowFromCheckboxes = ((adObject, checkboxEl) => {
  const featuresList = checkIncomingArray(adObject.offer.features);
  if (checkboxEl.checked && !featuresList.includes(checkboxEl.value)) {
    return false;
  }
  return true;
});

const applyFilter = (adObject) => {
  let allow = true;
  const formElements = [...mapFilters.elements];
  formElements.forEach((formElement) => {
    if (allow && formElement.nodeName === NodeName.SELECT) {
      allow = getAllowFromSelect(adObject, formElement, allow);
    }
    if (allow && formElement.nodeName === NodeName.INPUT) {
      allow = getAllowFromCheckboxes(adObject, formElement);
    }
  });
  return allow;
};

export { applyFilter };
