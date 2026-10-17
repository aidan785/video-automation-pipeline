import json
from pathlib import Path
b=Path(__file__).parent;a=b/'assets';p=a/'source.json';t=json.loads(p.read_text());(a/'source.before-repairs.json').write_text(json.dumps(t))
repairs=[(130.36,130.99),(281.12,281.67),(369.74,370.29),(383.98,384.24),(568.22,568.51),(700.22,700.75),(704.14,704.60),(930.77,931.32),(1028.81,1029.16),(1132.72,1133.34),(1201.34,1201.64),(1252.20,1252.69),(1289.40,1289.69),(1365.99,1366.38)]
for s,e in repairs:
 w=min((w for w in t['words'] if w['type']=='word'),key=lambda w:abs(w['start']-s))
 if abs(w['start']-s)>.08:raise Exception((s,w))
 w['end']=e
p.write_text(json.dumps(t,indent=2));(a/'transcript-repairs.json').write_text(json.dumps(dict(end_repairs=repairs,evidence='isolated Scribe transcripts and 50ms source-audio RMS; 70ms tail guard'),indent=2))
