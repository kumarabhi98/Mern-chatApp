import React from "react";
import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getPic, getSender } from "../components/config/ChatLogics";
import ChatLoading from "./ChatLoading";
// import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider";
import { Avatar } from '@chakra-ui/react'
import "../App.css"

const MyChats = ({ fetchAgain }) => {


  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    // <div className="chatlist">
      <Box
        d="flex"
        flexDir="column"
        flex="1"
        w="100%"
        h="100%"
        mt="2px"
        // overflowY="hidden"
        overflowY="scroll"
        borderRight="2px solid rgb(216, 216, 216)"
      >
        {chats ? (
          <Stack spacing="0px">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#d5dbe0" : "white"}
                color="black"
                px={3}
                py={2}
                display="flex"
                alignItems="center"
                key={chat._id}
                borderBottom="2px solid #ebeded"
              >
                <Avatar src={!chat.isGroupChat
                  ? getPic(loggedUser, chat.users)
                  : chat.chatName}
                  mr="10px"
                ></Avatar >
                <div style={{display:"flex", flexDirection:"column"}}>
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                  {chat.latestMessage && (
                    <Text fontSize="xs">
                      <b>{chat.latestMessage.sender.name} : </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </Text>
                  )}
                </div>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    // </div >
  )
}

export default MyChats