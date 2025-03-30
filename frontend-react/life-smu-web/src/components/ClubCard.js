import React from "react";
import { Box, Image, Text, Button, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; 

function ClubCard({ club }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/clubs/${club.id}`, { state: { club } });
      };
  return (
    <Box
      maxW="280px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      bg="white"
      transition="transform 0.2s ease-in-out"
      _hover={{ transform: "scale(1.05)", boxShadow: "lg" }}
    >
      {/* Club Image */}
      <Image
        src={club?.profilePicture || "https://via.placeholder.com/250x350"}
        alt={club?.clubName || "Club"}
        objectFit="fit"
        width="100%"
        height="200px"
        
      />

      {/* Club Information */}
      <VStack p={4} spacing={2} align="center">
        <Text fontSize="lg" fontWeight="bold">
          {club?.clubName || "Club Name"}
        </Text>
        <Text fontSize="sm" color="gray.500" noOfLines={2} textAlign="center">
          {club?.description || "A great club for students."}
        </Text>
        <Button size="sm" colorScheme="blue" width="full" onClick={handleClick}>
          View Club
        </Button>
      </VStack>
    </Box>
  );
}

export default ClubCard;
