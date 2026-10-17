from PIL import Image,ImageDraw
from pathlib import Path
import json,subprocess
from concurrent.futures import ThreadPoolExecutor
b=Path(__file__).parent;(b/'frames').mkdir(exist_ok=True);m=json.loads((b/'run-manifest.json').read_text());times=[10,23,39,69,80,93,106,128,162,177,209,234,258,287,328,375,410,446,471,503,529,563,599,620,721,754,794,847,902,950,957,988,1000,1016,1044,1062,1148,1198]
def shot(t):
 s=next(s for s in m['source_order'] if s['offset']<=t<s['offset']+s['duration']);p=b/'frames'/f'source-{t}.jpg';subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t-s['offset']),'-i',s['path'],'-frames:v','1','-vf','scale=768:216',str(p)],check=True);return p
with ThreadPoolExecutor(max_workers=2) as ex:ps=list(ex.map(shot,times))
for k in range(0,len(ps),12):
 subset=ps[k:k+12];im=Image.new('RGB',(1536,246*((len(subset)+1)//2)), '#111111');d=ImageDraw.Draw(im)
 for j,p in enumerate(subset):
  x=(j%2)*768;y=(j//2)*246;im.paste(Image.open(p),(x,y));d.text((x+8,y+220),f'Source {times[k+j]//60:02}:{times[k+j]%60:02}',fill='white')
 im.save(b/'frames'/f'source-sheet-{k//12}.jpg')
print('source sheets done')
