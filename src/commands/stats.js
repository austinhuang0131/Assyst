const { Command } = require('../../lib/Command.js');
const command = new Command( ['stats'], 0, ( ( { msg } ) => {
    const memoryUsage = process.memoryUsage().heapUsed;
    const cpu = require('os').cpus().map(i => i.model);
    const cpuLength = cpu.length;
    const cpuType = cpu[0];
    console.log(this.utils);
    const uptime = this.utils.elapsed(this.bot.uptime);
    this.sendMsg(msg.channel, {
        embed: {
            title: `${this.bot.user.username} statistics`,
            color: 0xFFFFFF,
            thumbnail: {
                url: this.bot.user.avatarURL,
            },
            fields: [
                {
                    name: 'Guilds',
                    value: this.bot.guilds.size,
                    inline: true,
                },
                {
                    name: 'Users',
                    value: this.bot.users.size,
                    inline: true,
                },
                {
                    name: 'Uptime',
                    value: `${uptime.days} days, ${uptime.hours} hours, ${uptime.minutes} minutes, ${uptime.seconds} seconds`,
                    inline: false,
                },
                {
                    name: 'Processor',
                    value: `${cpuLength}x ${cpuType}`,
                },
                {
                    name: 'Memory usage',
                    value: `${memoryUsage}MB`,
                },
            ],
        },
    } );
} ) );

module.exports = {
    command,
    info: {
        description: 'Get statistics about the bot and the process.',
        author: 'Jacherr',
        usage: 'stats',
        examples: ['stats'],
    },
};