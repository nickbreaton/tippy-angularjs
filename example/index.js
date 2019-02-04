import angular from 'angular';
import 'tippy.js/dist/tippy.css';

import '../src/index.ts';

const app = angular.module('debug', [
  'tippy'
]);

app.controller('DebugController', function () {
  this.log = (x) => console.log(x);
});