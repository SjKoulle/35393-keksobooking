'use strict';

(function () {
  var mapAdTemplateNode = document.querySelector('template');
  var mapAdTemplatePopupNode = mapAdTemplateNode.content.querySelector('.map__card');
  var mapElementNode = document.querySelector('.map__pins');
  var adElement;
  var popupFeature;
  var popupPhotos;
  var popupPhoto;

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
    var photosInAd = [];
    popupPhotos.removeChild(popupPhoto);

    for (var i = 0; i < photos.length; i++) {
      var photoInAd = popupPhoto.cloneNode(true);

      photoInAd.src = photos[i];
      photosInAd[i] = photoInAd;

      popupPhotos.appendChild(photosInAd[i]);
    }
    return photosInAd;
  };

  window.renderAd = function (ad) {
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

    window.popupUtiles.closePopup(adElement);
  };

})();
