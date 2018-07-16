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
var MIN_LOCATION_X = 0;
var MAX_LOCATION_X = 1200;
var MIN_LOCATION_Y = 130;
var MAX_LOCATION_Y = 630;
var ADS_QUANTITY = 8;
var PIN_MAIN_WIDTH = 62;
var PIN_HEIGHT = 66;
var ENTER_KEYCODE = 13;
var ESC_KEYCODE = 27;

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
var mainPinX;
var mainPinY;
var pinsNode;
var noticeBlockNode;
var noticePriceNode;
var noticeTypeNode;
var noticeTimeInNode;
var noticeTimeOutNode;
var noticeRoomsNode;
var noticeCapacityNode;
var adFormNode;
var adFormHeaderNode;
var adFormElementNode;
var adFormAdressNode;
var mapAdTemplateNode;
var mapAdTemplatePopupNode;
var mapPinElementNode;
var popupFeature;
var popupPhotos;
var popupPhoto;
var adElement;
var noticeButtonSubmitNode;
var noticeInputElementsNode;

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
    left: box.left + pageXOffset - 8
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
  return 'left: ' + (x - PIN_MAIN_WIDTH / 2).toString(10) + 'px; top: ' + (y - PIN_HEIGHT).toString(10) + 'px;';
};

var getMainPinCoords = function () {
  var mainPinCoordinates = getCoords(mainPinNode);
  mainPinX = mainPinCoordinates.left;
  mainPinY = mainPinCoordinates.top;
  return Math.ceil((mainPinX + PIN_MAIN_WIDTH / 2)) + ', ' + Math.ceil((mainPinY + PIN_HEIGHT));
};

var generateNoticeAdress = function () {
  adFormAdressNode = document.querySelector('input[name="address"]');
  adFormAdressNode.value = getMainPinCoords();
  adFormAdressNode.textContent = getMainPinCoords();
  adFormAdressNode.readOnly = true;
};

var closePopup = function (elem) {
  elem.addEventListener('click', function () {
    mapElementNode.removeChild(elem);
  });

  var closePopupOnEsc = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      mapElementNode.removeChild(elem);
      document.removeEventListener('keydown', closePopupOnEsc);
    }
  };

  document.addEventListener('keydown', closePopupOnEsc);

  elem.querySelector('.popup__close').addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      mapElementNode.removeChild(elem);
    }
  });
};

var openPopup = function (evt) {
  var targetId = evt.target.getAttribute('data-id');
  showAdDetails(adsAll[targetId]);
};

var addEventListenersForPins = function () {
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
  addEventListenersForPins();
  addEventListenersForForm();
};

var addEventListenersForMainPin = function () {
  mainPinNode = document.querySelector('.map__pin--main');


  mainPinNode.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var actualPinPosition = {
        x: mainPinNode.offsetLeft - shift.x,
        y: mainPinNode.offsetTop - shift.y
      };

      var mapBorder = {
        top: MIN_LOCATION_Y - PIN_HEIGHT,
        right: MAX_LOCATION_X - PIN_MAIN_WIDTH,
        bottom: MAX_LOCATION_Y - PIN_HEIGHT,
        left: MIN_LOCATION_X
      };

      if (actualPinPosition.x >= mapBorder.left && actualPinPosition.x <= mapBorder.right) {
        mainPinNode.style.left = actualPinPosition.x + 'px';
      }

      if (actualPinPosition.y >= mapBorder.top && actualPinPosition.y <= mapBorder.bottom) {
        mainPinNode.style.top = actualPinPosition.y + 'px';
      }

      generateNoticeAdress();
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      activatePage();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  mainPinNode.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      activatePage();
    }
  });
};

// Валидация формы

var setTypePrice = function () {
  var noticeTypeCheckedElementNode = noticeTypeNode.querySelector('option:checked');
  if (noticeTypeCheckedElementNode.value === 'flat') {
    noticePriceNode.min = 1000;
    noticePriceNode.placeholder = '1 000';
  } else if (noticeTypeCheckedElementNode.value === 'bungalo') {
    noticePriceNode.min = 0;
    noticePriceNode.placeholder = '0';
  } else if (noticeTypeCheckedElementNode.value === 'house') {
    noticePriceNode.min = 5000;
    noticePriceNode.placeholder = '5 000';
  } else if (noticeTypeCheckedElementNode.value === 'palace') {
    noticePriceNode.min = 10000;
    noticePriceNode.placeholder = '10 000';
  }
};

