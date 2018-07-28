var ws = new WebSocket(
  'ws://' + document.domain + ':' + location.port + '/ws'
);

document.addEventListener('DOMContentLoaded', function () {
  var sroBox = document.getElementById('sro');
  var sylBox = document.getElementById('syl');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);
    updateBoxes(data);
  };

  sroBox.addEventListener('input', function (event) {
    send({sro: event.target.value});
  });

  sylBox.addEventListener('input', function (event) {
    send({syl: event.target.value});
  });

  function updateBoxes(data) {
    if (data.sro)
      sroBox.value = data.sro;
    if (data.syl)
      sylBox.value = data.syl;
  }

  function send(message) {
    ws.send(JSON.stringify(message));
  }
});
