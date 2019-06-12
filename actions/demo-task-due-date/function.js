function(ellipsis) {
  const DemoHelpers = require('demo-helpers');
if (!DemoHelpers.botMentionedOrIsKoen(ellipsis)) {
  ellipsis.noResponse();
} else {
  const moment = require('moment-timezone');
  const aDate = moment.tz(ellipsis.team.timeZone).add(3, 'days').format("MMM D, YYYY");
  ellipsis.success(`The due date is ${aDate}.`);
}
}
