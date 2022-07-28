import React, { useRef, useEffect } from 'react'
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "./config/ChatLogics";
import { ChatState } from "../context/ChatProvider";
import "../App.css"

function ScrollableChat({ messages }) {
  const bottomRef = useRef(null);
  const { user } = ChatState();

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  });

  return (
    <div className='ScrollableChat'>
      {messages && 
        messages.map((m, i) => (
          <div style={{ display: "flex", margin: "10px" }} key={m._id}>
            {
              (isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.pic}
                  />
                </Tooltip>
              )
            }
            <span
              style={{
                backgroundColor: `${m.sender._id === user._id ? "#5cc0fa" : "#7ffaaa"
                  }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
            <div ref={bottomRef} />
          </div>
        ))}
    </div>
  )
}

export default ScrollableChat