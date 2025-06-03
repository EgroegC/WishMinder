module.exports = {
  Celebration: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      user_id: { type: 'integer' },
      name: { type: 'string' },
      surname: { type: 'string' },
      phone: { type: 'string' },
      birthdate: { type: 'string', format: 'date' },
      nameday_date: { type: 'string', format: 'date', nullable: true },
      created_at: { type: 'string', format: 'date-time' },
      type: {
        type: 'string',
        enum: ['birthday', 'nameday'],
      },
    },
  },
};
