const normalizeName = require('../../utils/normalizeName');

class ContactNormalizer {
    constructor(knownNames) {
        this.normalizedMap = new Map();
        knownNames.forEach((name) => {
            this.normalizedMap.set(normalizeName(name), name);
        });
    }

    normalizePhoneNumber(phone) {
        return phone.trim().replace(/(?!^\+)[^\d]/g, '');
    }

    splitFullNameIfNeeded(name, surname) {
        if (!surname && name && name.trim().split(/\s+/).length === 2) {
            const [first, last] = name.trim().split(/\s+/);
            return { name: first, surname: last };
        }
        return { name, surname };
    }

    normalizeAndResolveNameOrder(name, surname) {
        const normName = normalizeName(name || "");
        const normSurname = normalizeName(surname || "");

        const nameMatch = this.normalizedMap.get(normName);
        const reverseNameMatch = this.normalizedMap.get(normSurname);

        const isSwapped = !nameMatch && reverseNameMatch;

        if (isSwapped) {
            return {
                name: reverseNameMatch,
                surname: name,
            };
        }

        return {
            name: nameMatch || name,
            surname: surname,
        };
    }

    normalizeContact(c) {
        if (!c?.phone || !(c.name || c.surname)) return c;

        let { name, surname } = this.splitFullNameIfNeeded(c.name, c.surname);
        ({ name, surname } = this.normalizeAndResolveNameOrder(name, surname));

        const normalized = {
            phone: this.normalizePhoneNumber(c.phone),
        };

        if (name) normalized.name = name;
        if (surname) normalized.surname = surname;
        if (c.email?.trim()) normalized.email = c.email.trim();
        if (c.birthdate) normalized.birthdate = c.birthdate;

        return normalized;
    }

    normalizeContacts(contacts) {
        return contacts.map((c) => this.normalizeContact(c));
    }
}

module.exports = ContactNormalizer;