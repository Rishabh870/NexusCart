import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { userRequest } from '../requestMethods';
import {Container} from 'react-bootstrap'
import UserCard from '../AdminComponents/UserCard';

const RowContainer = styled.div`
  
  padding: 10px 20px;
  background-color: #f8f9fa;
  font-weight: bold;
`;

const HeaderCell = styled.div`
  flex: 1;
  text-align: center;
`;

const UserPanel = () => {
const [users, setUsers] = useState([])

    useEffect(() => {
        const getUser = async () => {
          try {
            const response = await userRequest.get('/user/users/all');
              console.log(response.data); // Access the data inside the resolved Promise
              setUsers(response.data)
          } catch (error) {
            console.log(error);
          }
        };
        getUser();
      }, []);
      
    return (
      <div>
            <Header />
            <Container style={{minHeight:'40rem'}}>

    <RowContainer className='row'>
      <HeaderCell className='col-3'>User ID</HeaderCell>
      <HeaderCell className='col-2'>Name</HeaderCell>
      <HeaderCell className='col-2'>Email</HeaderCell>
      <HeaderCell className='col-2'>isAdmin</HeaderCell>
      <HeaderCell className='col-3'>Action</HeaderCell>
                </RowContainer>
               
                {users.map((user, index) => {
                    return <div>
                        <UserCard userId={user._id} name={user.fullName} email={user.email} isAdmin={ user.isAdmin}/>
                    </div>
                })}
            </Container>
            <Footer/>
      </div>
  );
};

export default UserPanel;
