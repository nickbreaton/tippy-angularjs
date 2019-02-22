/// <reference types="cypress" />

import './render'

// TYPES

type UpdaterFunction =
  (currentValue: any) => any

declare global {
  namespace Cypress {
    interface Chainable {
      controller(subcommand: 'set', property: string, value: any): Chainable
      controller(subcommand: 'update', property: string, updater: UpdaterFunction): Chainable
      controller(subcommand: 'get', property: string): Chainable
      controller(subcommand: 'apply'): Chainable
      controller(subcommand: 'invoke', functionName: string, ...args: any[]): Chainable
    }
  }
}

// SUBCOMMANDS

function set(property: string, value: any) {
  return cy
    .then(getController)
    .then(controller => controller[property] = value)
    .then(apply)
}

function update(property: string, updater: UpdaterFunction) {
  return cy
    .then(getController)
    .then(controller => controller[property] = updater(controller[property]))
    .then(apply)
}

function get(property: string) {
  return cy
    .then(getController)
    .then(controller => controller[property])
}

function apply() {
  return cy
    .then(getScope)
    .then($scope => $scope.$apply());
}

function invoke(functionName: string, ...args: any[]) {
  return cy
    .then(getController)
    .invoke(functionName, ...args)
}

// HELPERS

function getScope() {
  return cy
    .window()
    .then(window => window.$$cypressAngular.fetchScope())
}

function getController() {
  return cy
    .window()
    .then(window => window.$$cypressAngular.fetchController())
}

// REGISTRATION

const controller: typeof cy.controller = function (subcommand: any, ...args: any) {
  const subcommands: any = { set, update, get, apply, invoke };
  const subcommandFunction: any = subcommands[subcommand] || (() => cy);
  return subcommandFunction(...args);
}

Cypress.Commands.add('controller', controller)