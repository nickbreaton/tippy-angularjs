import { IAngularStatic, IControllerConstructor, IController, IScope } from 'angular';
import { EventEmitter } from 'events';

context('Actions', () => {
  beforeEach(() => {
    cy.viewport(300, 300).visit('http://localhost:1234');
  })

  // it('should render dynamic content', () => {
  //   cy.get('button')
  //     .trigger('mouseenter')
  //     .get('.tippy-content')
  //     .should('contain', 'world')
  //     .get('body')
  //     .click()
  //     .get('.tippy-content')
  //     .should('not.exist')
  // });

  // it('should modify code', () => {
  //   cy.visit('http://securingsincity.github.io/react-ace/');
  // });

  let appId = 0;

  function render(innerHTML: string, Controller?: IControllerConstructor) {
    return () => cy.window().then((window) => {
      const { document, angular } = window as (Window & { angular: IAngularStatic });

      const node = document.createElement('div');
      node.innerHTML = innerHTML;
      document.body.appendChild(node);

      const app = angular.module(`app-${appId++}`, ['tippy']);

      if (Controller) {
        app.controller('MainController', Controller);
        node.setAttribute('ng-controller', 'MainController as vm');
      }

      angular.bootstrap(node, [app.name]);
    });
  }

  afterEach(() => {
    cy.document().then((document) => document.body.innerHTML = '');
  });

  it('should render a tooltip', () => {
    const content = `
      <button>
        hover here
        <tippy>a tooltip</tippy>
      </button>
    `;

    cy.then(render(content))
      .get('button')
      .trigger('mouseenter')
      .get('.tippy-content')
      .should('contain', 'a tooltip')
      .get('body')
      .click()
      .get('.tippy-content')
      .should('not.exist');
  });

  it('should render dynamic content', () => {
    const content = `
      <button>
        hover here
        <tippy>{{ vm.count }}</tippy>
      </button>
    `;

    const emitter = new EventEmitter();

    class Controller implements IController {
      constructor(private $scope: IScope) {}

      count = 0

      $onInit = () => emitter.on('increment', () => {
        this.count++
        this.$scope.$apply();
      });
    }

    cy.then(render(content, Controller))
      .get('button')
      .trigger('mouseenter')
      .get('.tippy-content')
      .should('contain', 0)
      .then(() => emitter.emit('increment'))
      .get('.tippy-content')
      .should('contain', 1);
  });

});
