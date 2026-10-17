import json
from pathlib import Path

b = Path(__file__).parent
m = json.loads((b / 'run-manifest.json').read_text())
p1 = [
    [41, "It's pretty", "It's crazy"],
    [42.7, 'And the coolest thing is', 'and the coolest thing is originally'],
    [96, 'Which is', 'which is eight hundred'],
    [110, 'So jumping So what this is so what this is called is', "So what this is it's called Artcraft"],
    [121.7, "And they have turned they've created", "they've created all of these craft clones"],
    [159.9, 'So these', 'so these bottom ones'],
    [163, 'from CADcraft', 'from Wordcraft to Deckcraft'],
    [166, 'Word', 'Microsoft applications'],
    [216.8, "Here's their official webs", "here's their official website"],
    [235, "Let's", "let's open up Effectcraft"],
    [272, 'but it has all of its features', 'but all of its features can tie'],
    [280, 'GPT Astra 6', 'GPT 6 Astra'],
    [303, "It's very similar with creating", "And it's very similar"],
    [315, 'We can open up our positions and our t', 'we can open up our transform'],
    [318, 'transform param our', 'transform keyframes'],
    [406, 'So', "so what I'm gonna do"],
]
p2 = [
    [95.3, 'And then if I wanted to', 'And then I tested out the nulls'],
    [142, 'g', 'make sure that everything'],
    [178, 'I love the motion b', 'I love the motion blur'],
    [190, 'Um', "and I'd definitely say"],
    [195, 'I was able to connect my agents and do buil', 'I was able to connect my agents and build'],
    [218, 'We have the timeline stacking so inste', 'we have the timeline layers'],
    [264, 'of those', 'those are the two most used'],
    [294, 'We can', "We don't get as many features"],
    [348, 'um', 'a testing seq sequence'],
    [350, 'seq', 'sequence so test'],
    [353, "and I'm gonna import one of my old YouTube videos Or actually", 'I will import the intro'],
    [520, 'effect or uh', 'Filmcraft sequences'],
    [552, 'inside of the f', 'inside of Filmcraft'],
    [589, 'You have to', 'Okay so this build has no speech to text'],
    [595, 'trans', 'transcriptions You have to import one'],
    [1313, 'nine minute video', 'nine minute and one second video'],
    [1317, 'three minutes and thirty seven', 'three minutes and thirty seven seconds'],
    [1373, 'Now I would', 'Now I would do deep dives'],
    [1386, "But I'm not super familiar with them so I'm just gonna go over", "But I'm not crazy familiar"],
    [1395, 'to give you', 'to give you enough knowledge'],
    [1423, 'Premiere Pro plugin or Premiere plug or', 'Premiere Pro clone'],
    [1437, 'You can', 'you can download the entire GitHub repo'],
    [1464, 'So for exam', 'so for example'],
    [1473, 'and then I also', 'and then because I have Filmcraft'],
    [1478, "So it's gonna install everything down It's uh", "it's gonna install everything into your local device"],
    [1513, 'and do the same exa', 'and do the same exact thing'],
    [1546, 'I have yet to find it', 'I have yet to find the Effects Craft'],
    [1556, "or if that's something that that's something that just hasn't been", "or that's something that I haven't thought over yet"],
    [1582, 'This is the Photoshop Oh', 'This is the Photoshop clone'],
    [1644, "About eighty percent of my subscribers aren't subscr", "About eighty percent of my watchers aren't subscribed"],
]
specs = p1 + [[r[0] + m['source_order'][1]['offset'], r[1], r[2]] for r in p2]
(b / 'edit-specs.json').write_text(json.dumps(specs, indent=2))
print(len(specs), 'editorial decisions')