var setCheckout = function (evt) {
  var checkinValue = evt.target.value;
  noticeTimeOutNode.value = checkinValue;
};

var setCheckin = function (evt) {
  var checkoutValue = evt.target.value;
  noticeTimeInNode.value = checkoutValue;
};

var getCustomCapacityMessage = function () {
  var roomsValue = noticeRoomsNode.value;
  var capacityValue = noticeCapacityNode.value;
  var message = '';

  if (roomsValue === '1' && (capacityValue === '2' || capacityValue === '3' || capacityValue === '0')) {
    message = 'Недопустимое количество гостей. Для одной комнаты может быть выбран только один гость';
  } else if (roomsValue === '2' && (capacityValue === '3' || capacityValue === '0')) {
    message = 'Недопустимое количество гостей. Для двух комнат можно указать не больше двух гостей';
  } else if (roomsValue === '3' && (capacityValue === '0')) {
    message = 'Недопустимое количество гостей. Три комнаты нельзя указать не для гостей';
  } else if (roomsValue === '100' && (capacityValue === '1' || capacityValue === '2' || capacityValue === '3')) {
    message = 'Данное количество комнат можно указать только не для гостей';
  }

  return message;
};

var validateCapacity = function () {
  var customCapacityMessage = getCustomCapacityMessage();
  noticeCapacityNode.setCustomValidity(customCapacityMessage);
};

var CustomValidation = function () {};

CustomValidation.prototype = {
  invalidities: [],

  checkValidity: function (input) {
    var validity = input.validity;
    this.invalidities.length = 0;

    if (validity.valueMissing) {
      this.addInvalidity('Пожалуйста, заполните поле');
    }

    if (validity.rangeOverflow) {
      this.addInvalidity('Значение должно быть меньше или равно ' + input.max);
    }

    if (validity.rangeUnderflow) {
      this.addInvalidity('Значение должно быть больше или равно ' + input.min);
    }

    if (validity.tooLong) {
      this.addInvalidity('Максимальная допустимая длина ' + input.maxLength + ' символов');
    }

    if (validity.tooShort) {
      this.addInvalidity('Минимальная допустимая длина ' + input.minLength + ' символов');
    }
  },

  addInvalidity: function (message) {
    this.invalidities.push(message);
  },

  getInvalidities: function () {
    return this.invalidities.join('. \n');
  }
};

var validateAdForm = function () {
  for (var i = 0; i < noticeInputElementsNode.length; i++) {
    var input = noticeInputElementsNode[i];

    if (input.checkValidity() === false) {
      var inputCustomValidation = new CustomValidation();
      inputCustomValidation.checkValidity(input);
      var customValidityMessage = inputCustomValidation.getInvalidities();
      input.setCustomValidity(customValidityMessage);
    }
  }
};

var addEventListenersForForm = function () {
  noticePriceNode = noticeBlockNode.querySelector('input[name="price"]');
  noticeTypeNode = noticeBlockNode.querySelector('select[name="type"]');
  noticeTimeInNode = noticeBlockNode.querySelector('select[name="timein"]');
  noticeTimeOutNode = noticeBlockNode.querySelector('select[name="timeout"]');
  noticeRoomsNode = noticeBlockNode.querySelector('select[name="rooms"]');
  noticeCapacityNode = noticeBlockNode.querySelector('select[name="capacity"]');
  noticeInputElementsNode = noticeBlockNode.querySelectorAll('input');
  noticeButtonSubmitNode = noticeBlockNode.querySelector('.ad-form__submit');

  noticeTypeNode.addEventListener('change', function () {
    setTypePrice();
  });

  noticeTimeInNode.addEventListener('change', function (evt) {
    setCheckout(evt);
  });

  noticeTimeOutNode.addEventListener('change', function (evt) {
    setCheckin(evt);
  });

  noticeCapacityNode.addEventListener('change', function (evt) {
    validateCapacity(evt);
  });

  noticeButtonSubmitNode.addEventListener('click', function () {
    validateAdForm();
    validateCapacity();
  });
};

var init = function () {
  getDiapasons();
  adsAll = getAdsAll();
  deactivatePage();
  addEventListenersForMainPin();
};

init();
