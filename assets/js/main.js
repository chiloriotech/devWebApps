// Main application entry point
import { CameraManager } from './modules/camera.js';
import { QRScanner } from './modules/qrScanner.js';
import { UIController } from './modules/ui.js';
import { ErrorHandler } from './modules/errorHandler.js';

class CIFValidator {
    constructor() {
        this.cameraManager = new CameraManager();
        this.qrScanner = new QRScanner();
        this.uiController = new UIController();
        this.errorHandler = new ErrorHandler();
        
        this.init();
    }

    init() {
        // Check browser compatibility
        if (!this.checkCompatibility()) {
            return;
        }

        // Set up event listeners
        this.setupEventListeners();
        
        console.log('CIF Validator initialized successfully');
    }

    checkCompatibility() {
        if (!navigator.mediaDevices) {
            this.errorHandler.showBrowserError();
            this.uiController.disableStartButton();
            return false;
        }
        return true;
    }

    setupEventListeners() {
        // Start camera button
        this.uiController.startBtn.addEventListener('click', async () => {
            try {
                this.uiController.setLoadingState(true);
                
                const stream = await this.cameraManager.startCamera();
                this.uiController.updateCameraState(true);
                
                // Start QR scanning
                this.qrScanner.startScanning(
                    this.cameraManager.video,
                    stream,
                    (result) => this.handleQRResult(result)
                );
                
            } catch (error) {
                this.errorHandler.showCameraError(error);
            } finally {
                this.uiController.setLoadingState(false);
            }
        });

        // Stop camera button
        this.uiController.stopBtn.addEventListener('click', () => {
            this.stopScanning();
        });

        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.cameraManager.isActive()) {
                this.stopScanning();
            }
        });
    }

    handleQRResult(data) {
        this.uiController.displayResult(data);
        try {
            if (data.toLowerCase().includes('siat.sat.gob.mx/app/qr/faces/pages/mobile/validadorqr.jsf'.toLowerCase())) {
                console.log('si jalo!')
                console.log('pinches putos!')
                const payload = data.substring(data.lastIndexOf('=') + 1)
                const [cifId, rfc] = payload.split('_');
                //
                console.log(rfcFieldInput)
                console.log(cifIdFieldInput)
                rfcFieldInput.value = rfc;
                cifIdFieldInput.value = cifId;
                //
                rfcFieldDiv.classList.remove('is-hidden')
                cifIdFieldDiv.classList.remove('is-hidden')
                //buttonsPanel.classList.remove('is-hidden')
                //
                //rfcField.display = 'block';
                //cifIdField.display = 'block';
            } else {
                console.log('valente vera!!')

            }
        } catch (e) {
            //
        }
    }

    stopScanning() {
        this.cameraManager.stopCamera();
        this.qrScanner.stopScanning();
        this.uiController.updateCameraState(false);
    }
}

// 
const qrTextAreaDiv = document.getElementById('textAreaFieldDiv');
const rfcFieldDiv = document.getElementById('rfcFieldDiv');
const cifIdFieldDiv = document.getElementById('cifIdFieldDiv');
const buttonsPanelDiv = document.getElementById('buttonsPanelDiv');
const rfcFieldInput = document.getElementById('rfcFieldInput')
const cifIdFieldInput = document.getElementById('cifIdFieldInput')
//
qrTextAreaDiv.classList.add('is-hidden')
rfcFieldDiv.classList.add('is-hidden')
cifIdFieldDiv.classList.add('is-hidden')
buttonsPanelDiv.classList.add('is-hidden')
// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CIFValidator();
});