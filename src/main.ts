import { Devvit, type TriggerContext } from "@devvit/public-api";
import { parseNamedBlocks } from "./customFormat.js";
import { ResolveSecondsAfter } from "anthelpers";
import { mappingFilter, toolBox } from "./mappingFilter.js";

Devvit.configure({
  redditAPI: true,
  redis: true,
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
    label: 'Allow banning by',
    helpText: '(case-insensitive) comma seperated usernames without the u/. i reccomend only putting bots to prevent abuse',
    defaultValue: 'Automoderator',
  },
  {
    type: "group",
    label: 'Warnings',
    fields: [
      {
        type: "boolean",
        name: 'enabled',
        label: 'Enabled',
      },
      {
        type: "paragraph",
        name: 'banUponWarnings',
        label: 'Ban Messages When Strikes exceed their limit',
        helpText: 'https://github.com/DNSCond/autoban-ext/blob/main/Warnings.md',
        onValidate({ value }) {
          try {
            if (value) {
              const set = new Set, object = parseNamedBlocks(value, { duplicateDisambiguation: "error" });
              if ('_settings' in object) throw TypeError('no key may be exactly named "_settings" for future compatibillity');
              Object.entries(object).forEach(([key, _value]) => {
                const matchArray = /^\((\d+),\s*(\d{1,3})d\)\s+([^"]+)/.exec(key);
                if (matchArray) {
                  if (set.has(matchArray[3])) throw TypeError('duplicate ban message');
                  set.add(matchArray[3]);
                  if (matchArray[1] === '0') throw RangeError('strikes until ban is 0. use !ban instead');
                } else {
                  throw TypeError('invalid ban message name');
                }
              });
            } else {
              throw TypeError('Strike Stay Time is undefined');
            }
          } catch (error) { return String(error); }
        }
      },
      {
        type: 'string',
        name: 'warning-stay-time',
        label: 'Strikes Stay Time',
        helpText: 'https://developers.reddit.com/apps/custommute',
        defaultValue: '72h',
        onValidate({ value }) {
          try {
            if (value) {
              const time = parseTime(value);
              if (time?.seconds) {
                if (time.seconds < (60 * 60)) {
                  throw RangeError('Strike Stay Time must be greater than 1 hour');
                } else if (time.seconds > (7_776_000)) {
                  throw RangeError('Strike Stay Time must be less than 90 days');
                }
              } else {
                throw TypeError('Strike Stay Time is not in the valid format');
              }
            } else {
              throw TypeError('Strike Stay Time is undefined');
            }
          } catch (error) { return String(error); }
        },
      },
    ]
  }
]);

function parseTime(string: string): { seconds: number; units: number; unitMatched: string; } | null {
  const commandMatch = string.match(/^(\d+)\s*(hour|minute|second|day|h|m|s|d)s?$/) as RegExpMatchArray | null;
  if (commandMatch) {
    const unit = commandMatch[2].charAt(0).toLowerCase();
    let units = +commandMatch[1], seconds = units, unitMatched;
    switch (unit) {
      case "s":
        seconds = seconds;
        unitMatched = 'Seconds';
        break;
      case "h":
        seconds = seconds * 60;
        unitMatched = 'Hours';
      case "m":
        seconds = seconds * 60;
        if (unitMatched !== 'Hours')
          unitMatched = 'Minutes';
        break;
      case "d":
        seconds = seconds * 86400;
        unitMatched = 'Days';
        break;
      default:
        throw TypeError('unknown time unit');
    }
    return {
      seconds, units,
      unitMatched,
    };
  } else return null;
}

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
            note: reason,
          });
          if (remove)
            await context.reddit.remove(automodComment.id, false);
        } else if (await context.settings.get<boolean>('enabled')) {
          const regexp = /!(?:strike|warn)(?:\s*user)?\s+(\d{1,2})\s+"([^"]+)"/i,
            regexpMatchArray = regexp.exec(body), now = new Date,
            time = parseTime(await context.settings.get<string>('warning-stay-time') ?? 'null');
          if (regexpMatchArray && time?.seconds) {
            const expires = ResolveSecondsAfter(time.seconds, now),
              userId = await context.reddit.getUserByUsername(username);
            if (!userId) return;
            const redisKey = `warningsOf:${userId}-${regexpMatchArray[2]}`,
              warnings = await context.redis.get(redisKey);
            const warningsArray = warnings?.split(/,/) ?? Array(),
              warningsN = Array(+regexpMatchArray[1]).fill(expires.toISOString());

            const nowMs = +now, timestampArray = Array(),
              unfiltered_newWarningsArray = warningsArray.concat(warningsN),
              newWarningsArray = mappingFilter(unfiltered_newWarningsArray, dateStr => {
                const date = Date.parse(dateStr);
                if (date > nowMs) {
                  timestampArray.push(date);
                  return dateStr;
                } else {
                  return toolBox.removeItem;
                }
              }), expiration = new Date(Math.max(...timestampArray,
                // seconds or negative on error, is safe.
                await context.redis.expireTime(redisKey) * 1000,
              ));

            await context.redis.set(redisKey, newWarningsArray.toString(), { expiration });
            const warningsUntilBan = await context.settings.get<string>('banUponWarnings'),
              currentWarnings = newWarningsArray.length;
            if (warningsUntilBan) {
              const object = parseNamedBlocks(warningsUntilBan, { duplicateDisambiguation: "error" }),
                something = Object.entries(object).map(([key, message]) => {
                  const matchArray = /^\((\d+),\s*(\d{1,3})d\)\s+([^"]+)/.exec(key);
                  if (matchArray) return {
                    duration: +matchArray[2],
                    key: matchArray[3], message,
                    warningsUntilBan: +matchArray[1],
                  }; return null;
                }).find(element => {
                  if (element) if (currentWarnings >= element.warningsUntilBan)
                    return regexpMatchArray[2] === element.key;
                  return false;
                });
              if (something) {
                const { message, duration, key } = something;
                await context.reddit.banUser({
                  username, subredditName,
                  duration, context: userItem.id,
                  reason: `Caught and summmoned by u/${summonedBy}`,
                  message, note: key,
                });
              }
            }
          }
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
