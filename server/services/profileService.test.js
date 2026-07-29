import test from 'node:test';
import assert from 'node:assert/strict';
import { searchUsers } from './profileService.js';

test('searchUsers includes unfiltered community account and contributor totals', async () => {
    const countCalls = [];
    const prismaClient = {
        user: {
            findMany: async () => [],
            count: async (args) => {
                countCalls.push(args);

                if (!args) return 24;
                if (args.where?.contributions) return 9;
                return 2;
            }
        }
    };

    const result = await searchUsers('ana', 1, 20, prismaClient);

    assert.deepEqual(result.communityStats, {
        users: 24,
        contributors: 9
    });
    assert.deepEqual(countCalls, [
        {
            where: {
                username: {
                    contains: 'ana',
                    mode: 'insensitive'
                }
            }
        },
        undefined,
        {
            where: {
                contributions: {
                    some: {}
                }
            }
        }
    ]);
});
