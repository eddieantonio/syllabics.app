var ws = new WebSocket(
  'ws://' + document.domain + ':' + location.port + '/ws'
);

document.addEventListener('DOMContentLoaded', function () {
  var sroBox = document.getElementById('sro');
  var sylBox = document.getElementById('syl');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);
    if (data.sro) {
      sroBox.innerText = data.sro;
    }
    if (data.syl) {
      sylBox.innerText = data.syl;
    }
  };

  ws.onopen = function() {
    ws.send(JSON.stringify({sro: 'maskekosihk trail'}));
    ws.send(JSON.stringify({syl: '→ ᒪᐢᑫᑯᓯᕽ  ᑎᕒᐁᕀᓬ'}));
  };
});
