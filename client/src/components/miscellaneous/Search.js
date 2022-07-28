import React, { useState, useEffect } from 'react';
import UserListItem from "../UseAvatar/UserListItem";
import { Tooltip } from "@chakra-ui/tooltip";
import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Spinner } from "@chakra-ui/spinner";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import { ChatState } from '../../context/ChatProvider';
import { useHistory } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import ChatLoading from "../ChatLoading"
import "../../App.css"
import { AddIcon } from "@chakra-ui/icons";
import GroupModal from './GroupModal';


const Search = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory()

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      console.log(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <div className="mychats">
        <h1 style={{ display: "flex" }}>My Chats</h1>
        <Tooltip label="Create Group" hasArrow placement="bottom-end" >
          <GroupModal>
            <Button
              borderRadius="full"
              colorScheme='teal'
              height="47px"
              mr="10px"
            > <AddIcon color="white" />  </Button>
          </GroupModal>
        </Tooltip>
      </div>

      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: "5px", borderRight: "2px solid rgb(216, 216, 216)" }}>
        <ArrowBackIcon boxSize={7} mx="10px" />
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end" >
          <Button variant="ghost" onClick={onOpen} my="5px" flex="1" bg="#ebebeb" >
            <i className="fas fa-search" ></i>
            <Text d={{ base: "none", md: "flex" }} px={4} fontSize="lg">
              Search User
            </Text>
          </Button>
        </Tooltip>
      </div>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((e) => (
                <UserListItem
                  key={e._id}
                  user={e}
                  handleFunction={() => accessChat(e._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default Search