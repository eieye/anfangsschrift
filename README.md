# anfangsschrift (09-SEP-2023)
File <a href="https://github.com/eieye/anfangsschrift/blob/main/full_alphabet.html" target="_blank">&ldquo;full_alphabet.html&rdquo;</a> contains all German upper and lowercase glyphs (A-Z ÄÖÜ, a-z äöüß) in svg/html format.
(NOTE top row shows &ldquo;Anfangsschrift&rdquo; bottom row your device's system-ui font)

&ldquo;Anfangsschrift&rdquo; is a sans-serif mono-linear font intended for foundational writing/reading instruction and practice, ie &lsquo;cognitive automation&rsquo; of the alphabet (and phonics). It adheres to teaching an unconnected/non-cursive (&lsquo;print-style&rsquo;) handwriting.

Letter shapes are deliberately &lsquo;prototypical&rsquo; (generic) for maximum recognition, defining a &lsquo;mean envelope&rsquo; of each character's &lsquo;principal components&rsquo;. &lsquo;Exaggerated&rsquo; features like extra-long ascenders or &lsquo;curls&rsquo; on all connectable stem ends that supposedly aid writing fluency or legibility are generally avoided. 

Emphasis is on &lsquo;smooth&rsquo; proportions inducing hand-writing and building graphomotor intuition for stroke sequence and direction, based on a slightly narrower &lsquo;less geometric&rsquo; overall width.

The font can be used for animation (stroke-wise instruction) and tracing (touch-responsive overwriting), using vanilla CSS-animation attributes and Javascript. A demo is linked at <a href="https://www.jenskreitmeyer.de/alpha/beta/ANIMATION_MOBILE/loadglyphs.html">here</a> (in desktop browsers turn on touch-sim).

Letter shapes are defined by cubic bezier segments describing a single centerline. To convert this (svg) to a normal outline font, use the template from this repository, set a fixed line weight and import the curves in your favorite vector/glyphs editor.
Figures (indo-arabic numerals), punctuation marks (?!) and (&) some special symbols (@#) will be added in the next version.
