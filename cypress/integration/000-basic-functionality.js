describe('Basic functionality', function () {
  const NNBSP = '\u202f';

  it('transcribes SRO to syllabics', function () {
    cy.visit('/');

    cy.get('textarea#sro')
      .clear()
      .type("tapwe, miyo-kîsikâw anohc.");

    cy.get('textarea#syl')
      .invoke('val')
      .should('equal', `ᑕᐻ, ᒥᔪ${NNBSP}ᑮᓯᑳᐤ ᐊᓄᐦᐨ᙮`);
  });

  it('transcribes syllabics to SRO', function () {
    cy.visit('/');

    cy.get('textarea#syl')
      .clear()
      .type('ᑲᐦᑭᔭᐤ ᑮᑿᕀ ᐚᐦᑰᐦᑐᐏᐣ᙮');

    cy.get('textarea#sro')
      .invoke('val')
      .should('equal', 'kahkiyaw kîkway wâhkôhtowin.');
  });

  it('allows for SRO transcription without clearing the textarea', function () {
    cy.visit('/');

    cy.get('textarea#sro')
      .click()
      .type("tapwe, miyo-kîsikâw anohc.");

    cy.get('textarea#syl')
      .invoke('val')
      .should('equal', `ᑕᐻ, ᒥᔪ${NNBSP}ᑮᓯᑳᐤ ᐊᓄᐦᐨ᙮`);
  });

  it('allows for syllabics transcription without clearing the textarea', function () {
    cy.visit('/');

    cy.get('textarea#syl')
      .clear()
      .type('ᑲᐦᑭᔭᐤ ᑮᑿᕀ ᐚᐦᑰᐦᑐᐏᐣ᙮');

    cy.get('textarea#sro')
      .invoke('val')
      .should('equal', 'kahkiyaw kîkway wâhkôhtowin.');
  });
});
