// Error handling module
export class ErrorHandler {
    constructor() {
        this.result = document.getElementById('result');
        this.errorMessages = {
            browser: {
                title: "ERROR: Navegador No Compatible",
                message: "Tu navegador no soporta acceso a la cámara.\n\n" +
                        "SOLUCIONES:\n" +
                        "• Usa Chrome, Firefox, Safari o Edge\n" +
                        "• Asegúrate de usar HTTPS\n" +
                        "• Intenta con localhost o 127.0.0.1"
            },
            camera: {
                title: "Error de Cámara",
                solutions: [
                    "Usar HTTPS en lugar de HTTP",
                    "Permitir acceso a la cámara",
                    "Intentar con un navegador diferente",
                    "Verificar que la cámara no esté siendo usada por otra aplicación",
                    "Reiniciar el navegador"
                ]
            },
            network: {
                title: "Error de Conexión",
                message: "No se puede cargar la librería jsQR.\n\n" +
                        "SOLUCIONES:\n" +
                        "• Verificar conexión a internet\n" +
                        "• Recargar la página"
            }
        };
    }

    showBrowserError() {
        const error = this.errorMessages.browser;
        this.displayError(error.title, error.message);
        console.error('Browser compatibility error');
    }

    showCameraError(error) {
        const errorMsg = this.formatCameraError(error);
        this.displayError(this.errorMessages.camera.title, errorMsg);
        console.error('Camera error:', error);
    }

    showNetworkError() {
        const error = this.errorMessages.network;
        this.displayError(error.title, error.message);
        console.error('Network error: jsQR library failed to load');
    }

    formatCameraError(error) {
        let message = `${error.message}\n\nSOLUCIONES:\n`;
        this.errorMessages.camera.solutions.forEach((solution, index) => {
            message += `${index + 1}. ${solution}\n`;
        });
        return message;
    }

    displayError(title, message) {
        const fullMessage = `${title}\n${'='.repeat(title.length)}\n\n${message}`;
        
        if (this.result) {
            this.result.value = fullMessage;
            this.result.classList.add('has-background-danger-light');
        }
        
        // Show visual notification
        this.showErrorNotification(title);
    }

    showErrorNotification(title) {
        // Create error notification element
        const notification = document.createElement('div');
        notification.className = 'notification is-danger';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
            max-width: 90%;
            animation: errorSlideDown 0.5s ease-out;
        `;
        
        notification.innerHTML = `
            <button class="delete" aria-label="cerrar"></button>
            <strong>⚠️ ${title}</strong><br>
            <small>Revisa la información detallada en el área de resultados</small>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 6 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'errorSlideUp 0.5s ease-in';
                setTimeout(() => notification.remove(), 500);
            }
        }, 6000);
        
        // Manual close
        notification.querySelector('.delete').addEventListener('click', () => {
            notification.remove();
        });
        
        this.addErrorAnimations();
    }

    addErrorAnimations() {
        if (!document.getElementById('error-animations')) {
            const style = document.createElement('style');
            style.id = 'error-animations';
            style.textContent = `
                @keyframes errorSlideDown {
                    from { 
                        transform: translateX(-50%) translateY(-100%); 
                        opacity: 0; 
                    }
                    to { 
                        transform: translateX(-50%) translateY(0); 
                        opacity: 1; 
                    }
                }
                @keyframes errorSlideUp {
                    from { 
                        transform: translateX(-50%) translateY(0); 
                        opacity: 1; 
                    }
                    to { 
                        transform: translateX(-50%) translateY(-100%); 
                        opacity: 0; 
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Log errors for debugging
    logError(context, error) {
        const timestamp = new Date().toISOString();
        const errorInfo = {
            timestamp,
            context,
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack
            },
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        console.group(`🚨 Error Log - ${context}`);
        console.error('Error Details:', errorInfo);
        console.groupEnd();
        
        // In a real application, you might want to send this to a logging service
        // this.sendErrorLog(errorInfo);
    }

    // Validate environment
    validateEnvironment() {
        const issues = [];
        
        // Check HTTPS
        if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
            issues.push('La aplicación requiere HTTPS para acceder a la cámara');
        }
        
        // Check jsQR availability
        if (typeof jsQR === 'undefined') {
            issues.push('La librería jsQR no se cargó correctamente');
            this.showNetworkError();
        }
        
        // Check MediaDevices API
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            issues.push('API de MediaDevices no disponible');
        }
        
        if (issues.length > 0) {
            console.warn('Environment issues detected:', issues);
            return false;
        }
        
        return true;
    }
}