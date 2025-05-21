const contactBaseProperties = {
    name: { type: 'string' },
    surname: { type: 'string' },
    phone: { type: 'string' },
    email: { type: 'string' },
    birthdate: { type: 'string', format: 'date' },
};
  
module.exports = {
    ContactRequest: {
      type: 'object',
      required: ['name', 'surname', 'phone'],
      properties: contactBaseProperties,
    },
    Contact: {
      type: 'object',
      required: ['name', 'surname', 'phone'],
      properties: {
        id: { type: 'integer' },
        ...contactBaseProperties,
      },
    },
};
  