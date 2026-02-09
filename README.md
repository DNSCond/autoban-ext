# Automoderator Ban Extension (u/autoban-ext)

Automoderator Ban Extension is a devvit app that bans users on behalf of automoderator.

to ban a user via automoderator simply write "`!ban user 10 "reason"`" in a comment block the automoderator config.

the "`!ban user`" can be in any case and the space is optional. `!ban` works too  
the "`10`" is the number of days to ban for, you can also use the word "`permanent`" (case-insensitive) for a permanent ban (0 for permanent also works).

the `"reason"` is the link to your custom message (case-sensitive).

you can append "` remove`" to have u/autoban-ext remove the comment automoderator just made.
it can still be seen in the user's notifications but not by anyone else.

## Ban Message Format

the Ban Message Format uses the Named Block Text Format (defined below).
each block is one message, and its name identifies it when reason is used.

### Named Block Text Format

the Named Block Text Format consists of Blocks.

- each Block is seperated by "`---`" on a line of its own.
- Optional `name`: line defines the block’s key. Only the text after `name`: is used as the key.
  - while optional, if you do not put a "`name: `" its name will be the empty string, which is rarely what you want.
- everything after that until the end of the block is the value. Any text is allowed in the value, except a line consisting solely of --- (used to start a new block)..

#### examples

```
name: documentation
# Named Block Text Format

the Named Block Text Format consists of Blocks.

- each Block is seperated by "`---`" on a line of its own.
- Optional `name`: line defines the block’s key. Only the text after `name`: is used as the key.
  - while optional, if you do not put a "`name: `" its name will be the empty string, which is rarely what you want.
- everything after that until the end of the block is the value. Any text is allowed in the value, except a line consisting solely of --- (used to start a new block)..
---
name: "edge case"
these quotes are part of the resulting string.
---
this block's name is "" in javascript.
---
name: warning
please be careful if your text starts with `name: `, you should always use a name explicitly
---
name: "edge case 2"
name: "edgy Text"
note that trying to use 2 names doesnt work.

Only the first name: line in a block is treated as the key. Any subsequent name: lines are part of the value.”
```

## Who to allow Banning.

of course u/AutoModerator wont be the only moderator bot in your subreddit,
but automoderator is the bot that cant ban natively.

to have any other person or bot be able to use the commannd i described above.
simply write their username in the subreddit config on the developers.reddit.com site.

## examples of usage

[see on github (https://github.com/DNSCond/autoban-ext/blob/main/example-configs.md)](https://github.com/DNSCond/autoban-ext/blob/main/example-configs.md)

## u/autoban-ext's socials

[https://developers.reddit.com/apps/autoban-ext/](https://developers.reddit.com/apps/autoban-ext/),
[https://github.com/DNSCond/autoban-ext](https://github.com/DNSCond/autoban-ext).

## See Also

### Custom Mute (u/custommute)

for the command in modmail and to mute.

[https://developers.reddit.com/apps/custommute/](https://developers.reddit.com/apps/custommute/),
[https://github.com/DNSCond/custommute](https://github.com/DNSCond/custommute).

by using both these bots you can ban and mute at the same time.
