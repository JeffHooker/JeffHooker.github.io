# Tiny Crew episode engine

Code-drawn vertical shorts (1080x1920, 30 fps) for Jeff's Tiny Crew channel. Not part of the flocs app.

- `film.js` draws every frame of an episode on a canvas (`draw(t)`, t in seconds). Episode 1 is "The Hairball".
- `audio.py` writes the music and sound effects to `audio.wav` (needs numpy).
- `render.js` films the canvas with Playwright and encodes one mp4 per scene with ffmpeg.

## Render

    npm install
    python3 audio.py
    node render.js preview 2 9.9 17.3 23      # contact sheet of stills -> preview.jpg
    node render.js full                       # s1..s4.mp4 (or: full s4 to redo one scene)
    printf "file s1.mp4\nfile s2.mp4\nfile s3.mp4\nfile s4.mp4\n" > list.txt
    ffmpeg -f concat -i list.txt -c copy silent.mp4
    ffmpeg -i silent.mp4 -i audio.wav -map 0:v -map 1:a -c:v copy -c:a aac -shortest episode.mp4

Scene frame ranges live in `render.js`; they must match the timeline in `film.js` and the length in `audio.py` (25.5 s).

## Episodes

- Episode 1, The Hairball: `node render.js full` (uses film.js and audio.py)
- Episode 2, The Sock Heist: `python3 audio2.py && EP=ep2 node render.js full` (ep2.js loads on top of film.js and sets its own scene list; outputs ep2-s1..s3.mp4)
- Channel art: `node art.js <output-folder>` draws the icon and banner artwork (art-draw.js)

A new episode is a new `epN.js` that defines `window.SCENES` and `window.draw`, plus an `audioN.py`.
