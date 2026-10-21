# End-to-end (e2e) tests for web

Browser tests written in plain English for [Kane CLI](https://www.testmuai.com/kane-cli/).

| Test | What it covers |
|---|---|
| `board_test.md` | Signing up with email and creating a blank board |
| `tile_test.md` | Logging in, renaming a tile, and building a sentence with it |

## Run

Start [freespeech-api](https://github.com/Merkie/freespeech-api) on port 8172 with an empty Postgres database, set `PUBLIC_API_URL=http://localhost:8172` in `.env`, then serve this app on port 5173:

```bash
npm install
npm run build
npm run preview -- --port 5173
```

`board_test.md` expects no account for `sam@example.com`. `tile_test.md` expects an account `alex@example.com` / `speakup2024` with a blank project named "Daily Needs".

```bash
npm install -g @testmuai/kane-cli
kane-cli login
kane-cli testmd run e2e/kane/board_test.md
```
