import json,re
from pathlib import Path
b=Path(__file__).parent;a=b/'assets';t=json.loads((a/'expected-final-transcript.json').read_text());tokens=[re.sub("[^a-z0-9']",'',w['text'].lower()) for w in t['words']];tokens=[x for x in tokens if x]
phrases='''hello hello
what would happen if we connected
stick to the end of this video
In this video I ran
generating the physics
generating scenes using physics
you might be surprised because there is
you might be surprised because these test scenes
and then of course the most intense one that I tried
tested inside
performed inside of Blender
So if I play this you can see that the collision
And I just wanna note that these are all generated
So I'm happy that
So I'm really impressed
and so that inspired me
here is the final rendered output
play around with different materials
understands how to do and why
essentially turning this liquid motion
We just We
We essentially just render out the water
and then we can
And then when we render out the actual video
we can get those files
those files essentially are compressed
That is to my best
And then we get a clean output like this
because again we have
The level of this water
and when the gate is released
I can't really determine
I can't really say
they are both very very similar
And again it's just
And I'm happy with both outputs
now this next scene
delete that
But stick with me here
And so this is where I started to think
this is not really effective
And so that brought me to this
And so that brought me to build out
I thought of Dune
collision collision
collision simulation which I was really happy with
and so with that prompt
and so with that and its knowledge
But but
technically two prompts
Now I have one more simulation
exactly what I was going for
They don't seem to be
It doesn't seem like there's a massive difference
or the or a drop test
or a drop test on these jelly blocks
But there you have it
That's how you can utilize
That's how I utilize
I hope you guys enjoy
I hope you guys enjoyed
Thanks'''.splitlines()
checks=[]
for p in phrases:
 xs=[re.sub("[^a-z0-9']",'',x.lower()) for x in p.split()];n=sum(tokens[i:i+len(xs)]==xs for i in range(len(tokens)-len(xs)+1));checks.append({'phrase':p,'expect':n,'from':'Expected kept source words after the 42 approved cuts'})
(a/'verify-phrases.json').write_text(json.dumps(checks,indent=2));print('Prepared',len(checks),'phrase checks')
