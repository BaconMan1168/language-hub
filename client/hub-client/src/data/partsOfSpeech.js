// Single source of truth for part-of-speech options.
// `partOfSpeech` is stored as a free-form string, so this list is the
// canonical set of choices shown in the UI. Each entry carries a definition
// used for the hover/focus tooltip on the contribute chips.
export const POS_OPTIONS = [
    { value: 'noun',          label: 'Noun',          definition: 'Names a person, place, thing, or idea.' },
    { value: 'verb',          label: 'Verb',          definition: 'Expresses an action, occurrence, or state.' },
    { value: 'adjective',     label: 'Adjective',     definition: 'Describes or modifies a noun or pronoun.' },
    { value: 'adverb',        label: 'Adverb',        definition: 'Modifies a verb, adjective, or other adverb.' },
    { value: 'pronoun',       label: 'Pronoun',       definition: 'Stands in place of a noun (e.g., siya, ito).' },
    { value: 'determiner',    label: 'Determiner',    definition: 'Marks or specifies a noun; includes case and personal markers (e.g., hi, ya, hên).' },
    { value: 'demonstrative', label: 'Demonstrative', definition: 'Points to something (e.g., this, that, here, there).' },
    { value: 'numeral',       label: 'Numeral',       definition: 'A number or quantity word (e.g., one, first, many, all).' },
    { value: 'preposition',   label: 'Preposition',   definition: 'Shows relationship between a noun and other words.' },
    { value: 'conjunction',   label: 'Conjunction',   definition: 'Connects words, phrases, or clauses.' },
    { value: 'interjection',  label: 'Interjection',  definition: 'Expresses a sudden emotion or reaction.' },
    { value: 'negation',      label: 'Negation',      definition: 'Negates or reverses meaning (e.g., not, no, never).' },
    { value: 'particle',      label: 'Particle',      definition: 'A function word with grammatical role (common in Philippine languages).' },
    { value: 'phrase',        label: 'Phrase',        definition: 'A group of words functioning as a single unit.' },
    { value: 'other',         label: 'Other',         definition: 'Does not fit the categories above.' },
];
