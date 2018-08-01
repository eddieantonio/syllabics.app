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

(function () {
  var dirty = null;
  var ws = new ReconnectingWebSocket(
    (location.protocol == 'https:' ? 'wss' : 'ws') + '://' +
    document.domain + ':' + location.port + '/ws'
  );

  document.addEventListener('DOMContentLoaded', function () {
    var sroBox = document.getElementById('sro');
    var sylBox = document.getElementById('syl');
    var macronButtons = document.getElementsByName('macrons');

    // Convert "dirty" changes soon as the WebSocket is open.
    ws.onopen = function() {
      if (dirty == 'sro') {
        sendSRO();
      } else if (dirty == 'syl') {
        sendSyllabics();
      }
    };

    ws.onmessage = function (event) {
      var data = JSON.parse(event.data);
      updateBoxes(data);
    };

    // Send the appropriate request when the user types or pastes into the SRO
    // or syllabics boxes, respectively.
    sroBox.addEventListener('input', () => sendSRO());
    sylBox.addEventListener('input', () => sendSyllabics());

    // Don't bother setting this handler if it doesn't exist.
    if (!('onhashchange' in window))
      return;

    // Change the values when the /#!hash changes.
    window.onhashchange = function () {
      let pairs = parseFragment();
      updateBoxes(pairs);
      if ('sro' in pairs) {
        sendSRO();
      } else if ('syl' in pairs) {
        sendSyllabics();
      }
    };

    function updateBoxes(data) {
      if (data.sro)
        sroBox.value = data.sro;
      if (data.syl)
        sylBox.value = data.syl;
    }

    function shouldProduceMacrons() {
      for (let button of macronButtons) {
        if (button.checked && button.value == 'true')
          return true;
      }
      return false;
    }

    function sendSRO() {
      send({sro: sroBox.value});
    }

    function sendSyllabics() {
      send({syl: sylBox.value, macrons: shouldProduceMacrons()});
    }

    function send(message) {
      ws.send(JSON.stringify(message));
    }
  });

  window.getDefaultTextareaValue = function (name) {
    var textarea = document.getElementById(name);
    const defaults = {
      sro: "tân'si",
      syl: 'ᑖᓂᓯ'
    };

    if (name != 'sro' && name != 'syl') {
      return;
    }

    let fragment = parseFragment();
    if (fragment[name]) {
      dirty = name;
      textarea.value = fragment[name];
    } else {
      textarea.value = defaults[name];
    }
  };

  function parseFragment() {
    var fragment = location.hash;
    let [_, pairsText] = fragment.split('!', 2);
    if (!pairsText) {
      return {};
    }

    const pairs = {};
    pairsText.split(';').forEach(pair => {
      let [key, value] = pair.split(':', 2);
      pairs[key] = decodeURIComponent(value);
    });

    return pairs;
  }

}());
/*global ReconnectingWebSocket*/
