'use strict';

(function () {

  var MIN_LOCATION_X = 0;
  var MAX_LOCATION_X = 1200;
  var MIN_LOCATION_Y = 130;
  var MAX_LOCATION_Y = 630;
  var PIN_MAIN_WIDTH = 65;
  var PIN_MAIN_HEIGHT = 87;

  var mapNode;
  var mapElementNode;
  var mainPinNode;
  var pinsNode;

  var createNodes = function () {
    mapElementNode = document.querySelector('.map__pins');
  };

  var openMap = function () {
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

  var activatePage = function () {
    openMap();
    createNodes();

    window.backend.load(function (ads) {
      window.adsAll = ads;
      for (var i = 0; i < ads.length; i++) {
        window.renderPins(ads[i], i);
      }
      addEventListenersForPins();
    }, window.backend.onError);

    window.formUtiles.enableNotice();
    window.formUtiles.generateNoticeAdress();
    window.formUtiles.addEventListenersForForm();
  };

  var init = function () {
    deactivatePage();
    addEventListenersForMainPin();
  };

  init();

})();
