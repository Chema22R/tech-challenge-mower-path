# Tech Challenge - Mower Path

To run the script, just execute `node main.js`.

The input is line by line and it's finished after pressing `CTRL + C`. There's input validation, so pasting multiple lines at once might result in messages being prompted between lines (invalid lines are not stored and it ask for the line corrected before continuing).

Two assumptions were made for the challenge:
- The limit of the plateau is treated as a no-go-place, so mowers that try to move towards the limit cannot move. A plateau is defined as an area of fairly level high ground, so the logical behavior would be that mowers that try to move towards the limits just fall out of the plateau, but as there is specified that mowers have cameras to inspect the terrain, we will assume that the cameras can detect the limit and avoid the fall.
- Mowers collisions are possible, so them would not move if a mower is already on the position they would move to.
