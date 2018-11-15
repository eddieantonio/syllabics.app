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
  var CreeSROSyllabics = require('cree-sro-syllabics');
  window.CREE_SRO_SYLLABICS_VERSION = CreeSROSyllabics.version.toString();

  var dirty = null;
  document.addEventListener('DOMContentLoaded', function () {
    var sroBox = document.getElementById('sro');
    var sylBox = document.getElementById('syl');
    var macronButtons = document.getElementsByName('macrons');

    // Convert "dirty" changes soon as the page is loaded.
    if (dirty == 'sro') {
      sendSRO();
    } else if (dirty == 'syl') {
      sendSyllabics();
    }

    // Send the appropriate request when the user types or pastes into the SRO
    // or syllabics boxes, respectively.
    sroBox.addEventListener('input', function () { sendSRO(); });
    sylBox.addEventListener('input', function () { sendSyllabics(); });

    // Send a request when somebody hits the macron/circumflex switch.
    for (var i = 0; i < macronButtons.length; i++) {
      var button = macronButtons[i];
      button.addEventListener('input', function() {
        sendSyllabics();
      });
    }

    // Change the values when the /#!hash changes.
    window.onhashchange = function () {
      var pairs = parseFragment();
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
      var button = document.querySelector('input[name="macrons"]:checked');
      return button.value == 'true';
    }

    function sendSRO() {
      send({ syl: CreeSROSyllabics.sro2syllabics(sroBox.value) });
    }

    function sendSyllabics() {
      var sro = CreeSROSyllabics.syllabics2sro(sylBox.value, {
        longAccents: shouldProduceMacrons() ? 'macrons'  : 'circumflexes'
      });
      send({ sro: sro });
    }

    function send(message) {
      updateBoxes(message);
    }
  });

  window.getDefaultTextareaValue = function (name) {
    var textarea = document.getElementById(name);
    var defaults = {
      sro: "tân'si",
      syl: 'ᑖᓂᓯ'
    };

    if (name != 'sro' && name != 'syl') {
      return;
    }

    var fragment = parseFragment();
    if (fragment[name]) {
      dirty = name;
      textarea.value = fragment[name];
    } else {
      textarea.value = defaults[name];
    }
  };

  function parseFragment() {
    var fragment = location.hash;
    var pairsText = fragment.split('!', 2)[1];
    if (!pairsText) {
      return {};
    }

    var pairs = {};
    pairsText.split(';').forEach(function (pair) {
      var _pair = pair.split(':', 2), key = _pair[0], value = _pair[1];
      pairs[key] = decodeURIComponent(value);
    });

    return pairs;
  }
}());
