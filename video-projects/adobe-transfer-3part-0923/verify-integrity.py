import json,sys,subprocess
from pathlib import Path
b=Path(__file__).parent;a=b/'assets';v=sys.argv[1];p=a/f'clean-{v}';e=json.loads(Path(str(p)+'.union-edl.json').read_text());probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(p)+'.mp4']));vs=next(x for x in probe['streams'] if x['codec_type']=='video');au=next(x for x in probe['streams'] if x['codec_type']=='audio');k=e['keep_ranges'];d=e['delete_ranges'];checks={}
checks['duration_math']=abs(sum(x['end']-x['start'] for x in k)-e['edited_duration'])<.00001
intervals=sorted([(x['start'],x['end'],'keep') for x in k]+[(x['start'],x['end'],'delete') for x in d]);checks['complete_partition']=abs(intervals[0][0])<1e-5 and abs(intervals[-1][1]-e['source_duration'])<1e-4 and all(abs(intervals[i][1]-intervals[i+1][0])<1e-5 for i in range(len(intervals)-1))
checks['frame_count']=int(vs['nb_frames'])==round(e['edited_duration']*30)
checks['av_sync']=abs(float(vs['duration'])-float(au['duration']))<.05
checks['resolution']=vs['width']==3840 and vs['height']==1080
checks['fps']=vs['r_frame_rate']=='30/1'
report=dict(result='PASS' if all(checks.values()) else 'FAIL',checks=checks,expected_frames=round(e['edited_duration']*30),actual_frames=int(vs['nb_frames']),video_duration=vs['duration'],audio_duration=au['duration'],keep_segments=len(k))
Path(str(p)+'.integrity.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2));sys.exit(0 if all(checks.values()) else 1)
