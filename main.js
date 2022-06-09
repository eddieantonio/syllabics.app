/*!
 * Copyright (C) 2018–2022 Eddie Antonio Santos <hello@eddieantonio.ca>
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

////////////////////////////////// Imports ///////////////////////////////////
const CreeSROSyllabics = require('cree-sro-syllabics');


///////////////////////////////// Exports //////////////////////////////////

/**
 * The current version of the cree-sro-syllabics library.
 * This is displayed in the footer, for reference.
 */
window.CREE_SRO_SYLLABICS_VERSION = CreeSROSyllabics.version.toString();

/**
 * Parses the URL fragment (part after #) to populate the value of the
 * textarea.
 */
window.updateNamedTextareaUsingFragment = updateNamedTextareaUsingFragment;


//////////////////////////////////// Main ////////////////////////////////////

document.addEventListener('DOMContentLoaded', initializeApplication);

/**
 * Initializes the application once all elements on the page are loaded.
 */
function initializeApplication() {
  // Elements on the page.
  const sroBox = document.getElementById('sro');
  const sylBox = document.getElementById('syl');
  const doubledVowelCheckbox = document.getElementsByName('double-vowels')[0];
  const macronButtons = document.getElementsByName('macrons');
  const hkFinalButtons = document.getElementsByName('final-hk');
  const clearButton = document.getElementsByName('clear')[0];
  const settingsBox = document.getElementById('settings');

  // Keeps the previous value of the textbox. Used for checking if a vowel was
  // typed twice.
  var previousSROText;

  setupPage();
  registerEventHandlers();

  /**
   * Registers all event handlers required by the application.
   */
  function registerEventHandlers() {
    // Add a long vowel when double-pressing a vowel.
    sroBox.addEventListener('input', handleKeypressInSROBox);

    // Send the appropriate request when the user types or pastes into the SRO
    // or syllabics boxes, respectively.
    sroBox.addEventListener('input', sendSROFromEvent);
    sylBox.addEventListener('input', sendSyllabicsFromEvent);

    // Recompute the SRO when the macron/circumflex switch is clicked
    for (var i = 0; i < macronButtons.length; i++) {
      macronButtons[i].addEventListener('input', sendSyllabicsFromEvent);
    }

    // Recompute the syllabics when the final HK is toggled
    for (var i = 0; i < hkFinalButtons.length; i++) {
      hkFinalButtons[i].addEventListener('input', sendSROFromEvent);
    }

    // Clear textboxes when the appropriate button is clicked
    clearButton.addEventListener('click', function () {
      sroBox.value = ''
      sylBox.value = ''
    })

    // Change the textareas and do conversions when the /#!hash changes.
    window.onhashchange = handleHashChange;
  }

  function setupPage() {
    // There might be text in the #!fragment that needs to be converted.
    // Do that first!
    updateTextareasUsingFragment();
    previousSROText = sroBox.value;
  }

  /**
   * Special handling for keypresses in the SRO box.
   *
   * Handles double-pressing vowels such that ii -> î.
   */
  function handleKeypressInSROBox(event) {
    var newSROText = sroBox.value;
    var differentAt;
    var addedChar;
    var commonPrefix;
    var newString;

    // Obey settings on whether it should change.
    if (!doubledVowelCheckbox.checked) {
      // Let the default happen.
      return;
    }

    // Check if exactly one character has been ADDED.
    // Only then can we check whether we want a long vowel.
    if (newSROText.length === previousSROText.length + 1) {
      differentAt = whereDiffer(previousSROText, newSROText);
      console.assert(newSROText.substr(0, differentAt) ===
                     previousSROText.substr(0, differentAt));
      commonPrefix = previousSROText.substr(0, differentAt);
      addedChar = newSROText[differentAt];

      // Check if a vowel has been doubled.
      if (isSROShortVowel(addedChar) && lastCharOf(commonPrefix) === addedChar) {
        // Pretend we never typed the second vowel; instead, add the long
        // vowel to the buffer.
        event.preventDefault();
        // Construct new string by chopping off the short vowel from the
        // common prefix, and chopping off the end of the previous buffer.
        newString = commonPrefix.substr(0, commonPrefix.length - 1)
          + longVowelOf(addedChar)
          + previousSROText.substr(differentAt);
        previousSROText = event.target.value = newString;
        return;
      }
    }

    previousSROText = newSROText;
  }

  /**
   * Does any tasks when the fragment/hash changes in the document.
   */
  function handleHashChange() {
    // Ensure the settings box if navigated to.
    if (location.hash === '#settings') {
      settingsBox.open = true;
    }

    // Do any text conversions in the fragment.
    updateTextareasUsingFragment();
  }

  /**
   * Updates whichever textbox needs updating.
   */
  function updateBoxes(data) {
    if (data.sro)
      sroBox.value = data.sro;
    if (data.syl)
      sylBox.value = data.syl;
  }

  /**
   * Checks the fragment (part after # in the URL) for text to convert.
   */
  function updateTextareasUsingFragment() {
    var pairs = parseFragment();

    updateBoxes(pairs);
    if ('sro' in pairs) {
      sendSRO();
    } else if ('syl' in pairs) {
      sendSyllabics();
    }
  }

  /**
   * Returns whether the conversion should produce macrons.
   */
  function shouldProduceMacrons() {
    var button = document.querySelector('input[name="macrons"]:checked');
    return button.value == 'true';
  }

  /**
   * @returns {'x' | 'hk'} which style of hk ending to use in conversions.
   */
  function getHKStyle() {
    var button = document.querySelector('input[name="final-hk"]:checked');
    var value = button.value
    console.assert(value === "x" || value === "hk", "unexpected value: " + value);
    return value;
  }

  /**
   * Convert SRO to syllabics and show conversion.
   */
  function sendSRO() {
    send({
      syl: CreeSROSyllabics.sro2syllabics(sroBox.value, {
        finalHK: getHKStyle()
      })
    });
  }

  /**
   * Convert syllabics to SRO and show conversion.
   */
  function sendSyllabics() {
    var sro = CreeSROSyllabics.syllabics2sro(sylBox.value, {
      longAccents: shouldProduceMacrons() ? 'macrons'  : 'circumflexes'
    });
    send({ sro: sro });
  }

  /**
   * Perform a conversion.
   */
  function send(message) {
    updateBoxes(message);
  }

  /**
   * Return the long version of a short vowel.
   */
  function longVowelOf(vowel) {
    const latinVowels = 'eioa';

    let index = latinVowels.indexOf(vowel);
    if (index < 0) {
      throw new RangeError('Invalid long vowel: ' + vowel);
    }

    // TODO: refactor: replace conditional with polymorphism
    let accentedVowels = shouldProduceMacrons()
      ? 'ēīōā'
      : 'êîôâ';
    return accentedVowels[index];
  }

  /**
   * Event hanlders that ignores the event
   */
  function sendSROFromEvent(/* ignored: event */) {
    sendSRO();
  }

  /**
   * Event hanlders that ignores the event
   */
  function sendSyllabicsFromEvent(/* ignored: event */) {
    sendSyllabics();
  }
};

