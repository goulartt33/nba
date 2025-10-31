// Sistema de API Real - Sem dados simulados
class RealNBAApi {
    constructor() {
        this.baseUrl = '';
        this.cache = {
            games: null,
            teams: null,
            lastUpdate: null
        };
    }

    async getRealGames() {
        try {
            console.log('🔄 Buscando dados reais da NBA...');
            const response = await fetch('/api/games');
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            const games = await response.json();
            console.log(`✅ ${games.length} jogos reais carregados`);
            return games;
            
        } catch (error) {
            console.error('❌ Erro ao buscar jogos reais:', error);
            this.showError('Erro ao conectar com a API NBA. Tente novamente.');
            return [];
        }
    }

    async getRealTeams() {
        try {
            const response = await fetch('/api/teams');
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar times:', error);
            return [];
        }
    }

    async getRealGameAnalysis(gameId) {
        try {
            const response = await fetch(`/api/analysis/${gameId}`);
            
            if (!response.ok) {
                throw new Error(`Erro na análise: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar análise:', error);
            this.showError('Erro ao gerar análise para este jogo.');
            return null;
        }
    }

    async sendRealTelegramAnalysis(analysis) {
        try {
            const response = await fetch('/api/send-telegram', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ analysis })
            });

            const result = await response.json();
            
            if (result.success) {
                this.showSuccess('Análise enviada para o Telegram!');
                return true;
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Erro ao enviar para Telegram:', error);
            this.showError('Erro ao enviar para Telegram: ' + error.message);
            return false;
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type) {
        // Remove existing notifications
        const existingAlert = document.querySelector('.alert-notification');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
        const alert = document.createElement('div');
        alert.className = `alert ${alertClass} alert-notification alert-dismissible fade show`;
        alert.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
        `;
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alert);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }

    updateSystemStatus(status, message) {
        const statusElement = document.getElementById('system-status');
        const apiStatusElement = document.getElementById('api-status');
        
        if (status === 'online') {
            statusElement.textContent = message;
            apiStatusElement.className = 'badge bg-success';
            apiStatusElement.textContent = 'API Online';
        } else {
            statusElement.textContent = message;
            apiStatusElement.className = 'badge bg-danger';
            apiStatusElement.textContent = 'API Offline';
        }
    }

    addUpdate(message, type = 'info') {
        const updatesContainer = document.getElementById('updates-container');
        const icon = type === 'success' ? 'text-success' : 'text-warning';
        
        const updateItem = document.createElement('div');
        updateItem.className = 'update-item fade-in';
        updateItem.innerHTML = `
            <small class="${icon}">●</small>
            <span>${message}</span>
        `;
        
        updatesContainer.insertBefore(updateItem, updatesContainer.firstChild);
        
        // Keep only last 5 updates
        while (updatesContainer.children.length > 5) {
            updatesContainer.removeChild(updatesContainer.lastChild);
        }
    }
}

// Instância global da API real
const realApi = new RealNBAApi();
