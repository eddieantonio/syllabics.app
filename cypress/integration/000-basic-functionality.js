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
      .type('ᑲᐦᑭᔭᐤ ᑮᑿᕀ ᐚᐦᑰᐦᑐᐘᐠ᙮');

    cy.get('textarea#sro')
      .invoke('val')
      .should('equal', 'kahkiyaw kîkway wâhkôhtowak.');
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
      .type('ᑲᐦᑭᔭᐤ ᑮᑿᕀ ᐚᐦᑰᐦᑐᐘᐠ᙮');

    cy.get('textarea#sro')
      .invoke('val')
      .should('equal', 'kahkiyaw kîkway wâhkôhtowak.');
  });

  describe("hk finals", function () {
    const sroInput = "Maskwaciisihk";

    it('supports ᕽ-style finals', function () {
      cy.visit('/');

      // Enable the ᕽ setting
      cy.get('[data-cy="settings-drop-down"]')
        .click();
      cy.get('[data-cy="option-final-x"]')
        .should("be.visible")
        .click();

      cy.get('textarea#sro')
        .clear()
        .type(sroInput);

      cy.get('textarea#syl')
        .invoke('val')
        .should('not.equal', 'ᒪᐢᑿᒌᓯᐦᐠ')
        .should('equal', 'ᒪᐢᑿᒌᓯᕽ');
    });

    it('supports ᐦᐠ-style finals', function () {
      cy.visit('/');

      // Enable the ᕽ setting
      cy.get('[data-cy="settings-drop-down"]')
        .click();
      cy.get('[data-cy="option-final-hk"]')
        .should("be.visible")
        .click();

      cy.get('textarea#sro')
        .clear()
        .type(sroInput);

      cy.get('textarea#syl')
        .invoke('val')
        .should('not.equal', 'ᒪᐢᑿᒌᓯᕽ')
        .should('equal', 'ᒪᐢᑿᒌᓯᐦᐠ');
    });
  });
});
