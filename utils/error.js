module.exports = {
    general(message, errorText = 'Small **oof** that didnt work') {
        message.reply(errorText).catch(err => {
            console.log(err);
        });        
    },
    empty(message, errorText = 'Small **oof** my dude i need some text') {
        message.reply(errorText).catch(err => {
            console.log(err);
        });
    },
    args(message, errorText = 'Small **oof** my dude please give me inputs') {
        message.reply(errorText).catch(err => {
            console.log(err);
        });
    },
    dead(message, err) {
        message.reply(message, `Small **oof** my dude ${err}`).catch(err => {
            console.log(err);
        });
    },
    perms() {

    }
}