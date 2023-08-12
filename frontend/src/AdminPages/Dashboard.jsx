import React, { useEffect, useState } from "react";
import { Container, NavLink } from "react-bootstrap";
import Header from "../Components/Header";
import { styled } from "styled-components";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  Legend,
} from "recharts";
import { userRequest } from "../requestMethods";
import { Link } from "react-router-dom";

const Box = styled.div`
  max-width: 10rem;
  width: 100%;
  height: 4rem;
  border: 1px solid #ccc;
  margin: 0 50px;
  display: flex;
  max-width: 13rem;
  align-items: center;
  background-color: #ffffff; /* Set your desired background color */
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2); /* Set your desired box shadow */
`;
const BoxContainer = styled.div`
  font-family: "Josefin Sans", sans-serif;
  justify-content: center;
`;

const Title = styled.div`
  font-family: "Playfair Display", serif;
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  text-decoration: underline;
`;

const AreaGraphContainer = styled.div`
  font-family: "Josefin Sans", sans-serif;
  margin: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const PieGraphContainer = styled.div`
  font-family: "Josefin Sans", sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Heading = styled.span`
  font-weight: bold;
  width: 100%;
`;
const Data = styled.span`
  width: 100%;
`;
const Dashboard = () => {
  const [User, setUser] = useState([]);
  const [Orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const totalAmount = Orders.reduce((total, order) => total + order.total, 0);
  // Assuming your Orders array is in the format mentioned in the previous prompt

  const liveChartData = [];

  // Get the earliest order date from the Orders array
  const earliestDate = new Date(
    Math.min(...Orders.map((order) => new Date(order.date)))
  );

  // Get the month before the earliest order
  const previousMonth = new Date(earliestDate);
  previousMonth.setMonth(previousMonth.getMonth() - 1);

  //  Initialize liveChartData with the month before the earliest order
  liveChartData.push({
    month: previousMonth.toLocaleString("default", { month: "long" }),
    value: 0,
  });

  //Loop through the Orders array and update liveChartData
  Orders.forEach((order) => {
    const orderDate = new Date(order.date);
    const month = orderDate.toLocaleString("default", { month: "long" });

    // Check if the month already exists in liveChartData
    const existingMonthIndex = liveChartData.findIndex(
      (data) => data.month === month
    );

    if (existingMonthIndex !== -1) {
      // If the month exists, update the value with the total amount
      liveChartData[existingMonthIndex].value += order.total;
    } else {
      // If the month doesn't exist, add a new entry to liveChartData with the total amount
      liveChartData.push({
        month,
        value: order.total,
      });
    }
  });

  // Create objects to keep track of total sales for each category and brand
  const categorySales = {};
  const brandSales = {};

  //  Loop through the Orders array and update the total sales for categories and brands
  Orders.forEach((order) => {
    order.products.forEach((product) => {
      const { category, brandName, price } = product.productId;
      const { quantity } = product;
      const total = quantity; // Calculate the total sales for the product

      // Update category sales
      if (category in categorySales) {
        categorySales[category] += total;
      } else {
        categorySales[category] = total;
      }

      // Update brand sales
      if (brandName in brandSales) {
        brandSales[brandName] += total;
      } else {
        brandSales[brandName] = total;
      }
    });
  });

  //Create the pieChartData array with data from categorySales
  const pieChartDataCategory = Object.keys(categorySales).map((category) => ({
    name: category,
    value: categorySales[category],
  }));

  //  Create the pieChartData array with data from brandSales
  const pieChartDataBrand = Object.keys(brandSales).map((brand) => ({
    name: brand,
    value: brandSales[brand],
  }));

  // Generate random unique colors for both pie charts
  const uniqueColorsCategory = new Set();
  const uniqueColorsBrand = new Set();

  while (uniqueColorsCategory.size < pieChartDataCategory.length) {
    const randomColor = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
    uniqueColorsCategory.add(randomColor);
  }

  while (uniqueColorsBrand.size < pieChartDataBrand.length) {
    const randomColor = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
    if (!uniqueColorsCategory.has(randomColor)) {
      uniqueColorsBrand.add(randomColor);
    }
  }

  // Convert the Sets of unique colors back to arrays
  const COLORS_CATEGORY = Array.from(uniqueColorsCategory);
  const COLORS_BRAND = Array.from(uniqueColorsBrand);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const user = await userRequest.get("/user/users/all");
        const orders = await userRequest.get("/order/all");
        setUser(user.data);
        setOrders(orders.data);
        setLoading(false);
      } catch (error) {}
    };
    getData();
  }, []);

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
        <Container>
          <Title>Dashboard</Title>

          <BoxContainer className="row mt-4 mx-auto">
            <Link
              to="/admin/users"
              className="col-4 m-0 p-0 text-decoration-none text-dark d-flex justify-content-around w-100 "
            >
              <Box className=" text-center">
                <Heading>User</Heading>
                <Data>{User ? User.length : 0}</Data>
              </Box>
            </Link>
            <Link
              to="/admin/history"
              className="col-4 m-0 p-0 text-decoration-none text-dark d-flex justify-content-around w-100"
            >
              <Box className="text-center">
                <Heading>Order</Heading>
                <Data>{Orders ? Orders.length : 0}</Data>
              </Box>
            </Link>
            <NavLink className="col-4 m-0 p-0 text-decoration-none text-dark d-flex justify-content-around w-100">
              <Box className="text-center">
                <Heading>Sales</Heading>
                <Data>${totalAmount ? totalAmount : 0}</Data>
              </Box>
            </NavLink>
          </BoxContainer>
          <AreaGraphContainer className="w-100 m-0 mt-4">
            <Title>Sales</Title>

            <AreaChart
              className=" pt-4 pr-5 me-5 me-md-0"
              width={850}
              height={400}
              data={liveChartData ? liveChartData : 0}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#5782e0"
                fill="#84c7d8"
              />
            </AreaChart>
          </AreaGraphContainer>
          <PieGraphContainer className="mt-5 pt-3">
            <Title>Categories And Brands</Title>
            <div className="d-flex mx-auto">
              <PieChart width={400} height={300}>
                <Pie
                  data={pieChartDataCategory}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#dddddd"
                  dataKey="value"
                >
                  {pieChartDataCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS_CATEGORY[index % COLORS_CATEGORY.length]}
                    />
                  ))}
                </Pie>
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                />
              </PieChart>
              <PieChart width={400} height={300}>
                <Pie
                  data={pieChartDataBrand}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartDataBrand.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS_BRAND[index % COLORS_BRAND.length]}
                    />
                  ))}
                </Pie>
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                />
              </PieChart>
            </div>
          </PieGraphContainer>
        </Container>
      )}
    </div>
  );
};

export default Dashboard;
