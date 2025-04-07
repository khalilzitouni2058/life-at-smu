import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; // Month view
import timeGridPlugin from '@fullcalendar/timegrid'; // Week & Day views
import interactionPlugin from '@fullcalendar/interaction'; // Click & Drag
import multiMonthPlugin from '@fullcalendar/multimonth'; // Yearly View
import axios from 'axios';
import { Box, HStack, Text, Dialog, Button, VStack,Portal,Flex,Image } from "@chakra-ui/react";

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
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
    const fetchEvents = async () => {
      try {

        const response = await axios.get('http://localhost:8000/api/auth/events');
        console.log(response.data)
        const formattedEvents = response.data.map(event => ({
          title: event.eventName,
          start: event.eventDate + 'T' + event.eventTime.split(' - ')[0],
          end: event.eventDate + 'T' + event.eventTime.split(' - ')[1],
          location: event.eventLocation,
          image:event.eventImage?.uri,
          backgroundColor: event.status?.toLowerCase() === "waiting" ? "grey" : event.status?.toLowerCase() === "approved" ? "green" : "gray",
          borderColor: event.status?.toLowerCase() === "waiting" ? "grey" : event.status?.toLowerCase() === "approved" ? "green" : "gray",
          extendedProps: { status: event.status },
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);
  
  const handleEventClick = (info) => {
    setIsDialogOpen(true);
    const eventDetails = info.event;
    console.log(info.event.extendedProps.image)
    setSelectedEvent({
      title: eventDetails.title,
      start: eventDetails.start,
      end: eventDetails.end,
      location: eventDetails.extendedProps.location,
      status: eventDetails.extendedProps.status ,
      image:eventDetails.extendedProps.image
    });
    console.log("hello")
  };

  const handleApproval = () => {
    // Logic to approve the event
    setSelectedEvent(prevState => ({ ...prevState, status: 'Approved' }));
    setIsDialogOpen(false);
  };

  const handleDecline = () => {
    // Logic to decline the event
    setSelectedEvent(prevState => ({ ...prevState, status: 'Declined' }));
    setIsDialogOpen(false);
  };

  return (
    <>
      <Box p={4}>
        <HStack spacing={4} mb={4}>
          <HStack>
            <Box w={3} h={3} bg="gray.500" borderRadius="full" />
            <Text fontSize="sm">Waiting</Text>
          </HStack>
          <HStack>
            <Box w={3} h={3} bg="green.600" borderRadius="full" />
            <Text fontSize="sm">Approved</Text>
          </HStack>
        </HStack>
      </Box>

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
        events={events}
        eventClick={handleEventClick}
      />

      {/* Dialog for event details */}
      <Dialog.Root open={isDialogOpen}  motionPreset="slide-in-bottom" size={"lg"}   placement="center" > 
        <Portal  >
        <Dialog.Backdrop  />
        <Dialog.Positioner >
        <Dialog.Content >
          <Dialog.Header   fontWeight="bold" color={"blackAlpha.950"} fontSize="4xl">{selectedEvent?.title}</Dialog.Header>
          <Dialog.Body alignItems={"center"}  >
            {selectedEvent && (
              <Flex direction="row" align="center" spacing={2}>
                {/* Left side: Image */}
                <Box    bgColor="gray.200" >
                  <Image 
                    src={selectedEvent.image} 
                    alt="Event Image" 
                    boxSize="100%"
                    width={350}
                    
                    
                    objectFit="cover" 
                    
                     
                  />
                </Box>
                
                {/* Right side: Event details */}
                <Box  bgColor="cyan.800" p={6} alignSelf={"center"} mr={20} >
                  <VStack spacing={5}  color="gray.700">
                    
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
                </Box>
              </Flex>
            )}
          </Dialog.Body>
          <Dialog.Footer>
          {selectedEvent && (
  <HStack spacing={4}>
    {selectedEvent.status === 'Waiting' ? (
      <>
        <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
          Close
        </Button>
        <Button colorPalette="red" variant="subtle" onClick={handleDecline}>
          Decline
        </Button>
        <Button colorPalette="green" variant="subtle" onClick={handleApproval}>
          Approve
        </Button>
      </>
    ) : selectedEvent.status === 'Approved' ? (
      <>
        <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
          Close
        </Button>
        <Button colorPalette="green" variant="solid" disabled >
          Approved
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
