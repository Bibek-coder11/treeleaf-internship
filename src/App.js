import React, {useState} from 'react';
import FormComponent from './Component/Form';
import UserTableComponent from './Component/UserTable';
import { Route, Routes, Link } from 'react-router-dom';
import UserProfileComponent from './Component/UserProfile';
import './App.css';

function App() {
  const [entries, setEntries] = useState(JSON.parse(localStorage.getItem('entries')) || []);

  const addEntry = (entry) => {
    const updatedEntries = [...entries, entry];
    setEntries(updatedEntries);
    localStorage.setItem('entries', JSON.stringify(updatedEntries));
  };

  const deleteEntry = (index) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
    localStorage.setItem('entries', JSON.stringify(updatedEntries));
  };

  const editEntry = (index, updatedEntry) => {
    const updatedEntries = entries.map((entry, i) => (i === index ? updatedEntry : entry));
    setEntries(updatedEntries);
    localStorage.setItem('entries', JSON.stringify(updatedEntries));
  };

  return (
    <div>
      <h1 className='tri'>TreeLeaf React Internship</h1>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <FormComponent addEntry={addEntry} />
              <UserTableComponent entries={entries} deleteEntry={deleteEntry} editEntry={editEntry} />
              <Link to="/profiles">
                <button className='btn'>View Profiles</button>
              </Link>
            </>
          }
        />
        <Route path="/profiles" element={<UserProfileComponent entries={entries} />} />
      </Routes>
    </div>
  );
}

export default App;
