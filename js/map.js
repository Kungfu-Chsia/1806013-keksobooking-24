import {setDocumentActiveOn} from './form.js';
import {createCustomPopup} from './generate.js';

const START_LAT = 35.6895;
const START_LNG = 139.692;
const PRECISION = 5;

/***********MAP*************/
const map = L.map('map-canvas')
  .on('load', setDocumentActiveOn)
  .setView({
    lat: START_LAT,
    lng: START_LNG,
  }, 10);

//слой карты
L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

//слой меток
const markerGroup = L.layerGroup().addTo(map);

//главная иконка
const mainPinIcon = L.icon({
  iconUrl: 'img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

const mainPinMarker = L.marker(
  {
    lat: START_LAT,
    lng: START_LNG,
  },
  {
    draggable: true,
    icon: mainPinIcon,
  },
);

const getReadableAddress = function (Location) {
  const Lat = Location.lat;
  const Lng = Location.lng;
  return `Широта: ${Lat.toFixed(PRECISION)} Долгота: ${Lng.toFixed(PRECISION)}`;
};

mainPinMarker.addTo(map);
document.getElementById('address').setAttribute('value', getReadableAddress(mainPinMarker.getLatLng()));

const resetMainPinMarker = function () {
  mainPinMarker.setLatLng({
    lat: START_LAT,
    lng: START_LNG,
  });
  document.getElementById('address').setAttribute('value', getReadableAddress(mainPinMarker.getLatLng()));
};

mainPinMarker.on('moveend', () => {
  document.getElementById('address').setAttribute('value', getReadableAddress(mainPinMarker.getLatLng()));
});


const createMarker = (currentPoint) => {
  const lat = currentPoint.location.lat;
  const lng = currentPoint.location.lng;

  const PinIcon = L.icon({
    iconUrl: 'img/pin.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  const marker = L.marker(
    {
      lat,
      lng,
    },
    {
      PinIcon,
    },
  );

  marker
    .addTo(markerGroup)
    .bindPopup(createCustomPopup(currentPoint));
};

const deleteMarker = function () {
  markerGroup.clearLayers();
  resetMainPinMarker();
};

export {createMarker};
export {deleteMarker};
