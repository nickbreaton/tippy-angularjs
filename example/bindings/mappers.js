export default {
  'boolean': {
    beforeTest(value, attr) {
      return attr === '' ? true : value;
    }
  },
  'string,string[]': {
    beforeSet(value) {
      const asArray = String(value).split(' ');
      return asArray.length > 1 ? asArray : asArray[0];
    }
  },
  'number': {
    beforeSet(value) {
      return Number(value);
    }
  },
  'number,number[]': {
    beforeSet(value) {
      const asArray = String(value).split(' ').map(num => Number(num));
      return asArray.length > 1 ? asArray : asArray[0];
    }
  },
  'number,string': {
    beforeSet(value) {
      const isNumber = (num) => {
        return typeof num === 'number' && !isNaN(num);
      };
      const parsedValue = Number(value);
      return isNumber(parsedValue) ? parsedValue : value;
    }
  },
};