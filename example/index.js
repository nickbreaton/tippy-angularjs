import angular from 'angular';
import tippyAngular from '../src/index.ts';
import 'tippy.js/dist/tippy.css';

const app = angular.module('debug', [
  tippyAngular
]);

app.controller('DebugController', function () {
  this.log = (x) => console.log(x);
});