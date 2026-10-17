"""Audit each fully settled scene using HyperFrames' contrast/layout tools.

The animated CLI validation only exposes header text in this compilation;
these static scene copies ensure its pixel audit actually covers every layout.
Studio and exported MP4 contacts verify motion separately.
"""
from pathlib import Path
import json,re,shutil,subprocess,concurrent.futures
R=Path(__file__).resolve().parent
CLI=R.parents[3]/'node_modules/.bin/hyperframes'
Q=R/'qc/static-audits';Q.mkdir(exist_ok=True)
tasks=[]
for shape in ['landscape','portrait']:
    source=(R/shape/'index.html').read_text()
    sections=re.findall(r'<section\b.*?</section>',source,flags=re.S)
    caps=re.findall(r'<div\b[^>]*id="cap\d+"[^>]*>.*?</div>',source,flags=re.S)
    longest=max(caps,key=lambda s:len(re.sub('<[^>]+>','',s)))
    for scene in sections:
        sid=re.search(r'id="([^"]+)"',scene).group(1)
        folder=Q/f'{shape}-{sid}';(folder/'assets').mkdir(parents=True,exist_ok=True)
        for name in ['Inter-Variable.ttf','gsap.min.js','ais-official-mark.png','speaker-poster.jpg']:
            shutil.copy2(R/'assets'/name,folder/'assets'/name)
        h=source
        for other in sections:h=h.replace(other,'')
        for cap in caps:h=h.replace(cap,'')
        # All information at the hero pose; source timing does not apply here.
        scene=re.sub(r' data-(?:start|duration|track-index|anchor)="[^"]*"','',scene).replace('class="scene clip"','class="scene"')
        cap=re.sub(r' data-(?:start|duration|track-index)="[^"]*"','',longest).replace('class="caption clip"','class="caption"')
        h=h.replace('</main>',scene+cap+'</main>')
        h=re.sub(r'<video\b.*?</video>','<img src="assets/speaker-poster.jpg" alt="Nate Herk">',h,flags=re.S)
        h=re.sub(r'<audio\b.*?</audio>','',h,flags=re.S)
        h=re.sub(r'<script>.*?</script>',"<script>const tl=gsap.timeline({paused:true});tl.to({}, {duration:1},0);window.__timelines={main:tl};</script>",h,flags=re.S)
        h=re.sub(r'data-duration="[^"]+"','data-duration="1"',h)
        h=h.replace('</style>','.caption{opacity:1}</style>')
        (folder/'index.html').write_text(h)
        tasks.append(folder)
def check(folder):
    logs=[]
    for action in ['validate','inspect']:
        p=subprocess.run([str(CLI),action,'--json'],cwd=folder,capture_output=True,text=True)
        (folder/f'{action}.json').write_text(p.stdout)
        logs.append({'check':action,'exit_code':p.returncode,'output':p.stdout,'stderr':p.stderr})
    return {'scene':folder.name,'checks':logs}
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    results=list(pool.map(check,tasks))
(R/'qc/static-layout-audit.json').write_text(json.dumps(results,indent=2)+'\n')
for item in results:
    print(item['scene'],[(x['check'],x['exit_code']) for x in item['checks']],flush=True)
if any(x['exit_code'] for item in results for x in item['checks']):raise SystemExit(1)
