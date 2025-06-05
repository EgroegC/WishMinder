const contactBaseProperties = {
  name: {
    type: 'string',
    description: 'First name.',
  },
  surname: {
    type: 'string',
    description: 'Last name.',
  },
  phone: {
    type: 'string',
    description: 'Phone number in international format (e.g. +123456789). Required.',
  },
  email: {
    type: 'string',
    format: 'email',
    description: 'Optional email address.',
  },
  birthdate: {
    type: 'string',
    format: 'date',
    description: 'Optional birthdate in ISO format (YYYY-MM-DD).',
  },
};

const requireNameOrSurname = [
  {
    required: ['name'],
    properties: {
      name: {
        type: 'string',
        description: 'First name. Either name or surname is required.',
      },
    },
  },
  {
    required: ['surname'],
    properties: {
      surname: {
        type: 'string',
        description: 'Surname. Either name or surname is required.',
      },
    },
  },
];

module.exports = {
  Contact: {
    type: 'object',
    required: ['id', 'phone'],
    properties: {
      id: { type: 'integer', example: 1 },
      name: {
        type: 'string',
        nullable: true,
        description: 'First name. Might be missing if not provided during creation.',
      },
      surname: {
        type: 'string',
        nullable: true,
        description: 'Last name. Might be missing if not provided during creation.',
      },
      phone: {
        type: 'string',
        description: 'Phone number in international format (e.g. +123456789). Required.',
      },
      email: {
        type: 'string',
        format: 'email',
        nullable: true,
        description: 'Optional email address.',
      },
      birthdate: {
        type: 'string',
        format: 'date',
        nullable: true,
        description: 'Optional birthdate in ISO format (YYYY-MM-DD).',
      },
    },
  },
  ContactCreateRequest: {
    type: 'object',
    required: ['phone'],
    properties: contactBaseProperties,
    anyOf: requireNameOrSurname,
  },
  ContactUpdateRequest: {
    type: 'object',
    required: ['phone'],
    properties: contactBaseProperties,
    anyOf: requireNameOrSurname,
  },
  ContactBatchImportRequest: {
    type: 'object',
    required: ['contacts'],
    properties: {
      contacts: {
        type: 'array',
        items: { $ref: '#/components/schemas/ContactCreateRequest' },
      },
    },
  },
};
