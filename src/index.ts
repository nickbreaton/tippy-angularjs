import angular from 'angular';
import { tippyDirective } from './directive';

const module = angular.module('tippy', []);

module.directive('tippy', () => tippyDirective);

export default module;
