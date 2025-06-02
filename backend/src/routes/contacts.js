const {authenticateToken} = require('../middleware/authorization');
const _ = require('lodash');
const { validateContact, validateContactsBatch} = require('./validation/contact_validation');
const Contact = require('../models/contact'); 
const ContactService = require('../services/contact_service');
const NamedayService = require('../services/namedays_service'); 
const express = require('express');
const router = express.Router();

let contactService;

// Preload names on startup
(async () => {
  const greekNames = await NamedayService.getAllNames();
  contactService = new ContactService(greekNames);
})();

/**
 * @swagger
 * /api/contacts/import/vcf:
 *   post:
 *     summary: Import multiple contacts using contact card (.vcf file)
 *     tags: [Contacts]
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contacts
 *             properties:
 *               contacts:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/ContactRequest'
 *     responses:
 *       201:
 *         description: Contacts imported successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/import/vcf', authenticateToken, async (req, res) => {
    const contacts = req.body.contacts;
    const userId = req.user.id;

    if (!Array.isArray(contacts) || contacts.length === 0) 
      return res.status(422).json({ message: 'Invalid request: contacts must be a non-empty array.' });
    

    if (validateContactsBatch(contacts)) 
      return res.status(422).json({message: 'One or more contacts failed validation.'});
    
    const { inserted, updated } = await contactService.importContacts(contacts, userId);
    
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
 *             $ref: '#/components/schemas/ContactRequest'
 *     responses:
 *       200:
 *         description: Contact created successfully
 *       400:
 *         description: The contact already exists
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, async (req, res) => {
    const { error, value } = validateContact(req.body); 
    if (error) return res.status(422).send(error.details[0].message);
    
    let user = await Contact.findByPhoneNumber(req.user.id, value.phone);
    if (user) return res.status(400).send('The Contact Already Exists.');

    const contact = new Contact({
        user_id: req.user.id, 
        ..._.pick(value, ['name', 'surname', 'phone', 'email', 'birthdate'])
    });

    await contact.save();
    
    res.send(contact);
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

    const contacts = await Contact.getAllContacts(req.user.id);
    res.json(contacts);
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

  res.status(200).json(deletedContact);
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
 *             $ref: '#/components/schemas/Contact'
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

  const { error, value } = validateContact(req.body); 
    if (error) return res.status(422).send(error.details[0].message);

  const { name, surname, phone, email, birthdate } = value;

  const contact = new Contact({
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

  res.json(updatedContact);
});

module.exports = router;
