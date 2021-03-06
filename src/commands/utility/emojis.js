export default class extends Command {
  constructor(options) {
    super(options);
    this.description = "Show all guild emojis";
    this.guildonly = true;
  }
  async run(bot, message) {
    if (!message.guild)
      return message.channel.send('This command only works on servers.');

    const fullN = message.guild.emojis.cache.size;

    if (fullN < 1)
      return message.reply('I don\'t see any emoji here.');

    const commonN = message.guild.emojis.cache.filter(e => e.available && !e.animated && (e.roles.cache.size >= 1 ? e.roles.cache.intersect(message.guild.me.roles.cache).size >= 1 : true)).size;

    const animatedN = message.guild.emojis.cache.filter(e => e.available && e.animated && (e.roles.cache.size >= 1 ? e.roles.cache.intersect(message.guild.me.roles.cache).size >= 1 : true)).size;

    const cantuse = message.guild.emojis.cache.filter(e => e.available && e.roles.cache.size >= 1 ? e.roles.cache.intersect(message.guild.me.roles.cache).size < 1 : false).size;

    const atext = message.guild.emojis.cache.filter(e => e.available && e.animated && (e.roles.cache.size >= 1 ? e.roles.cache.intersect(message.guild.me.roles.cache).size >= 1 : true)).map(e => e.toString()).join(" ");

    const ntext = message.guild.emojis.cache.filter(e => e.available && !e.animated && (e.roles.cache.size >= 1 ? e.roles.cache.intersect(message.guild.me.roles.cache).size >= 1 : true)).map(e => e.toString()).join(" ");

    const ctext = message.guild.emojis.cache.filter(e => e.available && e.roles.cache.size >= 1 ? e.roles.cache.intersect(message.guild.me.roles.cache).size < 1 : false).map(e => e.name).join(", ");

    const utext = message.guild.emojis.cache.filter(e => !e.available).map(e => e.name).join(", ");
    const unavailable = message.guild.emojis.cache.filter(e => !e.available).size;

    let realtext = "";

    let a = false;
    let n = false;
    let c = false;

    if (animatedN > 0) {
      a = true;
      realtext += `**Animated (${animatedN}): ** ${atext}`;
    }

    if (commonN > 0) {
      n = true;
      if (a)
        realtext += `\n\n**Common (${commonN}): ** ${ntext}`;
      else
        realtext += `**Common (${commonN}): ** ${ntext}`;
    }

    if (cantuse > 0) {
      c = true;
      if (n)
        realtext += `\n\n**I can't use (${cantuse}): ** ${ctext}`;
      else
        realtext += `**I can't use (${cantuse}): ** ${ctext}`;
    }

    if (unavailable > 0) {
      if (c)
        realtext += `\n\n**Unavailable (${unavailable}): ** ${utext}`;
      else
        realtext += `**Unavailable (${unavailable}): ** ${utext}`;
    }

 await message.channel.send(realtext, { split: { char: " " } });
  }
}