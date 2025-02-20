import React, { useState } from 'react';

interface UserInfo {
  name: string;
  lastName: string;
  contact: string;
}

interface UserInfoFormProps {
  onStartChat: (userInfo: UserInfo) => void;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ onStartChat }) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contact, setContact] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const userInfo: UserInfo = { name, lastName, contact };
    onStartChat(userInfo);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Ingresá tus datos para el turno</h2>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nombre (requerido):</label>
        <input
          type="text"
          id="name"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">Apellido (opcional):</label>
        <input
          type="text"
          id="lastName"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="contact" className="block text-gray-700 text-sm font-bold mb-2">Teléfono o Email (requerido):</label>
        <input
          type="text"
          id="contact"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
          Comenzar Chat
        </button>
      </div>
    </form>
  );
};

export default UserInfoForm;