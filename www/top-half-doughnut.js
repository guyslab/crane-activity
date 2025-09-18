class TopHalfDoughnut extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.chart = null;
    }
    
    connectedCallback() {
        const title = this.getAttribute('title') || '';
        const threshold = parseFloat(this.getAttribute('threshold')) || 0;
        const value = parseFloat(this.getAttribute('value')) || 0;
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    text-align: center;
                    margin: 2rem 0;
                }
                .chart-container {
                    position: relative;
                    width: 300px;
                    height: 200px;
                    margin: 0 auto;
                }
                .title {
                    color: #fff;
                    font-size: 1.2rem;
                    margin-bottom: 1rem;
                }
                .center-value {
                    position: absolute;
                    top: 60%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 2rem;
                    font-weight: bold;
                    color: #fff;
                }
                .threshold-label {
                    position: absolute;
                    top: 30%;
                    right: 10px;
                    font-size: 0.8rem;
                    color: #999;
                }
            </style>
            <div class="title">${title}</div>
            <div class="chart-container">
                <canvas id="chart"></canvas>
                <div class="center-value">${value}%</div>
                <div class="threshold-label">${threshold}%</div>
            </div>
        `;
        
        this.createChart(value, threshold);
    }
    
    createChart(value, threshold) {
        const canvas = this.shadowRoot.getElementById('chart');
        const ctx = canvas.getContext('2d');
        
        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [value, 100 - value],
                    backgroundColor: ['#E9B504', '#ffffff'],
                    borderWidth: 0,
                    circumference: 180,
                    rotation: 270
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                onComplete: () => {
                    this.drawThresholdLine(ctx, threshold);
                }
            }
        });
    }
    
    drawThresholdLine(ctx, threshold) {
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.85;
        const angle = (threshold / 100) * Math.PI - Math.PI;
        
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

customElements.define('top-half-doughnut', TopHalfDoughnut);