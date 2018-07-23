/*
@exportId pfBYnBB1RT2LFF-IssaZ_w
*/
module.exports = (function() {
return ellipsis => {
  const value = ellipsis.env.COLLIBRA_SHOULD_LOG_TIMING
  return value && value.toLowerCase() === "true";
};
})()
     