from PIL import Image,ImageDraw
from pathlib import Path
import subprocess
from concurrent.futures import ThreadPoolExecutor
b=Path('video-projects/adobe-transfer-2part-0909')
times=[10,21,90,135,168,182,202,249,310,400,568,780,840,955,1115,1255,1375,1420,1650,1705,1810,1990,2260,2357,2555,2630,2805,2895,3025,3080,3135,3230,3280,3540,3780,3815,3870]
def shot(t):
 p=b/'frames'/f'source-{t}.jpg';subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',str(b/'assets/source.ffconcat'),'-frames:v','1','-vf','scale=768:216',str(p)],check=True);return p
with ThreadPoolExecutor(max_workers=3) as ex:ps=list(ex.map(shot,times))
for k in range(0,len(ps),12):
 subset=ps[k:k+12];im=Image.new('RGB',(1536,246*((len(subset)+1)//2)), '#111111');d=ImageDraw.Draw(im)
 for j,p in enumerate(subset):
  x=(j%2)*768;y=(j//2)*246;im.paste(Image.open(p),(x,y));d.text((x+8,y+220),f'Source {times[k+j]//60:02}:{times[k+j]%60:02}',fill='white')
 im.save(b/'frames'/f'source-sheet-{k//12}.jpg')
