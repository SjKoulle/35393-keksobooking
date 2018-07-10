'use strict';

var MIN_AVATAR_NUMBER = 1;
var MAX_AVATAR_NUMBER = 8;
var MIN_ADRESS_X = 100;
var MAX_ADRESS_X = 1000;
var MIN_ADRESS_Y = 100;
var MAX_ADRESS_Y = 1000;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var MAX_ROOMS = 5;
var MAX_GUESTS = 10;
var MIN_LOCATION_X = 200;
var MAX_LOCATION_X = 1000;
var MIN_LOCATION_Y = 130;
var MAX_LOCATION_Y = 630;
var ADS_QUANTITY = 8;
var PIN_WIDTH = 40;
var PIN_HEIGHT = 66;

var titles = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var types = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var checkInTimes = [
  '12:00',
  '13:00',
  '14:00'
];

var checkOutTimes = [
  '12:00',
  '13:00',
  '14:00'
];

var featuresAll = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var photosUrl = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var getRandomInRange = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getRandomUnic = function (length, min, max) {
  var numReserve = [];

  while (numReserve.length < length) {
    var randomNumber = getRandomInRange(min, max);
    var found = false;
    for (var i = 0; i < numReserve.length; i++) {
      if (numReserve[i] === randomNumber){
        found = true;
        break;
      }
    }
    if (!found) {
      numReserve[numReserve.length] = randomNumber;
    }
  }

  return numReserve;
};

var avatarDiapason = getRandomUnic(MAX_AVATAR_NUMBER - (MIN_AVATAR_NUMBER - 1), MIN_AVATAR_NUMBER, MAX_AVATAR_NUMBER);
var titlesDiapason = getRandomUnic(titles.length, 0, titles.length - 1);

var getFeatures = function () {
  var features = [];
  var featuresQuantity = getRandomInRange(1, featuresAll.length);
  var featuresDiapason = getRandomUnic(featuresAll.length, 0, featuresAll.length - 1);
  for (var i = 0; i < featuresQuantity; i++) {
    features[i] = featuresAll[featuresDiapason[i]];
  }
  return features;
};

var getPhotosUrl = function () {
  var photos = [];
  var photosDiapason = getRandomUnic(photosUrl.length, 0, photosUrl.length - 1);
  for (var i = 0; i < photosUrl.length; i++) {
    photos[i] = photosUrl[photosDiapason[i]];
  }
  return photos;
};

var getTypesRus = function (typeEn) {
  var type = '';
  if (typeEn === 'flat') {
    type = 'Квартира';
  } else if (typeEn === 'bungalo') {
    type = 'Бунгало';
  } else if (typeEn === 'house') {
    type = 'Дом';
  } else if (typeEn === 'palace') {
    type = 'Дворец';
  }
  return type;
};

var getCapacityText = function (rooms, guests) {
  var CapacityText = '';
  if (rooms === 1) {
    CapacityText += rooms.toString(10) + ' комната для ';
  } else if (rooms > 1 && rooms < 5) {
    CapacityText += rooms.toString(10) + ' комнаты для ';
  } else if (rooms > 4) {
    CapacityText += rooms.toString(10) + ' комнат для ';
  }
  if (guests === 1) {
    CapacityText += guests.toString(10) + ' гостя';
  } else {
    CapacityText += guests.toString(10) + ' гостей';
  }
  return CapacityText;
};

var enableFeaturesInAd = function (features) {
  var featuresInAd = features;
  var index = 0;

  for (i = 0; i < popupFeature.length; i++) {
    popupFeature[i].style = 'display: none;';
  }

  for (var i = 0; i < featuresInAd.length; i++) {
    var found = false;
    var featureAcc = 'popup__feature--' + featuresInAd[i];

    for (var j = 0; j < popupFeature.length; j++) {
      if (featureAcc === popupFeature[j].classList[1]) {
        found = true;
        index = j;
      }
    }
    if (found = true) {
        popupFeature[index].style = '';
      }
  }
};

var getAdPhotos = function (photos) {
  var photosUrl = photos;
  var photosInAd = [];
  popupPhotos.removeChild(popupPhoto);

  for (i = 0; i < photosUrl.length; i++) {
    var photoInAd = popupPhoto.cloneNode(true);

    photoInAd.src = photosUrl[i];
    photosInAd[i] = photoInAd;

    popupPhotos.appendChild(photosInAd[i]);
  }
  return photosInAd;
}

