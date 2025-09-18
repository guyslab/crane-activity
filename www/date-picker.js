class DatePicker extends HTMLElement {
    constructor() {
        super();
        this.availableDates = [];
        this.render();
    }
    
    async connectedCallback() {
        await this.loadAvailableDates();
    }
    
    async loadAvailableDates() {
        try {
            this.availableDates = await dateService.getAvailableDates();
            this.updateDateBounds();
        } catch (error) {
            console.error('Failed to load available dates:', error);
        }
    }
    
    updateDateBounds() {
        const input = this.querySelector('input');
        if (this.availableDates.length > 0) {
            input.min = this.availableDates[0];
            input.max = this.availableDates[this.availableDates.length - 1];
        }
    }
    
    render() {
        this.innerHTML = `
            <style>
                input[type="date"] {
                    background-color: #333;
                    color: #ccc;
                    border: 1px solid #666;
                    padding: 0.5rem;
                    border-radius: 4px;
                    font-size: 1rem;
                }
            </style>
            <input type="date">
        `;
        
        this.querySelector('input').addEventListener('change', (e) => {
            this.dispatchEvent(new CustomEvent('datechange', { 
                detail: { date: e.target.value } 
            }));
        });
    }
}

customElements.define('date-picker', DatePicker);