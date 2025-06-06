const { authenticateToken } = require('../middleware/authorization');
const _ = require('lodash');
const { validateContact, validateContactsBatch } = require('./validation/contact_validation');
const Contact = require('../models/contact');
const { encryptContact, decryptContact, hash, ContactNormalizer, ContactImporter } = require('../services/contact');
const NamedayService = require('../services/namedays_service');
const { getContactService, setContactService } = require('../utils/contactServiceHolder');
const express = require('express');
const router = express.Router();

// Preload names on startup
(async () => {
  const names = await NamedayService.getAllNames();
  setContactService(new ContactNormalizer(names));
})();

/**
 * @swagger
 * /api/contacts/batch:
 *   post:
 *     summary: Import multiple contacts
 *     tags: [Contacts]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactBatchImportRequest'
 *     responses:
 *       201:
 *         description: Contacts imported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contacts imported successfully.
 *                 insertedCount:
 *                   type: integer
 *                   example: 10
 *                 updatedCount:
 *                   type: integer
 *                   example: 1
 *                 updated:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contact'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: contacts must be a non-empty array.
 *       422:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Some contacts failed validation.
 *                 invalidContacts:
 *                   type: array
 *                   description: List of invalid contact objects with reasons.
 *                   items:
 *                     type: object
 *                     additionalProperties: true
 *       500:
 *         description: Internal server error
 */
router.post('/batch', authenticateToken, async (req, res) => {
  let contacts = req.body.contacts;

  if (!Array.isArray(contacts) || contacts.length === 0)
    return res.status(400).json({ message: 'Invalid request: contacts must be a non-empty array.' });

  contacts = getContactService().normalizeContacts(contacts);
  const invalidContacts = validateContactsBatch(contacts);

  if (invalidContacts.length > 0) {
    return res.status(422).json({ message: 'Some contacts failed validation.', invalidContacts, });
  }

  const importer = new ContactImporter({ encryptContact, decryptContact });
  const { inserted, updated } = await importer.importContacts(contacts, req.user.id);

  res.status(201).json({
    message: 'Contacts imported successfully.',
    insertedCount: inserted.length,
    updatedCount: updated.length,
    updated,
  });
});

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactCreateRequest'
 *     responses:
 *       200:
 *         description: Contact created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: The contact already exists
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Phone is required." 
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, async (req, res) => {
  const { error } = validateContact(req.body);
  if (error) return res.status(422).send(error.details[0].message);

  const normalized = getContactService().normalizeContact(req.body);
  const phoneHash = hash(normalized.phone);

  let user = await Contact.findByPhoneHash(req.user.id, phoneHash);
  if (user) return res.status(400).send('The Contact Already Exists.');

  const encrypted = encryptContact({
    ...normalized,
    user_id: req.user.id,
  });

  const saved = await encrypted.save();
  res.send(decryptContact(saved).serialize());
});

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Get all contacts for the authenticated user
 *     tags: [Contacts]
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200:
 *         description: List of contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticateToken, async (req, res) => {
  const encryptedContacts = await Contact.getAllContacts(req.user.id);
  const decryptedContacts = encryptedContacts.map(decryptContact);
  res.json(decryptedContacts.map(c => c.serialize()));
});

/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     summary: Delete a contact by ID
 *     tags: [Contacts]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contact deleted
 *       404:
 *         description: Contact not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  const contact_id = parseInt(req.params.id);
  const user_id = req.user.id;

  const deletedContact = await Contact.deleteContact(contact_id, user_id);
  if (!deletedContact) {
    return res.status(404).send('Contact not found');
  }

  res.status(200).json(decryptContact(deletedContact).serialize());
});

/**
 * @swagger
 * /api/contacts/{id}:
 *   put:
 *     summary: Update a contact by ID
 *     tags: [Contacts]
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactUpdateRequest'
 *     responses:
 *       200:
 *         description: Contact updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact not found or not updated
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.put("/:id", authenticateToken, async (req, res) => {
  const contactId = parseInt(req.params.id);
  const userId = req.user.id;

  const { error } = validateContact(req.body);
  if (error) return res.status(422).send(error.details[0].message);

  const { name, surname, phone, email, birthdate } = req.body;

  const contact = encryptContact({
    id: contactId,
    user_id: userId,
    name,
    surname,
    phone,
    email,
    birthdate,
  });

  const updatedContact = await contact.update();

  if (!updatedContact) {
    return res.status(404).json({ message: "Contact not found or not updated" });
  }

  res.json(decryptContact(updatedContact).serialize());
});

module.exports = router;
