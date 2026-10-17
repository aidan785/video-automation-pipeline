#!/usr/bin/env python3
"""One-shot source intake. No cuts or styled media are rendered."""
from pathlib import Path
import concurrent.futures, hashlib, json, re, subprocess, time

ROOT=Path(__file__).resolve().parent
WORK=ROOT.parent.parent
SOURCES=json.loads((ROOT/'sources.json').read_text())

def run(args):
    return subprocess.run(args,capture_output=True,text=True,check=True)

def intake(item):
    clip=item['clip']; source=ROOT/'raw'/item['name']
    report=ROOT/'references'/f'{clip}.probe.json'
    probe=json.loads(run(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(source)]).stdout)
    report.write_text(json.dumps(probe,indent=2))
    tr=ROOT/'transcripts'/f'{clip}.raw.json'
    if not tr.exists():
        log=run(['node',str(WORK/'scripts/transcribe-elevenlabs.mjs'),str(source),'--output',str(tr),'--no-diarize'])
        (ROOT/'transcripts'/f'{clip}.transcription.log').write_text(log.stdout+log.stderr)
    d=json.loads(tr.read_text()); words=[w for w in d['words'] if w['type']=='word']
    lines=[]; chunk=[]
    for w in words:
        if chunk and w['start']-chunk[-1]['end']>1:
            lines.append(f"{chunk[0]['start']:.2f}–{chunk[-1]['end']:.2f}: "+' '.join(x['text'] for x in chunk));chunk=[]
        chunk.append(w)
        if w['text'].endswith(('.', '?', '!')) or len(chunk)>=30:
            lines.append(f"{chunk[0]['start']:.2f}–{chunk[-1]['end']:.2f}: "+' '.join(x['text'] for x in chunk));chunk=[]
    if chunk: lines.append(f"{chunk[0]['start']:.2f}–{chunk[-1]['end']:.2f}: "+' '.join(x['text'] for x in chunk))
    (ROOT/'transcripts'/f'{clip}.raw.sentences.txt').write_text('\n'.join(lines)+'\n')
    loud=run(['ffmpeg','-hide_banner','-nostdin','-i',str(source),'-vn','-af','ebur128=peak=true','-f','null','-']).stderr
    summary=loud[loud.rfind('Summary:'):]
    (ROOT/'references'/f'{clip}.audio.txt').write_text(summary)
    diff=run(['ffmpeg','-hide_banner','-nostdin','-i',str(source),'-vn','-af','pan=mono|c0=c0-c1,volumedetect','-f','null','-']).stderr
    (ROOT/'references'/f'{clip}.channel-difference.txt').write_text('\n'.join(x for x in diff.splitlines() if 'volumedetect' in x))
    for t,label in [(5,'opening'),(float(probe['format']['duration'])/2,'middle')]:
        run(['ffmpeg','-v','error','-nostdin','-ss',str(t),'-i',str(source),'-frames:v','1','-vf','scale=960:-1','-y',str(ROOT/'references'/f'{clip}-{label}.jpg')])
    v=next(s for s in probe['streams'] if s['codec_type']=='video'); a=next(s for s in probe['streams'] if s['codec_type']=='audio')
    r={**item,'source_path':str(source.resolve()),'size_bytes':source.stat().st_size,'duration':float(probe['format']['duration']),
       'video':{k:v.get(k) for k in ['codec_name','width','height','r_frame_rate','avg_frame_rate','pix_fmt','color_space','color_transfer','color_primaries','start_time','duration','nb_frames','bit_rate']},
       'audio':{k:a.get(k) for k in ['codec_name','sample_rate','channels','channel_layout','bit_rate','start_time','duration']},
       'integrated_lufs':float(re.search(r'I:\s+([-\d.]+) LUFS',summary).group(1)),
       'true_peak_dbfs':float(re.search(r'Peak:\s+([-\d.]+) dBFS',summary).group(1)),
       'channel_difference_mean_db':re.search(r'mean_volume:\s+([^\n]+)',diff).group(1),
       'words':len(words),'first_word':words[0],'last_word':words[-1]}
    (ROOT/'references'/f'{clip}.inventory.json').write_text(json.dumps(r,indent=2))
    print(f"READY {clip}: {r['duration']:.2f}s; {v['width']}x{v['height']}; {len(words)} words; {r['integrated_lufs']} LUFS",flush=True)
    return r

if __name__=='__main__':
    pending={x['clip']:x for x in SOURCES}; futures={}; results=[]; deadline=time.time()+1800
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
        while (pending or futures) and time.time()<deadline:
            for clip,item in list(pending.items()):
                p=ROOT/'raw'/item['name']
                if p.exists():
                    futures[pool.submit(intake,item)]=clip;del pending[clip]
            for f in list(futures):
                if f.done():
                    clip=futures.pop(f)
                    try:results.append(f.result())
                    except Exception as e:print(f'FAILED {clip}: {e}',flush=True)
            (ROOT/'inventory.json').write_text(json.dumps(sorted(results,key=lambda r:r['clip']),indent=2))
            if pending or futures:time.sleep(5)
    if pending:print('NOT DOWNLOADED: '+','.join(pending),flush=True)
    print(f'Completed {len(results)}/8 sources',flush=True)
