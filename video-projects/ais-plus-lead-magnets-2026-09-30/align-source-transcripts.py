#!/usr/bin/env python3
"""Transcribe source-clock PCM; preserve initial audio PTS as silence."""
from pathlib import Path
import concurrent.futures,json,subprocess
ROOT=Path(__file__).resolve().parent;WORK=ROOT.parent.parent
(ROOT/'transcripts/audio').mkdir(exist_ok=True)
def process(item):
    clip=item['clip']; src=ROOT/'raw'/item['name'];out=ROOT/'transcripts'/f'{clip}.source.json'
    if not src.exists() or out.exists():return
    wav=ROOT/'transcripts/audio'/f'{clip}.source-clock.wav'
    subprocess.run(['ffmpeg','-v','error','-nostdin','-i',str(src),'-vn','-af','aresample=async=1:first_pts=0','-ac','1','-ar','16000','-c:a','pcm_s16le','-map_metadata','-1','-y',str(wav)],check=True)
    r=subprocess.run(['node',str(WORK/'scripts/transcribe-elevenlabs.mjs'),str(wav),'--output',str(out),'--no-diarize'],capture_output=True,text=True,check=True)
    (ROOT/'transcripts'/f'{clip}.source.log').write_text(r.stdout+r.stderr)
    d=json.loads(out.read_text());d['timeline_basis']='Original MP4 presentation clock; PCM prepared with aresample=async=1:first_pts=0; mono 16 kHz.'
    out.write_text(json.dumps(d,indent=2))
    words=[x for x in d['words'] if x['type']=='word'];lines=[];ch=[]
    for w in words:
        if ch and w['start']-ch[-1]['end']>1:
            lines.append(f"{ch[0]['start']:.3f}–{ch[-1]['end']:.3f}: "+' '.join(x['text'] for x in ch));ch=[]
        ch.append(w)
        if w['text'].endswith(('.', '?', '!')) or len(ch)>=30:
            lines.append(f"{ch[0]['start']:.3f}–{ch[-1]['end']:.3f}: "+' '.join(x['text'] for x in ch));ch=[]
    if ch:lines.append(f"{ch[0]['start']:.3f}–{ch[-1]['end']:.3f}: "+' '.join(x['text'] for x in ch))
    out.with_suffix('.sentences.txt').write_text('\n'.join(lines)+'\n')
    print(f'SOURCE CLOCK READY {clip}: {len(words)} words',flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
    for r in pool.map(process,json.loads((ROOT/'sources.json').read_text())):pass
