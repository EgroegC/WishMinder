const {authenticateToken} = require('../middleware/authorization');
const _ = require('lodash');
const validate = require('./validation/contact_validation');
const Contact = require('../models/contact'); 
const express = require('express');
const router = express.Router();

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

router.get('/', authenticateToken, async (req, res) => {

    const contacts = await Contact.getAllContacts(req.user.id);
    res.json(contacts);
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const contact_id = parseInt(req.params.id);
  const user_id = req.user.id;

  const deletedContact = await Contact.deleteContact(contact_id, user_id);
  if (!deletedContact) {
    return res.status(404).send('Contact not found');
  }

  res.status(200).json(deletedContact);
});

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
