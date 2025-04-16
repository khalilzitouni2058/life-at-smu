import { Flex, Box, IconButton , Avatar, Badge,HStack,Button  } from "@chakra-ui/react"
import { IoIosNotifications } from "react-icons/io";

const Header = ({ setActiveSection, activeSection }) => {
  const handleNavigation = (section) => {
    console.log(`Navigating to ${section}`);
    setActiveSection(section);
  };
  return (
   <Flex 
   as="header"
      align="center"
      justify="space-between"
      paddingX={4}
      paddingY={3}
      bg="alphablack.800"
      boxShadow="xs"
      position="sticky"
      overflowY={"auto"}
      top={0}
      w={"100%"}
      zIndex={0}>
        <HStack wrap="wrap" gap="1" >


<Button size="xs"   variant="plain" onClick={() => handleNavigation('Dashboard')}>Dashboard</Button>
<Button size="xs"   variant="plain"  onClick={() => handleNavigation('users')}>Users</Button>
<Button size="xs"   variant="plain">Settings</Button>
</HStack>
        <Box 
        position="relative" marginRight={4}>
        
        <IconButton
          variant="varient"
          color={"blackAlpha.950"}
          aria-label="Notifications"
          mr={9}
          fontSize="xl"

        >
          <IoIosNotifications />
        </IconButton>
      
        <Badge
          position="absolute"
          top="1"
          right="20"

          transform="translate(50%, -50%)"
          colorPalette="red"
          borderRadius="full"
          fontSize="0.5rem"
          paddingX="1.5"
        >
          3
        </Badge>
        <Avatar.Root size={"sm"}>
      <Avatar.Fallback name="Segun Adebayo" />
      <Avatar.Image src="https://bit.ly/sage-adebayo" />
    </Avatar.Root>
        </Box>  
        

   </Flex>
  );
}

export default Header;
