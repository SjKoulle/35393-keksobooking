'use strict';

(function () {

  var MIN_LOCATION_X = 0;
  var MAX_LOCATION_X = 1200;
  var MIN_LOCATION_Y = 130;
  var MAX_LOCATION_Y = 630;
  var PIN_MAIN_WIDTH = 65;
  var PIN_MAIN_HEIGHT = 87;
  var PIN_QUANTITY = 5;
  var PRICE_LOW = 10000;
  var PRICE_HIGH = 50000;

  var mapNode;
  var mainPinNode = document.querySelector('.map__pin--main');
  var pinsNode;
  var mapElementNode = document.querySelector('.map__pins');
  var mapFiltersNode = document.querySelector('.map__filters');
  var mapFilterElementsNode = mapFiltersNode.querySelectorAll('.map__filter');
  var mapFilterTypeNode = mapFiltersNode.querySelector('select[name="housing-type"]');
  var mapFilterPriceNode = mapFiltersNode.querySelector('select[name="housing-price"]');
  var mapFilterRoomsNode = mapFiltersNode.querySelector('select[name="housing-rooms"]');
  var mapFilterGuestsNode = mapFiltersNode.querySelector('select[name="housing-guests"]');
  var mapFilterFeaturesNode = mapFiltersNode.querySelector('.map__features');
  var filterSet = {};

  window.map = {
    adsAll: [],
    filteredPins: []
  };

  var generateFilter = function () {
    for (var i = 0; i < mapFilterElementsNode.length; i++) {
      filterSet[mapFilterElementsNode[i].id] = mapFilterElementsNode[i].value;
    }
    filterSet[mapFilterFeaturesNode.id] = [];
    return filterSet;
  };

  var generateFilterFeatures = function () {
    var featureArray = filterSet[mapFilterFeaturesNode.id];
    var features = mapFilterFeaturesNode.querySelectorAll('input:checked');
    for (var i = 0; i < features.length; i++) {
      featureArray[i] = features[i].value;
    }
    return featureArray;
  };

  var addEventListenerForFilteres = function () {
    mapFilterTypeNode.addEventListener('change', function () {
      generateFilter();
    });

    mapFilterPriceNode.addEventListener('change', function () {
      generateFilter();
    });

    mapFilterRoomsNode.addEventListener('change', function () {
      generateFilter();
    });

    mapFilterGuestsNode.addEventListener('change', function () {
      generateFilter();
    });

    mapFilterFeaturesNode.addEventListener('click', function () {
      generateFilterFeatures();
    });

    mapFiltersNode.addEventListener('change', function () {
      updatePins();
    });
  };

  var removeAllPins = function () {
    var pinElements = mapElementNode.querySelectorAll('.map__pin:not(.map__pin--main)');
    pinElements.forEach(function (it) {
      mapElementNode.removeChild(it);
    });
  };

  var filterType = function (it) {
    if (filterSet['housing-type'] === 'any') {
      return it;
    } else {
      return it.offer.type === filterSet['housing-type'];
    }
  };

  var filterPrice = function (it) {
    if (filterSet['housing-price'] === 'low') {
      return it.offer.price < PRICE_LOW;
    } else if (filterSet['housing-price'] === 'middle') {
      return it.offer.price >= PRICE_LOW && it.offer.price <= PRICE_HIGH;
    } else if (filterSet['housing-price'] === 'high') {
      return it.offer.price >= PRICE_HIGH;
    } else {
      return it;
    }
  };

  var filterRooms = function (it) {
    if (filterSet['housing-rooms'] === 'any') {
      return it;
    } else {
      return it.offer.rooms.toString(10) === filterSet['housing-rooms'];
    }
  };

  var filterGuests = function (it) {
    if (filterSet['housing-guests'] === 'any') {
      return it;
    } else {
      return it.offer.guests.toString(10) === filterSet['housing-guests'];
    }
  };

  var filterFeatures = function (it) {
    var activatedFeatures = filterSet['housing-features'];
    var inAdFeatures = it.offer.features;

    for (var i = 0; i < activatedFeatures.length; i++) {
      if (inAdFeatures.indexOf(activatedFeatures[i]) === -1) {
        return false;
      }
    }
    return true;
  };

  var getFilteredPins = function () {
    window.map.filteredPins = window.map.adsAll.filter(filterType).filter(filterPrice).filter(filterRooms).filter(filterGuests).filter(filterFeatures);
    return window.map.filteredPins;
  };

  var renderFilteredPins = function () {
    var length = Math.min(window.map.filteredPins.length, PIN_QUANTITY);
    for (var i = 0; i < length; i++) {
      window.renderPins(window.map.filteredPins[i], i);
    }
  };

  var renderPinsAfterFilter = function () {
    removeAllPins();
    getFilteredPins();
    renderFilteredPins();
    addEventListenersForPins(window.popupUtiles.openAfterFilterPopup);
  };

  var updatePins = window.debounce(function () {
    renderPinsAfterFilter();
  });

  var openMap = function () {
    generateFilter();
    mapNode = document.querySelector('.map');
    mapNode.classList.remove('map--faded');
  };

  var addEventListenersForPins = function (action) {
    pinsNode = mapElementNode.querySelectorAll('.map__pin:not(.map__pin--main)');

    for (var i = 0; i < pinsNode.length; i++) {
      pinsNode[i].addEventListener('click', function (evt) {
        action(evt);
      });

      pinsNode[i].addEventListener('keydown', function (evt) {
        window.utiles.performActionIfEnterEvent(evt, action);
      });
    }
  };

  var addEventListenersForMainPin = function () {
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
          top: MIN_LOCATION_Y - PIN_MAIN_HEIGHT,
          right: MAX_LOCATION_X - PIN_MAIN_WIDTH,
          bottom: MAX_LOCATION_Y - PIN_MAIN_HEIGHT,
          left: MIN_LOCATION_X
        };

        if (actualPinPosition.x >= mapBorder.left && actualPinPosition.x <= mapBorder.right) {
          mainPinNode.style.left = actualPinPosition.x + 'px';
        }

        if (actualPinPosition.y >= mapBorder.top && actualPinPosition.y <= mapBorder.bottom) {
          mainPinNode.style.top = actualPinPosition.y + 'px';
        }

        window.formUtiles.generateNoticeAdress();
      };

      var onMouseUp = function () {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  };

  var onMouseClick = function (evt) {
    evt.preventDefault();
    activatePage();
    mainPinNode.removeEventListener('click', onMouseClick);
  };

  var addFirstEventListener = function () {
    mainPinNode.addEventListener('click', onMouseClick);

    mainPinNode.addEventListener('keydown', function (evt) {
      window.utiles.performActionIfEnterEvent(evt, activatePage);
    });
  };

  var deactivatePage = function () {
    window.formUtiles.disableNotice();
  };

  var onSuccessPageLoad = function (ads) {
    window.map.adsAll = ads;
    for (var i = 0; i < PIN_QUANTITY; i++) {
      window.renderPins(ads[i], i);
    }
    addEventListenersForPins(window.popupUtiles.openPopup);
  };

  var activatePage = function () {
    openMap();
    window.backend.load(onSuccessPageLoad, window.backend.onError);
    window.formUtiles.enableNotice();
    window.formUtiles.generateNoticeAdress();
    window.formUtiles.addEventListenersForForm();
    addEventListenerForFilteres();
  };

  var init = function () {
    deactivatePage();
    addEventListenersForMainPin();
    addFirstEventListener();
  };

  init();

})();
