/// <reference types="cypress" />

import { IControllerConstructor, IAngularStatic, IRootScopeService, IController, IScope } from 'angular';

// TYPES

interface RenderOptions {
  template: string;
  controller?: IControllerConstructor;
  controllerAs?: string;
  modules?: string[];
}

declare global {
  interface Window {
    requestIdleCallback: Function
    $$cypressAngular: {
      fetchScope: () => Promise<IScope>
      fetchRootScope: () => Promise<IRootScopeService>
      fetchController: () => Promise<IController>
    }
  }
  namespace Cypress {
    interface Chainable {
      render(options: RenderOptions): Chainable
    }
  }
}

// IMPLEMENTATION

let count = 0

class NoopController {}

const render: typeof cy.render = ({
  template,
  controller = NoopController,
  controllerAs = '$ctrl',
  modules = [],
}) => {
  return cy.window().then((window) => {
    const { document, angular } = window as (Window & { angular: IAngularStatic });

    const node = document.createElement('div')
    node.innerHTML = template;
    document.body.appendChild(node)

    const app = angular.module(`app-${count++}`, modules)

    const fetchScope = () => new Promise<IScope>((resolve) => {
      const poll = () => {
        const $scope = angular.element(node).scope()
        $scope ? resolve($scope) : window.requestIdleCallback(poll)
      }
      poll()
    })

    const fetchController = () => new Promise<IController>((resolve) => {
      const poll = () => {
        const controller = angular.element(node).controller()
        controller ? resolve(controller) : window.requestIdleCallback(poll)
      }
      poll()
    })

    const fetchRootScope = () => {
      return fetchScope().then($scope => $scope.$root)
    }

    window.$$cypressAngular = {
      fetchScope,
      fetchController,
      fetchRootScope
    }

    app.controller('MainController', controller);
    node.setAttribute('ng-controller', `MainController as ${controllerAs}`)

    angular.bootstrap(node, [app.name])
  })
}

// SETUP

Cypress.Commands.add('render', render);