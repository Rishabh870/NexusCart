import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { styled } from 'styled-components';
import { userRequest } from '../requestMethods';

const ProfileContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
`;

const ProfileField = styled.div`
  margin-bottom: 1rem;

  label {
    font-weight: bold;
  }

  input,
  span {
    display: block;
    width: 100%;
    padding: 0.5rem 0.7rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
    margin-top: 0.5rem;
  }
`;

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
`;

const Profile = () => {
  const userId = localStorage.getItem('userId'); // Retrieve the userId from localStorage

  const [userData, setUserData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsEditMode(false);
    const { fullName, mobileNumber, email, password, confirmPassword } =
      userData;
    const data = {
      fullName,
      mobileNumber,
      email,
    };
    // Add the password field to the data object if it's present
    if (password) {
      if (password !== confirmPassword) {
        console.log('Password and Confirm Password do not match.');
        return;
      }
      data.password = password;
    }

    console.log(data.fullName);

    try {
      const response = await userRequest.put(`/user/${userId}`, {
        data,
      });
      console.log(response.data); // Handle the response if needed
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await userRequest.get(`/user/${userId}`);
        const data = response.data;
        console.log(data);
        // Update state with received data
        setUserData({
          fullName: data.user.fullName,
          mobileNumber: data.user.mobileNumber,
          email: data.user.email,
          password: '', // Clear password field on fetch
          confirmPassword: '', // Clear confirm password field on fetch
        });
        // setAlternateMobile(data.user.alternateMobile);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <>
      <Header />
      <Container style={{ minHeight: '55vh' }}>
        <ProfileContainer>
          <h2 className=' text-center text-decoration-underline'>
            Profile Details
          </h2>
          <div className='mt-4'>
            <ProfileField>
              <label>Full Name</label>
              {isEditMode ? (
                <input
                  type='text'
                  value={userData.fullName}
                  onChange={(e) =>
                    setUserData({ ...userData, fullName: e.target.value })
                  }
                />
              ) : (
                <span>{userData.fullName}</span>
              )}
            </ProfileField>
            <ProfileField>
              <label>Mobile Number</label>
              {isEditMode ? (
                <input
                  type='text'
                  value={userData.mobileNumber}
                  onChange={(e) =>
                    setUserData({ ...userData, mobileNumber: e.target.value })
                  }
                />
              ) : (
                <span>{userData.mobileNumber}</span>
              )}
            </ProfileField>
            <ProfileField>
              <label>Email ID</label>
              {isEditMode ? (
                <input
                  type='text'
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                />
              ) : (
                <span>{userData.email}</span>
              )}
            </ProfileField>
            <ProfileField>
              <label>Password</label>
              {isEditMode ? (
                <input
                  type='text'
                  onChange={(e) =>
                    setUserData({ ...userData, password: e.target.value })
                  }
                />
              ) : (
                <span>Enter New Password</span>
              )}
            </ProfileField>
            <ProfileField>
              <label>Confirm Password</label>
              {isEditMode ? (
                <input
                  type='text'
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              ) : (
                <span>Repeat New Password</span>
              )}
            </ProfileField>

            {isEditMode ? (
              <Button type='submit' onClick={(e) => handleSubmit(e)}>
                Save
              </Button>
            ) : (
              <Button onClick={handleEdit}>Edit</Button>
            )}
          </div>
        </ProfileContainer>
      </Container>
      <Footer />
    </>
  );
};

export default Profile;
