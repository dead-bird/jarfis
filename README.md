# Jarfis
Meme ratings for OG meme bois

# Dev
* run `npm i` to get dependencies
* ensure `nodemon` is correctly installed
* duplicate `.env.example`, enter the correct `token` and save the file as `.env`
* run `nodemon app/rate.js` from project root.

# Live
* Run app:  `pm2 start app/rate.js`
* Restart:  `pm2 restart rate`
* Stop app: `pm2 stop rate`
