/**
 * Test double-typing to insert long vowels.
 */
describe('Double typing for long vowels', function () {
  it('should work by typing the same vowel twice', function () {
    cy.visit('/');

    cy.get('textarea#sro')
      .clear()
      .type('eetii niiya, eekwa oohoo niciihkeeyimaaw.');

    cy.get('textarea#syl')
      .invoke('val')
      .should('equal', 'ᐁᑏ ᓃᔭ, ᐁᑿ ᐆᐦᐆ ᓂᒌᐦᑫᔨᒫᐤ᙮')

    cy.get('textarea#sro')
      .invoke('val')
      .should('contain', 'êtî nîya, êkwa ôhô nicîhkêyimâw.');
  });

  it.skip('should not affect pasted text');
  it.skip('can be disabled');
});
