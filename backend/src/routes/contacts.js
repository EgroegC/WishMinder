const {authenticateToken} = require('../middleware/authorization');
const _ = require('lodash');
const validate = require('./validation/contact_validation');
const Contact = require('../models/contact'); 
const express = require('express');
const router = express.Router();

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
 *         description: Bad request or duplicate contact
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
    let user = await Contact.findByPhoneNumber(req.user.id, req.body.phone);
    if (user) return res.status(400).send('The Contact Already Exists.');

    const contact = new Contact({
        user_id: req.user.id, 
        ..._.pick(req.body, ['name', 'surname', 'phone', 'email', 'birthdate'])
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
 *       404:
 *         description: Contact not found or not updated
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put("/:id", authenticateToken, async (req, res) => {
  const contactId = parseInt(req.params.id);
  const userId = req.user.id; 

  const { name, surname, phone, email, birthdate } = req.body;

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
