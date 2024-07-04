import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './style/profile.css'; 

const UserProfile = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem('entries')) || [];
    setEntries(savedEntries);
  }, []);

  return (
    <div className="profile-container">
      <h1 className='profile-title'>Profiles</h1>
      <Link to="/">
        <button className='btn-back'>Back</button>
      </Link>
      <table>
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
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              <td>{entry.name}</td>
              <td>{entry.email}</td>
              <td>{entry.phoneNumber}</td>
              <td>{entry.dob}</td>
              <td>{entry.city}</td>
              <td>{entry.district}</td>
              <td>{entry.province}</td>
              <td>{entry.country}</td>
              <td>{entry.profilePicture ? <img src={entry.profilePicture} alt="Profile" width="50" height="50" /> : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserProfile;
