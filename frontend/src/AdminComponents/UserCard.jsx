import React from 'react';
import styled from 'styled-components';
import { userRequest } from '../requestMethods';

const CardContainer = styled.div`
  text-align: center;
  padding: 10px 20px;
  border: 1px solid #e0e0e0;
  margin-bottom: 10px;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const ActionButton = styled.button`
  background-color: ${(props) => (props.edit ? 'white' : 'black')};
  color: ${(props) => (props.edit ? 'black' : 'white')};
  border: 2px solid black;
  cursor: pointer;
  padding: 3px 12px; 
  margin-right: 5px;
`;

const UserCard = ({ userId, name, email, isAdmin }) => {
  const handleEdit = async () => {
    try {
      const response = await userRequest.get()
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  const handleDelete = async () => {
    try {
      const response = await userRequest.delete()
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <CardContainer className='row'>
      <UserInfo className='col-3 my-auto'>{userId}</UserInfo>
      <UserInfo className='col-2 my-auto'>{name}</UserInfo>
      <UserInfo className='col-2 my-auto'>{email}</UserInfo>
      <UserInfo className='col-2 my-auto'>{isAdmin ? 'Yes' : 'No'}</UserInfo>
      <UserInfo className='col-3 my-auto'>
        <ActionButton onClick={handleEdit} edit>Edit</ActionButton>
        <ActionButton onClick={handleDelete}>Delete</ActionButton>
      </UserInfo>
    </CardContainer>
  );
};

export default UserCard;
