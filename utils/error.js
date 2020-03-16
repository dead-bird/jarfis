module.exports = {
    empty(message, errorText = 'Small **oof** my dude i need some text') {
        message.reply(errorText);
    },
    args() {

    },
    dead(message, err) {
        message.reply(message, `Small **oof** my dude ${err}`);
    },
    perms() {

    }
}