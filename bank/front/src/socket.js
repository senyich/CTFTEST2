class CustomWebSocket {
    constructor({ uid, token, onOpenHandler, onMessageHandler, onErrorHandler, onCloseHandler }) {
        // 🔐 1. Используем wss:// вместо ws:// (защита от MITM)
        // 🔐 2. Передаём токен аутентификации при подключении
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/?token=${encodeURIComponent(token)}`;
        
        this.socket = new WebSocket(wsUrl);
        this.uid = uid; // ⚠️ Только для локального использования, НЕ отправляем на сервер!
        this.token = token;
        
        // 🛡️ 3. Флаг: сокет готов только после успешной аутентификации на сервере
        this._authenticated = false;

        this.socket.onopen = (e) => {
            // 🔐 4. Не считаем соединение готовым сразу — ждём подтверждения от сервера
            console.log('WebSocket connected, waiting for auth confirmation...');
            if (onOpenHandler) onOpenHandler(e);
        };

        this.socket.onmessage = (e) => {
            // 🛡️ 5. Безопасный парсинг + валидация схемы
            try {
                const data = JSON.parse(e.data);
                
                // 🔐 6. Обрабатываем служебные сообщения (авторизация, пинг)
                if (data.type === 'auth') {
                    if (data.status === 'ok') {
                        this._authenticated = true;
                        console.log('✅ WebSocket authenticated');
                    } else {
                        console.error('❌ Auth failed:', data.error);
                        this.socket.close();
                        return;
                    }
                }
                
                if (data.type === 'ping') {
                    // 🛠️ 7. Heartbeat через приложение, а не через несуществующий socket.pong()
                    this._sendRaw({ type: 'pong' });
                    return;
                }

                // 🛡️ 8. Валидация входящих данных перед передачей в хендлер
                if (typeof data !== 'object' || data === null) {
                    throw new Error('Invalid message format');
                }

                // 🛡️ 9. Экранирование потенциально опасных полей (защита от XSS)
                if (data.content && typeof data.content === 'string') {
                    // Пример: удаляем скрипты, если контент будет рендериться в DOM
                    data.content = this._sanitize(data.content);
                }

                if (onMessageHandler) onMessageHandler(data);
                
            } catch (err) {
                console.error('🛡️ WS parse error:', err.message);
                // 🛑 Не передаём ошибку в хендлер — это может сломать приложение
                if (onErrorHandler) onErrorHandler({ type: 'parse_error', message: err.message });
            }
        };

        this.socket.onerror = (e) => {
            if (onErrorHandler) onErrorHandler(e);
        };

        this.socket.onclose = (e) => {
            this._authenticated = false;
            if (onCloseHandler) onCloseHandler(e);
        };

        // ❌ Убираем несуществующий listener 'ping' для браузерного WebSocket
        // this.socket.addEventListener('ping', ...) — НЕ РАБОТАЕТ в браузере!
    }

    // 🔐 Приватный метод для отправки "сырых" сообщений (без uid)
    _sendRaw(payload) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(payload));
            return true;
        }
        return false;
    }

    // 🛡️ Санитизация строки (базовая защита от XSS)
    _sanitize(str) {
        return str
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+=/gi, '');
    }

    // 🔐 Публичный метод отправки: uid НЕ передаётся, берётся из сессии на сервере
    sendMessage(pid = null, extra = {}) {
        if (!this._authenticated) {
            console.warn('⚠️ Cannot send: WebSocket not authenticated yet');
            return false;
        }

        // ✅ Отправляем только то, что нужно: тип, данные, метаданные
        // ❌ uid НЕ включаем — сервер сам определит его из токена
        return this._sendRaw({
            type: 'message',
            pid: pid,
            ...extra,
            // uid добавляется на сервере автоматически из расшифрованного токена
        });
    }

    // 🔐 Метод для корректного закрытия с очисткой
    close() {
        if (this.socket) {
            this._sendRaw({ type: 'close' });
            this.socket.close();
        }
    }

    // 🔐 Статус аутентификации (полезно для UI)
    isAuthenticated() {
        return this._authenticated && this.socket.readyState === WebSocket.OPEN;
    }
}

export default SecureWebSocket;