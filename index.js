const Assyst = require('./lib/Assyst.js').Assyst
const config = require('./config.json')

const client = new Assyst(config)

console.log('Starting Assyst')

console.log('Loading commands')

client.loadCommands()

client.bot.on('messageCreate', (msg) => {
    checkRepl(msg)
    if (!msg.content.startsWith(client.prefix) || msg.author.bot) {
        return
    }
    let args = msg.content.slice(config.client.prefix.length).trim().split(/ +/g)
    let command = args.shift().toLowerCase()
    let foundCommand = findCommand(command)
    if(!foundCommand) {
        return
    }
    let authorPermLevel = checkPermissions(client, msg)
    if(foundCommand.permissions > authorPermLevel) {
        return
    }
    foundCommand.execute({ msg: msg, args: args })
});

async function checkRepl(msg) {
    if(!msg.startsWith('`') || !msg.endsWith('`')) {
        return;
    } else if (msg.startsWith('```')) {
        return
    } else if (!client.repl.map(i => i.user).includes(msg.author.id) || !client.repl.map(i => i.channel).includes(msg.channel.id)) {
        return
    } else {
        const currentRepl = client.repl.find(j => j.map(i => i.user).includes(msg.author.id) && j.map(i => i.channel).includes(msg.channel.id))
        const contentToSend = msg.substr(1, msg.content.length - 2)
        if(contentToSend === 'exit') {
            client.repl.splice(client.repl.indexOf(currentRepl, 1))
            return
        }
        const utils = require('./src/utils')
        const response = await utils.request(require('config.json').chiasm-ip, 'POST', {"content-type": "application/json"}, {code: contentToSend, lang: currentRepl.lang, imports: []})
        msg.channel.createMessage('```\n' + response.text + '\n```')
    }
}

function findCommand(command) {
    let foundCommand
    try {
        foundCommand = client.commands[command] || client.cmdAliases[command]
    } catch(e) {}   
    if(!foundCommand) {
        return null
    } else {
        return foundCommand
    }
}

function checkPermissions(client, msg) {
    let authorPermLevel
    if(client.staff.owners.includes(msg.author.id)) {
        authorPermLevel = 2
    } else if (client.staff.admins.includes(msg.author.id)) {
        authorPermLevel = 1
    } else {
        authorPermLevel = 0
    }
    return authorPermLevel
}

client.bot.on('ready', () => {
    console.log('Ready')
});

client.bot.connect()