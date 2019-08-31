const Command = require('../command.js').Command;
const command = new Command(['ping', 'pong', 'pang'], 0, function({msg}) {
    this.sendMsg(msg.channel, 'Pong!', 'success')
})

module.exports = {
    command,
    info: {
        description: 'Ping the bot',
        author: 'Jacherr',
        usage: 'ping',
        examples: ['ping']
    }
}