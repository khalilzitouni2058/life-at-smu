import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Image, Text, Heading, VStack, Flex, Button } from "@chakra-ui/react";

function ClubDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const club = location.state?.club;

  if (!club) {
    return (
      <Flex height="100vh" align="center" justify="center">
        <Text fontSize="xl" color="gray.500">Club details not found.</Text>
      </Flex>
    );
  }

  return (
    <Box height="100vh" width="100vw" bg="gray.50">
      {/* Navbar */}
      <Flex bg="white" p={4} boxShadow="md" align="center">
        <Button colorScheme="blue" onClick={() => navigate(-1)}>Go Back</Button>
      </Flex>
      
      <Flex direction={{ base: "column", md: "row" }} height="calc(100vh - 60px)">
        {/* Left Section - Club Image with Background */}
        <Box
          flex={{ base: "none", md: "1" }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={6}
          bg="blue.100"
        >
          <Image
            src={club.profilePicture || "https://via.placeholder.com/400"}
            alt={club.clubName || "Club"}
            borderRadius="lg"
            width={{ base: "50%", md: "150px" }}
            
          />
        </Box>

        {/* Right Section - Club Info */}
        <Box
          flex="1"
          bg="white"
          p={8}
          borderRadius={{ base: "lg", md: "none" }}
          boxShadow={{ base: "lg", md: "none" }}
          maxW={{ base: "100%", md: "500px" }}
        >
          <VStack align="start" spacing={4}>
            <Heading as="h2" size="xl" color="blue.600">
              {club.clubName}
            </Heading>
            <Text fontSize="lg" fontWeight="bold">
              <strong>Category:</strong> {club.category || "No category"}
            </Text>
            <Text fontSize="md" color="gray.700">
              <strong>Description:</strong> {club.description || "No description available."}
            </Text>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
}

export default ClubDetails;