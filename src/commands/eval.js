const Command = require('../../lib/Command.js').Command;
const command = new Command(['eval', 'e'], 2, async function ({ msg, args }) {
    let evaled;
    let flags = this.utils.resolveFlags(args, [])
    args = this.utils.removeFlags(args)
    try {
        evaled = await eval(args.join(' ')); // eslint-disable-line no-eval
    } catch (err) {
        return this.sendMsg(msg.channel, err, 'error');
    }

    if (typeof evaled === 'object') {
        evaled = require('util').inspect(evaled, { depth: 0, showHidden: true });
    } else {
        evaled = String(evaled);
    }

    evaled = evaled.split(this.bot.token).join(' ');

    const fullLen = evaled.length;

    if (fullLen === 0) { // eslint-disable-line no-magic-numbers
        return null;
    }

    if(flags.map(i => i.flagName).includes('files.gg')) {
        let file = await this.utils.uploadToFilesGG(evaled, 'evaloutput.js')
        this.sendMsg(msg.channel, file)
    } else {
        if (fullLen > 2000) { // eslint-disable-line no-magic-numbers
            evaled = evaled.match(/[\s\S]{1,1900}[\n\r]/g) || [];
            if (evaled.length > 3) { // eslint-disable-line no-magic-numbers
                this.sendMsg(msg.channel, `\`\`\`js\n${evaled[0]}\`\`\``);
                this.sendMsg(msg.channel, `\`\`\`js\n${evaled[1]}\`\`\``);
                return this.sendMsg(msg.channel, `\`\`\`js\n${evaled[2]}\`\`\``);
            }
            return evaled.forEach((message) => {
                this.sendMsg(msg.channel, `\`\`\`js\n${message}\`\`\``);
                return;
            });
        }
        return this.sendMsg(msg.channel, `\`\`\`js\n${evaled}\`\`\``);
    }
})
module.exports = {
    command,
    info: {
        description: 'Evaluate code',
        author: 'Jacherr',
        usage: 'e [code]',
        examples: ['e 1+1', 'e this.bot']
    }
}