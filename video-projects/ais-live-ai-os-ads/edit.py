"""Reproducible, frame-aligned source edit. Originals are read-only."""
import json, subprocess, pathlib, concurrent.futures

ROOT = pathlib.Path(__file__).resolve().parent
ASSETS = ROOT / 'assets'
SOURCE = pathlib.Path('/Volumes/Extreme SSD/Uppit AI/AIS Live/October /Ads/AIS Live 3 Ads.mp4')
FPS = 30

def run(args, log):
    with open(log, 'w') as f:
        subprocess.run(args, stdout=f, stderr=subprocess.STDOUT, check=True)

def write_json(p, obj):
    p.write_text(json.dumps(obj, indent=2))

def plan():
    raw = json.loads((ASSETS/'raw-transcript.json').read_text())
    words = [w for w in raw['words'] if w['type'] == 'word']
    silence = json.loads((ASSETS/'raw.silence-edl.json').read_text())
    mistakes = [
        {'start':54.27,'end':59.177,'reason':'Keep complete You can now build restart; remove abandoned manage your task take.'},
        {'start':67.23,'end':71.83,'reason':'Keep corrected who you are take; remove what you are restart.'},
        {'start':99.29,'end':101.01,'reason':'Keep complete CTA; remove incomplete So if you would like.'},
        {'start':125.80,'end':135.172,'reason':'Keep complete priorities/projects/repetitive work sentence; remove two abandoned takes.'},
    ]
    write_json(ASSETS/'editorial-decisions.json', mistakes)
    specs=[('01-the-30-minute-morning',0,142,2.98,47.04),
           ('02-ai-executive-assistant',142,325,50.40,103.78),
           ('03-the-420k-ai-os',325,532,109.70,169.02)]
    projects=[]
    for name, wi, we, start, end in specs:
        out=ROOT/name
        (out/'segments').mkdir(parents=True,exist_ok=True)
        deletes=sorted([{'start':max(start,d['start']),'end':min(end,d['end'])} for d in silence['delete_ranges']+mistakes if d['start']<end and d['end']>start],key=lambda d:d['start'])
        # Per-ad head/tail pads replace the inter-ad silence trim.
        deletes=[d for d in deletes if d['start']>start and d['end']<end]
        merged=[]
        for d in deletes:
            if merged and d['start']<=merged[-1]['end']+0.3:merged[-1]['end']=max(merged[-1]['end'],d['end'])
            else:merged.append(dict(d))
        keeps=[];cur=start
        for d in merged:
            if d['start']-cur>0.3: keeps.append({'start':round(cur*FPS)/FPS,'end':round(d['start']*FPS)/FPS})
            cur=d['end']
        keeps.append({'start':round(cur*FPS)/FPS,'end':round(end*FPS)/FPS})
        t=0; mapped=[]
        for k in keeps:
            k['at']=round(t,6)
            k['frames']=round((k['end']-k['start'])*FPS)
            for w in words[wi:we]:
                if w['start']>=k['start']-0.02 and w['end']<=k['end']+0.02:
                    mapped.append({**w,'source_start':w['start'],'source_end':w['end'],'start':round(w['start']-k['start']+t,6),'end':round(w['end']-k['start']+t,6)})
            t+=k['frames']/FPS
        duration=round(t,6)
        full_deletes=[];cur=0
        for k in keeps:
            if k['start']>cur: full_deletes.append({'start':cur,'end':k['start']})
            cur=k['end']
        source_duration=171.086533
        full_deletes.append({'start':cur,'end':source_duration})
        edl={'source':str(SOURCE),'source_duration':source_duration,'edited_duration':duration,'removed':source_duration-duration,'keep_ranges':keeps,'delete_ranges':full_deletes}
        write_json(out/'edit-list.json',edl)
        write_json(out/'mapped-transcript.json',{'words':mapped,'text':' '.join(w['text'] for w in mapped),'audio_duration_secs':duration})
        print(name,round(duration,3),'seconds',len(keeps),'segments',len(mapped),'words',flush=True)
        projects.append(out)
    return projects

def render(out):
    edl=json.loads((out/'edit-list.json').read_text())
    paths=[]
    for i,k in enumerate(edl['keep_ranges']):
        target=out/'segments'/f'{i:02}.mov';paths.append(target)
        dur=k['frames']/FPS
        if not target.exists():
            run(['ffmpeg','-hide_banner','-y','-ss',str(k['start']),'-i',str(SOURCE),'-t',str(dur),
                 '-vf','scale=1920:1080:flags=lanczos,setsar=1,format=yuv420p',
                 '-af',f'atrim=duration={dur},asetpts=PTS-STARTPTS,apad=whole_dur={dur},afade=t=in:d=0.008,afade=t=out:st={dur-0.012}:d=0.012',
                 '-c:v','libx264','-preset','fast','-crf','16','-threads','4','-r','30',
                 '-c:a','pcm_s16le','-ar','48000','-ac','2',str(target)],out/'segments'/f'{i:02}.log')
        print(out.name,'segment',i+1,'/',len(edl['keep_ranges']),flush=True)
    concat=out/'segments.txt';concat.write_text(''.join("file '"+str(p)+"'\n" for p in paths))
    run(['ffmpeg','-hide_banner','-y','-f','concat','-safe','0','-i',str(concat),'-c:v','copy',
         '-c:a','aac','-b:a','256k','-af','loudnorm=I=-16:TP=-1.5:LRA=9','-ar','48000',
         '-movflags','+faststart',str(out/'clean.mp4')],out/'clean-render.log')
    print('COMPLETE',out/'clean.mp4',flush=True)

if __name__=='__main__':
    ps=plan()
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
        list(pool.map(render,ps))
