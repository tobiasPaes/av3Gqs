describe('Cadastro de Restaurante', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/restaurantes/novo');
    });

    it('criar novo restaurante', () => {
        cy.get('#nome').type('Restaurante Cypress E2E2');
        cy.get('#tipo_culinaria').type('Mediterrânea');
        cy.get('#classificacao').type('4');
        cy.get('.btn-submit').click();
        cy.get('#message').should('contain', 'Restaurante criado com sucesso!');
    });

});
