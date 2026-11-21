# BCS Vocabulary — Library integration notes

## Collection summary
- Section label: **BCS Vocabulary**
- Distinct profiles: **224**
- Source question records: **485** English questions
- Scoreable source questions: **484**
- BCS references linked across profiles: **230**

A BCS profile can be a single headword or a multiword expression/phrase. Duplicates are consolidated into one canonical profile, while their distinct question references are retained. This is why the number of unique profiles is not expected to equal the number of source questions.

## Profile structure
Each BCS item reuses the existing VocabHub word-profile layout and data fields, including:
- `en`, `bn`, `pos`
- `ipa`, `ipaDialect`, `ipaSource`
- `ex`, `ext`
- `syn`, `ant` (empty where there is no suitable direct match)
- `sources` (Cambridge and Oxford dictionary lookup links)
- `sections: ["BCS Vocabulary"]` for the dedicated section
- `bcsRefs` and `bcsSourceReferences` for source-question navigation and provenance

The IPA field is generated from the pronunciation sources recorded in each profile; Cambridge and Oxford URLs are lookup links, not a claim that every entry was individually certified against both dictionaries.

## Files
- `bcs-data.js` — question bank and source references
- `data/bcs-vocabulary.json` — dedicated export of all 224 profiles
- `vocabulary.json` — canonical hosted full vocabulary data
- `data/vocabulary.json` — maintained full vocabulary copy
- `script.js` — offline embedded vocabulary, Library section, word-profile links and practice integration

## Editorial notes
Phrase and expression entries are intentionally retained when the source uses a multiword expression rather than a single headword. Near-duplicate forms are consolidated only when they refer to the same expression; the source question references remain attached to the canonical profile. Empty antonym/synonym lists are preferable to misleading invented equivalents.
