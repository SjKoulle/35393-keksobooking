'use strict';

(function () {

  var RESPONSE_OK = 200;
  var RESPONSE_WRONG = 400;
  var RESPONSE_NOT_FOUND = 404;
  var RESPONSE_SERVER_ERROR = 500;
  var URL_UPLOAD = 'https://js.dump.academy/keksobooking';
  var URL_LOAD = 'https://js.dump.academy/keksobooking/data';
  var TIMER = 5000;
  var errorText;
  var page = document.querySelector('main');

  var closeErrorMessage = function () {
    page.removeChild(errorText);
    document.removeEventListener('keydown', closeErrorMessageOnEsc);
  };

  var closeErrorMessageOnEsc = function (evt) {
    window.utiles.performActionIfEscEvent(evt, closeErrorMessage);
  };

  var getErrorMessage = function (message) {
    errorText = document.createElement('p');

    page.appendChild(errorText);

    errorText.style = 'position: fixed; top: 40%; left: 40%; min-width: 400px; padding: 50px 20px; background-color: rgba(0, 0, 0, 0.8); z-index: 2; font-size: 24px; font-weight: bold; color: #fff;';
    errorText.appendChild(document.createTextNode(message));

    document.addEventListener('keydown', closeErrorMessageOnEsc);
    setTimeout(closeErrorMessage, TIMER);
  };

  var addEventListenerOnLoad = function (xhr, onLoad, onError) {
    var error;
    switch (xhr.status) {
      case RESPONSE_OK:
        onLoad(xhr.response);
        break;
      case RESPONSE_WRONG:
        error = 'Неверный запрос';
        break;
      case RESPONSE_NOT_FOUND:
        error = 'Ничего не найдено';
        break;
      case RESPONSE_SERVER_ERROR:
        error = 'Ошибка при подключении к серверу';
        break;

      default:
        error = 'Cтатус ответа: : ' + xhr.status + ' ' + xhr.statusText;
    }
    if (error) {
      onError(error);
    }
  };

  window.backend = {
    onError: function (message) {
      getErrorMessage(message);
    },

    upload: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        addEventListenerOnLoad(xhr, onLoad, onError);
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.open('POST', URL_UPLOAD);
      xhr.send(data);
    },

    load: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.open('GET', URL_LOAD);

      xhr.addEventListener('load', function () {
        addEventListenerOnLoad(xhr, onLoad, onError);
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.send();
    }
  };

})();
