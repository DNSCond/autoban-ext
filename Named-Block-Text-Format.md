# Named Block Text Format

the Named Block Text Format consists of Blocks.

- each Block is seperated by "`---`" on a line of its own.
- Optional `name`: line defines the block’s key. Only the text after `name`: is used as the key.
  - while optional, if you do not put a "`name: `" its name will be the empty string, which is rarely what you want.
- everything after that until the end of the block is the value. Any text is allowed in the value, except a line consisting solely of --- (used to start a new block)..

## examples

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
