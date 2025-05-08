import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // Month view
import timeGridPlugin from "@fullcalendar/timegrid"; // Week & Day views
import interactionPlugin from "@fullcalendar/interaction"; // Click & Drag
import multiMonthPlugin from "@fullcalendar/multimonth"; // Yearly View
import axios from "axios";
import emailjs from '@emailjs/browser'

import { Toaster, toaster } from "../components/ui/toaster";

import {
  Box,
  HStack,
  Text,
  Dialog,
  Button,
  VStack,
  Portal,
  Flex,
  Image,
  Card,
  Checkbox,
  List,
  Avatar,
  Badge,
  Switch,
} from "@chakra-ui/react";

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [assignedUserIds, setAssignedUserIds] = useState([]);
  const [checked, setChecked] = useState(false);
  const [checkedMap, setCheckedMap] = useState({});

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [users, setUsers] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const handleEventDidMount = (info) => {
    if (info.event.extendedProps.status === "waiting") {
      info.el.style.backgroundColor = "blue";
    } else if (info.event.extendedProps.status === "approved") {
      info.el.style.backgroundColor = "green";
    }

    // Change dot color
    const dotEl = info.el.getElementsByClassName("fc-event-dot")[0];
    if (dotEl) {
      if (info.event.extendedProps.status === "Waiting") {
        dotEl.style.backgroundColor = "blue";
      } else if (info.event.extendedProps.status === "Approved") {
        dotEl.style.backgroundColor = "green";
      }
    }
  };

  useEffect(() => {
    if (users && selectedEvent) {
      const map = {};
      console.log(selectedEvent);
      const assigned = selectedEvent.assignedMembers || [];

      users.forEach((user) => {
        map[user._id] = assigned.includes(user._id);
      });

      setCheckedMap(map);
      
    }
  }, [users, selectedEvent,!isDialogOpen]);
  const sendassignEmail = (email,eventName,eventDate,support_email,eventlocation,student_fullname) => {
      const templateParams = {
        email: email,
        eventLocation:eventlocation,
        eventName:eventName,
        eventDate:eventDate,
        support_email:support_email,
        student_fullname:student_fullname
        
      };
      console.log("📨 Sending email with params:", templateParams);
  
      emailjs
        .send(
          'service_c3y8o5g',       // Replace with your EmailJS service ID
          'template_qzlsfwq',      // Replace with your EmailJS template ID
          templateParams,
          'TnwC11NR8IXLU9kFt'        // Replace with your EmailJS public key
        )
        .then((response) => {
          console.log('✅ Email sent successfully:', response.text)
        })
        .catch((err) => {
          console.error('❌ Failed to send email:', err)
        })
    }
    const sendunassignEmail = (email,eventName,eventDate,support_email,eventlocation,student_fullname) => {
      const templateParams = {
        email: email,
        eventLocation:eventlocation,
        eventName:eventName,
        eventDate:eventDate,
        support_email:support_email,
        student_fullname:student_fullname
        
      };
      console.log("📨 Sending email with params:", templateParams);
  
      emailjs
        .send(
          'service_c3y8o5g',       // Replace with your EmailJS service ID
          'template_4bloyi2',      // Replace with your EmailJS template ID
          templateParams,
          'TnwC11NR8IXLU9kFt'        // Replace with your EmailJS public key
        )
        .then((response) => {
          console.log('✅ Email sent successfully:', response.text)
        })
        .catch((err) => {
          console.error('❌ Failed to send email:', err)
        })
    }
  const handleToggle = async (val, eventId, userId,useremail,userfullname) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/auth/events/${eventId}/assign-member`,
        {
          userId,
        }
      );

      const { assigned } = response.data;

      // Optional: Different message depending on result
      toaster.create({
        description: assigned
          ? "Member assigned successfully"
          : "Member unassigned successfully",
        type: "success",
      });
      if(assigned){
      sendassignEmail("kzitouni18@gmail.com",selectedEvent.eventName,selectedEvent.eventDate,"lifeatatsmu@gmail.com",selectedEvent.location,userfullname)
      }
      else{
        sendunassignEmail("kzitouni18@gmail.com",selectedEvent.eventName,selectedEvent.eventDate,"lifeatatsmu@gmail.com",selectedEvent.location,userfullname)
      }
      // ✅ Update the local checked state based on backend response
      setCheckedMap((prev) => ({
        ...prev,
        [userId]: assigned,
      }));
    } catch (err) {
      console.error("Toggle error:", err);
      toaster.create({
        description: "Something went wrong.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    const fetchexistingUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/auth/student-life-dep"
        );
        const existingUsers = Array.isArray(response.data.users)
          ? response.data.users
          : [];
        setUsers(existingUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchexistingUsers();
  }, [isDialogOpen]);

  // Handle the checkbox change

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/auth/events"
        );
       
        const formattedEvents = response.data.map((event) => ({
          id: event._id,
          title: event.eventName,
          start: event.eventDate + "T" + event.eventTime.split(" - ")[0],
          end: event.eventDate + "T" + event.eventTime.split(" - ")[1],
          location: event.eventLocation,
          image: event.eventImage?.uri,
          eventName : event.eventName,
          assignedMembers: event.assignedMembers,
          eventDate : event.eventDate,
          club:event.club,
          backgroundColor:
            event.status?.toLowerCase() === "waiting"
              ? "grey"
              : event.status?.toLowerCase() === "approved"
              ? "green"
              : event.status?.toLowerCase() === "declined"
              ? "red"
              : "gray", // Default fallback color

          borderColor:
            event.status?.toLowerCase() === "waiting"
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
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [!isDialogOpen]);

  const handleEventClick = (info) => {
    setIsDialogOpen(true);
    const eventDetails = info.event;
    const eventId = info.event._def.publicId;

    
    setSelectedEvent({
      id: eventId,
      title: eventDetails.title,
      start: eventDetails.start,
      end: eventDetails.end,
      location: eventDetails.extendedProps.location,
      status: eventDetails.extendedProps.status,
      image: eventDetails.extendedProps.image,
      assignedMembers: eventDetails.extendedProps.assignedMembers,
      club:eventDetails.extendedProps.club,
      eventName:eventDetails.extendedProps.eventName,
      eventDate:eventDetails.extendedProps.eventDate
    });
    
  
  };
  const fetchClubEmail = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/auth/clubs/${id}`);
      console.log(res.data.club.email)
      return res.data.club.email;
    } catch (err) {
      console.error("Failed to fetch club email", err);
      return null;
    }
  };
  
  const sendEventStatusEmail = (clubEmail, eventTitle,eventDate,eventLocation ,status) => {
    const templateParams = {
      user_email: clubEmail,
      
      event_title: eventTitle,
      event_date: eventDate,
      event_location: eventLocation,
      
      status: status,
      
      
    };
    console.log("📨 Sending email with params:", templateParams);

    emailjs
      .send(
        'service_1ml3ls9',       // Replace with your EmailJS service ID
        'template_4ul91xt',      // Replace with your EmailJS template ID
        templateParams,
        'VCjuhQHBZ7DEMPEGH'        // Replace with your EmailJS public key
      )
      .then((response) => {
        console.log('✅ Email sent successfully:', response.text)
      })
      .catch((err) => {
        console.error('❌ Failed to send email:', err)
      })
  }
  
  const handleApproval = async (eventId) => {
    
    try {
      await axios.post("http://localhost:8000/api/auth/events/approve", {
        eventId,
      });
      setSelectedEvent((prev) => ({ ...prev, status: "Approved" }));
      console.log(selectedEvent)
      const clubEmail = await fetchClubEmail(selectedEvent.club); 
      console.log(clubEmail)
      const testEmail = "kzitouni18@gmail.com";
      
    const eventTitle = selectedEvent.eventName;
    console.log(selectedEvent)// Replace `clubId` with the actual field
    if (clubEmail) {
      sendEventStatusEmail(testEmail, eventTitle,selectedEvent.eventDate,selectedEvent.location,"Approved");
    }
    } catch (error) {
      console.error("Approval failed:", error);
    } finally {
      setIsDialogOpen(false);
    }
  };
  const DetailItem = ({ label, value }) => (
    <Box>
      <Text fontSize="sm" fontWeight="semibold" color="gray.500">
        {label}
      </Text>
      <Text fontSize="md" color="gray.800">
        {value}
      </Text>
    </Box>
  );
  
  const handleDecline = async (eventId) => {
    try {
      await axios.post("http://localhost:8000/api/auth/events/decline", {
        eventId,
      });
      setSelectedEvent((prev) => ({ ...prev, status: "Declined" }));
      const clubEmail = await fetchClubEmail(selectedEvent.club);
      const testEmail = "kzitouni18@gmail.com";
      const eventTitle = selectedEvent.eventName;
      if (clubEmail) {
        sendEventStatusEmail(testEmail, eventTitle,selectedEvent.eventDate,selectedEvent.location,"Refused");
      }
      
      

    } catch (error) {
      console.error("Decline failed:", error);
    } finally {
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <Box>
        <HStack spacing={12}>
          <HStack spacing={2} align="center">
            <Box w={3} h={3} bg="gray.500" borderRadius="full" />
            <Text fontSize="sm" mt={4}>
              Waiting
            </Text>
          </HStack>
          <HStack spacing={2} align="center">
            <Box w={3} h={3} bg="green.600" borderRadius="full" />
            <Text fontSize="sm" mt={4}>
              Approved
            </Text>
          </HStack>
          <HStack spacing={2} align="center">
            <Box w={3} h={3} bg="red.600" borderRadius="full" />
            <Text fontSize="sm" mt={4}>
              Declined
            </Text>
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
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          multiMonthPlugin,
        ]}
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

          let borderColor = "rgb(135, 147, 158)"; // Default gray
          if (status === "approved") borderColor = "#38A169"; // green
          else if (status === "declined") borderColor = "#E53E3E"; // red
          else if (status === "waiting") borderColor = "#A0AEC0"; // light gray

          info.el.style.borderLeft = `4px solid ${borderColor}`;
        }}
        events={events}
        eventClick={handleEventClick}
      />

      {/* Dialog for event details */}
      <Dialog.Root open={isDialogOpen} motionPreset="slide-in-bottom" size="cover" placement="center">
  <Portal>
    <Dialog.Backdrop bg="blackAlpha.300" />
    <Dialog.Positioner>
      <Dialog.Content bg="white" borderRadius="xl" boxShadow="2xl" p={6}>
        {/* Header */}
        <Dialog.Header fontSize="4xl" fontWeight="bold" color="gray.800" mb={4}>
          {selectedEvent?.title}
        </Dialog.Header>

        {/* Body */}
        <Dialog.Body>
  {selectedEvent && (
    <Flex
      p={2}
      gap={4}
      
      overflow="hidden"
    >
      {/* Left: Event Image with Title */}
      <Box flex="0.7">
       
        <Box
          borderRadius="xl"
          overflow="hidden"
          boxShadow="md"
          
          
        >
          <Image
            src={selectedEvent.image}
            alt="Event"
            objectFit="cover"
            w="100%"
            h="100%"
            maxH="500px"
          />
        </Box>
      </Box>

      {/* Middle: Event Details with Title */}
      <Box
        flex="1"
        bg="gray.50"
        borderRadius="xl"
        p={6}
        boxShadow="md"
        overflowY="auto"
      >
        <Text fontSize="lg" fontWeight="semibold" mb={4} color="gray.700">
          Event Details
        </Text>
        <VStack align="start" spacing={4}>
          <DetailItem label="Location" value={selectedEvent.location} />
          <DetailItem label="Start Time" value={new Date(selectedEvent.start).toLocaleString()} />
          <DetailItem label="End Time" value={new Date(selectedEvent.end).toLocaleString()} />
          <DetailItem label="Status" value={selectedEvent.status} />
        </VStack>
      </Box>

      {/* Right: Member Assignment */}
      <Box
        flex="1"
        bg="gray.50"
        borderRadius="xl"
        p={4}
        overflowY="auto"
        maxH={400}
        boxShadow="md"
        sx={{ "&::-webkit-scrollbar": { display: "none" } }}
      >
        <Text fontSize="lg" fontWeight="semibold" mb={4} color="gray.700">
          Assign Members
        </Text>

        <VStack spacing={4} align="stretch" >
          <List.Root>
            {users.length > 0 ? (
              users.map((user) => (
                <List.Item key={user._id} listStyleType={"none"} >
                  <Card.Root
                  mt={3}
                    bg="white"
                    p={4}
                    borderRadius="md"
                    boxShadow="sm"
                    _hover={{
                      boxShadow: "md",
                      transform: "scale(1.01)",
                      transition: "0.2s",
                    }}
                  >
                    <HStack spacing={4}  align="center">
                      {/* Avatar */}
                      <Avatar.Root boxSize={12}>
                        <Avatar.Fallback name={user.fullname} />
                        <Avatar.Image src={user.picture} />
                      </Avatar.Root>

                      {/* Info */}
                      <Box flex="1" >
                        <Text fontWeight="bold" fontSize="md" color="gray.800">
                          {user.fullname}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {user.email}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {user.Role}
                        </Text>
                        <HStack mt={2} spacing={2} wrap="wrap">
                          <Badge colorScheme="blue" fontSize="0.75rem">
                            {user.major}
                          </Badge>
                          <Badge colorScheme="green" fontSize="0.75rem">
                            {user.program}
                          </Badge>
                        </HStack>
                      </Box>

                      {/* Light-Themed Switch */}
                      <Switch.Root
                        variant="solid"
                        display={"flex"}
                        colorPalette={"green"}
                        checked={!!checkedMap[user._id]}
                        onCheckedChange={(val) =>
                          handleToggle(val, selectedEvent.id, user._id,user.email,user.fullname)
                        }
                      >
                        <Switch.HiddenInput />
                        <Switch.Control
                          
                          
                         
                        />
                        <Switch.Label ml={2} color="gray.700">
                          Assign
                        </Switch.Label>
                      </Switch.Root>
                    </HStack>
                  </Card.Root>
                </List.Item>
              ))
            ) : (
              <Text color="gray.500">No users available.</Text>
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
                    {selectedEvent.status === "Waiting" ? (
                      <>
                        <Button
                          color="white"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Close
                        </Button>
                        <Button
                          colorPalette="red"
                          variant="subtle"
                          onClick={() => handleDecline(selectedEvent.id)}
                        >
                          Decline
                        </Button>
                        <Button
                          colorPalette="green"
                          variant="subtle"
                          onClick={() => handleApproval(selectedEvent.id)}
                        >
                          Approve
                        </Button>
                      </>
                    ) : selectedEvent.status === "Approved" ? (
                      <>
                        <Button
                          variant="ghost"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Close
                        </Button>
                        <Button colorPalette="green" variant="solid" disabled>
                          Approved
                        </Button>
                      </>
                    ) : selectedEvent.status === "Declined" ? (
                      <>
                        <Button
                          variant="ghost"
                          onClick={() => setIsDialogOpen(false)}
                        >
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
