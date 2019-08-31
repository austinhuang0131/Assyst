const Command = require('../command.js').Command;
const command = new Command(['help'], 0, function({msg, args}) {
    if(args.length < 1) {
        let commands = []
        let fields = []
        Object.values(this.assyst.commands).forEach(command => {
            if(commands.map(i => i.names).includes(command.names)) {
                return
            }
            commands.push(command)
            if(command.permissions !== 0) {
                return
            }
            let commandNamesFormat = command.names.map(i => `${this.assyst.prefix}${i}`).join(', ')
            fields.push({name: commandNamesFormat, value: `${command.info.description}`, inline: false})
        })
        this.sendMsg(msg.channel, {embed: {title: 'Command Help', color: 0xFFFFFF, fields: fields}})
    }
})
module.exports = {
    command,
    info: {
        description: 'Display command help',
        author: 'Jacherr',
        usage: 'help <command>',
        examples: ['help', 'help ping']
    }
}