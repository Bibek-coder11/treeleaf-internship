import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style/form.css';

const Form = ({ addEntry }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [province, setProvince] = useState('');
  const [country, setCountry] = useState('Nepal');
  const [profilePicture, setProfilePicture] = useState(null);
  const [countries, setCountries] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((response) => {
        setCountries(response.data.map((country) => country.name.common));
      })
      .catch((error) => console.error('Error fetching countries:', error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const profilePictureBase64 = profilePicture ? await profilePictureToBase64(profilePicture) : null;
      const entry = {
        name,
        email,
        phoneNumber,
        dob,
        city,
        district,
        province,
        country,
        profilePicture: profilePictureBase64,
      };
      addEntry(entry);
      clearForm();
      console.log(entry);
    }
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!name) {
      formErrors.name = 'Name is required';
      isValid = false;
    }
    if (!email) {
      formErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = 'Email is invalid';
      isValid = false;
    }
    if (!phoneNumber) {
      formErrors.phoneNumber = 'Phone number is required';
      isValid = false;
    } else if (!/^\d{7,}$/.test(phoneNumber)) {
      formErrors.phoneNumber = 'Phone number is invalid';
      isValid = false;
    }
    if (profilePicture && !profilePicture.name.endsWith('.png')) {
      formErrors.profilePicture = 'Profile picture must be a PNG file';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const clearForm = () => {
    setName('');
    setEmail('');
    setPhoneNumber('');
    setDob('');
    setCity('');
    setDistrict('');
    setProvince('');
    setCountry('Nepal');
    setProfilePicture(null);
  };

  const profilePictureToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="form-container">
      <h2 className='form-title'>Enter Your Information</h2>
      <form onSubmit={handleSubmit} encType='multipart/form-data'>
        <div className="form-group">
          <label>Name:<span className='star'>*</span> </label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          {errors.name && <span>{errors.name}</span>}
        </div>
        <div className="form-group">
          <label>Email: <span className='star'>*</span></label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {errors.email && <span>{errors.email}</span>}
        </div>
        <div className="form-group">
          <label>Phone Number: <span className='star'>*</span></label>
          <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          {errors.phoneNumber && <span>{errors.phoneNumber}</span>}
        </div>
        <div className="form-group">
          <label>DOB:</label>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
        </div>
        <div className="form-group">
          <label>City:</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div className="form-group">
          <label>District:</label>
          <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Province:</label>
          <select value={province} onChange={(e) => setProvince(e.target.value)}>
            <option value="">Select Province</option>
            {['Province No. 1', 'Province No. 2', 'Province No. 3', 'Province No. 4', 'Province No.5', 'Province No. 6', 'Province No. 7'].map((prov) => (
              <option key={prov} value={prov}>
                 {prov}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Country:</label>
          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            {countries.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Profile Picture:</label>
          <input type="file" accept=".png" onChange={(e) => setProfilePicture(e.target.files[0])} />
          {errors.profilePicture && <span>{errors.profilePicture}</span>}
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default Form;
