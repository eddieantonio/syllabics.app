/*!
 * Copyright (C) 2018 Eddie Antonio Santos <easantos@ualberta.ca>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
