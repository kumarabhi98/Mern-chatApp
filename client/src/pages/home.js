import React from 'react'
import { Container, Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../components/authentication/login'
import SignUp from '../components/authentication/signup'
import "../App.css"
import Logo from '../components/logo'
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

function Home() {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  }, [history]);

  return (
    <div id="home"> 
      <Logo/>
      <img class="hero-img" alt="NA" src="https://www.clerksy.co/assets/hero-f09b73e367e36e9a39fd215049966db45a5a93740a09ce3aa6ededd503052067.svg"></img>
      <img class="plant-img" alt="NA" src="https://www.clerksy.co/assets/leafs1-e28a3acc22ee280805e116749f8f7d327e2d181be0595424b5711858361e5515.svg"></img>
      <Container maxW='xl' className="stack" >
        <Box
          d="flex"
          justifyContent='center'
          p={3}
          className="Box"
        >
          <Tabs variant='soft-rounded' colorScheme='green'>
            <TabList>
              <Tab width="50%" color="black">Login</Tab>
              <Tab width="50%" color="black">Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <SignUp />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

      </Container>
    </div>
  )
}

export default Home