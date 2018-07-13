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
var PIN_IMG_HEIGHT = 44;
var PIN_HEIGHT = 66;
var ENTER_KEYCODE = 13;

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
var adsAll = [];
var mapNode;
var mapElementNode;
var mainPinNode;
var pinsNode;
var noticeBlockNode;
var noticeTitleNode;
var noticePriceNode;
var noticeTypeNode;
var noticeTimeInNode;
var noticeTimeOutNode;
var timeinOptions;
var timeoutOptions;
var adFormNode;
var adFormHeaderNode;
var adFormElementNode;
var adFormAdressNode;
var mapAdTemplateNode;
var mapAdTemplatePopupNode;
var mapPinElementNode;
var closePopupNode;
var popupFeature;
var popupPhotos;
var popupPhoto;
var adElement;


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

var getCoords = function (elem) {
  var box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };
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
  var capacityText = '';
  if (rooms === 1) {
    capacityText += rooms.toString(10) + ' комната для ';
  } else if (rooms > 1 && rooms < 5) {
    capacityText += rooms.toString(10) + ' комнаты для ';
  } else if (rooms > 4) {
    capacityText += rooms.toString(10) + ' комнат для ';
  }
  if (guests === 1) {
    capacityText += guests.toString(10) + ' гостя';
  } else {
    capacityText += guests.toString(10) + ' гостей';
  }
  return capacityText;
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
    if (found) {
      popupFeature[index].style = '';
    }
  }
};

var getAdPhotos = function (photos) {
  var photosUrls = photos;
  var photosInAd = [];
  popupPhotos.removeChild(popupPhoto);

  for (var i = 0; i < photosUrls.length; i++) {
    var photoInAd = popupPhoto.cloneNode(true);

    photoInAd.src = photosUrls[i];
    photosInAd[i] = photoInAd;

    popupPhotos.appendChild(photosInAd[i]);
  }
  return photosInAd;
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

// Работа с DOM-элементами

var openMap = function () {
  mapNode = document.querySelector('.map');
  mapNode.classList.remove('map--faded');
};

var disableNotice = function () {
  noticeBlockNode = document.querySelector('.notice');
  adFormNode = noticeBlockNode.querySelector('.ad-form');
  adFormHeaderNode = adFormNode.querySelector('.ad-form-header');
  adFormElementNode = adFormNode.querySelectorAll('.ad-form__element');

  adFormHeaderNode.disabled = true;

  for (var i = 0; i < adFormElementNode.length; i++) {
    adFormElementNode[i].disabled = true;
  }

};

var openNotice = function () {

  adFormNode.classList.remove('ad-form--disabled');
  adFormHeaderNode.disabled = false;

  for (var i = 0; i < adFormElementNode.length; i++) {
    adFormElementNode[i].disabled = false;
  }
};

var createNodes = function () {
  mapElementNode = document.querySelector('.map__pins');
  mapAdTemplateNode = document.querySelector('template');
  mapAdTemplatePopupNode = mapAdTemplateNode.content.querySelector('.map__card');
  mapPinElementNode = mapAdTemplateNode.content.querySelector('.map__pin');
};

// Создаем метки на карте

var renderPins = function () {
  for (var i = 0; i < ADS_QUANTITY; i++) {
    var pinElement = mapPinElementNode.cloneNode(true);

    pinElement.style = getPinLocation(adsAll[i].location.x, adsAll[i].location.y);
    pinElement.querySelector('img').src = adsAll[i].author.avatar;
    pinElement.querySelector('img').alt = adsAll[i].offer.title;
    pinElement.dataset.id = i;
    pinElement.querySelector('img').dataset.id = i;

    mapElementNode.appendChild(pinElement);
  }
};

// Создаем объявление

var showAdDetails = function (ad) {
  adElement = mapAdTemplatePopupNode.cloneNode(true);

  adElement.querySelector('.popup__avatar').src = ad.author.avatar;
  adElement.querySelector('.popup__title').textContent = ad.offer.title;
  adElement.querySelector('.popup__text--address').textContent = ad.offer.address;
  adElement.querySelector('.popup__text--price').textContent = ad.offer.price.toString(10) + '₽/ночь';
  adElement.querySelector('.popup__type').textContent = getTypesRus(ad.offer.type);
  adElement.querySelector('.popup__text--capacity').textContent = getCapacityText(ad.offer.rooms, ad.offer.guests);
  adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  adElement.querySelector('.popup__description').textContent = ad.offer.description;

  popupFeature = adElement.querySelector('.popup__features').children;
  enableFeaturesInAd(ad.offer.features);

  popupPhotos = adElement.querySelector('.popup__photos');
  popupPhoto = adElement.querySelector('.popup__photo');
  getAdPhotos(ad.offer.photos);

  mapElementNode.appendChild(adElement);
  closePopup(adElement);
};

// Неактивное состояние страницы

var deactivatePage = function () {
  disableNotice();
};

// Активное состояние страницы

var getPinLocation = function (x, y) {
  return 'left: ' + (x - PIN_WIDTH / 2).toString(10) + 'px; top: ' + (y - PIN_HEIGHT).toString(10) + 'px;';
};

var getNoticeAdress = function () {
  var mainPinCoordinates = getCoords(mainPinNode);
  var mainPinX = mainPinCoordinates.left;
  var mainPinY = mainPinCoordinates.top;
  return (mainPinX + PIN_WIDTH / 2) + ', ' + (mainPinY + PIN_IMG_HEIGHT / 2);
};

var generateNoticeAdress = function () {
  adFormAdressNode = document.querySelector('input[name="address"]');
  adFormAdressNode.value = getNoticeAdress();
  adFormAdressNode.disabled = true;
};

var closePopup = function (adElement) {
  adElement.addEventListener('click', function (evt) {
    mapElementNode.removeChild(adElement);
  });
};

var openPopup = function (evt) {
  var targetId = evt.target.getAttribute('data-id');
  showAdDetails(adsAll[targetId]);
};

var onPinClick = function () {
  pinsNode = mapElementNode.querySelectorAll('.map__pin:not(.map__pin--main)');

  for (var i = 0; i < pinsNode.length; i++) {
    pinsNode[i].addEventListener('click', function (evt) {
      openPopup(evt);
    });

    pinsNode[i].addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        openPopup(evt);
      }
    });
  }
};

var activatePage = function () {
  openMap();
  openNotice();
  generateNoticeAdress();
  createNodes();
  renderPins();
  onPinClick();
};

var addEventListenersForAds = function () {
  mainPinNode = document.querySelector('.map__pin--main');

  mainPinNode.addEventListener('mouseup', function () {
    activatePage();
  });

  mainPinNode.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      activatePage();
    }
  });
};

var init = function () {
  getDiapasons();
  adsAll = getAdsAll();
  deactivatePage();
  addEventListenersForAds();
};

init();
