const fs = require('fs')
const promisifyWrite = require('util').promisify(fs.writeFile)
const promisifyUnlink = require('util').promisify(fs.unlink)
const superagent = require('superagent')
class Utils {
    elapsed(value) {
        let date = new Date(value)
        let elapsed = { days: date.getUTCDate() - 1, hours: date.getUTCHours(), minutes: date.getUTCMinutes(), seconds: date.getUTCSeconds() }
        return elapsed
    }

    snowflakeToTime(snowflake) {
        const Epoch = 1420070400000;
        const Binary = (parseInt(snowflake, 10)).toString(2).padStart(64, '0');
        return parseInt(Binary.substring(0, 42), 2) + Epoch;
    }

    getRandomColour() {
        var letters = '0123456789ABCDEF';
        var color = '0x';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return parseInt(color);
    }

    resolveFlags(args) {
        let flags = []
        for (let i = 0; i < args.length; i++) {
            if (args[i].startsWith('-')) {
                flags.push({ flagName: args[i].substr(1, args[i].length), flagContent: null })
            } else if (args[i].startsWith('--')) {
                flags.push({ flagName: args[i].substr(2, args[i].length), flagContent: args[i + 1] })
            }
        }
        return flags
    }

    removeFlags(args) {
        args.forEach(arg => {
            if (arg.startsWith('--') || arg.startsWith('-')) {
                args.splice(args.indexOf(arg), 1)
            }
        })
        return args
    }

    divideArray(array, size) {
        let dividedArray = []
        while (array.length > size) {
            dividedArray.push(array.slice(0, size))
            array.splice(0, size)
        }
        if (array.length > 0) {
            dividedArray.push(array)
        }
        return dividedArray
    }

    async uploadToFilesGG(text, filename) {
        const data = new Uint8Array(Buffer.from(text));
        await promisifyWrite(__dirname + "/" + filename, data)
        const response = await superagent.post('https://api.files.gg/files').type('form').attach('file', __dirname + "/" + filename)
        await promisifyUnlink(__dirname + "/" + filename)
        return response.body.urls.main
    }

    async getChiasmAliases(ctx) {
        let response = await ctx.request('http://152.89.106.191:4840/languages', 'GET')
        let aliasesArrays = Object.values(JSON.parse(response.text)).map(i => i.aliases)
        let aliases = []
        aliasesArrays.forEach(array => {
            array.forEach(value => {
                aliases.push(value)
            })
        })
        return aliases
    }

    async requestAPI(url, type, set, args) {
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
}

module.exports = {
    Utils
}
