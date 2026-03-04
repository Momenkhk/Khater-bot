module.exports = async function safeReply(ctx, payload) {
  if (ctx.deferred || ctx.replied) {
    return ctx.followUp(payload);
  }
  return ctx.reply(payload);
};
