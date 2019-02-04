import { createScope, getBindingNames, getTypeOfBinding } from './helpers';
import { IDirective, IDirectiveLinkFn } from 'angular';
import mappers from './bindings/mappers';
import tippy from 'tippy.js';

const scope = { ...createScope(), onCreate: '&?onCreate' };

const link: IDirectiveLinkFn = (scope, element, attrs, _, transclude) => transclude!((contents) => {
  // create wrapper element
  const parent = document.createElement('div');

  // add each transcluded node to wrapper element
  Array.from(contents || []).forEach((child) => {
    parent.appendChild(child)
  });

  // create tippy instance
  const instance = tippy.one(element[0].parentElement!, {
    content: parent
  });

  // apply custom watchers

  scope.$watch('onCreate', (callback) => {
    if (typeof callback === 'function') {
      callback({ $instance: instance });
    }
  });

  // apply tippy option watchers

  const bindingNames = getBindingNames();

  bindingNames.forEach((name) => {
    let isFirstRun = true;

    scope.$watch(name, (value) => {
      const type = getTypeOfBinding(name);

      const noop = (x: any) => x;
      const { beforeTest = noop, beforeSet = noop } = (mappers as any)[type] || {};

      const testValue = beforeTest(value, attrs[name]);

      if (!(isFirstRun && testValue === undefined)) {
        instance.set({ [name]: beforeSet(testValue) });
      }

      isFirstRun = false;
    });
  });

  // end link
});

export const tippyDirective: IDirective = {
  restrict: 'E',
  transclude: true,
  scope,
  link
};
