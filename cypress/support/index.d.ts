declare namespace Cypress {
  interface Chainable<Subject> {
    addConstructorItem(title: string): Chainable<Subject>;
  }
}
