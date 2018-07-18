'use strict';

(function () {

  var PIN_MAIN_WIDTH = 65;
  var PIN_MAIN_HEIGHT = 87;

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
  var noticeButtonSubmitNode;
  var noticeInputElementsNode;
  var mainPinX;
  var mainPinY;
  var mainPinNode;

  var getCoords = function (elem) {
    var box = elem.getBoundingClientRect();
    var indentX = (self.innerWidth - document.body.clientWidth) / 2;
    var coords = {};

    if (self.innerWidth >= document.body.clientWidth) {
      coords.left = box.left + pageXOffset - indentX;
    } else {
      coords.left = box.left + pageXOffset;
    }

    coords.top = box.top + pageYOffset;
    return coords;
  };

  var getMainPinCoords = function () {
    mainPinNode = document.querySelector('.map__pin--main');
    var MainPinCoords = getCoords(mainPinNode);
    mainPinX = MainPinCoords.left;
    mainPinY = MainPinCoords.top;

    return Math.ceil(mainPinX + PIN_MAIN_WIDTH / 2) + ', ' + Math.ceil(mainPinY + PIN_MAIN_HEIGHT);
  };

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

  window.formUtiles = {
    disableNotice: function () {
      noticeBlockNode = document.querySelector('.notice');
      adFormNode = noticeBlockNode.querySelector('.ad-form');
      adFormHeaderNode = adFormNode.querySelector('.ad-form-header');
      adFormElementNode = adFormNode.querySelectorAll('.ad-form__element');

      adFormHeaderNode.disabled = true;

      for (var i = 0; i < adFormElementNode.length; i++) {
        adFormElementNode[i].disabled = true;
      }
    },

    enableNotice: function () {

      adFormNode.classList.remove('ad-form--disabled');
      adFormHeaderNode.disabled = false;

      for (var i = 0; i < adFormElementNode.length; i++) {
        adFormElementNode[i].disabled = false;
      }
    },

    generateNoticeAdress: function () {
      adFormAdressNode = document.querySelector('input[name="address"]');
      adFormAdressNode.value = getMainPinCoords();
      adFormAdressNode.textContent = getMainPinCoords();
      adFormAdressNode.readOnly = true;
    },

    addEventListenersForForm: function () {
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
    }
  };

})();
