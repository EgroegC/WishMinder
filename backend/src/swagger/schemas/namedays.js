module.exports = {
  Nameday: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      nameday_date: { type: 'string', format: 'date' },
    },
  },
};  