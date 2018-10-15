function(ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const api = new EllipsisApi(ellipsis);
const test = require('tape');
const definitionHelpers = require('definition-helpers');

test.onFailure(ellipsis.error);
test.onFinish(() => ellipsis.success("All passed!"));

test('textForAttribute', function (t) {
    t.plan(1);
  
    const attributeWithHTML = { value: `Hello <a href="foo">link</a> how are you?` };
    const expectedTextWithLinksStripped = `Hello link how are you?`;
    const result = definitionHelpers.textForAttribute(attributeWithHTML);
    t.equals(expectedTextWithLinksStripped, result);
  
});
}
