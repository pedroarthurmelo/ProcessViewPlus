// Seleciona o elemento com a classe 'wrapper' que envolve o formulário de login
const wrapper = document.querySelector('.wrapper');

// Seleciona o botão de popup de login
const btnPopup = document.querySelector('.btnLogin-popup');

// Seleciona o ícone de fechar o formulário
const iconClose = document.querySelector('.icon-close');

// Seleciona o formulário de login
const loginForm = document.querySelector('.form-box.login form');

// Quando o botão de popup de login é clicado, ele abre o formulário de login
btnPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
});

// Quando o ícone de fechar é clicado, ele fecha o popup de login
iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
});

// Adiciona um evento de envio ao formulário de login
loginForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Obtém os valores de login e senha digitados pelo usuário
    const loginInput = loginForm.querySelector('input[type="mail"]').value;
    const passwordInput = loginForm.querySelector('input[type="password"]').value;

    // Cria um objeto com os dados do login
    const loginData = {
        login: loginInput,
        senha: passwordInput
    };

    // Faz a requisição AJAX para verificar o login
    fetch('../php/0.01_login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Armazena o nome do usuário na sessionStorage
            sessionStorage.setItem('nome_completo', data.nome_completo);
            window.alert('Login realizado com sucesso!');
            // Redireciona para a página inicial
            window.location.href = '15_inicio.html';
        } else {
            window.alert('Login ou senha incorretos!');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        window.alert('Erro na conexão com o servidor!');
    });
});


// Atualizar o horário
function updateCurrentTime() {
    const currentTimeElement = document.getElementById('current-time');
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    currentTimeElement.textContent = `Horário: ${hours}:${minutes}`;
}

// Obter o clima com base na cidade
async function fetchWeather(city = 'Curitiba') {
    const weatherElement = document.getElementById('weather-info');
    const apiKey = '54e34b086b857489828a1e446a5329cc'; // Substitua pela sua chave da OpenWeatherMap
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
        const response = await fetch(apiURL);
        if (!response.ok) throw new Error('Erro ao buscar dados do clima');
        const weatherData = await response.json();
        const temperature = weatherData.main.temp.toFixed(1);
        const description = weatherData.weather[0].description;
        weatherElement.textContent = `Clima: ${description}, ${temperature}°C`;
    } catch (error) {
        weatherElement.textContent = 'Erro ao carregar o clima';
        console.error(error);
    }
}

// Atualizar o horário a cada minuto
setInterval(updateCurrentTime, 2000);
updateCurrentTime(); // Atualizar imediatamente

// Configurar evento para o botão de busca de clima
document.getElementById('fetch-weather-btn').addEventListener('click', () => {
    const cityInput = document.getElementById('city-input').value.trim();
    if (cityInput) {
        fetchWeather(cityInput);
    } else {
        alert('Por favor, insira o nome de uma cidade.');
    }
});

// Buscar clima inicial para a cidade padrão
fetchWeather();
