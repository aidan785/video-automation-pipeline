import json,shutil
from pathlib import Path
b=Path(__file__).parent;a=b/'assets';p=a/'source.json'
if not (a/'source.initial.json').exists():shutil.copy2(p,a/'source.initial.json')
t=json.loads((a/'source.initial.json').read_text());w=t['words']
# Isolated original audio restores words missed by the long-source ASR.
for name,off,lo,hi,count in [('so',386.8,387.5,389.95,9),('will',448.5,449.1,452.2,13),('but',490.8,491.3,493.87,11),('story',588.5,589.3,594.56,15)]:
 sub=[dict(x,start=x['start']+off,end=x['end']+off,source_part=1) for x in json.loads((a/f'isolate-{name}.json').read_text())['words'] if x['type']=='word'][:count]
 if name=='so':sub[-1]['text']='this'
 if name=='will':sub[-1]['text']='Blender.'
 w=[x for x in w if not lo<(x['start']+x['end'])/2<hi]+sub
w.sort(key=lambda x:x['start']);t.update(words=w,text=' '.join(x['text'] for x in w));p.write_text(json.dumps(t,indent=2))
specs=json.loads((b/'edit-specs.json').read_text());specs.extend([
 [308.0,'to then turn or scripting','to then turn into a 3D model'],
 [387.66,'So','so that\'s why we use Blender'],
 [449.22,'Which then will be uh','which then will be distorted'],
 [491.42,'But for this','but for this example specifically'],
 [589.38,'How you can create a storyboard','how you can create a storyboard of your game']])
(b/'edit-specs.json').write_text(json.dumps(specs,indent=2))
(a/'residual-cuts.json').write_text(json.dumps([dict(start=1383.41,end=1383.826,reason='Remove isolated s- false start before working; preserve 61ms before retained word onset')],indent=2))
