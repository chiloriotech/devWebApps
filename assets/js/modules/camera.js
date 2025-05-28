// Camera management module
export class CameraManager {
    constructor() {
        this.video = document.getElementById('video');
        this.stream = null;
        this.constraints = {
            video: { 
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };
    }

    async startCamera() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia(this.constraints);
            this.video.srcObject = this.stream;
            
            return new Promise((resolve, reject) => {
                this.video.addEventListener('loadedmetadata', () => {
                    resolve(this.stream);
                }, { once: true });
                
                this.video.addEventListener('error', (e) => {
                    reject(new Error('Video loading failed'));
                }, { once: true });
            });
            
        } catch (error) {
            throw new Error(this.getCameraErrorMessage(error));
        }
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => {
                track.stop();
            });
            this.stream = null;
            this.video.srcObject = null;
        }
    }

    isActive() {
        return this.stream && this.stream.active;
    }

    getCameraErrorMessage(error) {
        switch (error.name) {
            case 'NotAllowedError':
                return 'Acceso a la cámara denegado. Por favor, permite el acceso e intenta de nuevo.';
            case 'NotFoundError':
                return 'No se encontró ninguna cámara en tu dispositivo.';
            case 'NotSupportedError':
                return 'Tu navegador no soporta acceso a la cámara.';
            case 'OverconstrainedError':
                return 'No se puede acceder a la cámara con la configuración solicitada.';
            default:
                return `Error de cámara: ${error.message || 'Error desconocido'}`;
        }
    }

    // Get video element for external use
    getVideoElement() {
        return this.video;
    }

    // Check if video has enough data for processing
    hasEnoughData() {
        return this.video.readyState >= this.video.HAVE_ENOUGH_DATA;
    }
}