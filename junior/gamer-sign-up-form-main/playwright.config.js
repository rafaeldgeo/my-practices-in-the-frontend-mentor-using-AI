// Playwright + Chromium: os mesmos testes rodam nos três tamanhos do design.
// O servidor de teste sobe numa porta própria (3100) para não colidir com `npm start` (3000).
const { defineConfig } = require('@playwright/test');

const PORTA = 3100;

module.exports = defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORTA}`,
    browserName: 'chromium',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node server.js',
    env: { PORT: String(PORTA) },
    url: `http://localhost:${PORTA}`,
    reuseExistingServer: false,
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'tablet', use: { viewport: { width: 768, height: 1024 } } },
    { name: 'mobile', use: { viewport: { width: 375, height: 812 } } },
  ],
});
