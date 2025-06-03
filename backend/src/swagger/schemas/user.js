const userBaseProperties = {
  name: { type: 'string' },
  email: { type: 'string', format: 'email' },
};

module.exports = {
  UserRequest: {
    type: 'object',
    required: ['name', 'email', 'password'],
    properties: {
      ...userBaseProperties,
      password: { type: 'string', format: 'password' },
    },
  },
  UserResponse: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      ...userBaseProperties,
    },
  },
};
