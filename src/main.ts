import { Devvit, type TriggerContext } from "@devvit/public-api";
import { parseNamedBlocks } from "./customFormat.js";

Devvit.configure({
  redditAPI: true,
});

Devvit.addSettings([
  {
    type: 'paragraph',
    name: 'messages',
    label: 'Ban Messages',
    helpText: 'look at the readme for how to format. markdown supported',
    // defaultValue:
  },
  {
    type: 'string',
    name: 'allowed-users',
    label: 'Allow banning from (case-insensitive)',
    helpText: 'comma seperated usernames without the u/. i reccomend only putting bots to prevent abuse',
    defaultValue: 'Automoderator',
  }
]);

Devvit.addTrigger({
  event: 'CommentCreate',
  async onEvent(event, context) {
    const regexp = /!ban(?:\s*user)?\s+(\d{1,3}|permanent)\s+"([^"]+)"(?:\s+(remove))?/i,
      subredditName = context.subredditName || (await context.reddit.getCurrentSubredditName()),
      body = event.comment?.body, automodComment = event.comment;

    if (body && automodComment) {
      const list = (await context.settings.get<string>('allowed-users'))?.toLowerCase().split(/,/g).map(str => str.trim()),
        summonedBy = (await context.reddit.getUserById(automodComment.author))?.username;
      if (list?.length && summonedBy) {
        const summonedByLower = summonedBy.toLowerCase();
        if (!list.includes(summonedByLower)) return console.log(`summonedByLower (${summonedByLower}) is not in ["${list.join('", "')}"]`);
      } else return console.log(`list or summonedBy is empty or undefined`);

      const userItem = await getItemById(automodComment.parentId, context);
      console.log(userItem?.id, automodComment.parentId);
      if (userItem) {
        const messages = await context.settings.get<string>('messages'),
          regexpMatchArray = regexp.exec(body), username = userItem.authorName;
        if (regexpMatchArray) {
          const duration = +(regexpMatchArray[1].toLowerCase()
            === "permanent" ? "0" : regexpMatchArray[1]),
            reason = (regexpMatchArray[2] ?? 'Other').trim(),
            remove = Boolean(regexpMatchArray[3]);
          await context.reddit.banUser({
            username, subredditName,
            duration, context: userItem.id,
            message: parseNamedBlocks(messages ?? '')[reason],
            reason: `Caught and summmoned by u/${summonedBy}`,
          });
          if (remove)
            await context.reddit.remove(automodComment.id, false);
        }
      }
    }
  },
});

export default Devvit;
function getItemById(itemId: string, context: TriggerContext) {
  switch (itemId.slice(0, 3)) {
    case "t1_":
      return context.reddit.getCommentById(itemId);
    case "t3_":
      return context.reddit.getPostById(itemId);
    // case "t2_": return context.reddit.getUserById(itemId);
  }return undefined;
}
