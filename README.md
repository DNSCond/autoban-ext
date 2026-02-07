# Automoderator Ban Extension (u/autoban-ext)

Automoderator Ban Extension is a devvit app that bans users on behalf of automoderator.

to ban a user via automodertaor simply write "`!ban user 10 "reason"`" in the automoderator config.

the "`!ban user`" can be in any case and the space is optional.  
the "`10`" is the number of days to ban for, you can also use the word "`permanent`" (case-insensitive) for a permanent ban (0 for permanent also works).

the `"reason"` is the link to your custom message (case-sensitive).

you can append "` remove`" to have u/autoban-ext remove the comment automoderator just made.
it can still be seen in the user's notifications but not by anyone else.

## Ban Message Format

to format custom ban messages, write "`name: `" and then the reason as above, then write the ban message the user will see.
for example

```
name: spam
please stop spamming our subreddit
```

to add multiple responses write "`---`" and then the same format.
for example

```
name: spam
please stop spamming our subreddit
---
name: harrasment
stop harrasing our users
```

you can even add multiple paragraphs and markdown

```
name: spam
please stop spamming our subreddit
---
name: harrasment
stop harrasing our users
---
name: hot potato
# Hot Potato - Game Rules

## Objective
Avoid being the player holding the "hot potato" when the music stops.

## Number of Players
- Minimum: 3  
- Maximum: Unlimited  

## Materials Needed
- A soft object to serve as the "hot potato" (ball, beanbag, etc.)  
- Music player  

## Setup
1. Players sit or stand in a circle.  
2. Choose someone to start with the "hot potato."

## How to Play
1. Start the music.  
2. The player holding the potato passes it to the next player in the circle.  
3. Continue passing the potato while the music plays.  
4. When the music stops, the player holding the potato is **out**.  
5. Remove that player from the circle.  
6. Restart the music with the remaining players.  

## Winning
- The game continues until only one player remains.  
- The last player remaining is the **winner**.  

## Optional Rules
- **Speed Variation:** Increase the speed of the music as the game progresses.  
- **Reverse Direction:** Occasionally reverse the passing direction.  
- **Multiple Potatoes:** Use more than one potato to make the game more challenging.  
```

[not sure why you want to send the ai generated rules of hot potato in someone's ban message but you can](https://chatgpt.com/share/69875c35-e7cc-800c-a635-fe707216cf40).

### Who to allow Banning.

of course u/AutoModerator wont be the only moderator bot in your subreddit,
but automoderator is the bot that cant ban natively.

to have any other person or bot be able to use the commannd i described above.
simply write their username in the subreddit config on the developers.reddit.com site.
