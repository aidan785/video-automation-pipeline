from pathlib import Path
import json, subprocess, shutil
ROOT=Path(__file__).resolve().parent
DEST=Path('/Volumes/Extreme SSD/Uppit AI/AIS Live/October /Ads/Edited/White Glass - HyperFrames')
names=['01 - The 30-Minute Morning - White Glass.mp4','02 - AI Executive Assistant - White Glass.mp4','03 - The 420K AI OS - White Glass.mp4']
specs=json.loads((ROOT/'scenes.json').read_text())
for spec in specs:
    d=ROOT/spec['dir']; raw=d/'renders/white-glass-hyperframes.mp4';final=d/'renders/white-glass.mp4'
    probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-of','json',str(d/'assets/speaker.mp4')]))
    duration=next(s['duration'] for s in probe['streams'] if s['codec_type']=='video')
    # Preserve the verified AAC packets and timing; avoid the renderer AAC priming delay.
    subprocess.run(['ffmpeg','-v','error','-i',str(raw),'-i',str(d/'assets/speaker.mp4'),'-map','0:v:0','-map','1:a:0','-c','copy','-t',duration,'-movflags','+faststart','-y',str(final)],check=True)
subprocess.run(['python3',str(ROOT/'verify-exports.py')],check=True)
DEST.mkdir(parents=True,exist_ok=True)
for spec,name in zip(specs,names):
    shutil.copy2(ROOT/spec['dir']/'renders/white-glass.mp4',DEST/name)
    print(DEST/name)
shutil.copy2(ROOT/'verification.json',DEST/'verification.json')
(DEST/'README.md').write_text('''# AIS Live — White Glass / HyperFrames

Three 1920×1080, 30 fps H.264 ads with the verified speech cuts, captions, white-space layouts, glass panels, soft shadows, blue accents, the AIS Live red dot and GSAP animation. Original exports remain in the parent folder.

The first frame shows the speaker and hook. The glass UI eases in; scene changes use short blur transitions. The founder-company results disclaimer remains in ad 3.

Editable HyperFrames compositions and build scripts:
/Users/aidanstanik/Projects/Video Automation/video-projects/ais-live-ai-os-ads/hyperframes-white-glass

All files fully decoded with no warnings. Final audio matches the verified clean edit exactly through each export. Layout and contrast checks passed. The caption-track density warning is organizational only: captions share a single track without overlap.
''')
