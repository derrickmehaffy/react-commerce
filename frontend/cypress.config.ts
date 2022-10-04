import { defineConfig } from 'cypress';

export default defineConfig({
   fixturesFolder: 'test/cypress/fixtures',
   screenshotsFolder: 'test/cypress/screenshots',
   videosFolder: 'test/cypress/videos',
   video: false,
   retries: {
      runMode: 2,
   },
   e2e: {
      // We've imported your old cypress plugins here.
      // You may want to clean this up later by importing these.
      setupNodeEvents(on, config) {
         return require('./test/cypress/plugins/index.js')(on, config);
      },
      baseUrl: 'http://localhost:3000',
      specPattern: 'test/cypress/integration/**/*.cy.{js,jsx,ts,tsx}',
      supportFile: 'test/cypress/support/index.ts',
   },
});
