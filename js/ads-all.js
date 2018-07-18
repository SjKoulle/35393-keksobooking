'use strict';

(function () {

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
  var PIN_WIDTH = 50;
  var MIN_LOCATION_X = 0 + PIN_WIDTH;
  var MAX_LOCATION_X = 1200 - PIN_WIDTH;
  var MIN_LOCATION_Y = 130;
  var MAX_LOCATION_Y = 630;
  var ADS_QUANTITY = 8;

  var TITLES = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];

  var TYPES = [
    'palace',
    'flat',
    'house',
    'bungalo'
  ];

  var CHECK_IN_TIMES = [
    '12:00',
    '13:00',
    '14:00'
  ];

  var CHECK_OUT_TIMES = [
    '12:00',
    '13:00',
    '14:00'
  ];

  var FEATURES_ALL = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];

  var PHOTOS_URL = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

  var ads = [];
  var avatarDiapason = [];
  var titlesDiapason = [];
  window.adsAll = [];

  var getRandomInRange = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var getRandomUnic = function (length, min, max) {
    var numReserve = [];

    while (numReserve.length < length) {
      var randomNumber = getRandomInRange(min, max);
      var found = false;
      for (var i = 0; i < numReserve.length; i++) {
        if (numReserve[i] === randomNumber) {
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

  var getDiapasons = function () {
    avatarDiapason = getRandomUnic(MAX_AVATAR_NUMBER - (MIN_AVATAR_NUMBER - 1), MIN_AVATAR_NUMBER, MAX_AVATAR_NUMBER);
    titlesDiapason = getRandomUnic(TITLES.length, 0, TITLES.length - 1);
  };

  var getFeatures = function () {
    var features = [];
    var featuresQuantity = getRandomInRange(1, FEATURES_ALL.length);
    var featuresDiapason = getRandomUnic(FEATURES_ALL.length, 0, FEATURES_ALL.length - 1);
    for (var i = 0; i < featuresQuantity; i++) {
      features[i] = FEATURES_ALL[featuresDiapason[i]];
    }
    return features;
  };

  var getPhotosUrl = function () {
    var photos = [];
    var photosDiapason = getRandomUnic(PHOTOS_URL.length, 0, PHOTOS_URL.length - 1);
    for (var i = 0; i < PHOTOS_URL.length; i++) {
      photos[i] = PHOTOS_URL[photosDiapason[i]];
    }
    return photos;
  };

  // Генерируем объекты-объявления

  var generateAd = function (i) {
    var ad = {};
    ad.author = {};
    ad.author.avatar = 'img/avatars/user0' + avatarDiapason[i].toString(10) + '.png';
    ad.offer = {};
    ad.offer.title = TITLES[titlesDiapason[i]];
    ad.offer.address = getRandomInRange(MIN_ADRESS_X, MAX_ADRESS_X).toString(10) + ', ' + getRandomInRange(MIN_ADRESS_Y, MAX_ADRESS_Y).toString(10);
    ad.offer.price = getRandomInRange(MIN_PRICE, MAX_PRICE);
    ad.offer.type = TYPES[getRandomInRange(0, TYPES.length - 1)];
    ad.offer.rooms = getRandomInRange(1, MAX_ROOMS);
    ad.offer.guests = getRandomInRange(1, MAX_GUESTS);
    ad.offer.checkin = CHECK_IN_TIMES[getRandomInRange(0, CHECK_IN_TIMES.length - 1)];
    ad.offer.checkout = CHECK_OUT_TIMES[getRandomInRange(0, CHECK_OUT_TIMES.length - 1)];
    ad.offer.features = getFeatures();
    ad.offer.description = '';
    ad.offer.photos = getPhotosUrl();
    ad.location = {};
    ad.location.x = getRandomInRange(MIN_LOCATION_X, MAX_LOCATION_X);
    ad.location.y = getRandomInRange(MIN_LOCATION_Y, MAX_LOCATION_Y);

    return ad;
  };

  var getAds = function (quantity) {
    for (var i = 0; i < quantity; i++) {
      ads[i] = generateAd(i);
    }
    return ads;
  };

  var getAdsAll = function () {
    return getAds(ADS_QUANTITY);
  };

  var init = function () {
    getDiapasons();
    window.adsAll = getAdsAll();
  };

  init();

})();
