const Assyst = require('./lib/Assyst.js')
const config = require('./config.json')

console.log(config)

const client = new Assyst(config)

console.log('Starting Assyst')

console.log('Loading commands')

client.loadCommands()

client.bot.on('messageCreate', (msg) => {
    if (!msg.content.startsWith(client.prefix)) {
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
    let authorPermLevel
    if(client.staff.owners.includes(msg.author.id)) {
        authorPermLevel = 2
    } else if (client.staff.admins.includes(msg.author.id)) {
        authorPermLevel = 1
    } else {
        authorPermLevel = 0
    }
    if(foundCommand.permissions > authorPermLevel) {
        return
    }
    if (foundCommand) {
        foundCommand.execute({ msg: msg, args: args })
    }
});

client.bot.on('ready', () => {
    console.log('Ready')
});

client.bot.connect()