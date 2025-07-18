document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('pratoForm');
    const messageElement = document.getElementById('message');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        data.preco = parseFloat(data.preco);

        if (!data.nome || !data.preco) {
            messageElement.textContent = 'Por favor, preencha todos os campos obrigatórios.';
            messageElement.style.color = 'red';
            return;
        }
        if (isNaN(data.preco) || data.preco <= 0) {
            messageElement.textContent = 'O preço deve ser um número positivo.';
            messageElement.style.color = 'red';
            return;
        }

        try {
            const response = await fetch('/api/pratos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                messageElement.textContent = result.message + ' ID: ' + result.prato.id;
                messageElement.style.color = 'green';
                form.reset();
            } else {
                messageElement.textContent = 'Erro: ' + (result.error || 'Erro desconhecido ao cadastrar.');
                messageElement.style.color = 'red';
            }
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            messageElement.textContent = 'Erro ao conectar com o servidor. Verifique sua conexão ou o console para mais detalhes.';
            messageElement.style.color = 'red';
        }
    });
});