describe('Cadastro de Prato', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/pratos/novo');
    });

    it('Criar novo prato', () => {
        cy.get('#nome').type('Salmão Grelhado E2E');
        cy.get('#preco').type('65.90');
        cy.get('.btn-submit').click();
        cy.get('#message').should('contain', 'Prato criado com sucesso!');
    });

});
