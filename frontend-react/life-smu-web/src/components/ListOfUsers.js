import React, { useEffect, useState } from 'react';
import '../styles/Dashboard/Products.css';
import axios from 'axios';
import { Box, Flex, Heading, Text, Table,  } from "@chakra-ui/react";

function ListOfUsers() {
  const [users, setusers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/auth/users');
        const fetchedUsers = Array.isArray(response.data.users) ? response.data.users : [];
        console.log(response);
        setusers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const totalUsers = users.length;
  const totalAdmins = users.filter(user => user.role === "Admin").length;

  return (
    <Box>
      <Heading as="h2" size="lg" mb={6}>
        Users Management
      </Heading>

      {/* Boxes for User Count */}
      <Flex mb={6} justify="space-between">
        <Box
          bg="gray.400"
          color="black"
          p={6}
          borderRadius="md"
          width="48%"
          textAlign="center"
        >
          <Text fontSize="2xl" fontWeight="bold" color={"white"}>
            {totalUsers}
          </Text>
          <Text color={"white"}>Users</Text>
        </Box>

        <Box
          bg="blue.500"
          color="white"
          p={6}
          borderRadius="md"
          width="48%"
          textAlign="center"
        >
          <Text fontSize="2xl" fontWeight="bold">
            {totalAdmins}
          </Text>
          <Text>Admins</Text>
        </Box>
      </Flex>

      {/* Table for Users Information */}
      <Box bg="white" p={6} borderRadius="md" boxShadow="md">
        <Table.Root variant="simple">
        <Table.Header>
    <Table.Row>
     
      <Table.ColumnHeader>Email</Table.ColumnHeader>
      <Table.ColumnHeader>Full Name</Table.ColumnHeader>
      <Table.ColumnHeader>Major</Table.ColumnHeader>
      <Table.ColumnHeader>Program</Table.ColumnHeader>
    </Table.Row>
  </Table.Header>

  <Table.Body>
    {users.map((user) => (
      <Table.Row key={user._id}>
        <Table.Cell>{user.email}</Table.Cell>
        <Table.Cell>{user.fullname}</Table.Cell>
        <Table.Cell>{user.major}</Table.Cell>
        <Table.Cell>{user.program}</Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
}

export default ListOfUsers;
