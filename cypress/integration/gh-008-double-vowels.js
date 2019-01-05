/**
 * Test double-typing to insert long vowels.
 */
describe('Double typing for long vowels', function () {
  it('should work by typing the same vowel twice', function () {
    cy.visit('/');

    cy.get('textarea#sro')
      .clear()
    // type double vowels here:
      .type('eetii niiya, eekwa oohoo niciihkeeyimaaw.');

    // it should convert properly
    cy.get('textarea#syl')
      .invoke('val')
      .should('equal', 'ᐁᑏ ᓃᔭ, ᐁᑿ ᐆᐦᐆ ᓂᒌᐦᑫᔨᒫᐤ᙮')

    // ...and the results should be reflected in the original buffer.
    cy.get('textarea#sro')
      .invoke('val')
      .should('contain', 'êtî nîya, êkwa ôhô nicîhkêyimâw.');
  });

  it('should not affect pasted text', function () {
    cy.get('textarea#sro').as('sro');
    var insertedText = 'mitho-ociimi-kiisikanisik';

    // Typing out the text should replace double vowels.
    cy.get('@sro')
      .clear()
      .type(insertedText)
      .invoke('val')
      .should('not.contain', insertedText)
      .and('contains', 'mitho-ocîmi-kîsikanisik');

    // Pretend to paste text into the box:
    cy.get('@sro')
      .clear()
      .invoke('val', insertedText)
      .trigger('input')
    // However, this should NOT change the buffer!
      .invoke('val')
      .should('contain', insertedText);
  });

  it.skip('can be disabled');
});
