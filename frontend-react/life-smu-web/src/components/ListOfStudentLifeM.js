import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Input, List, ListItem, Card, CardBody, Text,Button,Select,Portal,createListCollection } from '@chakra-ui/react';

const ListOfStudentLifeM = () => {
  const [users, setUsers] = useState([]);
  const [existingUsers, setexistingUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showList, setShowList] = useState(false); 
  const frameworks = createListCollection({
    items: [
      { label: "Student Life Member", value: "Student Life Member" },
      { label: "Officer", value: "Officer" },
      
    ],
  })
  const fetchexistingUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/auth/student-life-dep');
      const existingUsers = Array.isArray(response.data.users) ? response.data.users : [];
      setexistingUsers(existingUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchexistingUsers();
  }, []);
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/auth/users');
      const fetchedUsers = Array.isArray(response.data.users) ? response.data.users : [];
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSelectUser = (user) => {
    if (!selectedUsers.find((u) => u.email === user.email)) {
      setSelectedUsers([...selectedUsers, user]);
      setSearchTerm("");
    }
  };
  const handleRoleChange = async (user, newRole) => {
    setSelectedUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.email === user.email ? { ...u, role: newRole } : u
      )
    );
    console.log(user.email)
    console.log(user.fullname)
    console.log(newRole)
    try {
      await axios.post('http://localhost:8000/api/auth/student-life-dep', {
        email: user.email,
        fullname: user.fullname,
        role: newRole,
      });
      console.log('User successfully added to Student Life Department');
    } catch (error) {
      console.error('Error pushing user to new collection:', error);
    }
  };
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  return (
    <Box p={4}>
      <Input
        placeholder="Search by email"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowList(true); 
        }}
        mb={4}
      />
      {showList && searchTerm && (
      <List.Root border="1px solid" borderRadius="md" p={2} maxH="160px" overflowY="auto">
        {filteredUsers.map((user) => (
          <List.Item
            key={user.email}
            p={2}
            cursor="pointer"
            _hover={{ bg: "gray.100" }}
            onClick={() => handleSelectUser(user)}
          >
            {user.email}
          </List.Item>
        ))}
      </List.Root>
      )}
      <Box mt={4}>
        {existingUsers.map((user) => (
          <Card.Root width="320px" key={user.email} p={4} borderWidth="1px" borderRadius="md" boxShadow="md" mb={2}>
            <Card.Body>
              <Text fontWeight="bold">Email: {user.email}</Text>
              <Text>Name: {user.fullname}</Text>
              <Text>Role: {user.role}</Text>
            </Card.Body>
          </Card.Root>
        ))}
      </Box>
      <Box mt={4}>
        {selectedUsers.map((user) => (
          <Card.Root width="320px" key={user.email} p={4} borderWidth="1px" borderRadius="md" boxShadow="md" mb={2}>
            <Card.Body>
              <Text fontWeight="bold">Email: {user.email}</Text>
              <Text>Name: {user.fullname}</Text>
              <Select.Root mt={2} collection={frameworks} onChange={(e) => handleRoleChange(user, e.target.value)}>
              <Select.HiddenSelect />
      
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select Role" color={'blackAlpha.900'} />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
        <Select.Content>
                  {frameworks.items.map((framework) => (
                    <Select.Item item={framework} key={framework.value}>
                      {framework.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
        </Select.Positioner>
      </Portal>
              </Select.Root>
            </Card.Body>
          </Card.Root>
        ))}
      </Box>
    </Box>
  );
};

export default ListOfStudentLifeM;
