// Sistema de API Real - Versão Corrigida
class RealNBAApi {
    constructor() {
        this.baseUrl = window.location.origin;
        this.cache = {
            games: null,
            lastUpdate: null
        };
    }

    async getRealGames() {
        try {
            console.log('🔄 Buscando dados reais da NBA...');
            const response = await fetch('/api/games');
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data || !Array.isArray(data)) {
                throw new Error('Resposta inválida da API');
            }
            
            console.log(`✅ ${data.length} jogos reais carregados`);
            return data;
            
        } catch (error) {
            console.error('❌ Erro ao buscar jogos reais:', error);
            this.showError('Erro ao carregar jogos: ' + error.message);
            return [];
        }
    }

    async getRealGameAnalysis(gameId) {
        try {
            console.log(`🔍 Buscando análise para jogo ${gameId}...`);
            const response = await fetch(`/api/analysis/${gameId}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
            }
            
            const analysis = await response.json();
            
            if (!analysis || !analysis.game) {
                throw new Error('Análise inválida recebida');
            }
            
            console.log('✅ Análise carregada com sucesso');
            return analysis;
            
        } catch (error) {
            console.error('❌ Erro ao buscar análise:', error);
            this.showError('Erro ao gerar análise: ' + error.message);
            return null;
        }
    }

    async sendRealTelegramAnalysis(analysis) {
        try {
            console.log('📤 Enviando análise para Telegram...');
            const response = await fetch('/api/send-telegram', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ analysis })
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Erro ao enviar para Telegram');
            }
            
            if (result.success) {
                this.showSuccess('✅ Análise enviada para o Telegram!');
                return true;
            } else {
                throw new Error(result.error || 'Erro desconhecido');
            }
        } catch (error) {
            console.error('❌ Erro ao enviar para Telegram:', error);
            this.showError('❌ Erro ao enviar para Telegram: ' + error.message);
            return false;
        }
    }

    // Sistema de notificações melhorado
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
        const icon = type === 'success' ? '✅' : '❌';
        
        const alert = document.createElement('div');
        alert.className = `alert ${alertClass} alert-notification alert-dismissible fade show`;
        alert.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            max-width: 400px;
        `;
        alert.innerHTML = `
            <strong>${icon}</strong> ${message}
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
        const icon = type === 'success' ? 'text-success' : type === 'error' ? 'text-danger' : 'text-warning';
        
        const updateItem = document.createElement('div');
        updateItem.className = 'update-item fade-in';
        updateItem.innerHTML = `
            <small class="${icon}">●</small>
            <span>${new Date().toLocaleTimeString('pt-BR')} - ${message}</span>
        `;
        
        updatesContainer.insertBefore(updateItem, updatesContainer.firstChild);
        
        // Keep only last 5 updates
        while (updatesContainer.children.length > 5) {
            updatesContainer.removeChild(updatesContainer.lastChild);
        }
    }

    // Verificar saúde do sistema
    async checkHealth() {
        try {
            const response = await fetch('/health');
            const data = await response.json();
            return data.status === 'online';
        } catch (error) {
            console.error('❌ Health check falhou:', error);
            return false;
        }
    }
}

// Instância global da API real
const realApi = new RealNBAApi();
