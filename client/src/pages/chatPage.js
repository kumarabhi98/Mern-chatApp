import { ChatState } from "../context/ChatProvider"
import { Box } from '@chakra-ui/react'
import SideDrawer from "../components/miscellaneous/SideDrawer"
import MyChats from "../components/MyChats"
import ChatBox from "../components/ChatBox"
import Search from "../components/miscellaneous/Search"
import '../App.css'
import { useEffect, useState } from "react"

function ChatPage() {
  const [fetchAgain, setFetchAgain] = useState(false);
  const {user} = ChatState();

  return (
    <div className="Main">
      <div className="ChatPage">
        {user &&
          <Box className="leftpannel">
            <SideDrawer />
            <Search />
            <MyChats fetchAgain = {fetchAgain} />
          </Box>
        }
        <div className="chatarea">
          {user &&  <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
        </div>
      </div>
    </div >
  )
}

export default ChatPage