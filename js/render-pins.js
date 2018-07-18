'use strict';

(function () {

  var ADS_QUANTITY = 8;
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var mapElementNode;
  var mapAdTemplateNode;
  var mapPinElementNode;

  var getPinLocation = function (x, y) {
    return 'left: ' + (x - PIN_WIDTH / 2).toString(10) + 'px; top: ' + (y - PIN_HEIGHT).toString(10) + 'px;';
  };

  window.renderPins = function () {
    mapElementNode = document.querySelector('.map__pins');
    mapAdTemplateNode = document.querySelector('template');
    mapPinElementNode = mapAdTemplateNode.content.querySelector('.map__pin');
    for (var i = 0; i < ADS_QUANTITY; i++) {
      var pinElement = mapPinElementNode.cloneNode(true);

      pinElement.style = getPinLocation(window.adsAll[i].location.x, window.adsAll[i].location.y);
      pinElement.querySelector('img').src = window.adsAll[i].author.avatar;
      pinElement.querySelector('img').alt = window.adsAll[i].offer.title;
      pinElement.dataset.id = i;
      pinElement.querySelector('img').dataset.id = i;

      mapElementNode.appendChild(pinElement);
    }
  };

})();
