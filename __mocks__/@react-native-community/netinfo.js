export default {
  getCurrentConnectivity: jest.fn(),
  isConnectionMetered: jest.fn(),
  addListener: jest.fn(),
  removeListeners: jest.fn(),
  fetch: () => {
    return Promise.resolve({
      isConnected: jest.fn()
    });
  },
  isConnected: {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
};
