let contactServiceInstance = null;

function setContactService(instance) {
  contactServiceInstance = instance;
}

function getContactService() {
  return contactServiceInstance;
}

module.exports = {
  setContactService,
  getContactService,
};
