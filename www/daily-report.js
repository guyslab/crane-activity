class DailyReport extends HTMLElement {
    constructor() {
        super();
        this.reportData = null;
    }
    
    connectedCallback() {
        this.render();
    }
    
    setData(data) {
        this.reportData = data;
        this.render();
    }
    
    render() {
        if (!this.reportData) {
            this.innerHTML = `
                <style>
                    .message {
                        text-align: center;
                        padding: 2rem;
                        color: #666;
                        font-size: 1.1rem;
                    }
                </style>
                <div class="message">Please select a date to view the daily report</div>
            `;
            return;
        }
        
        if (this.reportData.error) {
            this.innerHTML = `
                <style>
                    .message {
                        text-align: center;
                        padding: 2rem;
                        color: #666;
                        font-size: 1.1rem;
                    }
                </style>
                <div class="message">No data available for the selected date</div>
            `;
            return;
        }
        
        this.innerHTML = `
            <style>
                .report {
                    background-color: #111;
                    border: 1px solid #333;
                    border-radius: 8px;
                    padding: 1.5rem;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 1rem;
                    margin-bottom: 2rem;
                }
                .breakdown {
                    margin-top: 2rem;
                }
                .breakdown-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 1rem;
                }
            </style>
            <div class="report">
                <div class="stats-grid">
                    <stat-card label="Start Time" value="${this.reportData.daily_stats.start_time}"></stat-card>
                    <stat-card label="End Time" value="${this.reportData.daily_stats.end_time}"></stat-card>
                    <stat-card label="Working Hours" value="${this.reportData.daily_stats.working_hours}"></stat-card>
                    <stat-card label="Utilized Hours" value="${this.reportData.daily_stats.utilized_hours}"></stat-card>
                </div>
                
                <top-half-doughnut title="Utilization" threshold="80" value="${this.reportData.daily_stats.utilization_percent}"></top-half-doughnut>
                
                <div class="breakdown">
                    <div class="breakdown-grid">
                        <stat-card label="Moving with Load" value="${this.reportData.breakdown.moving_with_load.duration}"></stat-card>
                        <stat-card label="Moving without Load" value="${this.reportData.breakdown.moving_without_load.duration}"></stat-card>
                        <stat-card label="Idle with Load" value="${this.reportData.breakdown.idle_with_load.duration}"></stat-card>
                        <stat-card label="Idle without Load" value="${this.reportData.breakdown.idle_without_load.duration}"></stat-card>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('daily-report', DailyReport);