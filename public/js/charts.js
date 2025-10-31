// Gerenciador de Gráficos com Dados Reais
class RealChartManager {
    constructor() {
        this.performanceChart = null;
        this.comparisonChart = null;
        this.init();
    }

    init() {
        this.createPerformanceChart();
        this.createComparisonChart();
    }

    createPerformanceChart() {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        this.performanceChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Pontuação', 'Rebotes', 'Assistências', 'Roubos', 'Bloqueios', 'Eficiência'],
                datasets: []
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Performance dos Times',
                        color: '#ffffff'
                    },
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        pointLabels: {
                            color: '#ffffff'
                        },
                        ticks: {
                            color: '#ffffff',
                            backdropColor: 'transparent'
                        }
                    }
                }
            }
        });
    }

    createComparisonChart() {
        const ctx = document.getElementById('comparisonChart').getContext('2d');
        this.comparisonChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Pontos', 'Rebotes', 'Assistências', 'Roubos', 'Bloqueios'],
                datasets: []
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Comparação de Estatísticas',
                        color: '#ffffff'
                    },
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#ffffff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#ffffff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }

    updateRealGameStats(analysis) {
        if (!analysis) return;

        const game = analysis.game;
        const stats = analysis.stats;

        // Atualizar gráfico de radar
        this.performanceChart.data.datasets = [
            {
                label: game.home_team.abbreviation,
                data: [
                    stats.home.points,
                    stats.home.rebounds,
                    stats.home.assists,
                    stats.home.steals || 0,
                    stats.home.blocks || 0,
                    parseFloat(stats.efficiency.home)
                ],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2
            },
            {
                label: game.visitor_team.abbreviation,
                data: [
                    stats.visitor.points,
                    stats.visitor.rebounds,
                    stats.visitor.assists,
                    stats.visitor.steals || 0,
                    stats.visitor.blocks || 0,
                    parseFloat(stats.efficiency.visitor)
                ],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2
            }
        ];
        this.performanceChart.update();

        // Atualizar gráfico de barras
        this.comparisonChart.data.datasets = [
            {
                label: game.home_team.abbreviation,
                data: [
                    stats.home.points,
                    stats.home.rebounds,
                    stats.home.assists,
                    stats.home.steals || 0,
                    stats.home.blocks || 0
                ],
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
            {
                label: game.visitor_team.abbreviation,
                data: [
                    stats.visitor.points,
                    stats.visitor.rebounds,
                    stats.visitor.assists,
                    stats.visitor.steals || 0,
                    stats.visitor.blocks || 0
                ],
                backgroundColor: 'rgba(255, 99, 132, 0.8)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ];
        this.comparisonChart.update();
    }
}

// Inicializar gerenciador de gráficos
let chartManager;
document.addEventListener('DOMContentLoaded', function() {
    chartManager = new RealChartManager();
});
