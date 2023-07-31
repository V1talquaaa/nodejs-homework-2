
const fs = require('fs/promises')
const path = require('path')
const {nanoid} = require('nanoid')

const contactsPath = path.resolve('./models/contacts.json')

async function listContacts() {
    const result = await fs.readFile(contactsPath, "utf-8")
    return JSON.parse(result)
  }
  
  async function getContactById(contactId) {
    const contacts = await listContacts();
    const findContactById = contacts.find((contact) => contact.id === contactId);
    return findContactById || null
  }
  
  async function removeContact(contactId) {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if(index === -1) return null
    const updatedContacts = contacts.splice(index, 1)
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
    return updatedContacts || null
  }
  
  async function addContact(name, email, phone) {
    const contacts = await listContacts();
    const newContact = {
      id: nanoid(), 
      name, 
      email, 
      phone,
    }
    contacts.push(newContact)
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
    return newContact

  }

  async function updateById(id, data) {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === id);
    if(index === -1) {
      return null;
    }
    contacts[index] = {id, ...data};
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts[index];
  }

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateById,
}