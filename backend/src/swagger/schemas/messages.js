module.exports = {
  Message: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      type: { type: 'string', enum: ['birthday', 'nameday'] },
      content: { type: 'string' },
    },
  },
};  