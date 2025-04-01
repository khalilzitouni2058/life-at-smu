import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; // Month view
import timeGridPlugin from '@fullcalendar/timegrid'; // Week & Day views
import interactionPlugin from '@fullcalendar/interaction'; // Click & Drag
import multiMonthPlugin from '@fullcalendar/multimonth'; // Yearly View
import axios from 'axios';

const EventCalendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/auth/events');
        const formattedEvents = response.data.map(event => ({
          title: event.eventName,
          start: event.eventDate + 'T' + event.eventTime.split(' - ')[0],
          end: event.eventDate + 'T' + event.eventTime.split(' - ')[1],
          location: event.eventLocation,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, multiMonthPlugin]}
      initialView="dayGridMonth" // Default view
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,multiMonthYear'
      }}
      views={{
        multiMonthYear: { type: 'multiMonth', duration: { months: 12 } }, // Year view
      }}
      events={events}
      
    />
  );
};

export default EventCalendar;
