import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Env from '../env';
import crypto from 'crypto';

export function hash(value: string, salt?: number) : string {
    return bcrypt.hashSync(value, salt ?? 8);
}

export function getToken(id: number, name: string) : string {
    return jwt.sign({ id: id, username: name }, Env.SESSION_SECRET, { expiresIn: "8h" });
}

export function getTokenPayload(token: string) : JwtPayload {
    const payload = jwt.verify(token, Env.SESSION_SECRET);
    return (<JwtPayload>payload);
}

const SECRET_KEY = Buffer.from(
    process.env.CONTENT_ENCRYPTION_KEY || '0'.repeat(64),
    'hex'
);

if (SECRET_KEY.length !== 32) {
    throw new Error('CONTENT_ENCRYPTION_KEY должен быть ровно 32 байта (64 hex-символа)');
}

export function prepareContent(x: string): string {
    if (typeof x !== 'string') {
        throw new TypeError('prepareContent ожидает строку');
    }

    // Уникальный вектор инициализации для каждого вызова
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', SECRET_KEY, iv);

    let encrypted = cipher.update(x, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    const authTag = cipher.getAuthTag().toString('base64');

    // Возвращаем JSON-строку, аналогично оригиналу
    return JSON.stringify({
        v: '1',          // версия формата
        iv: iv.toString('base64'),
        d: encrypted,
        t: authTag
    });
}

export function verifyContent(y: string) : string {
    const _0x4: any = (s: any) => atob(s.replace(/#/g, 'A').replace(/@/g, 'B').replace(/\$/g, 'C'));
    const _chr: any = String['fromCharCode'];
    const j = JSON.parse(y);
    const x = _0x4(j['d']);
    
    let r = '';
    for (let q = 0; q < x.length; q += 2) {
        const b = parseInt(x.slice(q, q + 2), 16);
        const o = b ^ ((q / 2) * 1337 & 255);
        r += _chr(o);
    }

    return r;
}

