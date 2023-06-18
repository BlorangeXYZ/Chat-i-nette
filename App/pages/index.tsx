import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Text42 } from "./components/Text42";
import { useMediaQuery, useTheme } from "@mui/material";
import axios from "axios";
import { API_BASE } from "./utils/constants";
import { useRouter } from 'next/router'
import Cookies from 'js-cookie';
import PageLoader from "./components/PageLoader";

const Login = () => {
  const [isHover, setIsHover] = useState(false);
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  useEffect(() => {
    if (!!router.query.code) {
      setLoading(true)
      const postAuthToken = async() => {
        const { data } = await axios.post(API_BASE + "/auth",  {
          data: router.query.code
        })
        Cookies.set('access_token', data, { expires: 7 });
        router.push('/chat');
      }
      postAuthToken()
    }
  },[router.query.code, router])



  const handleAuth = async() => {
    try{
      const response = await axios.get(API_BASE + "/auth")
      window.location.href = response.data.redirectUrl;
    }catch(e) {
      console.error(e)
    }
  }

  if(loading) {
    return <PageLoader />
  }

  return (
    <div>
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          position: [-0.8, 1.2, 2.8],
        }}
        style={{ height: "70vh", cursor: "pointer" }}
      >
        <Text42 isMobile={isMobile}/>
      </Canvas>
      <div style={{ width: "100%", display: "flex", justifyContent: "center", position: 'relative', height: '30vh'}}>
        <button
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            padding: "23px 65px",
            borderRadius: "10px",
            position: 'absolute',
            marginTop: "2rem",
            cursor: "pointer",
            fontSize: 15,
            color: 'white',
            backgroundColor: isHover ? '#4a4a4b' : '#2a2a2b',
            transition: 'all 0.1s ease-in-out',
            transform: isHover ? 'scale(1.02)' : 'scale(1)',
            fontFamily: 'Helvetica, sans-serif',
            border: 'none'
          }}
          onClick={handleAuth}
        >
          LOGIN AUTH
        </button>
      </div>
    </div>
  );
};

export default Login;
