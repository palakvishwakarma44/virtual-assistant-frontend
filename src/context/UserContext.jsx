import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'
axios.defaults.withCredentials = true;
export const userDataContext = createContext()
function UserContext({ children }) {
const serverUrl = import.meta.env.VITE_API_URL
  const [userData, setUserData] = useState(null)
  const [frontendImage, setFrontendImage] = useState(null)
  const [backendImage, setBackendImage] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const handleCurrentUser = async () => {
    console.log(`Attempting to fetch current user from: ${serverUrl}/api/user/current`);
    try {
      const ping = await axios.get(`${serverUrl}/api/ping`);
      console.log("Backend Ping Response:", ping.data);

      const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true })
      setUserData(result.data)
      console.log("User data fetched successfully:", result.data)
    } catch (error) {
      console.error("Connectivity or Auth Error:", error.message);
      if (error.response) {
        console.error("Error Response Data:", error.response.data);
      }
    }
  }

  const getGeminiResponse = async (command, file = null, userLang = 'en-US') => {
    try {
      const url = `${serverUrl}/api/user/asktoassistant`;
      console.log(`!!!DEBUG!!! Frontend calling: ${url} with command: ${command}, hasFile: ${!!file}, Lang: ${userLang}`);
      
      let data;
      if (file) {
        data = new FormData();
        data.append("command", command);
        data.append("image", file);
        data.append("userLang", userLang);
      } else {
        data = { command, userLang };
      }

      const result = await axios.post(url, data, { 
        withCredentials: true,
        headers: file ? { "Content-Type": "multipart/form-data" } : {}
      })
      return result.data
    } catch (error) {
      console.error(`!!!DEBUG!!! Frontend error calling ${serverUrl}/api/user/asktoassistant:`, error.message);
      return null
    }
  }

  useEffect(() => {
    handleCurrentUser()
  }, [])
  const value = {
    serverUrl, userData, setUserData, backendImage, setBackendImage, frontendImage, setFrontendImage, selectedImage, setSelectedImage, getGeminiResponse
  }
  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  )
}

export default UserContext
