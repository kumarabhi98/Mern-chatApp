import React from 'react'
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router";
import "../../App.css"
import {ChatState} from "../../context/ChatProvider"

function Login() {
   
  const toast = useToast();
  const history = useHistory(); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [picLoading, setPicLoading] = useState(false);
  const {setUser} = ChatState();

  const submitHandler = async () => {
    setPicLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      
      setUser(userInfo);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };
  const handleClick = () => {
    setShow(!show);
  }

  return (
    <VStack spacing='5px'>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email"
          bg="transparent"
          border="none"
          onChange={(e) => { setEmail(e.target.value) }}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            bg="transparent"
            border="none"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        className = "button"
        colorScheme="green"
        width="25%"
        style={{ marginTop: 15 }}
        box-shadow =  "10px 10px 30px rgb(26, 26, 26)"
        onClick={submitHandler}
        isLoading={picLoading}
      >
        login
      </Button>
    </VStack>
  )
}

export default Login

