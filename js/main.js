const getRandomIntInclusive = function(min, max) {
  if (max > min && min>=0 ) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  } else {
    return 'Некорректный диапазон чисел!';
  }
};

const getRandomFloat = function(min, max, precision) {
  if (max > min && min>=0 ) {
    const number = Math.random() * (max - min) + min;
    return number.toFixed(precision);
  } else {
    return 'Некорректный диапазон чисел!';
  }
};

getRandomIntInclusive (20, 30);
getRandomFloat(10.3, 10.4, 5);

//console.log(getRandomIntInclusive(20, 30));
//console.log(getRandomFloat(10.3, 10.4, 5));