var getPinLocation = function (x, y) {
  var locationX = x;
  var locationY = y;
  return 'left: ' + (x - PIN_WIDTH / 2).toString(10) + 'px; top: ' + (y - PIN_HEIGHT).toString(10) + 'px;';
}

//Генерируем объявления

var generateAd = function (i) {
  var ad = {};
  ad.author = {};
  ad.author.avatar = 'img/avatars/user0' + avatarDiapason[i].toString(10) + '.png';
  ad.offer = {};
  ad.offer.title = titles[titlesDiapason[i]];
  ad.offer.address = getRandomInRange(MIN_ADRESS_X, MAX_ADRESS_X).toString(10) + ', ' + getRandomInRange(MIN_ADRESS_Y, MAX_ADRESS_Y).toString(10);
  ad.offer.price = getRandomInRange(MIN_PRICE, MAX_PRICE);
  ad.offer.type = types[getRandomInRange(0, types.length - 1)];
  ad.offer.rooms = getRandomInRange(1, MAX_ROOMS);
  ad.offer.guests = getRandomInRange(1, MAX_GUESTS);
  ad.offer.checkin = checkInTimes[getRandomInRange(0, checkInTimes.length - 1)];
  ad.offer.checkout = checkOutTimes[getRandomInRange(0, checkOutTimes.length - 1)];
  ad.offer.features = getFeatures();
  ad.offer.description = '';
  ad.offer.photos = getPhotosUrl();
  ad.location = {};
  ad.location.x = getRandomInRange(MIN_LOCATION_X, MAX_LOCATION_X);
  ad.location.y = getRandomInRange(MIN_LOCATION_Y, MAX_LOCATION_Y);

  return ad;
};

var getAds = function (quantity) {
  var ads = [];
  for (var i = 0; i < quantity; i++) {
    ads[i] = generateAd(i);
  }
  return ads;
}

var adsAll = getAds(ADS_QUANTITY);

//Работа с DOM-элементами

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var mapElement = document.querySelector('.map__pins');
var mapAdTemplate = document.querySelector('#map-ad-template').content.querySelector('.map__card');
var mapPinElement = document.querySelector('button.map__pin');

//Создаем метки на карте

for (var i = 0; i < ADS_QUANTITY; i++) {
  var pinElement = mapPinElement.cloneNode(true);

  pinElement.style = getPinLocation(adsAll[i].location.x, adsAll[i].location.y);
  pinElement.querySelector('img').src = adsAll[i].author.avatar;
  pinElement.querySelector('img').alt = adsAll[i].offer.title;

  mapElement.appendChild(pinElement);
}

mapElement.removeChild(mapPinElement);


//Создаем объявление

for (var i = 0; i < 1; i++) {
  var adElement = mapAdTemplate.cloneNode(true);

  adElement.querySelector('.popup__avatar').src = adsAll[i].author.avatar;
  adElement.querySelector('.popup__title').textContent = adsAll[i].offer.title;
  adElement.querySelector('.popup__text--address').textContent = adsAll[i].offer.address;
  adElement.querySelector('.popup__text--price').textContent = adsAll[i].offer.price.toString(10) + '₽/ночь';
  adElement.querySelector('.popup__type').textContent = getTypesRus(adsAll[i].offer.type);
  adElement.querySelector('.popup__text--capacity').textContent = getCapacityText(adsAll[i].offer.rooms, adsAll[i].offer.guests);
  adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + adsAll[i].offer.checkin + ', выезд до ' + adsAll[i].offer.checkout;
  adElement.querySelector('.popup__description').textContent = adsAll[i].offer.description;

  var popupFeatures = adElement.querySelector('.popup__features');
  var popupFeature = adElement.querySelector('.popup__features').children;
  enableFeaturesInAd(adsAll[i].offer.features);

  var popupPhotos = adElement.querySelector('.popup__photos');
  var popupPhoto = adElement.querySelector('.popup__photo');
  getAdPhotos(adsAll[i].offer.photos);

  mapElement.appendChild(adElement);
};
