import { createScope, getBindingNames, getTypeOfBinding } from './helpers';
import { IDirective, IDirectiveLinkFn } from 'angular';
import mappers from './bindings/mappers';
import tippy from 'tippy.js';

const scope = {
  ...createScope(),
  onCreate: '&?onCreate',
  class: '@?class'
};

const link: IDirectiveLinkFn = (scope, element, attrs, _, transclude) => transclude!((contents) => {
  const parent = document.createElement('div');

  Array.from(contents || []).forEach((child) => {
    parent.appendChild(child)
  });

  const instance = tippy.one(element[0].parentElement!, {
    content: parent
  });

  // lifecycle

  scope.$on('$destroy', () => instance.destroy());

  // apply custom watchers

  scope.$watch('onCreate', (callback) => {
    if (typeof callback === 'function') {
      callback({ $instance: instance });
    }
  });

  scope.$watch('class', (value?: string) => {
    parent.className = value || '';
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
