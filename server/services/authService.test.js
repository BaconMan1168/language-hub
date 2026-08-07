import test from 'node:test';
import assert from 'node:assert/strict';
import { authenticateUser } from './authService.js';

const users = [
    {
        id: 'user-1',
        email: 'celerina@example.com',
        username: 'Celerina',
        password: 'celerina-hash'
    }
];

for (const identifier of ['celerina@example.com', 'Celerina']) {
    test(`authenticateUser accepts ${identifier.includes('@') ? 'an email' : 'a username'}`, async () => {
        const queries = [];
        const prismaClient = {
            user: {
                findMany: async (args) => {
                    queries.push(args);
                    return users;
                }
            }
        };
        const comparePassword = async (password, hash) => (
            password === 'password123' && hash === 'celerina-hash'
        );

        const user = await authenticateUser(
            identifier,
            'password123',
            prismaClient,
            comparePassword
        );

        assert.equal(user, users[0]);
        assert.deepEqual(queries, [{
            where: {
                OR: [
                    { email: { equals: identifier, mode: 'insensitive' } },
                    { username: identifier }
                ]
            }
        }]);
    });
}

test('authenticateUser rejects an incorrect password', async () => {
    const prismaClient = {
        user: {
            findMany: async () => users
        }
    };

    const user = await authenticateUser(
        'Celerina',
        'incorrect',
        prismaClient,
        async () => false
    );

    assert.equal(user, null);
});
