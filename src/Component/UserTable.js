import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

import './style/table.css';

Modal.setAppElement('#root');

const UserTable = ({ entries, deleteEntry, editEntry }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEntries, setFilteredEntries] = useState(entries);
  const entriesPerPage = 5;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [countryList, setCountryList] = useState([]);
  const [provinceList, setProvinceList] = useState([]);

  useEffect(() => {
    // Fetch country list from API
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((response) => {
        const countries = response.data.map((country) => country.name.common);
        setCountryList(countries);
      })
      .catch((error) => {
        console.error('There was an error fetching the country list!', error);
      });

    // Fetch province list for Nepal (hardcoded for this example)
    const nepalProvinces = [
      'Province No. 1',
      'Province No. 2',
      'Bagmati Province',
      'Gandaki Province',
      'Lumbini Province',
      'Karnali Province',
      'Sudurpashchim Province',
    ];
    setProvinceList(nepalProvinces);
  }, []);

  useEffect(() => {
    const filtered = entries.filter((entry) =>
      Object.values(entry).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredEntries(filtered);
  }, [searchTerm, entries]);

  const handleDelete = (index) => {
    deleteEntry(index);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditingEntry(entries[index]);
    setIsModalOpen(true);
  };

  const handleChangePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingEntry({ ...editingEntry, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'image/png') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingEntry({ ...editingEntry, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a PNG image.');
    }
  };

  const handleSave = () => {
    // Simulate an API call
    setTimeout(() => {
      editEntry(editingIndex, editingEntry);
      setIsModalOpen(false);
    }, 500);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  return (
    <div className="table-container">
      <div className='table-title'>
        <h1>User Information Detail</h1>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>DOB</th>
            <th>City</th>
            <th>District</th>
            <th>Province</th>
            <th>Country</th>
            <th>Profile Picture</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedEntries.map((entry, index) => (
            <tr key={index}>
              <td>{entry.name}</td>
              <td>{entry.email}</td>
              <td>{entry.phoneNumber}</td>
              <td>{entry.dob}</td>
              <td>{entry.city}</td>
              <td>{entry.district}</td>
              <td>{entry.province}</td>
              <td>{entry.country}</td>
              <td>
                {entry.profilePicture && (
                  <img src={entry.profilePicture} alt="Profile" width="50" />
                )}
              </td>
              <td>
                <button
                  className="action-button edit-button"
                  onClick={() => handleEdit((currentPage - 1) * entriesPerPage + index)}
                >
                  Edit
                </button>
                <button
                  className="action-button delete-button"
                  onClick={() => handleDelete((currentPage - 1) * entriesPerPage + index)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredEntries.length / entriesPerPage) }, (_, i) => (
          <button className="page-button" key={i + 1} onClick={() => handleChangePage(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
        <h2 className="editText">Edit Information</h2>
        {editingEntry && (
          <form>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={editingEntry.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={editingEntry.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Phone Number:</label>
              <input
                type="text"
                name="phoneNumber"
                value={editingEntry.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>DOB:</label>
              <input type="date" name="dob" value={editingEntry.dob} onChange={handleInputChange} />
            </div>
            <div>
              <label>City:</label>
              <input type="text" name="city" value={editingEntry.city} onChange={handleInputChange} />
            </div>
            <div>
              <label>District:</label>
              <input
                type="text"
                name="district"
                value={editingEntry.district}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Province:</label>
              <select name="province" value={editingEntry.province} onChange={handleInputChange}>
                {provinceList.map((province, index) => (
                  <option key={index} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Country:</label>
              <select name="country" value={editingEntry.country} onChange={handleInputChange}>
                {countryList.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Profile Picture:</label>
              <input type="file" accept=".png" onChange={handleFileChange} />
              {editingEntry.profilePicture && (
                <div>
                  <img src={editingEntry.profilePicture} alt="Profile" width="100" />
                </div>
              )}
            </div>
            <button className="page-button" type="button" onClick={handleSave}>
              Save
            </button>
            <button className="page-button" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default UserTable;

