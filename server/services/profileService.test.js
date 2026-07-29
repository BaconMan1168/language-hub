import test from 'node:test';
import assert from 'node:assert/strict';
import { getPublicProfile, searchUsers } from './profileService.js';

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

test('getPublicProfile includes unverified contributions', async () => {
    const translationQueries = [];
    const prismaClient = {
        user: {
            findUnique: async () => ({
                username: 'ana',
                createdAt: new Date('2026-01-01'),
                role: 'LEARNER',
                _count: {
                    contributions: 1,
                    createdSets: 0
                }
            })
        },
        translation: {
            findMany: async (args) => {
                translationQueries.push(args.where);
                return [{ id: 'translation-1', status: 'UNVERIFIED' }];
            },
            count: async (args) => {
                translationQueries.push(args.where);
                return 1;
            }
        },
        vocabSet: {
            findMany: async () => [],
            count: async () => 0
        }
    };

    const result = await getPublicProfile(
        'user-1',
        { contributionsPage: 1, setsPage: 1, limit: 20 },
        prismaClient
    );

    assert.equal(result.contributions[0].status, 'UNVERIFIED');
    assert.deepEqual(translationQueries, [
        { authorId: 'user-1' },
        { authorId: 'user-1' }
    ]);
});
