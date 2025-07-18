document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('restauranteForm');
    const messageElement = document.getElementById('message');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede o recarregamento padrão da página

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (data.classificacao) {
            data.classificacao = parseInt(data.classificacao);
        }

        try {
            const response = await fetch('/api/restaurantes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                messageElement.textContent = result.message + ' ID: ' + result.restaurante.id;
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