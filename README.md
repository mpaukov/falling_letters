# A typing keyboard game with falling letters.

# Rules of the game:

1. Game starts after pressing start button
2. Game session lasts 20 seconds
3. Golden Letters are harder to get, however they give twice as many points.

# Implementation details:

1. After each session show a screen with total score details(formula of total score visualized for player - total points + (total golden letters \* golden letter price)

# config.json

The configuration file contains the basic default settings for the game to work.<br>
colors - gold should always be the last one.<br>
timeInterval - for the session time<br>
timeLetterRespawn - time for respawning of letters<br>
timeDelay - the time after which the background changes after the game session<br>
letterSpeed - changing the position of the letter in each frame in px<br>
probability - the probability of appearing the Gold letter<br>
price - for normal and Gold letters
