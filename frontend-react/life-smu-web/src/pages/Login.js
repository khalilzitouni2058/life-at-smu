"use client"

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Field,
  Fieldset,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";

import { toaster } from "../components/ui/toaster.jsx"

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const validUser = {
    username: "a",
    password: "a",
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    setTimeout(() => {
      setLoading(false);
      if (username === validUser.username && password === validUser.password) {
        setIsAuthenticated(true);
        console.log()
        navigate("/dashboard");
      } else {
        toaster.error({
          title: "Login Successful",
        })
        console.log(toaster.title)
        setError(true);
      }
    }, 1000);
    
    console.log(error)
  };

  return (
    
    <Box
      bg="gray.100"
      height="100vh"
      display="flex"
      flexDirection={"column"}
      alignItems="center"
      justifyContent="top-center"
    >
      
      <Text
        fontSize="xl"
        fontWeight="bold"
        textAlign="center"
        mb={8}
        color="#007da5"
        mt={24}
      >
        WELCOME TO LIFE AT SMU ADMIN DASHBOARD
      </Text>
      <Box
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        maxW="400px"
        width="100%"
      >
        <form onSubmit={handleLogin}>
          <Fieldset.Root size="lg">
            <Stack spacing={4}>
              <Fieldset.Legend
                fontSize="xl"
                fontWeight="bold"
                textAlign="center"
                color="#007da5"
              >
                Login
              </Fieldset.Legend>

              <Field.Root invalid={error}>
                <Field.Label>Username</Field.Label>
                <Input
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  borderColor={error ? "red.500" : "#007da5"}
                />
              </Field.Root>

              <Field.Root invalid={error}>
                <Field.Label>Password</Field.Label>
                <Input
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  borderColor={error ? "red.500" : "#007da5"}
                />
              </Field.Root>

              {error && (
                <Text fontSize="sm" color="red.500" textAlign="left" mt={-2}>
                  Invalid username or password
                </Text>
              )}

              <Button
                type="submit"
                colorScheme="blue"
                isLoading={loading}
                backgroundColor="#007da5"
                color={"white"}

              >
                Login
              </Button>
            </Stack>
          </Fieldset.Root>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
