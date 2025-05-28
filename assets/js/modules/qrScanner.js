// QR Code scanning module
export class QRScanner {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.isScanning = false;
        this.lastScanTime = 0;
        this.scanInterval = 100; // Scan every 100ms
    }

    startScanning(video, stream, onResult) {
        this.video = video;
        this.stream = stream;
        this.onResult = onResult;
        this.isScanning = true;
        this.lastResult = null;
        
        this.scanLoop();
    }

    stopScanning() {
        this.isScanning = false;
        this.video = null;
        this.stream = null;
        this.onResult = null;
    }

    scanLoop() {
        if (!this.isScanning || !this.stream?.active) {
            return;
        }

        const now = Date.now();
        if (now - this.lastScanTime >= this.scanInterval) {
            this.processScan();
            this.lastScanTime = now;
        }

        requestAnimationFrame(() => this.scanLoop());
    }


    processScan() {
        if (!this.video || this.video.readyState < this.video.HAVE_ENOUGH_DATA) {
            return;
        }

        try {
            // Set canvas dimensions to match video
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;

            // Draw current video frame to canvas
            this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

            // Get image data from canvas
            const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

            // Scan for QR code
            const qrCode = jsQR(imageData.data, this.canvas.width, this.canvas.height, {
                inversionAttempts: "dontInvert"
            });

            if (qrCode && qrCode.data !== this.lastResult) {
                this.lastResult = qrCode.data;
                this.onResult?.(qrCode.data);
                console.log('QR Code found:', qrCode.data);
                try {
                    if (qrCode.data.toLowerCase().includes('siat.sat.gob.mx/app/qr/faces/pages/mobile/validadorqr.jsf'.toLowerCase())) {
                        const payload = qrCode.data.substring(qrCode.data.lastIndexOf('=') + 1)
                        const [cifId, rfc] = payload.split('_');
                        console.log(payload)
                        console.log(cifId)
                        console.log(rfc)
                    }
                } catch (e) {
                    //
                }
            }
        } catch (error) {
            console.error('Error during QR scan:', error);
        }
    }

    // Manual scan trigger (for debugging)
    manualScan() {
        if (this.isScanning) {
            this.processScan();
        }
    }

    // Get scan statistics
    getScanStats() {
        return {
            isScanning: this.isScanning,
            canvasSize: {
                width: this.canvas.width,
                height: this.canvas.height
            },
            lastResult: this.lastResult,
            scanInterval: this.scanInterval
        };
    }
}