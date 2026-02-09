# Named Block Text Format

This format stores **text blocks with optional names**. It is designed to be **human-readable and human-editable**, perfect for templates, autoresponders, or simple key/value content.

---

## 1. File Structure

* Each **block** consists of:

  1. Optional **name line**:

     ```
     name: BLOCK_NAME
     ```

     * If omitted, the block uses the default empty key `""`.
  2. **Block content**: any text lines after the name line.

     * Can include empty lines.
     * Indentation is preserved; optional dedent may be applied by parser.
* Blocks are **separated by a line containing only `---`**:

```text
name: GREETING
Hello, world!
How are you?
---
name: FAREWELL
Goodbye!
See you later!
```

---

## 2. Key Rules

* Only the **first line starting with `name:`** is interpreted as the key.
* All lines after the first line belong to the block **value**.
* Values can contain any characters, including `name:` (except an unindented `---`, which is treated as a block separator).

---

## 3. Optional Features

* **Dedent**: Leading spaces in the block value can be automatically removed to keep indentation for readability.
* **Duplicate handling**: Parsers may support options for blocks with the same name:

  * `"last"` → last block wins (default)
  * `"concat"` → join multiple blocks with `\n\n`
  * `"array"` → store all occurrences in an array
  * `"error"` → throw an error on duplicate keys

---

## 4. Writing Tips

1. Keep `---` on its own line to separate blocks.
2. Indent multiline values for readability — optional dedent will remove leading whitespace.
3. Use only simple ASCII or UTF-8 characters for keys.
4. Avoid putting `---` at the start of any content line unless indented.

---

## 5. Example File

```text
name: WELCOME
Hello, new user!
Welcome to the system.
---
name: FAREWELL
Goodbye, friend.
See you next time!
---
# unnamed block
Just some general text without a name.
```

* This parses to a map/dictionary like:

```ts
{
  "WELCOME": "Hello, new user!\nWelcome to the system.",
  "FAREWELL": "Goodbye, friend.\nSee you next time!",
  "": "Just some general text without a name."
}
```
