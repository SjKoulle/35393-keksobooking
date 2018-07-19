'use strict';

(function () {

  var PIN_MAIN_WIDTH = 65;
  var PIN_MAIN_HEIGHT = 87;
  var PIN_MAIN_INITIAL_X = 570;
  var PIN_MAIN_INITIAL_Y = 375;

  var noticeBlockNode = document.querySelector('.notice');
  var noticePriceNode = noticeBlockNode.querySelector('input[name="price"]');
  var noticeTypeNode = noticeBlockNode.querySelector('select[name="type"]');
  var noticeTimeInNode = noticeBlockNode.querySelector('select[name="timein"]');
  var noticeTimeOutNode = noticeBlockNode.querySelector('select[name="timeout"]');
  var noticeRoomsNode = noticeBlockNode.querySelector('select[name="rooms"]');
  var noticeCapacityNode = noticeBlockNode.querySelector('select[name="capacity"]');
  var adFormNode = noticeBlockNode.querySelector('.ad-form');
  var adFormHeaderNode = adFormNode.querySelector('.ad-form-header');
  var adFormElementNode = adFormNode.querySelectorAll('.ad-form__element');
  var adFormAdressNode = document.querySelector('input[name="address"]');
  var noticeButtonSubmitNode = noticeBlockNode.querySelector('.ad-form__submit');
  var noticeInputElementsNode = noticeBlockNode.querySelectorAll('input');
  var mainPinNode = document.querySelector('.map__pin--main');
  var noticeResetButtonNode = noticeBlockNode.querySelector('.ad-form__reset');
  var successMessageNode = document.querySelector('.success');
  var mainPinX;
  var mainPinY;

  var getMainPinCoords = function () {
    var mainPinLeft = parseInt(mainPinNode.style.left.replace(/[p, x]/, ''), 10);
    var mainPinRight = parseInt(mainPinNode.style.top.replace(/[p, x]/, ''), 10);

    var coords = {
      left: mainPinLeft + (PIN_MAIN_WIDTH / 2),
      top: mainPinRight + PIN_MAIN_HEIGHT
    };

    mainPinX = coords.left;
    mainPinY = coords.top;

    return Math.floor(mainPinX) + ', ' + Math.floor(mainPinY);
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

  var closeSuccessMessageOnEsc = function (evt) {
    window.utiles.performActionIfEscEvent(evt, function () {
      successMessageNode.classList.add('hidden');
      document.removeEventListener('keydown', closeSuccessMessageOnEsc);
    });
  };

  var onSuccessLoad = function () {
    adFormNode.reset();
    window.formUtiles.resetNoticeAdress();
    successMessageNode.classList.remove('hidden');
    document.addEventListener('keydown', closeSuccessMessageOnEsc);
  };

  window.formUtiles = {
    disableNotice: function () {

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
      adFormAdressNode.value = getMainPinCoords();
      adFormAdressNode.textContent = getMainPinCoords();
      adFormAdressNode.readOnly = true;
    },

    resetNoticeAdress: function () {
      mainPinNode.style.left = PIN_MAIN_INITIAL_X + 'px';
      mainPinNode.style.top = PIN_MAIN_INITIAL_Y + 'px';
      window.formUtiles.generateNoticeAdress();
    },

    addEventListenersForForm: function () {
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

      noticeResetButtonNode.addEventListener('click', function () {
        window.formUtiles.resetNoticeAdress();
      });

      adFormNode.addEventListener('submit', function (evt) {
        window.backend.upload(new FormData(adFormNode), onSuccessLoad, window.backend.onError);

        evt.preventDefault();
      });
    }
  };

})();
