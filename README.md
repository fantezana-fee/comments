# FEE Comment Assistant

Local tool for drafting, reviewing and approving Instagram comment replies in FEE's voice.

## Run it

1. Install Node 18 or newer.
2. Create a file called `.env` in this folder with your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```
3. Start it:
   ```
   node server.js
   ```
4. Open http://localhost:3000

No `npm install` needed.

## How it works

- Paste a post caption and a comment, click **Draft reply**. Claude returns a best reply, a shorter option and notes for the reviewer.
- A comment that is only a CTA keyword (see `config.json`) gets a canned reply like "Sent!" with no AI.
- The reviewer edits, redrafts with an instruction, skips or approves. Everything is saved in `data/items.json`.

## Editing the voice

- `prompts/fee_voice.md` holds the instructions (your original prompt).
- `prompts/examples.md` holds approved example replies. Add more as you approve good ones; they make the tone more consistent.
- `config.json` holds the CTA keywords and reply variations.

## Next steps

Connect the two Instagram accounts so comments arrive automatically and approved replies post directly.
