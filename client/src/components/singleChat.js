import React, { useState, useEffect } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box, Text, Avatar, IconButton, Spinner, useToast } from '@chakra-ui/react'
import { getSenderFull } from './config/ChatLogics'
import ProfileModal from './miscellaneous/profilemodel'
import UpadateGroupChat from './authentication/upadateGroupChat'
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import axios from "axios";
import ScrollableChat from './ScrollableChat'
import io from "socket.io-client";

const ENDPOINT = "https://mern-web-chat.herokuapp.com/";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const toast = useToast();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(
                `/api/message/${selectedChat._id}`,
                config
            );
            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(
                    "/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat,
                    },
                    config
                );
                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => {
            setSocketConnected(true);
        })
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, [])

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    // console.log(notification, "----------------------->");

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (
                !selectedChatCompare || // if chat is not selected or doesn't match current chat
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            }
            else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        console.log(e.target.value);
        if (e.target.value === "") {
            socket.emit("stop typing", selectedChat._id);
            setTyping(false);
            setIsTyping(false);
            return;
        }

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    return (
        <>
            {selectedChat ? (
                <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>

                    <div className='chatheader'>
                        {!selectedChat.isGroupChat ?
                            <> <div className='chatheader-avatar'>
                                <Avatar size="sm" src={getSenderFull(user, selectedChat.users).pic}></Avatar>
                                <h1>{getSenderFull(user, selectedChat.users).name.toUpperCase()}</h1>
                            </div>
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} /> </>
                            :
                            <>
                                <div className='chatheader-avatar'>
                                    <h1>{selectedChat.chatName.toUpperCase()}</h1>
                                </div>
                                <UpadateGroupChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
                            </>
                        }
                        {istyping ? (
                            <span className='type' 
                            style={{
                                marginLeft: `${!selectedChat.isGroupChat ? "30px" : "5px"
                                  }`,
                              }}
                            > typing..... </span>
                        ) : (
                          <></>
                        )}
                    </div>
                    <div className='texts'>
                        {loading ? <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" /> :
                            <>
                                <div className='ReadText'>
                                    <ScrollableChat messages={messages} />
                                </div>
                                <div className='messagesInput'>
                                    <FormControl
                                        onKeyDown={sendMessage}
                                        id="first-name"
                                        isRequired
                                    >
                                       
                                        <Input
                                            variant="filled"
                                            bg="white"
                                            // my={"5px"}
                                            placeholder="Enter a message.."
                                            value={newMessage}
                                            onChange={typingHandler}
                                        />
                                    </FormControl>
                                </div>
                            </>
                        }
                    </div>
                </div>
            ) : (
                <div id='empty'>
                    <Text fontSize="3xl" pb={3} >
                        Let's Get Started
                    </Text>
                </div >
            )
            }
        </>
    )
}

export default SingleChat