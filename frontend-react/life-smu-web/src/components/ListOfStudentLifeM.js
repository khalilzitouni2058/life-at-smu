import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Input, List, ListItem, Card, CardBody, Text,Button,Select,Portal,createListCollection, Drawer,CloseButton,HStack, Image, Flex,Badge } from '@chakra-ui/react';
import defaultImage from "../assets/defaultImage.png"
const ListOfStudentLifeM = () => {
  const [users, setUsers] = useState([]);
  const [existingUsers, setexistingUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [pickedRole, setpickedRole] = useState("");
  const [showList, setShowList] = useState(false); 
  const frameworks = createListCollection({
    items: [
      { label: "Student Life Member", value: "Student Life Member" },
      { label: "Officer", value: "Officer" },
      
    ],
  })
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setShowList(false); 
    
    
    
  };

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
  }, [isDrawerOpen]);
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
      setSelectedUser(user);
      setIsDrawerOpen(true);
      setSearchTerm(""); // Reset search term
      setShowList(false); // Hide the search list
      setSelectedUsers([...selectedUsers, user]);
    }
  };
  const handleRoleChange = async (user, newRole) => {
    setSelectedUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.email === user.email ? { ...u, role: newRole } : u
      )
    );
    
  
    console.log(user.email)
    console.log(user.picture)
    console.log(newRole)
    try {
      await axios.post('http://localhost:8000/api/auth/student-life-dep', {
        email: user.email,
        fullname: user.fullname,
        role: newRole,
        picture: user.picture,
        program:user.program,
        major:user.major
      });
      console.log('User successfully added to Student Life Department');
      setIsDrawerOpen(false);
    } catch (error) {
      console.error('Error pushing user to new collection:', error);
    }
  };
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  return (
    <Box p={4}>
  <Text fontSize="xl" fontWeight="bold" mb={2} color="black">
    Add a Student Life Member
  </Text>
  <Input
    placeholder="Search by email"
    value={searchTerm}
    onChange={(e) => {
      setSearchTerm(e.target.value);
      setShowList(true);
    }}
    mb={4}
    color="black"
    w={1080}
    borderRadius="md"
    _placeholder={{ color: "gray.400" }} // Subtle placeholder text
    _focus={{
      borderColor: "teal.400",
      boxShadow: "0 0 0 2px teal.400",
    }}
    
    px={4}
  />

      {showList && searchTerm && (
      <List.Root border="1px solid" borderRadius="md" p={2} maxH="160px"   overflowY="auto" w={1080}>
        {filteredUsers.map((user) => (
          <List.Item
            key={user.email}
            p={2}
            cursor="pointer"
            _hover={{ bg: "gray.100" }}
            onClick={() => handleSelectUser(user)}
            display="flex"
        alignItems="center"
          >
            <Image
          src={user.picture || defaultImage}
          boxSize="40px"
          borderRadius="full"
          mr={3}
          objectFit="cover"
        />
        <Text color="black" fontWeight="bold">{user.email}</Text>
          </List.Item>
        ))}
      </List.Root>
      )}
      {selectedUser && (
        <Drawer.Root open={isDrawerOpen}    placement={"top"}>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content overflowY="auto">  
              <Drawer.Header>
                <Drawer.Title>Student Details</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Text fontWeight="bold" textStyle="3xl">Email: {selectedUser.email}</Text>
                <Text textStyle="2xl">Name: {selectedUser.fullname}</Text>
                <Select.Root mt={4} collection={frameworks} onChange={(e) => setpickedRole(e.target.value)}>
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
                      <Select.Content style={{ zIndex: 9999 }}>
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
              </Drawer.Body>
              <Drawer.Footer>
                <Button variant="outline" onClick={handleDrawerClose}>Cancel</Button>
                <Button onClick={()=>handleRoleChange(selectedUser,pickedRole)}>Save</Button> {/* Ensure the Save button works */}
              </Drawer.Footer>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" onClick={handleDrawerClose} />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
       )}
       
       <Flex mt={4} wrap="wrap" gap={4} justify="flex-start">
  {existingUsers.map((user) => (
    <Card.Root
      key={user.id}
      display="flex"
      flexDirection="row"
      alignItems="flex-start"
      width="350px"
      bg="gray.100"

      color="black"
      borderRadius="lg"
      maxHeight="220px"
      p={3}
      boxShadow="md"
      _hover={{
        boxShadow: "xl",
        transform: "scale(1.02)",
        transition: "0.2s",
      }}
    >
      <Image
        objectFit="cover"
        boxSize="80px"
        borderRadius="full"
        
        ml={2}
        mt={4}
        src={user.picture || defaultImage}
        alt={user.fullname}
      />
      <Box flex="1" overflow="hidden">
        <Card.Body>
          <Card.Title mb={1} fontSize="md" isTruncated>
            {user.fullname}
          </Card.Title>
          <Card.Description fontSize="sm" isTruncated>
            {user.email}
          </Card.Description>
          <Card.Description fontSize="sm" isTruncated>
            {user.role}
          </Card.Description>
          <HStack mt={2} spacing={2} wrap="wrap">
            <Badge variant="outline" fontSize="0.6em">{user.major}</Badge>
            <Badge variant="outline" fontSize="0.6em">{user.program}</Badge>
          </HStack>
        </Card.Body>
        <Card.Footer mt={2}>
          {/* Optional actions/buttons */}
        </Card.Footer>
      </Box>
    </Card.Root>
  ))}
</Flex>


       {/** 
      
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
      */}
    </Box>

  );
  
};

export default ListOfStudentLifeM;
