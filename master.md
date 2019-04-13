# Pong
Classic Arcade Table Tennis Game!

## Tasks to do
- Develop AI opponent
- Alter paddle speeds
- Fix collision detection imperfections
- Add spin


## Notes
- https://codeincomplete.com/posts/javascript-pong/part5/
- https://gamedev.stackexchange.com/questions/57352/imperfect-pong-ai
- Use a combination of both approaches. Use the invisible ball AI, the opponent predicts where the invisible ball will reach but it is slower than the ball, so there are chances it might not get there. This can be modified by tweaking the reaction time and an error value. These values change according to how well the human plays or the difficulty setting.
- One more change that needs to be made is how fast P0 paddle moves. If it is too fast, it will be very easy to quickly move and hit the ball. The speed has to be fixed so that the player has to predict where the ball will end up in advance.
- Make the ball spin.
- Fix all collision detection bugs.


## BUGS
- **FIXED(!)** Plate doesn't stay within bounds
- Ball keeps bouncing in straight lines if it hits the plate exactly perpendicular
- **FIXED** Pause doesn't work 
- AI is too perfect
- Once the ball bounces off p0 , p1 doesn't adjust properly
- No option to restart the game
- Add correction for choppy graphic updation
- No menu to configure the game

## Documentation
#### GAME FUNCTIONALITY
- **init()** Sets up all game objects (Plates, Ball, Invisible Ball)
- **run()** Starts the game loop
- **updateGame()** Executed at every iteration of the game loop to update game state
- **clearFrame()** Clears canvas draws the empty board
- **setupEventListeners()** Sets up event listeners for space bar, arrow keys, mouse