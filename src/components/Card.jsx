import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'

function Card({ image }) {
  const { serverUrl, userData, setUserData, backendImage, setBackendImage, frontendImage, setFrontendImage, selectedImage, setSelectedImage } = useContext(userDataContext)
  return (
    <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#020220] border border-white/10 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer hover:border-white/30 transition-all duration-300 ${selectedImage == image ? "border-2 border-white shadow-2xl shadow-blue-500/30 " : null}`} onClick={() => {
      setSelectedImage(image)
      setBackendImage(null)
      setFrontendImage(null)
    }}>
      <img src={image} className='h-full object-cover' />
    </div>
  )
}

export default Card
