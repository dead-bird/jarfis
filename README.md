# Jarfis

Meme ratings for OG meme bois

# Dev

- run `npm i` to get dependencies
- ensure `nodemon` is correctly installed
- ensure `mocha` is correctly installed
- duplicate `.env.example`, enter the correct details and save the file as `.env`
- run `npm start` from project root.
- ~~before pushing run npm test~~

# Live

- Run app: `pm2 start app/jarfis.js`
- Restart: `pm2 restart rate`
- Stop app: `pm2 stop rate`

# Gotchas

- 404 Not Found: flatmap-stream: https://github.com/dominictarr/event-stream/issues/116

# Changelog

Changelog ignores any commit whose message starts with chore. It also ignores any commit message that doesn't have a type


> Reference: http://thecodebarbarian.com/keeping-a-changelog-in-nodejs

> Prefix commits like so:

- build: Changes that affect the build system or external dependencies
- ci: Changes to our CI configuration files and scripts
- docs: Documentation only changes
- feat: A new feature
- fix: A bug fix
- perf: A code change that improves performance
- refactor: A code change that neither fixes a bug nor adds a feature
- style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- test: Adding missing tests or correcting existing tests
- chore: ignored 

> Workflow

- Commit as usual
- Bump up the `package.json` version number using semver (https://semver.org/) (don't commit)
- Run `npm run release` (this will auto commit anything, be careful)
