class CustomWebSocket {
    constructor({
        onOpenHandler,
        onMessageHandler,
        onErrorHandler,
        onCloseHandler
    }) {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        this.socket = new WebSocket(`${protocol}//${window.location.host}/ws/`);

        this.socket.onopen = (e) => {
            if (onOpenHandler) {
                onOpenHandler(e);
            }
        };

        this.socket.onmessage = (e) => {
            if (!onMessageHandler) return;

            try {
                const data = JSON.parse(e.data);
                onMessageHandler(data);
            } catch (err) {
                console.error('Invalid WS message JSON:', err, e.data);
            }
        };

        this.socket.onerror = (e) => {
            if (onErrorHandler) {
                onErrorHandler(e);
            }
        };

        this.socket.onclose = (e) => {
            if (onCloseHandler) {
                onCloseHandler(e);
            }
        };
    }

    sendMessage(pid = null) {
        if (this.socket.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket is not open');
        }

        const payload = {
            pid
        };

        this.socket.send(JSON.stringify(payload));
    }

    close(code = 1000, reason = 'Normal closure') {
        if (
            this.socket.readyState === WebSocket.OPEN ||
            this.socket.readyState === WebSocket.CONNECTING
        ) {
            this.socket.close(code, reason);
        }
    }
}

export default CustomWebSocket;