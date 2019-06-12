/*
@exportId Z3eZJT43RvqnEpeHXYuC0g
*/
module.exports = (function() {
return {
  botMentionedOrIsKoen: function(ellipsis) {
    const user = ellipsis.event.user;
    const botId = ellipsis.team.botUserIdForContext;
    const isKoen = user.userIdForContext === "U02Q0HK66";
    const message = ellipsis.event.message;
    const botMentioned = message && message.usersMentioned.some((user) => user.userIdForContext === botId);
    return botMentioned || isKoen;
  }
};
})()
     