import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AiOutlineSearch, AiOutlineShoppingCart } from "react-icons/ai";
import { HiOutlineUser } from "react-icons/hi2";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import DealAnnouncement from "./DealAnnouncement";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { userRequest } from "../requestMethods";

const Sections = styled.div`
  display: flex;
  align-items: center;
`;

const LogoContainer = styled.div`
  width: 10rem;
  display: flex;
  align-content: center;
`;

const Container = styled.div`
  justify-content: space-evenly;
`;

const SearchContainer = styled.form`
  width: 100%;
  font-family: "Playfair Display", serif;

  input {
    width: 80%;
    flex: 1;
    border-right: transparent;
    border-radius: 20px 0 0 20px;
    padding: 7px 15px;
    border-top: 1px solid gray;
    border-bottom: 1px solid gray;
    border-left: 1px solid gray;
  }

  button {
    width: fit-content;
    border-left: transparent;
    background-color: transparent;
    border-radius: 0 20px 20px 0;
    padding: 7px 15px;
    border-right: 1px solid gray;
    border-top: 1px solid gray;
    border-bottom: 1px solid gray;
  }
`;

const IconContainer = styled.div`
  font-size: larger;
`;

const DropdownItem = styled(Link)`
  text-decoration: none;
  color: black;
  font-family: "Playfair Display", serif;
  margin: 0.3rem 0;
`;

const CartBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  background-color: red;
  color: white;
  border-radius: 50%;
  font-size: 12px;
`;

const SidebarContainer = styled.div`
  position: fixed;
  height: 100vh;
  z-index: 3;
  display: flex;
  flex-direction: column;
  top: 0;
  left: ${({ open }) => (open ? "0" : "-100%")};
  transform: ${({ open }) => (open ? "translateX(0)" : "translateX(-100%)")};
  width: 250px;
  background-color: #ffffff;
  transition: transform 0.3s ease-in-out;
  padding: 0.9rem 2rem;
  overflow-y: auto; /* Enable vertical scrolling */
`;

const SidebarHeading = styled.p`
  font-size: 13px;
  color: #b8b8b8;
  font-weight: bold;
  margin-bottom: 10px;
  font-family: "Josefin Sans regular";
`;

const SidebarItem = styled.p`
  font-size: 16px;
`;

const SidebarLink = styled(Link)`
  text-decoration: none;
  color: black !important;
  text-decoration: none;
  font-family: "Josefin Sans regular";
  font-size: 16px;
  &:visited {
    color: black; /* Set the desired color for visited links */
    text-decoration: none;
  }
`;

const LogoutButton = styled(Button)`
  width: 75%;
  background-color: #000;
  color: #fff;
  padding: 10px;
  position: relative;
  bottom: 0;
  border: none;
  margin: 10px auto;
