import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Header from '../Components/Header';
import { styled } from 'styled-components';
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
} from 'recharts';

const Box = styled.div`
  width: 10rem;
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
  font-family: 'Josefin Sans', sans-serif;
  justify-content: center;
`;

const Title = styled.div`
  font-family: 'Playfair Display', serif;
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  text-decoration: underline;
`;

const AreaGraphContainer = styled.div`
  font-family: 'Josefin Sans', sans-serif;
  margin: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const PieGraphContainer = styled.div`
  font-family: 'Josefin Sans', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Heading = styled.span`
  font-weight: bold;
`;
const Data = styled.span``;
const Dashboard = () => {
  const liveChartData = [
    { month: 'January', value: 0 },
    { month: 'February', value: 0 },
    { month: 'March', value: 3 },
    { month: 'April', value: 5 },
    { month: 'May', value: 2 },
    { month: 'June', value: 9 },
  ];

  const pieChartData = [
    { name: 'Red', value: 12 },
    { name: 'Blue', value: 19 },
    { name: 'Yellow', value: 3 },
    { name: 'Green', value: 5 },
    { name: 'Purple', value: 2 },
    { name: 'Orange', value: 3 },
  ];

  const COLORS = [
    '#fe0000',
    '#0096c4',
    '#FFBB28',
    '#42ff71',
    '#8884D8',
    '#ffae00',
  ];

  return (
    <div>
      <Header />
      <Container>
        <Title>Dashboard</Title>

        <BoxContainer className='row mt-4 mx-auto'>
          <Box className='col-4 d-flex justify-content-around'>
            <Heading>User</Heading>
            <Data>33k</Data>
          </Box>
          <Box className='col-4 d-flex justify-content-around'>
            <Heading>Order</Heading>
            <Data>18k</Data>
          </Box>
          <Box className='col-4 d-flex justify-content-around'>
            <Heading>Sales</Heading>
            <Data>$300000</Data>
          </Box>
        </BoxContainer>
        <AreaGraphContainer className='w-100 m-0 mt-4'>
          <Title>Sales</Title>

          <AreaChart
            className=' pt-4 pr-5 me-5 me-md-0'
            width={850}
            height={400}
            data={liveChartData}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='month' />
            <YAxis />
            <Tooltip />
            <Area
              type='monotone'
              dataKey='value'
              stroke='#5782e0'
              fill='#84c7d8'
            />
          </AreaChart>
        </AreaGraphContainer>
        <PieGraphContainer className='mt-5 pt-3'>
          <Title>Categories And Brands</Title>
          <div className='d-flex mx-auto'>
            <PieChart width={400} height={300}>
              <Pie
                data={pieChartData}
                cx='50%'
                cy='50%'
                outerRadius={80}
                fill='#dddddd'
                dataKey='value'
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend layout='vertical' align='right' verticalAlign='middle' />
            </PieChart>
            <PieChart width={400} height={300}>
              <Pie
                data={pieChartData}
                cx='50%'
                cy='50%'
                outerRadius={80}
                fill='#8884d8'
                dataKey='value'
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend layout='vertical' align='right' verticalAlign='middle' />
            </PieChart>
          </div>
        </PieGraphContainer>
      </Container>
    </div>
  );
};

export default Dashboard;
