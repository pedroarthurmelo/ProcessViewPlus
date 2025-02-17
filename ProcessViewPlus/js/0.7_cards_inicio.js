document.addEventListener('DOMContentLoaded', function() {
    // Fazendo a requisição para o arquivo PHP que retorna os dados
    fetch('../php/0.7_cards_inicio.php')  // Corrigido para o nome correto do arquivo PHP
        .then(response => response.json())
        .then(data => {
            const container = document.querySelector('.card-container');
            
            // Verificando se os dados existem e são retornados corretamente
            if (data.length > 0) {
                data.forEach(item => {
                    const card = document.createElement('div');
                    card.classList.add('card');
                    card.innerHTML = `
                        <h3>${item.ds_Classe}</h3>
                        <div class="value">
                            ${item.value} <span>${item.ds_Sufixo}</span>
                        </div>
                        <div class="last-updated">${item.data_hora}</div>
                    `;
                    container.appendChild(card);
                });
            } else {
                const noDataMessage = document.createElement('div');
                noDataMessage.classList.add('no-data');
                noDataMessage.textContent = 'Nenhum dado disponível.';
                container.appendChild(noDataMessage);
            }
        })
        .catch(error => console.error('Erro ao carregar os dados:', error));
});
