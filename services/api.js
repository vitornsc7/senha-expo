const BASE_URL = 'http://localhost:3001';

function getToken() {
    return localStorage.getItem('token');
}

async function request(path, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro desconhecido');
    return data;
}

export function signup(name, email, password, passwordConfirm) {
    return request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, passwordConfirm }),
    });
}

export function signin(email, password) {
    return request('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}

export function generatePassword() {
    return request('/passwords/generate', { method: 'POST' });
}

export function getHistory() {
    return request('/passwords/history');
}

export function clearHistory() {
    return request('/passwords/history', { method: 'DELETE' });
}
