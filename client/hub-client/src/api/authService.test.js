import test from 'node:test';
import assert from 'node:assert/strict';
import api from './axiosConfig.js';
import { authService } from './authService.js';

test('register stores the returned auth token', async (t) => {
    const storedValues = new Map();
    const originalPost = api.post;
    const originalLocalStorage = globalThis.localStorage;

    globalThis.localStorage = {
        getItem: (key) => storedValues.get(key) ?? null,
        setItem: (key, value) => storedValues.set(key, value),
        removeItem: (key) => storedValues.delete(key),
    };
    api.post = async () => ({
        data: {
            user: { id: 1, email: 'new@example.com', username: 'new-user' },
            token: 'registration-token',
        },
    });

    t.after(() => {
        api.post = originalPost;
        globalThis.localStorage = originalLocalStorage;
    });

    await authService.register({
        email: 'new@example.com',
        username: 'new-user',
        password: 'password123',
    });

    assert.equal(storedValues.get('authToken'), 'registration-token');
});
