import json
from pathlib import Path

b = Path(__file__).resolve().parent
a = b / 'assets'
m = json.loads((b / 'run-manifest.json').read_text())
words, specs = [], []
for i, source in enumerate(m['source_order'], 1):
    transcript = json.loads((a / f'part{i}.json').read_text())
    shift = source.get('audio_start_adjust_samples', 0) / 48000
    for word in transcript['words']:
        if word['type'] == 'word':
            words.append(dict(word, start=max(0, word['start'] - shift + source['offset']),
                              end=max(0, word['end'] - shift + source['offset']), source_part=i))
    for near, remove, keep in json.loads((b / f'part{i}-edit-specs.json').read_text()):
        specs.append([round(near - shift + source['offset'], 5), remove, keep])
specs.append([563.85 - 2 / 30,
              'references that I use to download to set up a secure and efficient connection',
              'References references that I use to set up'])
(a / 'source.json').write_text(json.dumps(dict(words=words, text=' '.join(w['text'] for w in words),
                                              audio_duration_secs=m['source_duration']), indent=2))
(b / 'edit-specs.json').write_text(json.dumps(specs, indent=2))
print(dict(words=len(words), editorial_specs=len(specs)))
