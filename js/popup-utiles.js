'use strict';

(function () {

  var mapElementNode = document.querySelector('.map__pins');

  window.popupUtiles = {
    openPopup: function (evt) {
      var targetId = evt.target.getAttribute('data-id');
      window.renderAd(window.adsAll[targetId]);
    },

    closePopup: function (elem) {
      elem.addEventListener('click', function () {
        mapElementNode.removeChild(elem);
      });

      var closePopupOnEsc = function (evt) {
        window.utiles.performActionIfEscEvent(evt, function () {
          mapElementNode.removeChild(elem);
          document.removeEventListener('keydown', closePopupOnEsc);
        });
      };

      document.addEventListener('keydown', closePopupOnEsc);

      elem.querySelector('.popup__close').addEventListener('keydown', function (evt) {
        window.utiles.performActionIfEnterEvent(evt, mapElementNode.removeChild(elem));
      });
    }
  };

})();
