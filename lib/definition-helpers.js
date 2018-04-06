/*
@exportId -N0kK4FyScy6AuJVyK_CUw
*/
module.exports = (function() {
return {
  textForAttribute: textForAttribute
};

function textForAttribute(attr) {
  return attr.value.toString().trim().replace(/<.+?>/g, " ").replace(/[ ]+/g, " ");
}
})()
     