spotifizer
===============

####V 0.1 by Jerry Liu

A Spotify audio visualizer based on [emiax](https://github.com/emiax)'s [castafiore](https://github.com/emiax/castafiore).

It splatters pastel colored paint on an WebGL canvas as appropriate in the music.

![Spotifizer](https://raw.github.com/personjerry/spotifizer/master/images/screenshot.jpg)

---

##Instructions:

1. Clone this entire folder.
2. Create the folder ~/Spotify (Mac, Linux) or My Documents/Spotify (Windows)
3. Place this entire folder inside the folder you just created.
4. Run Spotify.
5. Start playing your favorite song.
6. Type this into your search bar without the quotes: "spotify:app:spotifizer"
7. Enjoy!
8. If you leave the app, you can press "back" until you return to it.

---

Note: If you restart Spotify, you'll need to type in "spotify:app:spotifizer". This is because Spotify ended their official app support a while ago, so you can only run them locally, but Spotify tries to load it from a nonexistent repository online upon restarting. This happens even if you "favorite" it, but if you find a solution, email me!

Note: It doesn't work perfectly as it uses a primitive analysis method, so if you really want to see it a full capacity, try an upbeat song with plenty of both treble and bass, like perhaps "I'm a Believer" by Smash Mouth. I can think of another way to perform the analysis, but it would take significant time to write, so that may or may not happen.

Again, most of the work is by [emiax](https://github.com/emiax)! I've just made it more accessible and pretty :)
