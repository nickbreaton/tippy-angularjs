// This exists simply to test the `cypress-angularjs` package.
// TODO: Move into own npm package.

context('cypress-angularjs', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1234')
  })

  context('#set', () => {
    it('should flush the value to the DOM', () => {
      const template = `
        <p>{{ $ctrl.text }}<p>
      `

      cy.render({ template })
        .controller('set', 'text', 'hello world')
        .get('p')
        .contains('hello world')
    })

    it('should set the value on the controller', () => {
      let instance: Controller;

      class Controller {
        text?: string

        constructor() {
          instance = this
        }
      }

      cy.render({ controller: Controller })
        .controller('set', 'text', 'hello world')
        .then(() => instance.text)
        .should('equal', 'hello world')
    })
  })

  context('#update', () => {
    it('should flush the value to the DOM', () => {
      const template = `
        <p>{{ $ctrl.count }}<p>
      `

      class Controller {
        count = 0
      }

      cy.render({ template, controller: Controller })
        .controller('update', 'count', count => count + 1)
        .get('p')
        .contains(1)
    })
  })

  context('#get', () => {
    it('should return the current controller instance value', () => {
      class Controller {
        count = 0
      }

      const increment = (value: number) => value + 1

      cy.render({ controller: Controller })
        // check initial value
        .controller('get', 'count')
        .then(count => expect(count).to.eq(0))
        // add one and check
        .controller('update', 'count', increment)
        .controller('get', 'count')
        .then(count => expect(count).to.eq(1))
        // add another and check
        .controller('update', 'count', increment)
        .controller('get', 'count')
        .then(count => expect(count).to.eq(2))
    })
  })

  context('#apply', () => {
    it('should flush the changes to the DOM', () => {
      const template = `
        <p>{{ $ctrl.text }}<p>
      `

      let instance: Controller;

      class Controller {
        text = 'one'

        constructor() {
          instance = this
        }
      }

      cy.render({ template, controller: Controller })
        .get('p')
        .contains('one')
        .then(() => instance.text = 'two')
        .controller('apply')
        .get('p')
        .contains('two')
    })
  })

  context('#invoke', () => {
    class InvokeController {
      syncMethod() {
        return 'sync'
      }

      async asyncMethod() {
        return 'async'
      }

      argumentMethod(name: string) {
        return `Hello ${name}!`
      }
    }

    it('should return the value of a method on the controller', () => {
      cy.render({ controller: InvokeController })
        .controller('invoke', 'syncMethod')
        .then(result => expect(result).to.equal('sync'))
    })

    it('should resolve async methods', () => {
      cy.render({ controller: InvokeController })
        .controller('invoke', 'asyncMethod')
        .then(result => expect(result).to.equal('async'))
    })

    it('should pass arguments', () => {
      cy.render({ controller: InvokeController })
        .controller('invoke', 'argumentMethod', 'Pippy')
        .then(result => expect(result).to.equal('Hello Pippy!'))
    })
  })
})
