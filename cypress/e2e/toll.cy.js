describe('Toll Api', () => {

  before(() => {
    // Runs once before all tests in the block
    cy.visit('http://localhost:5173') // Replace with your app's login URL
    // Perform any setup tasks here (if needed)
  })

  it('should display the map', () => {
    cy.get('#TollMap')
    .should('be.visible')
  })




})