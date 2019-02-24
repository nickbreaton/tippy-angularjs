
context('Actions', () => {
  beforeEach(() => {
    cy.viewport(300, 300).visit('http://localhost:1234')
  })

  it('should render a tooltip', () => {
    const template = `
      <button>
        HOVER
        <tippy>TOOLTIP</tippy>
      </button>
    `

    cy.render({ template, modules: ['tippy'] })
      .get('button')
      .trigger('mouseenter')
      .get('.tippy-content')
      .contains('TOOLTIP')
      .get('body')
      .click()
      .get('.tippy-content')
      .should('not.exist')
  })

  it('should render dynamic content', () => {
    const template = `
      <button>
        HOVER
        <tippy>{{ $ctrl.count }}</tippy>
      </button>
    `

    cy.render({ template, modules: ['tippy'] })
      .get('button')
      .trigger('mouseenter')
      .controller('set', 'count', 0)
      .get('.tippy-content')
      .contains(0)
      .controller('update', 'count', value => value + 1)
      .get('.tippy-content')
      .contains(1)
  })
})
