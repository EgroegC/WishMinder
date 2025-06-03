const authBaseProperties = {
  email: { type: 'string', format: 'email' },
  password: { type: 'string', format: 'password' },
};

module.exports = {
  AuthRequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: authBaseProperties,
  },
  AuthResponse: {
    type: 'object',
    properties: {
      accessToken: { type: 'string' },
    },
  },
};
