const client = require('./assyst.js').client
const config = require('./config.json')

console.log('Starting Assyst')

console.log('Loading commands')

client.loadCommands()

client.bot.on('messageCreate', (msg) => {
    if (!msg.content.startsWith(config.client.prefix)) {
        return
    }
    let args = msg.content.slice(config.client.prefix.length).trim().split(/ +/g)
    let command = args.shift().toLowerCase()
    let foundCommand
    try {
        foundCommand = client.commands[command] || client.cmdAliases[command]
    } catch(e) {}   
    if(!foundCommand) {
        return
    }
    switch (foundCommand.permissions) {
        case 0:
            break;
        case 1:
            if (!client.staff.admins.includes(msg.member.user.id)) {
                return;
            }
            break;
        case 2:
            if (!client.staff.owners.includes(msg.member.user.id) && !client.staff.admins.includes(msg.member.user.id)) {
                return;
            }
            break;
        default:
            if (!config.client.staff.owners.includes(msg.member.user.id)) {
                return;
            }
            break;
    }
    if (foundCommand) {
        foundCommand.execute({ msg: msg, args: args })
    }
});

client.bot.on('ready', () => {
    console.log('Ready')
});

client.bot.connect()