import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; // Month view
import timeGridPlugin from '@fullcalendar/timegrid'; // Week & Day views
import interactionPlugin from '@fullcalendar/interaction'; // Click & Drag
import multiMonthPlugin from '@fullcalendar/multimonth'; // Yearly View
import axios from 'axios';

import { Box, HStack, Text, Dialog, Button, VStack,Portal,Flex,Image,Card,Checkbox,List,Avatar,Badge } from "@chakra-ui/react";

// Dnd Kit utilities
import { CSS } from '@dnd-kit/utilities'
import DraggableUser from './ui/DraggableUser' // Adjust the path

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [users, setUsers] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const handleEventDidMount = (info) => {
    if (info.event.extendedProps.status === 'waiting') {
      info.el.style.backgroundColor = 'blue';
    } else if (info.event.extendedProps.status === 'approved') {
      info.el.style.backgroundColor = 'green';
    }
  
    // Change dot color
    const dotEl = info.el.getElementsByClassName('fc-event-dot')[0];
    if (dotEl) {
      if (info.event.extendedProps.status === 'Waiting') {
        dotEl.style.backgroundColor = 'blue';
      } else if (info.event.extendedProps.status === 'Approved') {
        dotEl.style.backgroundColor = 'green';
      }
    }
  };
  
  
  
  
  
  useEffect(() => {
    const fetchexistingUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/auth/student-life-dep');
        const existingUsers = Array.isArray(response.data.users) ? response.data.users : [];
        console.log(existingUsers)
        setUsers(existingUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  

    fetchexistingUsers();
  }, [isDialogOpen]);

  // Handle the checkbox change
  const handleCheckboxChange = (userId) => {
    setAssignedUsers((prevAssignedUsers) => {
      const updatedAssignedUsers = new Set(prevAssignedUsers);
      if (updatedAssignedUsers.has(userId)) {
        updatedAssignedUsers.delete(userId); // Unassign if already assigned
      } else {
        updatedAssignedUsers.add(userId); // Assign if not assigned
      }
      return updatedAssignedUsers;
    });
  };
  

  
  useEffect(() => {
    const fetchEvents = async () => {
      try {

        const response = await axios.get('http://localhost:8000/api/auth/events');
        console.log(response.data)
        const formattedEvents = response.data.map(event => ({
          id:event._id,
          title: event.eventName,
          start: event.eventDate + 'T' + event.eventTime.split(' - ')[0],
          end: event.eventDate + 'T' + event.eventTime.split(' - ')[1],
          location: event.eventLocation,
          image:event.eventImage?.uri,
          backgroundColor: event.status?.toLowerCase() === "waiting"
  ? "grey"
  : event.status?.toLowerCase() === "approved"
  ? "green"
  : event.status?.toLowerCase() === "declined"
  ? "red"
  : "gray", // Default fallback color

borderColor: event.status?.toLowerCase() === "waiting"
  ? "grey"
  : event.status?.toLowerCase() === "approved"
  ? "green"
  : event.status?.toLowerCase() === "declined"
  ? "red"
  : "gray",
          extendedProps: { status: event.status },
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [!isDialogOpen]);
  
  
  
  const handleEventClick = (info) => {
    setIsDialogOpen(true);
    const eventDetails = info.event;
    const eventId = info.event._def.publicId;

    console.log(info.event._def.publicId)
    setSelectedEvent({
      id:eventId,
      title: eventDetails.title,
      start: eventDetails.start,
      end: eventDetails.end,
      location: eventDetails.extendedProps.location,
      status: eventDetails.extendedProps.status ,
      image:eventDetails.extendedProps.image
    });
    console.log(eventDetails.id)
  };

  const handleApproval = async (eventId) => {
    console.log(eventId)
    try {
      await axios.post('http://localhost:8000/api/auth/events/approve', { eventId })
      setSelectedEvent(prev => ({ ...prev, status: 'Approved' }))
    } catch (error) {
      console.error('Approval failed:', error)
    } finally {
      setIsDialogOpen(false)
    }
  }
  
  const handleDecline = async (eventId) => {
    
    try {
      await axios.post('http://localhost:8000/api/auth/events/decline', {eventId})
      setSelectedEvent(prev => ({ ...prev, status: 'Declined' }))
    } catch (error) {
      console.error('Decline failed:', error)
    } finally {
      setIsDialogOpen(false)
    }
  }
  
  return (
    <>
    
     <Box  >
  <HStack spacing={12}  >
    <HStack spacing={2} align="center">
      <Box w={3} h={3} bg="gray.500" borderRadius="full" />
      <Text fontSize="sm" mt={4}>Waiting</Text>
    </HStack>
    <HStack spacing={2} align="center">
      <Box w={3} h={3} bg="green.600" borderRadius="full" />
      <Text fontSize="sm" mt={4}>Approved</Text>
    </HStack>
    <HStack spacing={2} align="center">
      <Box w={3} h={3} bg="red.600" borderRadius="full" />
      <Text fontSize="sm" mt={4}>Declined</Text>
    </HStack>
  </HStack>
</Box>
      <style>{`
    /* Main calendar styling */
    .fc {
      font-family: 'Inter', sans-serif;
      background-color: white;
      color: #2D3748;
    }

    /* Toolbar title */
    .fc-toolbar-title {
      font-size: 1.5rem;
      font-weight: 600;
      color:rgb(39, 50, 69);
    }

    /* Buttons */
    .fc-button {
      background-color: #3182CE;
      border: none;
      color: white;
      padding: 6px 14px;
      border-radius: 6px;
      transition: background-color 0.2s ease;
      font-weight: 500;
    }

    .fc-button:hover {
      background-color: #2B6CB0;
    }

    .fc-button:disabled {
      background-color: #A0AEC0;
      cursor: not-allowed;
    }

    /* Header toolbar spacing */
    .fc-toolbar.fc-header-toolbar {
      margin-bottom: 1rem;
    }

    /* Day number styling */
    .fc-daygrid-day-number {
      font-weight: 500;
      color: #4A5568;
      padding: 4px 6px;
      text-decoration: none;
      
    }

    /* Remove border under day number and around cell */
    
    
      

    /* Add subtle hover effect to day cells */
    .fc-daygrid-day:hover {
      background-color: #F7FAFC;
    }

    /* Event appearance */
    .fc-daygrid-event {
      background-color: #EDF2F7;
      border-left: 4px solid rgb(135, 147, 158);
      color: #2D3748;
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 0.75rem;
      margin-bottom: 2px;
      transition: background-color 0.2s ease;
    }

    .fc-daygrid-event:hover {
      background-color: #E2E8F0;
      cursor: pointer;
    }

    /* Multi-month view */
    .fc-multimonth {
      
    }

    .fc-col-header-cell-cushion {
      font-weight: 600;
      color: #2D3748;
      padding: 8px 0;
      text-decoration: none;
    }

    /* Week numbers and grid highlights */
    .fc .fc-col-header-cell,
    .fc .fc-daygrid-day {
      border: none;
    }

    /* Scrollbar styling if needed */
    .fc-scroller::-webkit-scrollbar {
      width: 8px;
    }

    .fc-scroller::-webkit-scrollbar-thumb {
      background-color: #CBD5E0;
      border-radius: 4px;
    }
  `}</style>


      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, multiMonthPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,multiMonthYear",
        }}
        views={{
          multiMonthYear: { type: "multiMonth", duration: { months: 12 } },
        }}
        eventDidMount={(info) => {
          const status = info.event.extendedProps.status?.toLowerCase();
      
          let borderColor = 'rgb(135, 147, 158)'; // Default gray
          if (status === 'approved') borderColor = '#38A169';  // green
          else if (status === 'declined') borderColor = '#E53E3E';  // red
          else if (status === 'waiting') borderColor = '#A0AEC0';  // light gray
      
          info.el.style.borderLeft = `4px solid ${borderColor}`;
        }}
        events={events}
        eventClick={handleEventClick}
      />

      {/* Dialog for event details */}
      <Dialog.Root open={isDialogOpen}  motionPreset="slide-in-bottom" size={"cover"}   placement="center" > 
        <Portal  >
        <Dialog.Backdrop  />
        <Dialog.Positioner >
        <Dialog.Content  >
          <Dialog.Header   fontWeight="bold" color={"blackAlpha.950"} bgColor="whiteAlpha.900"  fontSize="4xl">{selectedEvent?.title}</Dialog.Header>
          <Dialog.Body bgColor="whiteAlpha.900" >
  {selectedEvent && (
    <Flex 
      direction="row" 
      align="stretch" 
      spacing={2} 
      
      
    >
      {/* Left side: Image */}
      <Box 
        bgColor="blackalpha.900" 
        flex="1" 

        overflow="hidden"
        boxShadow="lg"
        display="flex"
        alignItems="center"
        justifyContent="center"
        
      >
        <Image 
          src={selectedEvent.image} 
          alt="Event Image" 
          objectFit="cover" 
          width="80%" 
          height="100%" 
          maxHeight="500px"
          
        />
      </Box>

      {/* Right side: Event details */}
      <Box 
        bgColor="blackAlpha.900" 
        flex="1" 
        p={6} 
        
        boxShadow="2xl"
        display="flex" 
        flexDirection="column" 
        justifyContent="center"
      >
        <VStack spacing={5} color="gray.700">
          <Box w="100%">
            <Text fontWeight="bold" fontSize="lg" color="cyan.400">Location:</Text>
            <Text fontSize="md" color="whiteAlpha.950">{selectedEvent.location}</Text>
          </Box>

          <Box w="100%">
            <Text fontWeight="bold" fontSize="lg" color="cyan.400">Start Time:</Text>
            <Text fontSize="md" color="whiteAlpha.950">{new Date(selectedEvent.start).toLocaleString()}</Text>
          </Box>

          <Box w="100%">
            <Text fontWeight="bold" fontSize="lg" color="cyan.400">End Time:</Text>
            <Text fontSize="md" color="whiteAlpha.950">{new Date(selectedEvent.end).toLocaleString()}</Text>
          </Box>

          <Box w="100%">
            <Text fontWeight="bold" fontSize="lg" color="cyan.400">Status:</Text>
            <Text fontSize="md" color="whiteAlpha.950">{selectedEvent.status}</Text>
          </Box>
        </VStack>
        {/* Drag & Drop User Assignment */}
        
      </Box>
      <Box width="100%" flex={1} maxH="500px" overflowY="auto" p={2}  bg="whiteAlpha.900"
      sx={{
        '&::-webkit-scrollbar': {
          display: 'none', // Hide the scrollbar
        },
        '&::-webkit-scrollbar-thumb': {
          display: 'none', // Hide the thumb too
        },
      }}
      >
      <VStack spacing={3} align="stretch" >
        <List.Root
        >
          {users.length > 0 ? (
            users.map((user) => (
              <List.Item key={user._id}>
                <Card.Root
        display="flex"
        flexDirection="row"
        alignItems="flex-start"
        width="100%"
        bg="blackAlpha.800"
         mb={4}
        color="white"
        variant={"solid"}
        maxHeight="220px"
        p={3}
        boxShadow="md"
        _hover={{
          boxShadow: "xl",
          transform: "scale(1.02)",
          transition: "0.2s",
        }}
      >
      <Card.Body h="100%" >
      <HStack align="center" spacing={4} h="100%">
      {/* Avatar */}
      <Avatar.Root>
      <Avatar.Fallback name={user.fullname} />
      <Avatar.Image src={user.picture} />
    </Avatar.Root>

      {/* Details + Checkbox */}
      <VStack align="start" spacing={2} flex="1" justify="center">
        <Box>
          <Text fontWeight="bold" fontSize="md" color="whiteAlpha.900">
            {user.fullname}
          </Text>
          <Text fontSize="sm" color="whiteAlpha.900">
            {user.email}
          </Text>
          <Text fontSize="sm" color="whiteAlpha.900">
            {user.Role}
          </Text>
           <HStack mt={2} spacing={2} wrap="wrap">
                      <Badge variant="solid" fontSize="0.9em" colorPalette={"whiteAlpha.900"}>{user.major}</Badge>
                      <Badge  variant="solid" fontSize="0.9em" colorPalette={"whiteAlpha.900"}>{user.program}</Badge>
                    </HStack>
        </Box>

        {/* Checkbox */}
        <Checkbox.Root
        colorPalette={"cyan"}
        variant={"solid"}
          
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Label ml={2}>Assign to Event</Checkbox.Label>
        </Checkbox.Root>
      </VStack>
            </HStack>
          </Card.Body>
        </Card.Root>

              </List.Item>
            ))
          ) : (
            <Text>No users available.</Text>
          )}
        </List.Root>
      </VStack>
    </Box>
    </Flex>
  )}
</Dialog.Body>

<Dialog.Footer bgColor="whiteAlpha.900">
  {selectedEvent && (
    <HStack spacing={4}>
      {selectedEvent.status === 'Waiting' ? (
  <>
    <Button color="white" onClick={() => setIsDialogOpen(false)}>
      Close
    </Button>
    <Button colorPalette="red" variant="subtle" onClick={() => handleDecline(selectedEvent.id)}>
      Decline
    </Button>
    <Button colorPalette="green" variant="subtle" onClick={() => handleApproval(selectedEvent.id)}>
      Approve
    </Button>
  </>
) : selectedEvent.status === 'Approved' ? (
  <>
    <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
      Close
    </Button>
    <Button colorPalette="green" variant="solid" disabled>
      Approved
    </Button>
  </>
) : selectedEvent.status === 'Declined' ? (
  <>
    <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
      Close
    </Button>
    <Button colorPalette="red" variant="solid" disabled>
      Refused
    </Button>
  </>
) : null}

    </HStack>
  )}
</Dialog.Footer>



          
          </Dialog.Content>
        </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

    </>
  );
};

export default EventCalendar;
