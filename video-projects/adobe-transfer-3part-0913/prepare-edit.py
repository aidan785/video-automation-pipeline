import json
from pathlib import Path
b=Path('video-projects/adobe-transfer-3part-0913');p=b/'assets/source.json';t=json.loads(p.read_text())
# Repair transcript timing from isolated source-audio transcriptions, before planning.
repairs=[(125.98,126.0,126.42),(174.14,174.14,174.38),(393.95,393.94,394.22),(565.57,565.58,566.06),(644.08,715.94,716.14),(892.29,892.64,896.52),(1003.45,1003.46,1003.62)]
for old,s,e in repairs:
 w=next(w for w in t['words'] if w['type']=='word' and abs(w['start']-old)<.015);w.update(start=s,end=e)
# Scribe merged the spoken slash command; preserve each audible word.
slice=json.loads((b/'assets/isolate-594.json').read_text())['words']
new=[dict(w,start=w['start']+594,end=w['end']+594) for w in slice if w['type']=='word' and 598.5<w['start']+594<604]
t['words']=[w for w in t['words'] if not (598.46<=w['start']<=603.1)]+new
t['words'].sort(key=lambda w:(w['start'],w['end']));t['text']=' '.join(w['text'] for w in t['words'] if w['type']=='word');p.write_text(json.dumps(t,indent=2))
# Each row: approximate source time, exact abandoned phrase, following kept anchor.
specs=[
[37,'And it isn\'t just','And there\'s a lot'],
[72,'And if I click on each one of these and if I click inside of these you can see','And if I click inside of the precomps'],
[108.6,'Everything is organized','GPT-6 Astra does'],
[114,'utilizing the','utilizing the software'],
[118,'but then also organizing everything but then also organizing everything ins','but then also organizing everything inside'],
[142,'And it\'s built with all one single prompt','So gone are these days'],
[150.46,'and you have to tweak each','And if you want to tweak something'],
[164,'If you are an avid','if you are an avid and daily'],
[173,'Now one thing I do wanna note is','now one thing I do wanna note is'],
[202,'So so about four months ago','so about four months ago I made'],
[220,'But to to','but moving forward'],
[249,'So this is a video j','So again'],
[250.4,'this is completely','this is completely generated'],
[257,'So this','so this video right here'],
[278.22,'I\'d never utilize this with a c','I\'d never utilize this with a client'],
[295,'it\'s going to be it\'s going to play','I personally think'],
[322,'So the tool we\'re gonna be using today is from Higgsfield And','So the tool we\'re gonna be using today'],
[329.42,'And before','And the great thing'],
[349.28,'which now Higgsfield MC','The Higgsfield MCP can'],
[355,'You get both uh you get','you get both of the best worlds'],
[381,'the Higgsfield mo','the Higgsfield AI Motion Designer'],
[389,'You\'ll see they go over some','You\'ll see they go over a walkthrough'],
[398,'And what I found best is','So all we need to do'],
[407.94,'type in the command in the chat','Type this command in the chat'],
[436,'So so hop into','so hop into ChatGPT'],
[458.13,'whatever model whatever effort mo','whatever effort level'],
[501,'and we\'re gonna f','and then we need to locate'],
[503.93,'This is','we\'re gonna find the Higgsfield plugin'],
[556,'we can We have the Higgsfield plugin we have the Higgsfield plugin logged We have the Higgsfield','we have the Higgsfield plugin plugged'],
[571,'And then again','and then again you can call'],
[605,'Use-After-Effects','We will shoot that off'],
[715,'Okay we can see Higgsfield Use','We can see that the Higgsfield'],
[781.91,'and ex','and give the human'],
[790,'So for So I always','So I went to this site'],
[798.71,'ins','inspiration'],
[810.77,'a motion','a motion design walkthrough'],
[824.99,'medi','media'],
[883.87,'to build something in After S uh','to build something in After Effects'],
[923,'Especially if you\'re a guy and you','So now you can see'],
[958.61,'what I believe','which I believe it has already'],
[974,'Then','Which then we can iterate'],
[980,'Okay it just finished up and it might uh','Okay it just finished up'],
[1038,'So again you can create these','Okay now it looks'],
[1042,'the','the full thing'],
[1054,'or done like','iterating with GPT-6'],
[1063.89,'or for your','or for your app'],
[1072,'So I\'m really excited to see So I\'m really excited','So I am really excited to see where'],
[1158,'And w I\'m','and I\'m really curious'],
[1168,'If you do If you did find this video resourceful or usef','If you did find this video resourceful or useful at all'],
[1180.67,'a lot uh on','a lot on this type']
]
(b/'edit-specs.json').write_text(json.dumps(specs,indent=2))
(b/'assets/transcript-repairs.json').write_text(json.dumps({'repairs':repairs,'command_split':new,'evidence':'isolate-*.json generated from original source.wav'},indent=2))
