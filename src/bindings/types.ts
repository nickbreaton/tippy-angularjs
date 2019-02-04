export default {
  // ONE-WAY BINDING
  'boolean': '<',
  'object': '<',
  // TEXT BINDING
  'string': '@',
  'number': '@',
  'string,string[]': '@',
  'number,number[]': '@',
  'number,string': '@',
  // EXPRESSION BINDING
  'Function': '&',
};