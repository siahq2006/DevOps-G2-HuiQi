describe('Add Movies Frontend', () => {
  let baseUrl;
  before(() => {
    cy.task('startServer').then((url) => {
      baseUrl = url; // Store the base URL
      cy.visit(baseUrl);
    });
  });
  after(() => {
    return cy.task('stopServer'); // Stop the server after the report is done
  });

  it('should add a new movie', () => {
    // Open the modal and fill in the form
    cy.get('button.movie-btn').click();

    cy.get('#movie-name').type('Test Movie', { force: true });
    cy.get('#poster-url').type('https://images-cdn.ubuy.co.in/63ef0a397f1d781bea0a2464-star-wars-rogue-one-movie-poster.jpg', { force: true });
    cy.get('#description').type('Test Description', { force: true });

    // Wait for the genre dropdown to be populated
    cy.get('#genre-select1').should('not.have.text', 'Loading genres...'); // Ensure it's loaded

    // Select a genre dynamically from the dropdown
    cy.get('#genre-select1').select(1); // Select by index (first valid option)

    cy.get('#rating').type('4', { force: true });
    cy.get('#release-date').type('2021-12-31', { force: true });
    cy.get('#duration').type('120', { force: true });
    // Click the add movie button
    cy.get('button.submit-btn').contains('Submit').click();
    // Verify the movie is in the table
    cy.get('#tableContent').contains('Test Movie').should('exist');

  });

  it('should view all movies', () => {
    // Visit the page where the movies are listed
    cy.visit(baseUrl);

    // Mock the server response for the GET /viewMovies_HuiQi request
    cy.intercept('GET', '/viewMovies_HuiQi', {
      statusCode: 200,
      body: [
        {
          movie_name: 'Test Movie',
          poster_url: 'http://example.com/test-movie-poster.jpg'
        },
        {
          movie_name: 'Another Movie',
          poster_url: 'http://example.com/another-movie-poster.jpg'
        }
      ]
    }).as('getMovies');

    // Trigger the function that will call viewMovies_HuiQi
    cy.window().then((win) => {
      win.viewMovies_HuiQi(); // Call the viewMovies_HuiQi function directly
    });

    // Wait for the API call to complete and ensure the movies are loaded
    cy.wait('@getMovies');

    // Check that the movies are displayed in the 'tableContent' div
    cy.get('#tableContent').should('contain', 'Test Movie');
    cy.get('#tableContent').should('contain', 'Another Movie');
    cy.get('#tableContent').find('img').should('have.length', 2); // Ensure two images are loaded
    cy.get('#tableContent').find('img').first().should('have.attr', 'src', 'http://example.com/test-movie-poster.jpg');
    cy.get('#tableContent').find('img').last().should('have.attr', 'src', 'http://example.com/another-movie-poster.jpg');
  });

  it('should load genres into the genre dropdown dynamically', () => {
    cy.visit(baseUrl);

    // Ensure the genre dropdown exists
    cy.get('#genre-select1').should('exist');

    // Intercept the genres API call
    cy.intercept('GET', '/getGenres_HuiQi', (req) => {
      // Optional: Mock the server response here if testing error scenarios
      // req.reply({ statusCode: 500, body: { error: "Internal Server Error" } });
    }).as('getGenres');

    // Trigger the genres load
    cy.window().then((win) => {
      win.loadGenres(); // Ensure this function triggers the genres loading
    });

    // Wait for the genres request to complete
    cy.wait('@getGenres');

    // Validate the dropdown has options and is not empty
    cy.get('#genre-select1').children('option').should('have.length.greaterThan', 1);

    // Validate the message displayed upon success
    cy.get('#message').should('have.class', 'text-success')
      .and('contain.text', 'Genres loaded successfully.');
  });


  it('should close the Add Movie modal when Cancel is clicked', () => {
    // Open the modal
    cy.visit(baseUrl);
    cy.get('button.movie-btn').click();

    cy.get('#movie-name').type('Test Movie', { force: true });
    cy.get('#poster-url').type('https://images-cdn.ubuy.co.in/63ef0a397f1d781bea0a2464-star-wars-rogue-one-movie-poster.jpg', { force: true });
    cy.get('#description').type('Test Description', { force: true });

    // Wait for the genre dropdown to be populated
    cy.get('#genre-select1').should('not.have.text', 'Loading genres...'); // Ensure it's loaded

    // Select a genre dynamically from the dropdown
    cy.get('#genre-select1').select(1); // Select by index (first valid option)

    cy.get('#rating').type('4', { force: true });
    cy.get('#release-date').type('2021-12-31', { force: true });
    cy.get('#duration').type('120', { force: true });
    // Click the Cancel button
    cy.get('button.cancel-btn').click();

    // Verify the modal is no longer visible
    cy.get('#add-movie-modal').should('not.be.visible');
  });

  it('should show error messages when required fields are not filled in', () => {
    cy.visit(baseUrl);

    // Open the modal
    cy.get('button.movie-btn').click();

    // Leave required fields empty and try to submit
    cy.get('#movie-name').clear();
    cy.get('#poster-url').clear();
    cy.get('#description').clear();
    cy.get('#rating').clear();
    cy.get('#release-date').clear();
    cy.get('#duration').clear();

    // Click the submit button
    cy.get('button.submit-btn').click();

    // Wait for the error messages to appear
    cy.get('#movie-name').parent().find('.error-message').should('be.visible');
    cy.get('#poster-url').parent().find('.error-message').should('be.visible');
    cy.get('#description').parent().find('.error-message').should('be.visible');
    cy.get('#rating').parent().find('.error-message').should('be.visible');
    cy.get('#release-date').parent().find('.error-message').should('be.visible');
    cy.get('#duration').parent().find('.error-message').should('be.visible');

  });

  it('should show an error if description is less than 10 characters', () => {
    cy.visit(baseUrl);

    // Open the modal
    cy.get('button.movie-btn').click();

    // Fill all fields except description with valid data
    cy.get('#movie-name').type('Test Movie');
    cy.get('#poster-url').type('https://images-cdn.ubuy.co.in/63ef0a397f1d781bea0a2464-star-wars-rogue-one-movie-poster.jpg');
    cy.get('#description').type('Short'); // Description with less than 10 characters
    cy.get('#genre-select1').select(1); // Select by index (first valid option)
    cy.get('#rating').type('4');
    cy.get('#release-date').type('2021-12-31');
    cy.get('#duration').type('120');

    // Click the submit button
    cy.get('button.submit-btn').click();

    // Assert that an error message is displayed for the description field
    cy.get('#description').parent().find('.error-message')
      .should('be.visible')
      .and('contain', 'Description must be at least 10 characters long');
  });

  it('should show an error if the poster URL is invalid', () => {
    cy.visit(baseUrl);

    // Open the modal
    cy.get('button.movie-btn').click();

    // Fill in the fields with valid data except for the poster URL
    cy.get('#movie-name').type('Test Movie');
    cy.get('#poster-url').type('invalid-url'); // Invalid URL
    cy.get('#description').type('A valid description');
    cy.get('#genre-select1').select(1); // Select by index (first valid option)
    cy.get('#rating').type('4');
    cy.get('#release-date').type('2021-12-31');
    cy.get('#duration').type('120');

    // Click the submit button
    cy.get('button.submit-btn').click();

    // Assert that an error message is displayed for the poster URL
    cy.get('#poster-url').parent().find('.error-message')
      .should('be.visible')
      .and('contain', 'Please enter a valid URL');
  });

});