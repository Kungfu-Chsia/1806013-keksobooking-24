import './data.js';
import './util.js';
import {createObject} from './data.js';

const generateObjectsList = function (countCreateObject) {
  const objects = [];

  for (let ind = 0; ind < countCreateObject; ind++ ) {
    objects.push(createObject());
  }

  return objects;
};

generateObjectsList (10);
//console.log(createObject());
