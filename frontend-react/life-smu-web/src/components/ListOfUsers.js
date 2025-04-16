import React, { useEffect, useState } from 'react';
import '../styles/Dashboard/Products.css';
import axios from 'axios';
import { Box, Flex, Heading, Text, Table,Card ,SimpleGrid, Avatar,HStack ,Badge,VStack,Stat} from "@chakra-ui/react";
import { Chart, useChart } from "@chakra-ui/charts"
import { Area, AreaChart } from "recharts"
import { LuGlobe } from "react-icons/lu"
import { MdEventAvailable } from "react-icons/md";

function ListOfUsers() {
  const [users, setusers] = useState([]);
  const [formattedEvents, setformattedEvents] = useState([]);
  const SparkLine = () => {
    const chart = useChart({
      data: [
        { value: 0 },
        { value: users.length },
        
      ],
      series: [{ color: "teal.solid" }],
    })
  
    return (
      <Chart.Root height="10" chart={chart}>
        <AreaChart
          data={chart.data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          {chart.series.map((item) => (
            <Area
              key={item.name}
              isAnimationActive={false}
              dataKey={chart.key(item.name)}
              fill={chart.color(item.color)}
              fillOpacity={0.2}
              stroke={chart.color(item.color)}
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </Chart.Root>
    )
  }
  const SparkLine2 = () => {
    const chart = useChart({
      data: [
        { value: 1 },
        { value: totalUsersWithEvents },
        
      ],
      series: [{ color: "cyan.solid" }],
    })
  
    return (
      <Chart.Root height="10" chart={chart}>
        <AreaChart
          data={chart.data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          {chart.series.map((item) => (
            <Area
              key={item.name}
              isAnimationActive={false}
              dataKey={chart.key(item.name)}
              fill={chart.color(item.color)}
              fillOpacity={0.2}
              stroke={chart.color(item.color)}
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </Chart.Root>
    )
  }
  const totalUsersWithEvents = users.filter(user => Array.isArray(user.events) && user.events.length > 0).length

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/auth/users');
        const fetchedUsers = Array.isArray(response.data.users) ? response.data.users : [];
        console.log(response);
        setusers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);
  

  const totalUsers = users.length;

  return (
    <Box>
      <Heading
  as="h2"
  size="xl"
  fontWeight="bold"
  mb={6}
  
  display={"flex"}
  justifyContent={"left"}
  color="blackAlpha.950"
  letterSpacing="wide"
  textTransform="uppercase"
>
  Users Management
</Heading>

      {/* Boxes for User Count */}
      <Flex mb={6} justify="space-between">
        
          <Card.Root w={"48%"} size={"lg"}  overflow="hidden">
      <Card.Body>
        <Stat.Root>
          <Stat.Label>
            <LuGlobe /> Users
          </Stat.Label>
          <Stat.ValueText>{users.length}</Stat.ValueText>
        </Stat.Root>
      </Card.Body>
      <SparkLine />
    </Card.Root>
       

    <Card.Root w={"48%"} size={"lg"}  overflow="hidden">
      <Card.Body>
        <Stat.Root>
          <Stat.Label>
            <MdEventAvailable /> Joined Events
          </Stat.Label>
          <Stat.ValueText>{totalUsersWithEvents}</Stat.ValueText>
        </Stat.Root>
      </Card.Body>
      <SparkLine2 />
    </Card.Root>
       
      </Flex>

      {/* Table for Users Information */}
      <Box bg="white" p={6} borderRadius="md" boxShadow="md">
  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} >
    {users.map((user) => (
      <Box
        key={user._id}
        p={5}
        m={2}
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="sm"
        bg="gray.50"
        _dark={{ bg: "gray.800" }}
        _hover={{ shadow: 'lg', transform: 'translateY(-4px)', transition: '0.2s' }}

      >
       <HStack spacing={4} align="start">
       <Avatar.Root>
      <Avatar.Fallback name={user.fullname} />
      <Avatar.Image src={user.picture} />
    </Avatar.Root>
        <VStack align="start" spacing={1}>
          <Text fontWeight="bold" fontSize="lg">
            {user.fullname}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {user.email}
          </Text>
          <Badge colorScheme="blue" borderRadius="full" px={2}>
            {user.role || 'User'}
          </Badge>
        </VStack>
      </HStack>

      <Box mt={4} fontSize="sm" color="gray.600">
        <Text><strong>Major:</strong> {user.major}</Text>
        <Text><strong>Program:</strong> {user.program}</Text>
      </Box>
      </Box>
    ))}
  </SimpleGrid>
</Box>
    </Box>
  );
}

export default ListOfUsers;
