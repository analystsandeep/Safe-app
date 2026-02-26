// Basic Web Worker listener
self.onmessage = async (e) => {
    const { type, dexBuffer } = e.data;
    if (type === 'SCAN_DEX') {
        try {
            const { scanDexWorkerFriendly } = await import('../utils/dexScanner.js');
            const findings = scanDexWorkerFriendly(dexBuffer);
            self.postMessage({ status: 'SUCCESS', findings });
        } catch (err) {
            self.postMessage({ status: 'ERROR', error: err.message });
        }
    }
};
