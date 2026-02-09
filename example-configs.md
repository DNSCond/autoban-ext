# example-configs

here are some examples you can use.

## u/AutoModerator Himself

[Full AutoModerator documentation](https://www.reddit.com/r/reddit.com/wiki/automoderator/full-documentation/)

### Ban everyone Linking to onlyfans.com

#### configuration AutoModerator

```yaml
domain: onlyfans.com
comment: |
  in our subreddit we do not want links to only fans.

  !ban 10 "only fans"
moderators_exempt: false
```

#### configuartion autoban-ext

```
name: only fans
in our subreddit we do not want links to only fans.
```

### ban and mute anyone referencing the by the word "epstein"

[you will need to have Custom Mute installed too (installable here)](https://developers.reddit.com/apps/custommute/).

#### configuration AutoModerator

```yaml
body: epstein
comment: |
  shut the fuck up about the epstein files

  !ban 10 "epstein"
moderators_exempt: false
```

#### configuartion autoban-ext

```
name: epstein
shut the fuck up about the epstein files

!mute 40 hours
```

## Flooding Assistant (u/floodassistant)

[install Flooding Assistant (u/floodassistant)](https://developers.reddit.com/r/vast_attention/apps/floodassistant).

basically any bot that can make comments as a reddit account can be used.
for example, if someone spams your subreddit you can add the ban user command to the bot's comment
and add their name to autoban-ext's config.

### ban everyone who posts too much

#### configuartion Flooding Assistant
configure your Flooding Assistant's installation and change these

removal comment:
```
Hi /u/{{author}}! Thanks for posting to /r/{{subreddit}}. Unfortunately, [your {{kind}}]({{permalink}}) was removed for the following reason:

* Please do not flood the subreddit with posts. You may only submit {{quota_amount}} posts within a {{quota_period}} hour period. Please wait a while and try again!

If you have questions about this, please [contact our mods via moderator mail](https://www.reddit.com/message/compose?to=/r/{{subreddit}}) rather than replying here. Thank you!

!ban User 1 "spam"
```

#### configuartion autoban-ext

```
name: spam
stop spamming our subreddit
```
