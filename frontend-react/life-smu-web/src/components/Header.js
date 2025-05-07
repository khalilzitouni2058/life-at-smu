import {
  Flex,
  Box,
  IconButton,
  Avatar,
  Badge,
  HStack,
  Button,
  Popover,
  VStack,
  Text,
} from "@chakra-ui/react";
import { IoIosNotifications } from "react-icons/io";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Header = ({ setActiveSection, activeSection }) => {
  const [newEvents, setNewEvents] = useState([]);
  const [lastChecked, setLastChecked] = useState(
    localStorage.getItem("lastCheckedEvents") || new Date(0).toISOString()
  );
  const handleNavigation = (section) => {
    console.log(`Navigating to ${section}`);
    setActiveSection(section);
  };
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/auth/events/new?since=${lastChecked}`
        );
        setNewEvents(res.data); // store new events
      } catch (err) {
        console.error("Error fetching new events", err);
      }
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, [lastChecked]);
  return (
    <Flex
      as="header"
    
      justify="space-between"
      paddingX={4}
      paddingY={3}
      bg="alphablack.800"
      boxShadow="xs"
      position="static"
      top={0}
      w={"100%"}
      zIndex={1000}
    >
      <HStack wrap="wrap" gap="1">
        <Button
          size="xs"
          variant="plain"
          onClick={() => handleNavigation("Dashboard")}
        >
          Dashboard
        </Button>
        <Button
          size="xs"
          variant="plain"
          onClick={() => handleNavigation("users")}
        >
          Users
        </Button>
        <Button size="xs" variant="plain">
          Settings
        </Button>
      </HStack>
      <Box position="relative" marginRight={4}>
        <Popover.Root placement="bottom-end">
          <Popover.Trigger>
            <Box position="relative">
              <IconButton
                variant="varient"
                color={"blackAlpha.950"}
                aria-label="Notifications"
                mr={6}
                fontSize="xl"
              >
                <IoIosNotifications />
              </IconButton>
              {newEvents.length > 0 && (
                <Badge
                  position="absolute"
                  top="0"
                  right="0"
                  transform="translate(50%, -50%)"
                  colorPalette="red"
                  borderRadius="full"
                  fontSize="0.6rem"
                  mr={7}
                  px={1.5}
                >
                  {newEvents.length}
                </Badge>
              )}
            </Box>
          </Popover.Trigger>
          <Popover.Positioner>
            <Popover.Content
              w="sm"
              position={"relative"}
              positioning={{ offset: { crossAxis: 0, mainAxis: 0 } }}
            >
              <Popover.Arrow />
              <Popover.Header fontWeight="bold">New Events</Popover.Header>
              <Popover.Body maxH="300px" overflowY="auto" p={4} bg="white">
                {newEvents.length === 0 ? (
                  <Text color="gray.500" fontStyle="italic">
                    No new events
                  </Text>
                ) : (
                  <VStack align="start" spacing={4} w="100%">
                    {newEvents.map((event) => (
                      <Box
                        key={event._id}
                        w="100%"
                        p={4}
                        borderRadius="lg"
                        boxShadow="sm"
                        bg="gray.100"
                        borderLeft="4px solid"
                        borderColor={
                          event.status === "Approved"
                            ? "green.400"
                            : event.status === "Declined"
                            ? "red.400"
                            : "orange.400"
                        }
                      >
                        <Flex justify="space-between" align="center" mb={2}>
                          <Text
                            fontWeight="bold"
                            fontSize="md"
                            color="gray.800"
                          >
                            {event.eventName}
                          </Text>
                          <Badge
                            colorScheme={
                              event.status === "Approved"
                                ? "green"
                                : event.status === "Declined"
                                ? "red"
                                : "grey"
                            }
                            fontSize="0.7em"
                            variant="solid"
                            px={2}
                            py={0.5}
                            borderRadius="md"
                          >
                            {event.status}
                          </Badge>
                        </Flex>

                        <Text fontSize="sm" color="gray.600" mb={1}>
                          📅 {event.eventDate} @ 🕒 {event.eventTime}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          📍 {event.eventLocation}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                )}
              </Popover.Body>
              <Popover.Footer>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    localStorage.setItem(
                      "lastCheckedEvents",
                      new Date().toISOString()
                    );
                    setLastChecked(new Date().toISOString());
                    setNewEvents([]);
                  }}
                >
                  Mark all as read
                </Button>
              </Popover.Footer>
            </Popover.Content>
          </Popover.Positioner>
        </Popover.Root>

        <Avatar.Root size={"sm"}>
          <Avatar.Fallback name="Segun Adebayo" />
          <Avatar.Image src="https://bit.ly/sage-adebayo" />
        </Avatar.Root>
      </Box>
    </Flex>
  );
};

export default Header;
