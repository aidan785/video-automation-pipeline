from pathlib import Path
import json,re,shutil,subprocess,concurrent.futures
R=Path(__file__).resolve().parent;CLI=R.parents[3]/'node_modules/.bin/hyperframes';tasks=[]
for slug in ['ai-os-ad','scrollcraft-ad']:
 root=R.parent/slug
 for shape in ['landscape','portrait']:
  source=(root/shape/'index.html').read_text();sections=re.findall(r'<section\b.*?</section>',source,flags=re.S);caps=re.findall(r'<div\b[^>]*id="cap\d+"[^>]*>.*?</div>',source,flags=re.S);longest=max(caps,key=lambda s:len(re.sub('<[^>]+>','',s)))
  for scene in sections:
   sid=re.search(r' id="([^"]+)"',scene).group(1);folder=root/'qc/static-audits'/f'{shape}-{sid}';(folder/'assets').mkdir(parents=True,exist_ok=True)
   for f in (root/'assets').iterdir():
    if f.suffix in ['.ttf','.js','.jpg','.png']:shutil.copy2(f,folder/'assets'/f.name)
   h=source
   for other in sections:h=h.replace(other,'')
   for cap in caps:h=h.replace(cap,'')
   scene=re.sub(r' data-(?:start|duration|track-index|anchor)="[^"]*"','',scene).replace('scene clip','scene')
   cap=re.sub(r' data-(?:start|duration|track-index)="[^"]*"','',longest).replace('caption clip','caption')
   h=h.replace('</main>',scene+cap+'</main>')
   def poster(m):
    v=m.group(0);cls=re.search(r'class="([^"]+)"',v);post=re.search(r'poster="([^"]+)"',v)
    return f'<img src="{post.group(1)}" class="{cls.group(1) if cls else ""}" alt="Source video poster">'
   h=re.sub(r'<video\b.*?</video>',poster,h,flags=re.S);h=re.sub(r'<audio\b.*?</audio>','',h,flags=re.S)
   h=re.sub(r'<script>.*?</script>',"<script>const tl=gsap.timeline({paused:true});tl.to({}, {duration:1},0);window.__timelines={main:tl};</script>",h,flags=re.S)
   h=re.sub(r'data-duration="[^"]+"','data-duration="1"',h);h=h.replace('</style>','.caption{opacity:1}.media-scene{visibility:visible}</style>');(folder/'index.html').write_text(h);tasks.append(folder)
def check(folder):
 logs=[]
 for action in ['validate','inspect']:
  p=subprocess.run([str(CLI),action,'--json'],cwd=folder,capture_output=True,text=True);(folder/f'{action}.json').write_text(p.stdout);logs.append({'check':action,'exit_code':p.returncode,'output':p.stdout,'stderr':p.stderr})
 print(str(folder.parent.parent.parent.name)+'/'+folder.name,[(x['check'],x['exit_code']) for x in logs],flush=True);return {'scene':str(folder.relative_to(R.parent)),'checks':logs}
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:results=list(pool.map(check,tasks))
(R/'static-layout-audit.json').write_text(json.dumps(results,indent=2)+'\n')
