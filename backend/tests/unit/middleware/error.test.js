const mockLoggerError = jest.fn();
const mockRollbarError = jest.fn();

jest.mock('../../../src/config/logger', () => {
  return jest.fn(() => ({
    error: mockLoggerError,
  }));
});

jest.mock('../../../src/config/rollbar', () => {
  return jest.fn(() => ({
    error: mockRollbarError,
  }));
});

const errorMiddleware = require('../../../src/middleware/error');

describe('error middleware', () => {
  it('should log the error and send a 500 response', () => {
    const error = new Error('Test error');
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const next = jest.fn();

    errorMiddleware(error, req, res, next);

    expect(mockLoggerError).toHaveBeenCalledWith('Test error');
    expect(mockRollbarError).toHaveBeenCalledWith('Test error');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Something failed.');
    expect(next).not.toHaveBeenCalled();
  });
});
