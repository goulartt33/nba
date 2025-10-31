// No arquivo public/js/script.js, substitua a função fetchGames por:

async function fetchGames() {
    try {
        document.getElementById('games-loading').style.display = 'block';
        
        // Usa o endpoint atualizado que busca jogos de hoje
        const response = await fetch('/api/games');
        this.games = await response.json();
        
        this.displayGames();
        this.updateQuickStats();
        
        document.getElementById('games-loading').style.display = 'none';
        
    } catch (error) {
        console.error('Erro ao buscar jogos:', error);
        // Fallback para dados mockados
        this.games = [];
        this.displayGames();
        document.getElementById('games-loading').innerHTML = 
            '<p class="text-warning">Usando dados de exemplo</p>';
    }
}