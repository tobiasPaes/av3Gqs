Instalação 

    Para configurar e executar o projeto em sua máquina local, siga os passos abaixo:
        1 - Clone o repositório
        2 - Instale as dependências

Como Executar o Projeto

    Inicie o servidor: npm start

    Após iniciar o servidor, você poderá acessar a aplicação e seus formulários nos seguintes endereços:
        Página Inicial: http://localhost:3000/
        Cadastro de Restaurante: http://localhost:3000/restaurantes/novo
        Cadastro de Prato: http://localhost:3000/pratos/novo
    
Como Executar os Testes
    O projeto inclui testes de integração (Jest/Supertest) para a API e testes End-to-End (Cypress) para as views frontend.
        Testes de Integração (Jest/Supertest). Estes testes verificam a lógica do backend, a interação com os modelos e o banco de dados. Eles utilizam um banco de dados SQLite separado (test_database.sqlite) para garantir o isolamento dos testes.
        Execute os testes de integração: npm test
        
        Testes End-to-End (Cypress). Estes testes simulam a interação de um usuário real com a interface da sua aplicação no navegador.
        Inicie o servidor da aplicação (se ainda não estiver rodando) em um terminal separado: npm start

        Abra a interface do Cypress em outro terminal: npx cypress open
        Na interface do Cypress, selecione "E2E Testing" e, em seguida, clique nos arquivos de teste (restaurante_cadastro.cy.js e prato_cadastro.cy.js) que você deseja executar. O Cypress abrirá um navegador e executará os testes, mostrando a automação da interação com seus formulários.