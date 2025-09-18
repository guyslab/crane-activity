class DatePicker extends HTMLElement {
    constructor() {
        super();
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
            <input type="date" value="${new Date().toISOString().split('T')[0]}">
        `;
        
        this.querySelector('input').addEventListener('change', (e) => {
            this.dispatchEvent(new CustomEvent('datechange', { 
                detail: { date: e.target.value } 
            }));
        });
    }
}

customElements.define('date-picker', DatePicker);