// chartOptions.js
export const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: 'top',
            labels: {
                font: {
                    size: 14,
                    family: 'Arial, sans-serif',
                },
            },
        },
        tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            titleFont: {
                size: 14,
                family: 'Arial, sans-serif',
                weight: 'bold',
            },
            bodyFont: {
                size: 12,
            },
            callbacks: {
                label: function (context) {
                    return `Total: ${context.raw}`;
                },
            },
        },
    },
    scales: {
        x: {
            grid: {
                display: false,
            },
            ticks: {
                font: {
                    size: 12,
                },
            },
        },
        y: {
            grid: {
                color: 'rgba(200, 200, 200, 0.2)',
            },
            ticks: {
                font: {
                    size: 12,
                },
                callback: function (value) {
                    return `${value}`;
                },
            },
        },
    },
};
