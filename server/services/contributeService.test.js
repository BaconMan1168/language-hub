import test from 'node:test';
import assert from 'node:assert/strict';
import { completeMissingTranslationFields } from './contributeService.js';

test('completeMissingTranslationFields persists only fields that are still missing', async () => {
    const updateCalls = [];
    const prismaClient = {
        translation: {
            findUnique: async () => ({
                authorId: 'author-1',
                exampleSentence: null,
                audioUrl: null,
                partOfSpeech: 'noun',
                usageComment: null,
                secondaryAuthors: []
            }),
            update: async (args) => {
                updateCalls.push(args);
                return {
                    id: 'translation-1',
                    exampleSentence: 'Ginagamit ito sa pangungusap.',
                    partOfSpeech: 'noun',
                    usageComment: 'Common in conversation.',
                    audioUrl: null
                };
            }
        }
    };

    const result = await completeMissingTranslationFields(
        'contributor-1',
        'translation-1',
        {
            exampleSentence: 'Ginagamit ito sa pangungusap.',
            partOfSpeech: 'verb',
            usageComment: 'Common in conversation.'
        },
        prismaClient
    );

    assert.equal(result.exampleSentence, 'Ginagamit ito sa pangungusap.');
    assert.deepEqual(updateCalls, [{
        where: {
            id: 'translation-1',
            exampleSentence: null,
            usageComment: null
        },
        data: {
            exampleSentence: 'Ginagamit ito sa pangungusap.',
            usageComment: 'Common in conversation.',
            secondaryAuthors: { connect: { id: 'contributor-1' } }
        },
        include: {
            language: true,
            author: true,
            secondaryAuthors: true
        }
    }]);
});

test('completeMissingTranslationFields rejects a contribution with no missing fields', async () => {
    const prismaClient = {
        translation: {
            findUnique: async () => ({
                authorId: 'author-1',
                exampleSentence: 'Existing example',
                audioUrl: 'existing-audio',
                partOfSpeech: 'noun',
                usageComment: 'Existing note',
                secondaryAuthors: []
            })
        }
    };

    await assert.rejects(
        completeMissingTranslationFields(
            'contributor-1',
            'translation-1',
            { partOfSpeech: 'verb' },
            prismaClient
        ),
        /No missing fields were provided/
    );
});
