import React from "react";
import { Box, Button, VStack,Image  } from "@chakra-ui/react";
import logo from "../assets/logo.png"
function Sidebar({ onSelectSection }) {
  return (
    <Box
      as="aside"
      bg="blue.200"
      color="black"
      width="250px"
      height="100vh"
      position="fixed"
      top="0"
      left="0"
      p={4}
    >
      <VStack spacing={6} align="flex-start">
        <Button variant="link" color="black" fontSize="xl">
        <Image src={logo} boxSize="50px"
    borderRadius="full"
    fit="cover"/>
          Dashboard
        </Button>

        {/* Sidebar Navigation Links */}
        <Button variant="link" color="black" onClick={() => onSelectSection('users')}>
          Users
        </Button>
        <Button variant="link" color="black" onClick={() => onSelectSection('clubs')}>
          Clubs
        </Button>
        <Button variant="link" color="black" onClick={() => onSelectSection('Student Life Members')}>
          Student Life Members
        </Button>
        <Button variant="link" color="black" onClick={() => onSelectSection('Events')}>
          Events
        </Button>
      </VStack>
    </Box>
  );
}

export default Sidebar;
