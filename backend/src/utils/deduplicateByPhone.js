module.exports = function deduplicateByPhone(contacts) {
    const seen = new Set();
    return contacts.filter(contact => {
        const key = contact.phone;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
};
