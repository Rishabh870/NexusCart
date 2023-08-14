import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { userRequest } from "../requestMethods";
import { Container } from "react-bootstrap";
import UserCard from "../AdminComponents/UserCard";
import ReactPaginate from "react-paginate";

const RowContainer = styled.div`
  padding: 10px 20px;
  background-color: #f8f9fa;
  font-weight: bold;
  font-family: "Playfair Display", sans-serif !important;
`;

const HeaderCell = styled.div`
  flex: 1;
  text-align: center;
`;
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    li {
      margin: 0 5px;
      a {
        padding: 5px 10px;
        border: 1px solid #ccc;
        color: #000000;
        text-decoration: none;
        &:hover {
          background-color: #000000;
          color: #ffffff;
        }
      }
    }
    .active a {
      background-color: #333;
      color: #fff;
    }
    .disabled a {
      pointer-events: none;
      color: #ccc;
    }
  }
`;

const UserPanel = () => {
  const [users, setUsers] = useState([]);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const productsPerPage = 11;
  const pageCount = Math.ceil(users.length / productsPerPage);
  const startIndex = currentPage * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const userToShow = users.slice(startIndex, endIndex);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const response = await userRequest.get("/user/users/all");
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [update]);

  return (
    <div>
      <Header />
      {loading ? (
        <div
          style={{ height: "80vh" }}
          className="w-100 d-flex justify-content-center align-items-center"
        >
          <div className=" spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <Container style={{ minHeight: "80vh" }}>
          <RowContainer className="row">
            <HeaderCell className="col-3">User ID</HeaderCell>
            <HeaderCell className="col-2">Name</HeaderCell>
            <HeaderCell className="col-3">Email</HeaderCell>
            <HeaderCell className="col-2">isAdmin</HeaderCell>
            <HeaderCell className="col-2 my-auto p-0">Action</HeaderCell>
          </RowContainer>

          {userToShow.map((user, index) => {
            return (
              <div>
                <UserCard
                  userId={user._id}
                  name={user.fullName}
                  email={user.email}
                  isAdmin={user.isAdmin}
                  mobile={user.mobileNumber}
                  update={update}
                  setUpdate={setUpdate}
                />
              </div>
            );
          })}
        </Container>
      )}
      <PaginationContainer>
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          previousLinkClassName={"page-link"}
          nextLinkClassName={"page-link"}
          disabledClassName={"disabled"}
          activeClassName={"active"}
        />
      </PaginationContainer>
      <Footer />
    </div>
  );
};

export default UserPanel;
