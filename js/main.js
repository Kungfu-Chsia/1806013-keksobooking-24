import {createObject} from './utils.js';

const generateObjectsList = function (countCreateObject) {
  const objects = [];

  for (let ind = 0; ind < countCreateObject; ind++ ) {
    objects.push(createObject());
  }

  return objects;
};

generateObjectsList (10);
//console.log(createObject());
