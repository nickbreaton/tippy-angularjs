import angular from 'angular';
import tippy from 'tippy.js';
import bindings from './bindings/names';
import { mapValues, flatMap, entries, fromPairs, map, values, keys, find } from 'lodash';
import types from './bindings/types';
import mappers from './bindings/mappers';
import 'tippy.js/dist/tippy.css'

const app = angular.module('debug', []);

app.controller('DebugController', function () {
  this.log = (x) => console.log(x)
});


function getTypeOf(bindingName) {
  const index = Object.values(bindings).findIndex(names => names.includes(bindingName));
  return Object.keys(bindings)[index];
}

const bindingNames = flatMap(Object.values(bindings));

const scope = bindingNames.reduce((scope, name) => {
  const type = getTypeOf(name);
  return { ...scope, [name]: `${types[type]}?${name}` };
}, {});

app.directive('tippy', () => ({
  restrict: 'E',
  transclude: true,
  scope: {
    // custom bindings
    onCreate: '&?onCreate',
    // tippy options
    ...scope,
    shouldPopperHideOnBlur: '&?shouldPopperHideOnBlur',
  },
  link(scope, element, attrs, controller, transclude) {
    transclude((content) => {
      const parent = document.createElement('div');

      Array.from(content || []).forEach(child => parent.appendChild(child));

      const instance = tippy.one(element[0].parentNode, { content: parent });

      scope.$watch('onCreate', (callback) => {
        if (typeof callback === 'function') {
          callback({ $instance: instance })
        }
      });

      bindingNames.forEach((name) => {
        let isFirstRun = true;

        scope.$watch(name, (value) => {
          const type = getTypeOf(name);
          const noop = x => x;
          const { beforeTest = noop, beforeSet = noop } = mappers[type] || {};

          const testValue = beforeTest(value, attrs[name]);

          if (!(isFirstRun && testValue === undefined)) {
            instance.set({ [name]: beforeSet(testValue) });
          }

          isFirstRun = false;
        });
      });

      scope.$watch('shouldPopperHideOnBlur', (callback) => {
        if (typeof callback === 'function') {

        }
      });

    });
  }
}));