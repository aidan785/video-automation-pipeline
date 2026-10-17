"""Render locally authored caption and graphic overlays, then package MP4 drafts."""
from PIL import Image, ImageDraw, ImageFont
import json, math, pathlib, subprocess, concurrent.futures

ROOT=pathlib.Path(__file__).resolve().parent
FONT=ROOT/'assets/fonts'
FPS=30; W=1920; H=1080
BLUE=(55,189,248,255); WHITE=(255,255,255,255); ONYX=(7,18,28,240)

def font(name,size): return ImageFont.truetype(str(FONT/name),size)
BODY=font('Inter-Regular.ttf',58)
SMALL=font('Inter-Regular.ttf',28)
MONO=font('JetBrainsMono-Bold.ttf',23)
DISPLAY=font('Montserrat-BlackItalic.ttf',58)
MARK=font('Montserrat-BlackItalic.ttf',36)

CARDS={
 '01':[(0,3.65,'EVERY MORNING','30 MINUTES','Just finding your priorities'),
       (7,11.6,'PERSONAL SYSTEM','YOUR AI OS','Context. Memory. Workflows.'),
       (27.1,31.92,'BUILD YOUR AI OS','LEARN MORE','Click below to get started')],
 '02':[(3.9,7.8,'PERSONAL SYSTEM','YOUR AI OS','Built around your actual work'),
       (11.35,15.65,'STEP 01','GIVE CONTEXT','Who you are. What you do.'),
       (15.7,20.08,'STEP 02','CONNECT TOOLS','Tasks. Calendar. Messages.'),
       (20.15,25.47,'STEP 03','ADD WORKFLOWS','Plan. Prepare. Follow up.'),
       (33.1,37.09,'BUILD YOUR AI OS','LEARN MORE','Click below to get started')],
 '03':[(0,7.6,'FOUNDER’S COMPANY','~$420K / MO','Fewer than 10 employees'),
       (12.5,16.9,'PERSONAL AI','CHIEF OF STAFF','Priorities. Projects. Workflows.'),
       (38.2,42.56,'BUILD YOUR AI OS','LEARN MORE','Go behind the scenes')]
}

def normalized_words(words):
    out=[];i=0
    while i<len(words):
        w=dict(words[i]); texts=[v['text'].lower().strip('.,') for v in words[i:i+6]]
        if texts[:3]==['ai','is','live']:
            w.update(text='AIS Live,',end=words[i+2]['end']);i+=3
        elif texts[:6]==['four','hundred','and','twenty','thousand','dollars']:
            w.update(text='$420,000',end=words[i+5]['end']);i+=6
        elif texts[:2]==['ai','os']:
            w.update(text='AI OS'+(',' if words[i+1]['text'].endswith(',') else '.' if words[i+1]['text'].endswith('.') else ''),end=words[i+1]['end']);i+=2
        else:
            if texts[0]=='jarvis':w['text']='JARVIS'
            i+=1
        out.append(w)
    return out

def caption_groups(words):
    groups=[];cur=[]
    for i,w in enumerate(words):
        cur.append(w)
        text=' '.join(v['text'] for v in cur)
        boundary=(len(cur)>=5 or len(text)>34 or w['text'].endswith(('.', '?', '!')) or
                  (w['text'].endswith(',') and len(cur)>=3) or i==len(words)-1 or
                  words[i+1]['start']-w['end']>.17)
        if boundary:
            groups.append({'start':max(0,cur[0]['start']-.02),'end':w['end']+.08,'text':text});cur=[]
    for i,g in enumerate(groups[:-1]):g['end']=min(g['end'],groups[i+1]['start'])
    return groups

def srt_time(t):
    ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'

