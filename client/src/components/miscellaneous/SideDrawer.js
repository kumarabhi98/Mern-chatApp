import React, { useState } from 'react'
import '../../App.css'
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
// import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import { useHistory } from "react-router-dom";
// import axios from "axios";
// import { useToast } from "@chakra-ui/toast";
// import ChatLoading from "../ChatLoading";
// import { Spinner } from "@chakra-ui/spinner";
import ProfileModal from "./profilemodel";
// import NotificationBadge from "react-notification-badge";
// import { Effect } from "react-notification-badge";
import { getSender } from "../config/ChatLogics"
// import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../context/ChatProvider";

function SideDrawer() {

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();
  const history = useHistory();


  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  return (
    <div className='SideDrawer'>
      <div>
        <Menu >
          <MenuButton mx={4} rightIcon={<ChevronDownIcon />}>
            <Avatar
              size="md"
              cursor="pointer"
              name={user.name}
              src={user.pic}
            />
          </MenuButton>
          <MenuList >
            <ProfileModal user={user}>
              <MenuItem >My Profile</MenuItem>{" "}
            </ProfileModal>
            <MenuDivider />
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </div>
      {/* <h1>{(user.name).toUpperCase()}</h1> */}
      <div>
        <Menu>
          <MenuButton px="3px" >
            {
              notification.length != 0 ?
                <h1 style={
                  {
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "100%",
                    display: "inline-block",
                    paddingRight: "5px",
                    paddingLeft: "5px",
                    position:"relative",
                    left:"20px",
                    fontSize: "10px"
                  }
                }>
                  {notification.length}
                </h1> : <></>
            }
            <BellIcon fontSize="4xl" m={1} color="grey" />
          </MenuButton>
          <MenuList pl={2}>
            {!notification.length && "No New Messages"}
            {notification.map((notif) => (
              <MenuItem
                key={notif._id}
                onClick={() => {
                  setSelectedChat(notif.chat);
                  setNotification(notification.filter((n) => n !== notif));
                }}
              >
                {notif.chat.isGroupChat
                  ? `New Message in ${notif.chat.chatName}`
                  : `New Message from ${getSender(user, notif.chat.users)}`}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </div>
    </div>
  )
}

export default SideDrawer