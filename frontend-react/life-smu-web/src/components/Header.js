import { Box, Flex, Heading, Button, HStack, useBreakpointValue } from "@chakra-ui/react";

function Header() {
  // Handle responsive design with `useBreakpointValue`
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box as="header" bg="blue.200" color="white" p={4}>
      <Flex justify="space-between" align="center">
        {/* Logo */}
        <Heading size="lg" letterSpacing="wider">
          MyLogo
        </Heading>

        {/* Navigation */}
        
        

        {/* Call-to-Action Button */}
        <Button colorScheme="teal" variant="solid">
          Get Started
        </Button>
      </Flex>
    </Box>
  );
}

export default Header;
