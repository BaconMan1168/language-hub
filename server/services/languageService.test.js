import test from 'node:test';
import assert from 'node:assert/strict';
import { getLanguageTranslationCounts } from './languageService.js';

test('getLanguageTranslationCounts returns core coverage and all translation totals', async () => {
    const prismaClient = {
        translation: {
            findMany: async () => [
                { languageId: 'language-1', commonWordId: 1 },
                { languageId: 'language-1', commonWordId: 2 },
                { languageId: 'language-2', commonWordId: 1 }
            ],
            groupBy: async () => [
                { languageId: 'language-1', _count: { _all: 14 } },
                { languageId: 'language-2', _count: { _all: 3 } }
            ]
        }
    };

    const result = await getLanguageTranslationCounts(
        ['language-1', 'language-2', 'language-3'],
        prismaClient
    );

    assert.deepEqual(result, {
        completionCounts: {
            'language-1': 2,
            'language-2': 1
        },
        totalWordCounts: {
            'language-1': 14,
            'language-2': 3
        }
    });
});
