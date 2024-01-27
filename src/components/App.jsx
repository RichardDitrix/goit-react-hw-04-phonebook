import { useState, useEffect, useRef } from 'react';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import ContactForm from './ContactForm';
import ContactList from './ContactList';
import Filter from './Filter';

const LS_KEY = 'contacts';
const DEFAULT_CONTACTS = [
  { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
  { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
  { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
  { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
];

export const App = () => {
  const [contacts, setContacts] = useState(
    () => JSON.parse(localStorage.getItem(LS_KEY)) ?? DEFAULT_CONTACTS
  );
  const [filter, setFilter] = useState('');

  const isFirstRender = useRef(true);

  const filteredContacts = contacts.filter(({ name }) =>
    name.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    localStorage.setItem(LS_KEY, JSON.stringify(contacts));
  }, [contacts]);

  const addContact = contact => {
    if (
      !contacts.find(
        ({ name }) =>
          name.toLocaleLowerCase() === contact.name.toLocaleLowerCase()
      )
    ) {
      setContacts(contacts => [contact, ...contacts]);
      return true;
    }

    Notify.failure(`${contact.name} is already in contacts`);
  };

  const deleteContact = contactId => {
    setContacts(contacts => contacts.filter(({ id }) => id !== contactId));
  };

  const onFilterChange = event => {
    setFilter(event.currentTarget.value);
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <ContactForm addContact={addContact} />
      <h2>Contacts</h2>
      <Filter value={filter} onChange={onFilterChange} />
      <ContactList contacts={filteredContacts} onDelete={deleteContact} />
    </div>
  );
};
