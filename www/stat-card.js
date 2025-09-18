class StatCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback() {
        const label = this.getAttribute('label') || '';
        const value = this.getAttribute('value') || '';
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    aspect-ratio: 2;
                    border: 1px solid #444;
                    border-radius: 2px;
                    background-color: #222;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 1rem;
                    position: relative;
                }
                .value {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #fff;
                    text-align: center;
                }
                .label {
                    position: absolute;
                    bottom: 0.1rem;
                    font-size: 0.8rem;
                    color: #999;
                    text-align: center;
                }
            </style>
            <div class="value">${value}</div>
            <div class="label">${label}</div>
        `;
    }
}

customElements.define('stat-card', StatCard);