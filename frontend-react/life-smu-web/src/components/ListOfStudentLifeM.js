import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Input,
  List,
  ListItem,
  Card,
  CardBody,
  Text,
  Button,
  Select,
  Portal,
  createListCollection,
  Drawer,
  CloseButton,
  HStack,
  Image,
  Flex,
  Badge,
  VStack,
  Dialog,
  IconButton
} from "@chakra-ui/react";
import defaultImage from "../assets/defaultImage.png";
import { IoMdClose } from "react-icons/io";
const ListOfStudentLifeM = () => {
  const [users, setUsers] = useState([]);
  const [existingUsers, setexistingUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDialogOpen, setisDialogOpen] = useState(false);
  const [pickedRole, setpickedRole] = useState("");
  const [showList, setShowList] = useState(false);
  const [deleted, setdeleted] = useState(false);
  const frameworks = createListCollection({
    items: [
      { label: "Student Life Member", value: "Student Life Member" },
      { label: "Officer", value: "Officer" },
    ],
  });
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setShowList(false);
  };

  const fetchexistingUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/auth/student-life-dep"
      );
      const existingUsers = Array.isArray(response.data.users)
        ? response.data.users
        : [];
      setexistingUsers(existingUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      console.log(userId);
      setdeleted(true);
      await axios.delete(`http://localhost:8000/api/delete-user/${userId}`);
      setexistingUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userId)
      );
    } catch (error) {
      console.error("Error deleting user:", error);
    }
    setdeleted(false);
    setisDialogOpen(false);
  };

  useEffect(() => {
    fetchexistingUsers();
  }, [isDrawerOpen, deleted]);
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/auth/users");
      const fetchedUsers = Array.isArray(response.data.users)
        ? response.data.users
        : [];
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
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

    console.log(user.email);
    console.log(user.picture);
    console.log(newRole);
    try {
      await axios.post("http://localhost:8000/api/auth/student-life-dep", {
        email: user.email,
        fullname: user.fullname,
        role: newRole,
        picture: user.picture,
        program: user.program,
        major: user.major,
      });
      console.log("User successfully added to Student Life Department");
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Error pushing user to new collection:", error);
    }
  };
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Hero Section */}
      <Box
        position="relative"
        w="100%"
        minH="300px"
        bgImage="url('https://www.leconomistemaghrebin.com/wp-content/uploads/2025/05/SMU-etudiants-1-860x573.jpg')"
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        px={4}
        mb={12}
      >
        {/* Dark overlay */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="blackAlpha.600"
        />

        {/* Title and Search */}
        <Box position="relative" zIndex="1" w="full" maxW="600px">
          <Text fontSize="4xl" fontWeight="bold" color="white" mb={2}>
            Add a New Student
          </Text>
          <Text fontSize="lg" color="gray.200" mb={6}>
            Find and add a student to your student life program easily.
          </Text>

          {/* Search input wrapper */}
          <Box position="relative">
            <Input
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowList(true);
              }}
              size="lg"
              borderRadius="full"
              bg="white"
              color="gray.800"
              boxShadow="lg"
              _placeholder={{ color: "gray.400" }}
              _focus={{
                borderColor: "teal.400",
                boxShadow: "0 0 0 3px teal.300",
                bg: "white",
              }}
              px={6}
            />

            {/* Dropdown list */}
            {showList && searchTerm && (
              <VStack
                position="absolute"
                top="100%" // Right under input
                left="0"
                right="0"
                mt={2}
                spacing={0}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                bg="white"
                boxShadow="xl"
                maxH="300px"
                overflowY="auto"
                zIndex="10"
              >
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <Flex
                      key={user.email}
                      p={3}
                      w="100%"
                      align="center"
                      borderBottom="1px solid"
                      borderColor="gray.100"
                      cursor="pointer"
                      _hover={{ bg: "teal.50" }}
                      onClick={() => handleSelectUser(user)}
                    >
                      <Image
                        src={user.picture || defaultImage}
                        boxSize="40px"
                        borderRadius="full"
                        mr={3}
                        objectFit="cover"
                      />
                      <Text fontWeight="medium" color="gray.700">
                        {user.email}
                      </Text>
                    </Flex>
                  ))
                ) : (
                  <Box p={4} color="gray.500">
                    No students found
                  </Box>
                )}
              </VStack>
            )}
          </Box>
        </Box>
      </Box>
      {selectedUser && (
        <Drawer.Root open={isDrawerOpen} placement={"top"}>
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content overflowY="auto">
                <Drawer.Header>
                  <Drawer.Title>Student Details</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                  <Text fontWeight="bold" textStyle="3xl">
                    Email: {selectedUser.email}
                  </Text>
                  <Text textStyle="2xl">Name: {selectedUser.fullname}</Text>
                  <Select.Root
                    mt={4}
                    collection={frameworks}
                    onChange={(e) => setpickedRole(e.target.value)}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText
                          placeholder="Select Role"
                          color={"blackAlpha.900"}
                        />
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
                  <Button variant="outline" onClick={handleDrawerClose}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleRoleChange(selectedUser, pickedRole)}
                  >
                    Save
                  </Button>{" "}
                  {/* Ensure the Save button works */}
                </Drawer.Footer>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" onClick={handleDrawerClose} />
                </Drawer.CloseTrigger>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      )}

      <Flex mt={2} wrap="wrap" gap={4} justify="center">
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
            {/* Delete Button */}
            <Dialog.Root>
              <Dialog.Trigger
                open={isDialogOpen}
                placement={"top"}
                motionPreset="slide-in-bottom"
              >
                <IconButton 
                  size="md"
                  fontSize={"15px"}
                  p={2}
                 colorPalette={"gray"}
                
                  rounded={"2xl"}
                  position={"absolute"}
                  variant="subtle"
                  top="8px"
                  right="8px"
                  aria-label="Remove Student"
                >
                  <IoMdClose />
                </IconButton>
              </Dialog.Trigger>
              <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content>
                    <Dialog.Header>
                      <Dialog.Title>
                        are you sure you want to remove student {user.fullname}{" "}
                      </Dialog.Title>
                    </Dialog.Header>

                    <Dialog.Footer>
                      <Dialog.ActionTrigger asChild>
                        <Button variant="outline">Cancel</Button>
                      </Dialog.ActionTrigger>
                      <Button
                        onClick={() => handleDeleteUser(user._id)}
                        colorPalette={"red"}
                      >
                        delete
                      </Button>
                    </Dialog.Footer>
                    <Dialog.CloseTrigger asChild>
                      <CloseButton size="sm" />
                    </Dialog.CloseTrigger>
                  </Dialog.Content>
                </Dialog.Positioner>
              </Portal>
            </Dialog.Root>
            {/* User Image */}
            <Image
              objectFit="cover"
              boxSize="80px"
              borderRadius="full"
              ml={2}
              mt={4}
              src={user.picture || defaultImage}
              alt={user.fullname}
            />
            {/* User Information */}
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
                  <Badge variant="outline" fontSize="0.6em">
                    {user.major}
                  </Badge>
                  <Badge variant="outline" fontSize="0.6em">
                    {user.program}
                  </Badge>
                </HStack>
              </Card.Body>
              <Card.Footer mt={2}>{/* Optional actions/buttons */}</Card.Footer>
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