def frame(caption,card,t,disc):
    im=Image.new('RGBA',(W,H),(0,0,0,0));d=ImageDraw.Draw(im)
    # Approved no-dot mark, discreet and separate from the source's wall sign.
    d.rounded_rectangle((62,48,317,113),radius=8,fill=(7,18,28,200))
    d.text((80,58),'AIS',font=MARK,fill=WHITE)
    d.text((157,58),'LIVE',font=MARK,fill=BLUE)
    if card:
        a,b,eyebrow,headline,sub=card
        envelope=min(1,max(0,(t-a)/.20),max(0,(b-t)/.15))
        ease=1-(1-envelope)**3
        panel=Image.new('RGBA',(W,H),(0,0,0,0));p=ImageDraw.Draw(panel)
        x=64-round(28*(1-ease));y=568
        p.rounded_rectangle((x,y,x+502,y+222),radius=14,fill=ONYX,outline=(255,255,255,42),width=2)
        p.text((x+28,y+27),eyebrow,font=MONO,fill=BLUE)
        f=DISPLAY
        while p.textlength(headline,font=f)>448:f=font('Montserrat-BlackItalic.ttf',f.size-1)
        p.text((x+24,y+69),headline,font=f,fill=WHITE)
        sf=SMALL
        while p.textlength(sub,font=sf)>444:sf=font('Inter-Regular.ttf',sf.size-1)
        p.text((x+28,y+158),sub,font=sf,fill=(221,231,239,255))
        if envelope<1:panel.putalpha(panel.getchannel('A').point(lambda v:round(v*envelope)))
        im=Image.alpha_composite(im,panel);d=ImageDraw.Draw(im)
    if caption:
        text=caption['text'];f=BODY
        while d.textlength(text,font=f)>1590:f=font('Inter-Regular.ttf',f.size-1)
        tw=d.textlength(text,font=f);cy=919 if disc else 965
        d.rounded_rectangle((960-tw/2-25,cy-49,960+tw/2+25,cy+46),radius=12,fill=(7,18,28,230))
        d.text((960,cy),text,font=f,fill=WHITE,anchor='mm',stroke_width=0)
    if disc:
        d.rounded_rectangle((108,989,1812,1066),radius=8,fill=(7,18,28,245))
        d.text((960,1011),"Results shown reflect the founder's company and are not typical.",font=SMALL,fill=WHITE,anchor='mm')
        d.text((960,1046),'Individual results vary.',font=SMALL,fill=WHITE,anchor='mm')
    return im

def finish(out):
    j=json.loads((out/'mapped-transcript.json').read_text());dur=j['audio_duration_secs']
    groups=caption_groups(normalized_words(j['words']));cards=CARDS[out.name[:2]]
    (out/'captions.srt').write_text('\n'.join(f"{i+1}\n{srt_time(g['start'])} --> {srt_time(g['end'])}\n{g['text']}\n" for i,g in enumerate(groups)))
    (out/'graphics-plan.json').write_text(json.dumps({'captions':groups,'cards':cards,'disclaimer_seconds':7.6 if out.name.startswith('03') else 0},indent=2))
    # Only store event frames; ffconcat holds each PNG until the next change.
    events={0,round(dur*FPS)}
    for g in groups:
        events.update([max(0,round(g['start']*FPS)),min(round(dur*FPS),round(g['end']*FPS))])
    for c in cards:
        for t in [c[0]+i/FPS for i in range(7)]+[c[1]-i/FPS for i in range(6)]:
            if 0<=t<dur:events.add(round(t*FPS))
    if out.name.startswith('03'):events.add(round(7.6*FPS))
    events=sorted(events);frames=out/'overlay-frames';frames.mkdir(exist_ok=True)
    entries=[]
    for n,(fi,fn) in enumerate(zip(events,events[1:])):
        t=fi/FPS+.0001
        # Match frame-rounded caption boundaries, avoiding a one-event delay.
        cap=next((g for g in groups if round(g['start']*FPS)<=fi<round(g['end']*FPS)),None)
        card=next((c for c in cards if c[0]<=t<c[1]),None)
        p=frames/f'{n:04}.png';frame(cap,card,t,out.name.startswith('03') and t<7.6).save(p)
        entries.append(f"file '{p}'\noption framerate 30\nduration {(fn-fi)/FPS:.9f}\n")
    manifest=out/'overlays.ffconcat';manifest.write_text('ffconcat version 1.0\n'+''.join(entries)+f"file '{p}'\noption framerate 30\n")
    cmd=['ffmpeg','-hide_banner','-y','-i',str(out/'clean.mp4'),'-f','concat','-safe','0','-i',str(manifest),
         '-filter_complex','[1:v]fps=30,format=rgba[ov];[0:v][ov]overlay=0:0:format=auto,format=yuv420p[v]',
         '-map','[v]','-map','0:a:0','-t',str(dur),'-r','30','-c:v','libx264','-preset','fast','-crf','18',
         '-threads','4','-c:a','copy','-movflags','+faststart',str(out/'edited-1080p.mp4')]
    with open(out/'finish-render.log','w') as log:subprocess.run(cmd,stdout=log,stderr=subprocess.STDOUT,check=True)
    print('FINISHED',out/'edited-1080p.mp4',flush=True)

if __name__=='__main__':
    ps=sorted(p for p in ROOT.iterdir() if p.is_dir() and p.name[:2] in CARDS)
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:list(pool.map(finish,ps))
