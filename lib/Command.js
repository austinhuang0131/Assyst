const config = require('../config.json')
const Utils = require('../src/utils.js').Utils
const utils = new Utils
const superagent = require('superagent')
const assyst = require('./Assyst').client
class Command {
    constructor(names, permissions, execute) {
        this.names = names;
        this.permissions = permissions;
        this.execute = execute
    }

    /* 
    info = {
        description
        author
        usage
        examples
    }
    */

    init(info) {
        this.info = info 
    }

    get assyst() {
        return assyst
    }

    get bot() {
        return assyst.bot
    }

    get utils() {
        return utils
    }

    getCommand(name) {
        return this.commands[name]
    }

    async sendMsg(channel, message, type) {
        let msgToSend;
        switch (type) {
            case 'info':
                msgToSend = config.client.emotes.info + ' ' + message
                break;
            case 'error':
                msgToSend = config.client.emotes.error + ' ' + message
                break;
            case 'success':
                msgToSend = config.client.emotes.success + ' ' + message
                break;
            case 'loading':
                msgToSend = config.client.emotes.loading + ' ' + message
                break;
            default:
                msgToSend = message
                break;
        }
        switch (typeof channel) {
            case 'object':
                if (channel.id) {
                    return this.bot.createMessage(channel.id, msgToSend)
                } else {
                    throw new Error('Invalid channel object')
                }
            case 'string':
                return this.bot.createMessage(channel, msgToSend)
            default:
                throw new Error('The channel paramater must either be a channel object or channel ID')
        }
    }

    async request(url, type, set, args) {
        if (type.toUpperCase() === 'GET') {
            const response = await superagent.get(url)
            return response
        } else if (type === 'POST') {
            const response = await superagent
                .post(url)
                .set(set)
                .send(args)
            return response
        } else {
            throw new Error('You must either GET or POST with superagent')
        }
    }

    getCommand(name) {
        return this.commands[name]
    }
}

module.exports = {
    Command
}