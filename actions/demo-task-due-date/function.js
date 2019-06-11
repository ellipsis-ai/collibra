function(ellipsis) {
  const moment = require('moment-timezone');
const aDate = moment.tz(ellipsis.team.timeZone).add(3, 'days').format("MMM D, YYYY");
ellipsis.success(`The due date is ${aDate}.`);
}
