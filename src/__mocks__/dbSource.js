// src/__mocks__/dbSource.js
const dbMock = {
    prepare: jest.fn().mockReturnThis(),
    run: jest.fn(),
    get: jest.fn(),
    all: jest.fn(),
  };
  
  module.exports = {
    db: dbMock,
  };
  