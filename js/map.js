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
  var mainPinNode;
  var pinsNode;
  var mapElementNode = document.querySelector('.map__pins');
  var mapFiltersNode = document.querySelector('.map__filters');
  var mapFilterElementsNode = mapFiltersNode.querySelectorAll('.map__filter');
  var mapFilterTypeNode = mapFiltersNode.querySelector('select[name="housing-type"]');
  var mapFilterPriceNode = mapFiltersNode.querySelector('select[name="housing-price"]');
  var mapFilterRoomsNode = mapFiltersNode.querySelector('select[name="housing-rooms"]');
  var mapFilterGuestsNode = mapFiltersNode.querySelector('select[name="housing-guests"]');
  var mapFilterFeaturesNode = mapFiltersNode.querySelector('.map__features');
  var Filter = {};
  var filteredPins;
  window.adsAll = [];

  var generateFilter = function () {
    for (var i = 0; i < mapFilterElementsNode.length; i++) {
      Filter[mapFilterElementsNode[i].id] = mapFilterElementsNode[i].value;
    }
    Filter[mapFilterFeaturesNode.id] = [];
    return Filter;
  };

  var generateFilterFeatures = function () {
    var featureArray = Filter[mapFilterFeaturesNode.id];
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

  var getFilteredPins = function () {
    filteredPins = window.adsAll.filter(function (it) {
      if (Filter['housing-type'] === 'any') {
        return it;
      } else {
        return it.offer.type === Filter['housing-type'];
      }
    }).filter(function (it) {
      if (Filter['housing-price'] === 'any') {
        return it;
      } else if (Filter['housing-price'] === 'low') {
        return it.offer.price < PRICE_LOW;
      } else if (Filter['housing-price'] === 'middle') {
        return it.offer.price >= PRICE_LOW && it.offer.price <= PRICE_HIGH;
      } else if (Filter['housing-price'] === 'high') {
        return it.offer.price >= PRICE_HIGH;
      }
    }).filter(function (it) {
      if (Filter['housing-rooms'] === 'any') {
        return it;
      } else {
        return it.offer.rooms.toString(10) === Filter['housing-rooms'];
      }
    }).filter(function (it) {
      if (Filter['housing-guests'] === 'any') {
        return it;
      } else {
        return it.offer.guests.toString(10) === Filter['housing-guests'];
      }
    });
    return filteredPins;
    // .filter(function (it) {
    //   var activatedFeatures = Filter['housing-features'];
    //   var inAdFeatures = it.offer.features;

    //   var isAccurateToAd = function (array, value) {
    //     return array.some(function (arrVal) {
    //       return value === arrVal;
    //     })
    //   };

    //   if (activatedFeatures.length === 0) {
    //     return it;
    //   } else {
    //     for (var i = 0; i < activatedFeatures.length; i++) {
    //       console.log(inAdFeatures);
    //       console.log(activatedFeatures[i]);
    //       console.log(isAccurateToAd(inAdFeatures, activatedFeatures[i]));
    //       if (isAccurateToAd(inAdFeatures, activatedFeatures[i])) {
    //       }
    //     }
    //   }
    // });
  };

  var renderPinsAfterFilter = function () {
    removeAllPins();
    getFilteredPins();
    if (filteredPins.length > PIN_QUANTITY) {
      for (var i = 0; i < PIN_QUANTITY; i++) {
        window.renderPins(filteredPins[i], i);
      }
    } else {
      for (var j = 0; j < filteredPins.length; j++) {
        window.renderPins(filteredPins[j], j);
      }
    }
  };

  var updatePins = window.debounce(function () {
    renderPinsAfterFilter();
  });

  var openMap = function () {
    generateFilter();
    mapNode = document.querySelector('.map');
    mapNode.classList.remove('map--faded');
  };

  var addEventListenersForPins = function () {
    pinsNode = mapElementNode.querySelectorAll('.map__pin:not(.map__pin--main)');

    for (var i = 0; i < pinsNode.length; i++) {
      pinsNode[i].addEventListener('click', function (evt) {
        window.popupUtiles.openPopup(evt);
      });

      pinsNode[i].addEventListener('keydown', function (evt) {
        window.utiles.performActionIfEnterEvent(evt, window.popupUtiles.openPopup);
      });
    }
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
      window.utiles.performActionIfEnterEvent(evt, activatePage);
    });
  };

  var deactivatePage = function () {
    window.formUtiles.disableNotice();
  };

  var onSuccessPageLoad = function (ads) {
    window.adsAll = ads;
    for (var i = 0; i < PIN_QUANTITY; i++) {
      window.renderPins(ads[i], i);
    }
    addEventListenersForPins();
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
  };

  init();

})();
