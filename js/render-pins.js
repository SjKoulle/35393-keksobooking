'use strict';

(function () {

  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var mapElementNode = document.querySelector('.map__pins');
  var mapAdTemplateNode = document.querySelector('template');
  var mapPinElementNode = mapAdTemplateNode.content.querySelector('.map__pin');

  var getPinLocation = function (x, y) {
    return 'left: ' + (x - PIN_WIDTH / 2).toString(10) + 'px; top: ' + (y - PIN_HEIGHT).toString(10) + 'px;';
  };

  window.renderPins = function (ad, i) {
    var pinElement = mapPinElementNode.cloneNode(true);

    pinElement.style = getPinLocation(ad.location.x, ad.location.y);
    pinElement.querySelector('img').src = ad.author.avatar;
    pinElement.querySelector('img').alt = ad.offer.title;
    pinElement.dataset.id = i;
    pinElement.querySelector('img').dataset.id = i;

    mapElementNode.appendChild(pinElement);
  };

})();
