// bankly/jest.config.js
// jest.config.js
module.exports = {
  setupFiles: ['<rootDir>/__tests__/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/__tests__/jest.setup.js', '<rootDir>/__tests__/jest.config.js'],
};