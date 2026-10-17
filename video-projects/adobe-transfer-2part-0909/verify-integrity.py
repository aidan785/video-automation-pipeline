import json, subprocess, math, sys
from pathlib import Path
b=Path('video-projects/adobe-transfer-2part-0909/assets');stem=b/(sys.argv[1] if len(sys.argv)>1 else 'clean-v2')
e=json.load(open(str(stem)+'.union-edl.json'));ks=e['keep_ranges'];ds=e['delete_ranges'];dur=e['source_duration']
assert all(math.isfinite(float(e[x])) for x in ['source_duration','edited_duration','removed'])
for ranges in [ks,ds]:
 assert all(0<=r['start']<r['end']<=dur+.00001 for r in ranges)
 assert all(a['end']<=c['start']+.00001 for a,c in zip(ranges,ranges[1:]))
allranges=sorted(ks+ds,key=lambda r:r['start']);assert abs(allranges[0]['start'])<1e-6 and abs(allranges[-1]['end']-dur)<1e-6
assert all(abs(a['end']-c['start'])<1e-6 for a,c in zip(allranges,allranges[1:]))
kept=sum(r['end']-r['start'] for r in ks);deleted=sum(r['end']-r['start'] for r in ds)
assert abs(kept-e['edited_duration'])<1e-6 and abs(deleted-e['removed'])<1e-6 and abs(kept+deleted-dur)<1e-6
p=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(stem)+'.mp4']))
v=next(s for s in p['streams'] if s['codec_type']=='video');a=next(s for s in p['streams'] if s['codec_type']=='audio')
assert int(v['nb_frames'])==round(kept*30),(v['nb_frames'],round(kept*30))
assert v['width']==3840 and v['height']==1080
assert abs(float(v['duration'])-kept)<1/30 and abs(float(a['duration'])-kept)<.025
assert abs(float(v['duration'])-float(a['duration']))<.025
firstpart=sum(max(0,min(r['end'],3805.633333333)-r['start']) for r in ks if r['start']<3805.633333333)
result=dict(result='PASS',keep_ranges=len(ks),source_seconds=dur,deleted_seconds=deleted,kept_seconds=kept,video_frames=int(v['nb_frames']),expected_frames=round(kept*30),video_seconds=float(v['duration']),audio_seconds=float(a['duration']),av_duration_difference=abs(float(v['duration'])-float(a['duration'])),part2_starts_at=firstpart,size_bytes=int(p['format']['size']),full_source_partition=True)
Path(str(stem)+'.integrity.json').write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
