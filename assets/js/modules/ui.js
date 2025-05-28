// UI Controller module
export class UIController {
    constructor() {
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.result = document.getElementById('result');
        this.container = document.querySelector('.container');
        
        this.initializeUI();
    }

    initializeUI() {
        // Set initial button states
        this.updateCameraState(false);
        
        // Add loading indicators
        this.createLoadingIndicator();
    }

    createLoadingIndicator() {
        const loadingHTML = `
            <div id="loadingIndicator" class="notification is-info is-light" style="display: none;">
                <button class="delete" aria-label="close"></button>
                <span class="icon">
                    <i class="fas fa-spinner fa-spin"></i>
                </span>
                Iniciando cámara...
            </div>
        `;
        
        this.container.insertAdjacentHTML('afterbegin', loadingHTML);
        this.loadingIndicator = document.getElementById('loadingIndicator');
        
        // Add close functionality to loading indicator
        this.loadingIndicator.querySelector('.delete').addEventListener('click', () => {
            this.hideLoading();
        });
    }

    updateCameraState(isActive) {
        this.startBtn.disabled = isActive;
        this.stopBtn.disabled = !isActive;
        
        // Update button text and styles
        if (isActive) {
            this.startBtn.classList.add('is-loading');
            this.stopBtn.classList.remove('is-loading');
        } else {
            this.startBtn.classList.remove('is-loading');
            this.stopBtn.classList.add('is-loading');
        }
    }

    setLoadingState(isLoading) {
        if (isLoading) {
            this.showLoading();
            this.startBtn.classList.add('is-loading');
        } else {
            this.hideLoading();
            this.startBtn.classList.remove('is-loading');
        }
    }

    showLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'block';
        }
    }

    hideLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'none';
        }
    }

    displayResult(data) {
        this.result.value = data;
        this.result.classList.add('has-background-success-light');
        this.container.classList.add('has-result');
        
        // Show success notification
        this.showNotification('¡Código QR detectado correctamente!', 'success');
        
        // Auto-clear success styling after 5 seconds
        setTimeout(() => {
            this.clearResultHighlight();
        }, 5000);
    }

    clearResult() {
        this.result.value = '';
        this.clearResultHighlight();
    }

    clearResultHighlight() {
        this.result.classList.remove('has-background-success-light', 'has-background-danger-light');
        this.container.classList.remove('has-result');
    }

    displayError(message) {
        this.result.value = message;
        this.result.classList.add('has-background-danger-light');
        
        this.showNotification('Error al procesar', 'danger');
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification.is-floating');
        existingNotifications.forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification is-${type} is-floating`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            min-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;
        
        notification.innerHTML = `
            <button class="delete" aria-label="close"></button>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }
        }, 4000);
        
        // Manual close
        notification.querySelector('.delete').addEventListener('click', () => {
            notification.remove();
        });
    }

    disableStartButton() {
        this.startBtn.disabled = true;
        this.startBtn.textContent = 'Cámara No Disponible';
        this.startBtn.classList.add('is-static');
    }

    // Utility methods
    toggleElementVisibility(element, show) {
        element.style.display = show ? 'block' : 'none';
    }

    addCSSAnimation() {
        if (!document.getElementById('ui-animations')) {
            const style = document.createElement('style');
            style.id = 'ui-animations';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize animations when module loads
document.addEventListener('DOMContentLoaded', () => {
    const ui = new UIController();
    ui.addCSSAnimation();
});