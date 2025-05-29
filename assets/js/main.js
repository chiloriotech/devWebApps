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
        console.log('QR Code detected:', data);
    }

    stopScanning() {
        this.cameraManager.stopCamera();
        this.qrScanner.stopScanning();
        this.uiController.updateCameraState(false);
    }
}

//
const qrTextArea = document.getElementById('textAreaFieldDiv');
const rfcField = document.getElementById('rfcFieldDiv');
const cifIdField = document.getElementById('cifIdFieldDiv');
const buttonsPanel = document.getElementById('buttonsPanelDiv');
console.log(buttonsPanel)
//
qrTextArea.classList.add('is-hidden')
rfcField.classList.add('is-hidden')
cifIdField.classList.add('is-hidden')
buttonsPanel.classList.add('is-hidden')
// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CIFValidator();
});