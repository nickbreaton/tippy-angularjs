import { isNumber } from '../helpers';

export default {
  'boolean': {
    beforeTest(value: any, attr: string) {
      return attr === '' ? true : value;
    }
  },
  'string,string[]': {
    beforeSet(value?: string) {
      const asArray = String(value).split(' ');
      return asArray.length > 1 ? asArray : asArray[0];
    }
  },
  'number': {
    beforeSet(value?: string) {
      return Number(value);
    }
  },
  'number,number[]': {
    beforeSet(value?: string) {
      const asArray = String(value).split(' ').map(num => Number(num));
      return asArray.length > 1 ? asArray : asArray[0];
    }
  },
  'number,string': {
    beforeSet(value?: string) {
      const parsedValue = Number(value);
      return isNumber(parsedValue) ? parsedValue : value;
    }
  },
};