'use strict';

(function () {

  var ERROR_BLOCK_COLOR = '#000';
  var ERROR_BLOCK_WIDTH = 400;
  var ERROR_BLOCK_HEIGHT = 150;
  var ERROR_TEXT_COLOR = '#fff';
  var ERROR_TEXT_X = 20;
  var ERROR_TEXT_Y = 80;


  var canvas = document.querySelector('canvas');

  var closeErrorMessageOnEsc = function (evt) {
    window.utiles.performActionIfEscEvent(evt, function () {
      canvas.classList.add('hidden');
      document.removeEventListener('keydown', closeErrorMessageOnEsc);
    });
  };

  var renderErrorMessageBlock = function (ctx, x, y) {
    ctx.fillStyle = ERROR_BLOCK_COLOR;
    ctx.fillRect(x, y, ERROR_BLOCK_WIDTH, ERROR_BLOCK_HEIGHT);
    canvas.classList.remove('hidden');
    canvas.style = 'position: absolute; top: 1000px; left: 40%';
  };

  var renderErrorText = function (ctx, message) {
    ctx.font = '16px PT Mono';
    ctx.fillStyle = ERROR_TEXT_COLOR;
    ctx.fillText(message, ERROR_TEXT_X, ERROR_TEXT_Y);
  };

  var renderErrorMessage = function (message) {
    var ctx = canvas.getContext('2d');
    renderErrorMessageBlock(ctx, 0, 0);
    renderErrorText(ctx, message);
    document.addEventListener('keydown', closeErrorMessageOnEsc);
  };

  window.backend = {
    onError: function (message) {
      renderErrorMessage(message);
    },

    upload: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        var error;
        switch (xhr.status) {
          case 200:
            onLoad(xhr.response);
            break;
          case 400:
            error = 'Неверный запрос';
            break;
          case 404:
            error = 'Ничего не найдено';
            break;
          case 500:
            error = 'Ошибка при подключении к серверу';
            break;

          default:
            error = 'Cтатус ответа: : ' + xhr.status + ' ' + xhr.statusText;
        }
        if (error) {
          onError(error);
        }
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.open('POST', 'https://js.dump.academy/keksobookin');
      xhr.send(data);
    },

    load: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.open('GET', 'https://js.dump.academy/keksobooking/data');

      xhr.addEventListener('load', function () {
        var error;
        switch (xhr.status) {
          case 200:
            onLoad(xhr.response);
            break;
          case 400:
            error = 'Неверный запрос';
            break;
          case 404:
            error = 'Ничего не найдено';
            break;
          case 500:
            error = 'Внутренняя ошибка сервера';
            break;

          default:
            error = 'Cтатус ответа: : ' + xhr.status + ' ' + xhr.statusText;
        }
        if (error) {
          onError(error);
        }
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
