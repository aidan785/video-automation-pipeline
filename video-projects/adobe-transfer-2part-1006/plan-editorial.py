import json
from pathlib import Path

b = Path(__file__).parent
m = json.loads((b / 'run-manifest.json').read_text())
p1 = [
    [7, 'Maybe not the strip club', "I'm sure you've seen by now"],
    [30.7, 'or even real time Pokemon b', 'or even Minecraft TNT'],
    [57.8, "And if you're wondering", 'and this is all built through Claude'],
    [68, 'to', 'to merge your two favorite games'],
    [96.9, "I've gone into", 'I have gone into this absolute rabbit hole'],
    [130.0, 'And this is', 'this opens up a whole new realm'],
    [139.6, "I personally don't have any", "I personally don't have any game development experience"],
    [160.1, 'So three game', 'so two games merged into one'],
    [204.8, 'Or even Wii Sports in Modern War', 'or even Wii Sports in Call of Duty'],
    [219.4, 'Or even Wii Sports or even Wii Sports inside of Zombies', 'This is like ridiculous'],
    [252.8, 'Minecraft inside of', 'Minecraft inside of Elden Ring'],
    [261.7, 'These are actual t', 'these are actual games merged together'],
    [353.8, 'Spider Man and Gyth Spider Ma', 'Spider Man and Gotham'],
    [367.9, 'Escape from', 'Minecraft and R2 D2'],
    [376.8, 'Minecraft and Red Dead', 'Minecraft and Red Dead Redemption'],
    [384, 'and in this article they kind of', 'So I highly recommend checking out this article'],
    [432.1, 'Y', 'you ask them to open up how they work'],
    [436, 'how can Mario be integrated into Ring versus Mar', 'How can Minecraft be merged into GTA 5'],
    [485.0, "So you're so you're", "so you're putting one game in the shell"],
    [502.6, "But it's not It's comple", "But it's not It's completely playable"],
    [523.3, 'So this GitHub repo has gone viral because of So this GitHub repo', 'So how can you actually start connecting'],
    [554, "It is called the Universal Model It's called the Uni", "It's called the Universal Modder"],
    [644.8, 'But if you are on a Windows computer', 'But if you are on a Windows computer you are in luck'],
    [683, 'you will find a setup guide to connect your two favorite gran You will s', 'You will find a setup MD project structure folder'],
    [750, 'So again this so again this', 'so again this is going to be tailored'],
    [786, "we're gonna lu use this", "we're gonna use this tool"],
    [808.9, 'You can also go and find Minecolonia', 'You can also find other alternatives like Minecolonia'],
    [819, "It's just like an open source Minec", "it's just an open sourced Minecraft alternative"],
    [829, 'Because if you do wanna clone bec', 'because if you do want to mesh your two games'],
    [884, 'and set up e', 'and set up the whole session for you'],
    [907.9, "And then finally and then finally And so the game that we're gonna clone", "and so the game that we're gonna mesh Minecraft with is Doom"],
    [916, "And Doom's", 'It is the OG game of all OG games'],
    [924, "I wasn't even alive when it first came out I will delete that I was alive", "It's an eight bit shooter style game"],
]
p2 = [
    [43, 'assets references s', 'assets references scripts'],
    [72.9, 'And based on that And base', "And based on that answer it's going to split"],
    [90.3, 'For example on Window for example on Mac if you have', "For example on Mac if you don't have"],
    [193.7, 'And then I get', 'And then in that zip file'],
    [223.8, 'This is just how it downloaded', "This is just what it's going to download"],
    [244.7, 'Some troublesu some troubleshooting M', 'a troubleshooting markdown file'],
    [292, 'how this is', 'how this folder is structured'],
    [323.5, 'So once', 'so once you have the game mashup setup'],
    [389.5, 'your agents can', 'your agents can start working as soon as possible'],
    [406, 'com', 'two completely free games'],
    [413.7, 'You also make su', 'you also need to make sure'],
    [457.4, 'You can navigate back', 'you can navigate back to your Game Mashup Setup'],
    [466, 'where you', 'wherever you stored that'],
    [498, "and it's going to download all the s", "and it's going to download all the files"],
    [737, 'We have', "I don't know what these"],
    [738, 'these is', 'these are'],
    [1109.5, 'You need to give them a chance to', 'Oh shit'],
    [1169.3, 'And it is', 'and it is pretty fun'],
]
specs = p1 + [[x[0] + m['source_order'][1]['offset'], x[1], x[2]] for x in p2]
(b / 'edit-specs.json').write_text(json.dumps(specs, indent=2))
print(len(specs), 'editorial decisions')
