module.exports = {
    empty(message, errorText = 'Small **oof** my dude i need some text') {
        message.reply(errorText).catch(err => {
            console.log(err);
        });
    },
    args() {

    },
    dead(message, err) {
        message.reply(message, `Small **oof** my dude ${err}`).catch(err => {
            console.log(err);
        });
    },
    perms() {

    }
}