`;
const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const quantity = useSelector((state) => state.cart.quantity);
  const [isOpen, setIsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [name, setName] = useState("Guest");
  const [MenuBrands, setMenuBrands] = useState([]);
  const [MenuCategories, setMenuCategories] = useState([]);

  const isLoggedIn = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin");
  let menus = useRef(null);

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate(
      searchQuery ? `/allproducts/?searchQuery=${searchQuery}` : `/allproducts`
    );
  };

  const handleAdminDropdownToggle = () => {
    setIsAdminOpen(!isAdminOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    // Then redirect to the login page
    setIsAdminOpen(false);
    setIsOpen(false);
    // Perform logout logic and redirect here

    window.location.href = "/login";
  };

  useEffect(() => {
    const getCategorysAndBrands = async () => {
      try {
        const categories = await userRequest.get("/category/categories");
        setMenuCategories(categories.data);
        const brands = await userRequest.get("/brand/brands");
        setMenuBrands(brands.data);
      } catch (error) {}
    };
    getCategorysAndBrands();
    const handleClickOutside = (event) => {
      if (!menus.current.contains(event.target)) {
        setSide(false);
      }
    };

    if (isLoggedIn) {
      const storedName = localStorage.getItem("name");
      setName(storedName ? storedName.split(" ")[0] : "Guest");
    }

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("scroll", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("scroll", handleClickOutside);
    };
  }, []);

  const [side, setSide] = useState(false);

  const handleToggleSidebar = () => {
    if (side) {
      setSide(false);
    } else {
      setSide(true);
    }
  };

  // remove token from localstorage, navigate to login

  return (
    <div
      style={{
        zIndex: 2,
        backgroundColor: "white",
      }}
    >
      <DealAnnouncement />
      <div>
        <Sections id="Sections" className="row p-0 py-2 m-0 ">
          <IconContainer
            ref={menus}
            className="text-center pl-2 w-100 col-1 p-0"
          >
            <HiOutlineMenuAlt1 onClick={handleToggleSidebar} />
            <SidebarContainer className="p-0" open={side}>
              <h3
                style={{ backgroundColor: "black" }}
                className=" m-0 text-white
                py-4"
              >
                Hello, {name}
              </h3>
              <hr className="mt-0" />
              <SidebarHeading className="text-left px-4">Menu</SidebarHeading>
              <div className="px-5 text-left ">
                <SidebarItem>
                  <SidebarLink to="/">Home</SidebarLink>
                </SidebarItem>
                <SidebarItem>
                  <SidebarLink to="/allproducts">Products</SidebarLink>
                </SidebarItem>
                <SidebarItem>
                  <SidebarLink to="/cart">Cart</SidebarLink>
                </SidebarItem>
                <SidebarItem>
                  <SidebarLink to="/orders">Order History</SidebarLink>
                </SidebarItem>
              </div>
              <SidebarHeading className="text-left px-4">
                Categories
              </SidebarHeading>
              <div className="px-5 text-left ">
                {MenuCategories.map((category) => {
                  return (
                    <SidebarItem>
                      <SidebarLink
                        to={`/allproducts/?category=${category.name}`}
                      >
                        {category.name}
                      </SidebarLink>
                    </SidebarItem>
                  );
                })}
              </div>
              <SidebarHeading className="text-left px-4">Brand</SidebarHeading>
              <div className="px-5 text-left ">
                {MenuBrands.map((brand) => {
                  return (
                    <SidebarItem>
                      <SidebarLink to={`/allproducts/?brand=${brand.name}`}>
                        {brand.name}
                      </SidebarLink>
                    </SidebarItem>
                  );
                })}
              </div>
              <div style={{ flexGrow: 1 }}></div>

              <LogoutButton
                style={{ marginTop: "auto" }}
                onClick={handleLogout}
                className="w-75 btn-dark mx-3"
              >
                Log Out
              </LogoutButton>
            </SidebarContainer>
          </IconContainer>
          <LogoContainer id="Logo" className="col-6 py-1 p-0">
            {/* <img src={Logo} alt='' style={{ width: '7.5rem' }} /> */}
            <Link to="/" style={{ textDecoration: "none", color: "black" }}>
              <h3 style={{ fontFamily: "Playfair Display SC" }} className="m-0">
                NexusCart
              </h3>
            </Link>
          </LogoContainer>
          <Container className="row col-5 p-0 justify-content-evenly">
            <SearchContainer onSubmit={handleSubmit} className=" col-8 p-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                placeholder="Search For Product ..."
              />
              <button type="submit">
                <AiOutlineSearch />
              </button>
            </SearchContainer>
            <div className="row p-0 col-4 justify-content-center">
              <IconContainer
                id="Cart"
                className="col-md-3 px-2 align-self-center"
              >
                <Link
                  to="/cart"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <div
                    style={{
                      width: "fit-content",
                      position: "relative",
                      paddingRight: "10px",
                    }}
                  >
                    <CartBadge>{quantity}</CartBadge>
                    <AiOutlineShoppingCart />
                  </div>
                </Link>
              </IconContainer>
              <IconContainer
                id="Profile"
                className="col-md-3 px-2 align-self-center"
              >
                <div
                  className="dropdown-icon "
                  onClick={handleDropdownToggle}
                  style={{
                    width: "fit-content",
                    position: "relative",
                  }}
                >
                  <HiOutlineUser />
                </div>
                <div
                  className={`dropdown-menu ${
                    isOpen ? "d-flex" : "d-none"
                  } px-3 mt-3`}
                  style={{
                    flexDirection: "column",
                    position: "absolute",
                    left: "-7rem",
                  }}
                >
                  {isLoggedIn ? (
                    <>
                      <DropdownItem
                        className=" text-decoration-none"
                        to="/profile"
                        onClick={handleDropdownToggle}
                      >
                        My Profile
                      </DropdownItem>
                      <DropdownItem
                        to="/orders"
                        className=" text-decoration-none"
                        onClick={handleDropdownToggle}
                      >
                        Order History
                      </DropdownItem>
                      <DropdownItem
                        to={"/login"}
                        className=" text-decoration-none"
                        onClick={handleLogout}
                      >
                        Logout
                      </DropdownItem>
                    </>
                  ) : (
                    <>
                      <DropdownItem
                        to="/login"
                        className=" text-decoration-none"
                        onClick={handleDropdownToggle}
                      >
                        Login
                      </DropdownItem>
                      <DropdownItem
                        to="/signup"
                        className=" text-decoration-none"
                        onClick={handleDropdownToggle}
                      >
                        Signup
                      </DropdownItem>
                    </>
                  )}
                </div>
              </IconContainer>
              {isAdmin === "true" ? (
                <IconContainer
                  id="Admin"
                  className="col-md-3 px-2 align-self-center"
                >
                  <div
                    className="dropdown-icon "
                    onClick={handleAdminDropdownToggle}
                    style={{
                      width: "fit-content",
                      position: "relative",
                      fontSize: "1.3rem",
                      paddingRight: "10px",
                    }}
                  >
                    <MdOutlineAdminPanelSettings />
                  </div>
                  <div
                    className={`dropdown-menu ${
                      isAdminOpen ? "d-flex" : "d-none"
                    } px-3 mt-3`}
                    style={{
                      flexDirection: "column",
                      position: "absolute",
                      left: "-7rem",
                    }}
                  >
                    <DropdownItem
                      className=" text-decoration-none"
                      to="/admin/dashboard"
                      onClick={handleAdminDropdownToggle}
                    >
                      Dashboard
                    </DropdownItem>
                    <DropdownItem
                      className=" text-decoration-none"
                      to="/admin/users"
                      onClick={handleAdminDropdownToggle}
                    >
                      Users
                    </DropdownItem>
                    <DropdownItem
                      className=" text-decoration-none"
                      to="/admin/products"
                      onClick={handleAdminDropdownToggle}
                    >
                      Products
                    </DropdownItem>
                    <DropdownItem
                      to="/admin/history"
                      className=" text-decoration-none"
                      onClick={handleAdminDropdownToggle}
                    >
                      Order History
                    </DropdownItem>
                    <DropdownItem
                      className=" text-decoration-none"
                      onClick={handleLogout}
                    >
                      Logout
                    </DropdownItem>
                  </div>
                </IconContainer>
              ) : null}
            </div>
          </Container>
        </Sections>
      </div>
      <hr className="mt-0" />
    </div>
  );
};

export default Header;
