const Command = require('../../lib/Command.js').Command;
const command = new Command(['ping', 'pong', 'pang'], 0, async function({msg}) {
    const start = Date.now();
    let message = await this.sendMsg(msg.channel, 'Pong!')
    if(!message) {
        return null
    }
    this.bot.editMessage(msg.channel.id, message.id, `Pong! \`${Date.now() - start}ms\``)
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