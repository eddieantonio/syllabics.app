/**
 * Test double-typing to insert long vowels.
 */
describe('Double typing for long vowels', function () {
  it('should work by typing the same vowel twice', function () {
    cy.visit('/');

    cy.get('textarea#sro')
      .clear()
      .type("eetii niiya, ekwa oohoo niciihkeyimaaw");

    cy.get('textarea#sro')
      .invoke('val')
      .should('equal', 'ᐁᑏ ᓃᔭ, ᐁᑿ ᐆᐦᐆ ᓂᒌᐦᑫᔨᒫᐤ')
  });

  it.skip('should not affect pasted text');
  it.skip('can be disabled');
});