/**
 * Parses the fragment and sets the named textarea's contents
 * appropriately.
 */
function updateNamedTextareaUsingFragment(name) {
  // no-op: this functionality is now done in setupPage();

  // TODO: delete this function
};

///////////////////////////// Utility functions //////////////////////////////

/**
 * Parse the current URL's fragment (part after hashtag) for key/value parameters.
 *
 * Syntax:
 *
 *  /#!key1:value;key2:value;...
 *
 *  - Parameters are specified after the first '!' in the fragment.
 *  - Parameters are separated by ';'.
 *  - Keys are followed by ':', then the value.
 *
 * Returns an object of the key/value pairs. If a key is specified more than
 * once, the last value is used.
 */
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

/**
 * Returns the last character (actually, UTF-16 code unit 🙄) of a string.
 */
function lastCharOf(string) {
  return string[string.length - 1];
}

/**
 * Returns the index of the first position that two strings differ.
 */
function whereDiffer(prev, current) {
  var i;
  for (i = 0; i < prev.length; i++) {
    if (prev[i] !== current[i]) {
      return i;
    }
  }
  // They must differ at the last position!
  return i;
}

/**
 * (for the purposes of conversion) can we ignore this key event?
 */
function isIgnorableKey(event) {
  // if event.key is missing...?
  // OR if event.key is something like "Space", "Meta", or something like
  // "ArrowRight", instead of a single character.
  return !event.key || event.key.length > 1;
}

/**
 * Return true if the letter is a short vowel that can have a long accent.
 */
function isSROShortVowel(letter) {
  return letter === 'e' || letter === 'i' || letter === 'o' || letter === 'a';
}
