const Command = require('../../lib/Command.js').Command;
const command = new Command(['ping', 'pong', 'pang'], 0, async function({msg, client}) {
    const start = Date.now();
    let message = await this.sendMsg(msg.channel, 'Pong!')
    if(!message) {
        return null
    }
    message.edit(this.assyst.emotes.success + ' Pong! `' + Date.now() - start + 'ms`')
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