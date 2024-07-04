import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style/form.css";

const provinces = [
  "Province No. 1",
  "Province No. 2",
  "Province No. 3",
  "Province No. 4",
  "Province No.5",
  "Province No. 6",
  "Province No. 7",
];

const Form = ({ addEntry }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    dob: "",
    city: "",
    district: "",
    province: "",
    country: "Nepal",
    profilePicture: "",
    countries: "",
  });

  const [countries, setCountries] = useState([]);
  const [errors, setErrors] = useState({});

  const setProfilePicture = (e) => {
    formData['profilePicture'] = e.target.files[0]
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    validateForm(name, value);

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      if (formData["profilePicture"]) {
        formData["profilePicture"] = await profilePictureToBase64(formData["profilePicture"]);
      }

      addEntry(formData);
      clearForm();

      console.log(formData);
    }
  };

  const validateForm = (name, value) => {
    let formErrors = {};
    let isValid = true;

    switch (name) {
      case "name":
        if (!formData['name']) {
          formErrors.name = "Name is required";
          isValid = false;
        } else {
          formErrors.name = "";
        }

        break;

      case "email":
        if (!formData["email"]) {
          formErrors.email = "Email is required";
          isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData["email"])) {
          formErrors.email = "Email is invalid";
          isValid = false;
        } else {
          formErrors.email = "";
        }

        break;

      case "phoneNumber":
        if (!formData["phoneNumber"]) {
          formErrors.phoneNumber = "Phone number is required";
          isValid = false;
        } else if (!/^\d{7,}$/.test(formData["phoneNumber"])) {
          formErrors.phoneNumber = "Phone number is invalid";
          isValid = false;
        }

        break;

      case "profilePicture":
        if (formData["profilePicture"]) {
          formErrors.profilePicture = "Profile picture must be a PNG file";
          isValid = false;
        }
        break;

      default:
        break;
    }

    setErrors(formErrors);

    return isValid;
  };

  const clearForm = () => {
    setFormData({
      name: "",
      email: "",
      phoneNumber: "",
      dob: "",
      city: "",
      district: "",
      province: "",
      country: "Nepal",
      profilePicture: "",
      countries: "",
    });
  };

  const profilePictureToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        setCountries(response.data.map((country) => country.name.common));
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  return (
    <div className="form-container">
      <h2 className="form-title">Enter Your Information</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>
            Name:<span className="star">*</span>{" "}
          </label>
          <input
            className=""
            type="text"
            name="name"
            value={formData["name"]}
            onChange={handleChange}
            style={{
              borderColor: errors.name ? "red" : "#ccc",
            }}
          />
          {errors.name && <span>{errors.name}</span>}
        </div>
        <div className="form-group">
          <label>
            Email: <span className="star">*</span>
          </label>
          <input
            name="email"
            type="email"
            value={formData["email"]}
            onChange={handleChange}
            style={{
              borderColor: errors.name ? "red" : "#ccc",
            }}
          />
          {errors.email && <span>{errors.email}</span>}
        </div>
        <div className="form-group">
          <label>
            Phone Number: <span className="star">*</span>
          </label>
          <input
            name="phoneNumber"
            type="text"
            value={formData["phoneNumber"]}
            onChange={handleChange}
            style={{
              borderColor: errors.name ? "red" : "#ccc",
            }}
          />
          {errors.phoneNumber && <span>{errors.phoneNumber}</span>}
        </div>
        <div className="form-group">
          <label>DOB:</label>
          <input name="dob" type="date" value={formData["dob"]} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>City:</label>
          <input name="city" type="text" value={formData["city"]} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>District:</label>
          <input
            name="district"
            type="text"
            value={formData["district"]}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Province:</label>
          <select name="province" value={formData["province"]} onChange={handleChange}>
            <option value="">Select Province</option>
            {provinces.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Country:</label>
          <select name="country" value={formData["country"]} onChange={handleChange}>
            {countries.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Profile Picture:</label>
          <input name="profilePicture" type="file" accept=".png" onChange={(e) => setProfilePicture(e)} />
          {errors.profilePicture && <span>{errors.profilePicture}</span>}
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default Form;
