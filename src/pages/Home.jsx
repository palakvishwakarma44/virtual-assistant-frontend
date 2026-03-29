// import React, { useContext, useEffect, useRef, useState } from 'react'
// import { userDataContext } from '../context/userContext'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import aiImg from "../assets/ai.gif"
// import { CgMenuRight } from "react-icons/cg";
// import { RxCross1 } from "react-icons/rx";
// import userImg from "../assets/user.gif"
// function Home() {
//   //const [, setActivated] = useState(false);

//   const {userData,serverUrl,setUserData,getGeminiResponse}=useContext(userDataContext)
//   const navigate=useNavigate()
//   const [listening,setListening]=useState(false)
//   const [userText,setUserText]=useState("")
//   const [aiText,setAiText]=useState("")
//   const isSpeakingRef=useRef(false)
//   const recognitionRef=useRef(null)


//   const [ham,setHam]=useState(false)
//     const [typedMessage, setTypedMessage] = useState("");
//   const isRecognizingRef=useRef(false)
//   const synth=window.speechSynthesis

//   const handleLogOut=async ()=>{
//     try {
//       const result=await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
//       setUserData(null)
//       navigate("/signin")
//     } catch (error) {
//       setUserData(null)
//       console.log(error)
//     }
//   }

//   const startRecognition = () => {

//    if (!isSpeakingRef.current && !isRecognizingRef.current) {
//     try {
//       recognitionRef.current?.start();
//       console.log("Recognition requested to start");
//     } catch (error) {
//       if (error.name !== "InvalidStateError") {
//         console.error("Start error:", error);
//       }
//     }
//   }

//   }

//   const speak=(text)=>{
//     const utterence=new SpeechSynthesisUtterance(text)
//     utterence.lang = 'hi-IN';
//     const voices =window.speechSynthesis.getVoices()
//     const hindiVoice = voices.find(v => v.lang === 'hi-IN');
//     if (hindiVoice) {
//       utterence.voice = hindiVoice;
//     }


//     isSpeakingRef.current=true
//     utterence.onend=()=>{
//         setAiText("");
//   isSpeakingRef.current = false;
//   setTimeout(() => {
//     startRecognition(); // ⏳ Delay se race condition avoid hoti hai
//   }, 800);
//     }
//    synth.cancel(); // 🛑 pehle se koi speech ho to band karo
// synth.speak(utterence);
//   }

//   const handleCommand=(data)=>{
//     const {type,userInput,response}=data
//       speak(response);

//     if (type === 'google-search') {
//       const query = encodeURIComponent(userInput);
//       window.open(`https://www.google.com/search?q=${query}`, '_blank');
//     }
//      if (type === 'calculator-open') {

//       window.open(`https://www.google.com/search?q=calculator`, '_blank');
//     }
//      if (type === "instagram-open") {
//       window.open(`https://www.instagram.com/`, '_blank');
//     }
//     if (type ==="facebook-open") {
//       window.open(`https://www.facebook.com/`, '_blank');
//     }
//      if (type ==="weather-show") {
//       window.open(`https://www.google.com/search?q=weather`, '_blank');
//     }

//     if (type === 'youtube-search' || type === 'youtube-play') {
//       const query = encodeURIComponent(userInput);
//       window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
//     }

//     const handleTypedSend = async () => {
//   if (!typedMessage.trim()) return;

//   recognitionRef.current?.stop();
//   isRecognizingRef.current = false;

//   setUserText(typedMessage);

//   const data = await getGeminiResponse(typedMessage);

//   handleCommand(data);
//   speak(data.response);

//   setTypedMessage("");
// };

//   }

// useEffect(() => {
//   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//   const recognition = new SpeechRecognition();

//   recognition.continuous = true;
//   recognition.lang = 'en-US';
//   recognition.interimResults = false;

//   recognitionRef.current = recognition;

//   let isMounted = true;  // flag to avoid setState on unmounted component

//   // Start recognition after 1 second delay only if component still mounted
//   const startTimeout = setTimeout(() => {
//     if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
//       try {
//         recognition.start();
//         console.log("Recognition requested to start");
//       } catch (e) {
//         if (e.name !== "InvalidStateError") {
//           console.error(e);
//         }
//       }
//     }
//   }, 1000);

//   recognition.onstart = () => {
//     isRecognizingRef.current = true;
//     setListening(true);
//   };

//   recognition.onend = () => {
//     isRecognizingRef.current = false;
//     setListening(false);
//     if (isMounted && !isSpeakingRef.current) {
//       setTimeout(() => {
//         if (isMounted) {
//           try {
//             recognition.start();
//             console.log("Recognition restarted");
//           } catch (e) {
//             if (e.name !== "InvalidStateError") console.error(e);
//           }
//         }
//       }, 1000);
//     }
//   };

//   recognition.onerror = (event) => {
//     console.warn("Recognition error:", event.error);
//     isRecognizingRef.current = false;
//     setListening(false);
//     if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
//       setTimeout(() => {
//         if (isMounted) {
//           try {
//             recognition.start();
//             console.log("Recognition restarted after error");
//           } catch (e) {
//             if (e.name !== "InvalidStateError") console.error(e);
//           }
//         }
//       }, 1000);
//     }
//   };

//   recognition.onresult = async (e) => {
//     const transcript = e.results[e.results.length - 1][0].transcript.trim();
//     if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
//       setAiText("");
//       setUserText(transcript);
//       recognition.stop();
//       isRecognizingRef.current = false;
//       setListening(false);
//       const data = await getGeminiResponse(transcript);
//       console.log("Gemini response data:", data); 
//       handleCommand(data);
//       setAiText(data.response);
//       speak(data.response); 
//       setUserText("");
//     }
//   };


//     const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
//     greeting.lang = 'hi-IN';

//     window.speechSynthesis.speak(greeting);


//   return () => {
//     isMounted = false;
//     clearTimeout(startTimeout);
//     recognition.stop();
//     setListening(false);
//     isRecognizingRef.current = false;
//   };
// }, []);




//   return (
//     <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-[15px]'>
//       <CgMenuRight className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={()=>setHam(true)}/>
//       <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham?"translate-x-0":"translate-x-full"} transition-transform`}>
//  <RxCross1 className=' text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={()=>setHam(false)}/>
//  <button className='min-w-[150px] h-[60px]  text-black font-semibold   bg-white rounded-full cursor-pointer text-[19px] ' onClick={handleLogOut}>Log Out</button>
//       <button className='min-w-[150px] h-[60px]  text-black font-semibold  bg-white  rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] ' onClick={()=>navigate("/customize")}>Customize your Assistant</button>

// <div className='w-full h-[2px] bg-gray-400'></div>
// <h1 className='text-white font-semibold text-[19px]'>History</h1>

// <div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate'>
//   {userData.history?.map((his)=>(
//     <div className='text-gray-200 text-[18px] w-full h-[30px]  '>{his}</div>
//   ))}

// </div>

//       </div>
//       <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold absolute hidden lg:block top-[20px] right-[20px]  bg-white rounded-full cursor-pointer text-[19px] ' onClick={handleLogOut}>Log Out</button>
//       <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold  bg-white absolute top-[100px] right-[20px] rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] hidden lg:block ' onClick={()=>navigate("/customize")}>Customize your Assistant</button>
//       <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
// <img src={userData?.assistantImage} alt="" className='h-full object-cover'/>
//       </div>
//       <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>
//       {!aiText && <img src={userImg} alt="" className='w-[200px]'/>}
//       {aiText && <img src={aiImg} alt="" className='w-[200px]'/>}

//     <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText?userText:aiText?aiText:null}</h1>

//     </div>
//   )
// }

// export default Home
// import React, { useContext, useEffect, useRef, useState } from 'react';
// import { userDataContext } from '../context/userContext';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import aiImg from "../assets/ai.gif";
// import { CgMenuRight } from "react-icons/cg";
// import { RxCross1 } from "react-icons/rx";
// import userImg from "../assets/user.gif";

// function Home() {
//   const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);
//   const navigate = useNavigate();

//   const [listening, setListening] = useState(false);
//   const [userText, setUserText] = useState("");
//   const [aiText, setAiText] = useState("");
//   const [ham, setHam] = useState(false);

//   const isSpeakingRef = useRef(false);
//   const recognitionRef = useRef(null);
//   const isRecognizingRef = useRef(false);

//   const synth = window.speechSynthesis;

//   // ------------------ Logout ------------------
//   const handleLogOut = async () => {
//     try {
//       await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
//       setUserData(null);
//       navigate("/signin");
//     } catch (error) {
//       setUserData(null);
//       console.error(error);
//     }
//   };

//   // ------------------ Speech Synthesis ------------------
//   const speak = (text) => {
//     if (!text) return;
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = 'hi-IN';
//     const voices = window.speechSynthesis.getVoices();
//     const hindiVoice = voices.find(v => v.lang === 'hi-IN');
//     if (hindiVoice) utterance.voice = hindiVoice;

//     isSpeakingRef.current = true;

//     utterance.onend = () => {
//       setAiText("");
//       isSpeakingRef.current = false;
//       setTimeout(() => {
//         startRecognition();
//       }, 800);
//     };

//     synth.cancel();
//     synth.speak(utterance);
//   };

//   // ------------------ Commands ------------------
//   const handleCommand = (data) => {
//     const { type, userInput, response } = data;

//     speak(response);

//     const openLink = (url) => window.open(url, '_blank');

//     switch (type) {
//       case 'google-search':
//         openLink(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`);
//         break;
//       case 'calculator-open':
//         openLink(`https://www.google.com/search?q=calculator`);
//         break;
//       case 'instagram-open':
//         openLink(`https://www.instagram.com/`);
//         break;
//       case 'facebook-open':
//         openLink(`https://www.facebook.com/`);
//         break;
//       case 'weather-show':
//         openLink(`https://www.google.com/search?q=weather`);
//         break;
//       case 'youtube-search':
//       case 'youtube-play':
//         openLink(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`);
//         break;
//       default:
//         break;
//     }
//   };

//   // ------------------ Speech Recognition ------------------
//   const startRecognition = () => {
//     if (recognitionRef.current && !isSpeakingRef.current && !isRecognizingRef.current) {
//       try {
//         recognitionRef.current.start();
//         console.log("Recognition requested to start");
//       } catch (error) {
//         if (error.name !== "InvalidStateError") console.error(error);
//       }
//     }
//   };

//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       console.error("Browser does not support Speech Recognition");
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.continuous = true;
//     recognition.interimResults = false;
//     recognition.lang = 'en-US';

//     recognitionRef.current = recognition;
//     let isMounted = true;

//     recognition.onstart = () => {
//       isRecognizingRef.current = true;
//       setListening(true);
//     };

//     recognition.onend = () => {
//       isRecognizingRef.current = false;
//       setListening(false);
//       if (isMounted && !isSpeakingRef.current) {
//         setTimeout(() => startRecognition(), 1000);
//       }
//     };

//     recognition.onerror = (event) => {
//       console.warn("Recognition error:", event.error);
//       isRecognizingRef.current = false;
//       setListening(false);
//       if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
//         if (event.error === "network") {
//           console.warn("Network error, recognition stopped.");
//           recognition.stop();
//         } else {
//           setTimeout(() => startRecognition(), 1000);
//         }
//       }
//     };

//     recognition.onresult = async (event) => {
//       const transcript = event.results[event.results.length - 1][0].transcript.trim();
//       if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
//         setAiText("");
//         setUserText(transcript);
//         recognition.stop();
//         isRecognizingRef.current = false;
//         setListening(false);

//         const data = await getGeminiResponse(transcript);
//         console.log("Gemini response:", data);

//         handleCommand(data);
//         setAiText(data.response);
//         speak(data.response);
//         setUserText("");
//       }
//     };

//     // Greeting
//     const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
//     greeting.lang = 'hi-IN';
//     synth.speak(greeting);

//     // Start recognition initially
//     setTimeout(() => startRecognition(), 1000);

//     return () => {
//       isMounted = false;
//       recognition.stop();
//       setListening(false);
//       isRecognizingRef.current = false;
//     };
//   }, []);

//   // ------------------ Render ------------------
//   return (
//     <div className='w-full h-[100vh] bg-gradient-to-t from-black to-[#02023d] flex justify-center items-center flex-col gap-[15px]'>
//       <CgMenuRight className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={()=>setHam(true)}/>
//       <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham?"translate-x-0":"translate-x-full"} transition-transform`}>
//         <RxCross1 className=' text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={()=>setHam(false)}/>
//         <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px]' onClick={handleLogOut}>Log Out</button>
//         <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] px-[20px] py-[10px]' onClick={()=>navigate("/customize")}>Customize your Assistant</button>

//         <div className='w-full h-[2px] bg-gray-400'></div>
//         <h1 className='text-white font-semibold text-[19px]'>History</h1>
//         <div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate'>
//           {userData.history?.map((his, i) => (
//             <div key={i} className='text-gray-200 text-[18px] w-full h-[30px]'>{his}</div>
//           ))}
//         </div>
//       </div>

//       <button className='min-w-[150px] h-[60px] text-black font-semibold absolute hidden lg:block top-[20px] right-[20px] bg-white rounded-full cursor-pointer text-[19px]' onClick={handleLogOut}>Log Out</button>
//       <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white absolute top-[100px] right-[20px] rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] hidden lg:block' onClick={()=>navigate("/customize")}>Customize your Assistant</button>

//       <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
//         <img src={userData?.assistantImage} alt="" className='h-full object-cover'/>
//       </div>

//       <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>
//       {!aiText && <img src={userImg} alt="" className='w-[200px]'/>}
//       {aiText && <img src={aiImg} alt="" className='w-[200px]'/>}

//       <h1 className='text-white text-[18px] font-semibold text-wrap'>
//         {userText || aiText || null}
//       </h1>
//     </div>
//   );
// }

// export default Home;
// import React, { useContext, useEffect, useRef, useState } from 'react'
// import { userDataContext } from '../context/userContext'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import aiImg from "../assets/ai.gif"
// import { CgMenuRight } from "react-icons/cg";
// import { RxCross1 } from "react-icons/rx";
// import userImg from "../assets/user.gif"

// function Home() {

//   const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext)
//   const navigate = useNavigate()

//   const [listening, setListening] = useState(false)
//   const [userText, setUserText] = useState("")
//   const [aiText, setAiText] = useState("")
//   const [ham, setHam] = useState(false)

//   const [typedMessage, setTypedMessage] = useState("");   //  ⬅ NEW STATE

//   const isSpeakingRef = useRef(false)
//   const recognitionRef = useRef(null)
//   const isRecognizingRef = useRef(false)
//   const synth = window.speechSynthesis


//   // ---------------------------------------------
//   // LOGOUT
//   // ---------------------------------------------
//   const handleLogOut = async () => {
//     try {
//       const result = await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
//       setUserData(null)
//       navigate("/signin")
//     } catch (error) {
//       setUserData(null)
//       console.log(error)
//     }
//   }


//   // ---------------------------------------------
//   // START SPEECH RECOGNITION
//   // ---------------------------------------------
//   const startRecognition = () => {
//     if (!isSpeakingRef.current && !isRecognizingRef.current) {
//       try {
//         recognitionRef.current?.start();
//         console.log("Recognition requested to start");
//       } catch (error) {
//         if (error.name !== "InvalidStateError") {
//           console.error("Start error:", error);
//         }
//       }
//     }
//   }


//   // ---------------------------------------------
//   // AI SPEAK
//   // ---------------------------------------------
//   const speak = (text) => {
//     const utterence = new SpeechSynthesisUtterance(text)
//     utterence.lang = 'hi-IN';

//     const voices = window.speechSynthesis.getVoices()
//     const hindiVoice = voices.find(v => v.lang === 'hi-IN');
//     if (hindiVoice) utterence.voice = hindiVoice;

//     isSpeakingRef.current = true

//     utterence.onend = () => {
//       setAiText("");
//       isSpeakingRef.current = false;

//       setTimeout(() => {
//         startRecognition();
//       }, 800);
//     }

//     synth.cancel();
//     synth.speak(utterence);
//   }


//   // ---------------------------------------------
//   // COMMAND HANDLER
//   // ---------------------------------------------
//   const handleCommand = (data) => {
//     const { type, userInput, response } = data

//     speak(response);

//     if (type === 'google-search') {
//       window.open(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`, '_blank');
//     }

//     if (type === 'calculator-open') {
//       window.open(`https://www.google.com/search?q=calculator`, '_blank');
//     }

//     if (type === 'instagram-open') {
//       window.open(`https://www.instagram.com/`, '_blank');
//     }

//     if (type === 'facebook-open') {
//       window.open(`https://www.facebook.com/`, '_blank');
//     }

//     if (type === "weather-show") {
//       window.open(`https://www.google.com/search?q=weather`, '_blank');
//     }

//     if (type === 'youtube-search' || type === 'youtube-play') {
//       window.open(
//         `https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`,
//         '_blank'
//       );
//     }
//   };


//   // ---------------------------------------------
//   // 📌 HANDLE TYPED MESSAGE (NEW)
//   // ---------------------------------------------
//   const handleTypedSend = async () => {
//     if (!typedMessage.trim()) return;

//     recognitionRef.current?.stop();
//     isRecognizingRef.current = false;

//     setUserText(typedMessage);

//     const data = await getGeminiResponse(typedMessage);

//     handleCommand(data);
//     speak(data.response);

//     setTypedMessage("");
//   };


//   // ---------------------------------------------
//   // USE EFFECT - SPEECH RECOGNITION ENGINE
//   // ---------------------------------------------
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     const recognition = new SpeechRecognition();

//     recognition.continuous = true;
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;

//     recognitionRef.current = recognition;

//     let isMounted = true;


//     const startTimeout = setTimeout(() => {
//       if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
//         try {
//           recognition.start();
//           console.log("Recognition requested to start");
//         } catch (e) {
//           if (e.name !== "InvalidStateError") console.error(e);
//         }
//       }
//     }, 1000);


//     recognition.onstart = () => {
//       isRecognizingRef.current = true;
//       setListening(true);
//     };

//     recognition.onend = () => {
//       isRecognizingRef.current = false;
//       setListening(false);

//       if (isMounted && !isSpeakingRef.current) {
//         setTimeout(() => {
//           try {
//             recognition.start();
//             console.log("Recognition restarted");
//           } catch (e) {
//             if (e.name !== "InvalidStateError") console.error(e);
//           }
//         }, 1000);
//       }
//     };


//     recognition.onerror = (event) => {
//       console.warn("Recognition error:", event.error);

//       isRecognizingRef.current = false;
//       setListening(false);

//       if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
//         setTimeout(() => {
//           try {
//             recognition.start();
//             console.log("Recognition restarted after error");
//           } catch (e) {
//             if (e.name !== "InvalidStateError") console.error(e);
//           }
//         }, 1000);
//       }
//     };


//     recognition.onresult = async (e) => {
//       const transcript = e.results[e.results.length - 1][0].transcript.trim();

//       if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
//         setAiText("");
//         setUserText(transcript);

//         recognition.stop();
//         isRecognizingRef.current = false;
//         setListening(false);

//         const data = await getGeminiResponse(transcript);
//         console.log("Gemini response data:", data);

//         handleCommand(data);
//         setAiText(data.response);

//         speak(data.response);

//         setUserText("");
//       }
//     };


//     // First greeting
//     const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
//     greeting.lang = 'hi-IN';
//     window.speechSynthesis.speak(greeting);


//     return () => {
//       isMounted = false;
//       clearTimeout(startTimeout);
//       recognition.stop();
//       setListening(false);
//       isRecognizingRef.current = false;
//     };
//   }, []);



//   // ---------------------------------------------
//   // RENDER UI
//   // ---------------------------------------------
//   return (
//     <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-[15px]'>

//       {/* Mobile menu */}
import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import aiImg from "../assets/ai.gif"
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import { FiMic, FiPaperclip, FiImage } from "react-icons/fi";
import userImg from "../assets/user.gif"

function Home() {

  
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext)
  const navigate = useNavigate()

  const [listening, setListening] = useState(false)
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
  const [ham, setHam] = useState(false)

  // NEW: typed input state
  const [typedMessage, setTypedMessage] = useState("");
  // Pending URL to open (shown as button to bypass popup blocker)
  const [pendingUrl, setPendingUrl] = useState(null);

  // ADVANCED ML FEATURES STATES
  const [generatedImgUrl, setGeneratedImgUrl] = useState(null);
  const [summaryText, setSummaryText] = useState("");
  const [showExpenses, setShowExpenses] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [moods, setMoods] = useState([]);
  const [showMoods, setShowMoods] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Load persistence on mount
  useEffect(() => {
    const savedExp = JSON.parse(localStorage.getItem("virtual_assistant_expenses") || "[]");
    setExpenses(savedExp);
    const savedMoods = JSON.parse(localStorage.getItem("virtual_assistant_moods") || "[]");
    setMoods(savedMoods);
  }, []);

  // Real-time Audio Level for visual feedback
  const [audioLevel, setAudioLevel] = useState(0);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const streamRef = useRef(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");

  // ── TODO LIST STATE ──
  const [todos, setTodos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("virtual_assistant_todos")) || [];
    } catch {
      return [];
    }
  });
  const [showTodos, setShowTodos] = useState(false);


  const chatContainerRef = useRef(null);
  
  // Auto-scroll logic removed to allow natural full-page scrolling behavior if desired, 
  // or it can be updated to scroll the main container.
  useEffect(() => {
    if (chatContainerRef.current) {
      // Instead of scrolling the container, we let the page handle it
      // but we might want to scroll the main wrapper to the bottom
      const mainWrapper = chatContainerRef.current.closest('.overflowY-auto') || document.querySelector('.custom-scrollbar');
      if (mainWrapper) {
        mainWrapper.scrollTo({
          top: mainWrapper.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [userText, aiText]);
  const isRecognizingRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const conversationActiveRef = useRef(false);
  const activeTimerRef = useRef(null);
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;
  const canvasRef = useRef(null);


  // ---------------------------------------------
  // LOGOUT
  // ---------------------------------------------
  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      setUserData(null)
      navigate("/signin")
    } catch (error) {
      setUserData(null)
      console.log(error)
    }
  }

  const handleDeleteHistory = async () => {
    try {
      const res = await axios.delete(`${serverUrl}/api/user/history`, { withCredentials: true })
      if (res.data?.success) {
        setUserData(prev => ({ ...prev, history: [] }))
      }
    } catch (error) {
      console.error("Delete history failed:", error)
      alert("Failed to clear history. Please try again.")
    }
  }


  // ---------------------------------------------
  // START AUDIO VISUALIZER (MEDIASTREAM)
  // ---------------------------------------------
  const initAudioVisualizer = async () => {
    if (audioContextRef.current) return; // already initialized
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      const bufferLength = analyser.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      const trackLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        const sum = dataArrayRef.current.reduce((a, b) => a + b, 0);
        const avg = sum / bufferLength;
        setAudioLevel(avg);
        requestAnimationFrame(trackLevel);
      };
      trackLevel();
      console.log("Audio visualizer active.");
    } catch (e) {
      console.warn("Could not start audio visualizer:", e);
    }
  };

  const stopAudioVisualizer = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(e => console.warn("Context close error:", e));
      audioContextRef.current = null;
    }
    analyserRef.current = null; // Important: stops the trackLevel loop
    setAudioLevel(0);
    console.log("Audio visualizer stopped (resources released for Mic)");
  };

  // ---------------------------------------------
  // START SPEECH RECOGNITION
  // ---------------------------------------------
  const startRecognition = () => {
    if (isSpeakingRef.current || isRecognizingRef.current) return;
    
    // 🧊 STOP Visualizer before starting Recognition to avoid 'network' (Busy) error in Chrome
    stopAudioVisualizer();

    // ⏳ Hardware Release Delay: 
    // Wait for the OS/Browser to release the Mic source before starting Recognition
    // Increased to 1200ms for more reliability across different hardware/Brave
    setTimeout(() => {
      try {
        window.speechSynthesis.cancel();
        recognitionRef.current?.start();
        console.log("Recognition requested to start after hardware delay (1200ms)");
      } catch (error) {
        if (error.name !== "InvalidStateError") console.error("Start error:", error);
      }
    }, 1200); 
  }


  // ---------------------------------------------
  // LANGUAGE DETECTION
  // ---------------------------------------------
  const detectLang = (text) => {
    if (!text) return 'en-US';
    // Detect Devanagari (Hindi)
    if (/[\u0900-\u097F]/.test(text)) return 'hi-IN';
    // Detect Arabic/Urdu script
    if (/[\u0600-\u06FF]/.test(text)) return 'ur-PK';
    // Detect Hinglish keywords (relaxed matching for romanized Hindi)
    const hinglishWords = ['hai', 'nahi', 'kya', 'kyun', 'kaise', 'mera', 'tumhara',
      'aapka', 'mujhe', 'aur', 'bhi', 'hi', 'karo', 'karna', 'bana', 'batao',
      'main', 'hum', 'ap', 'tum', 'yeh', 'woh', 'kar', 'ek', 'sab', 'bahut',
      'accha', 'theek', 'haan', 'bolna', 'sunna', 'dekho', 'bilkul', 'zaroor',
      'kab', 'kahan', 'kitna', 'chahiye', 'milta', 'raha', 'rahi', 'ho',
      'gaya', 'gayi', 'aata', 'ata', 'bolo', 'sun', 'batana', 'karne', 'karta'];
    const words = text.toLowerCase().split(/\s+/);
    const hinglishCount = words.filter(w => hinglishWords.includes(w)).length;
    // Require at least 2 keywords to avoid false hi-IN detection
    if (hinglishCount >= 2) return 'hi-IN';
    return 'en-US';
  };


  // ---------------------------------------------
  // AI SPEAK
  // ---------------------------------------------
  const speak = (text, inputLang) => {
    const utterence = new SpeechSynthesisUtterance(text);

    // Fix for Windows Chrome TTS garbage collection bug dropping onend events
    window.utterances = window.utterances || [];
    window.utterances.push(utterence);

    // Use explicitly passed language, or detect from AI response as fallback
    let lang = inputLang || detectLang(text);
    
    // If text is purely Roman script but detected as Hindi, treat it as Hinglish (en-IN)
    // English-Indian voices often sound more natural for Romanized Hinglish than pure Hindi voices.
    const isRoman = !/[^\x00-\x7F]/.test(text);
    if (lang === 'hi-IN' && isRoman) lang = 'en-IN';
    
    utterence.lang = lang;

    const voices = window.speechSynthesis.getVoices();

    if (lang === 'hi-IN') {
      // Best Hindi voices (for Devanagari text)
      const hindiVoice = voices.find(v => v.lang === 'hi-IN')
        || voices.find(v => v.name.includes('Hindi'))
        || voices.find(v => v.lang.startsWith('hi'));
      if (hindiVoice) utterence.voice = hindiVoice;
      utterence.rate = 0.95;
    } else if (lang === 'ur-PK') {
      const urduVoice = voices.find(v => v.lang === 'ur-PK' || v.lang.startsWith('ur'));
      if (urduVoice) utterence.voice = urduVoice;
    } else if (lang === 'en-IN') {
      // Best Indian English voices for Hinglish
      const indianVoice = voices.find(v => v.lang === 'en-IN')
        || voices.find(v => v.name.includes('India'))
        || voices.find(v => v.name.includes('Google India'));
      if (indianVoice) utterence.voice = indianVoice;
      utterence.rate = 1.0;
    } else {
      // Priority list for clear, high-quality English voices on Windows/Chrome
      const premiumEnglishVoices = [
        'Google US English',
        'Google UK English Female',
        'Microsoft Zira',
        'Microsoft Aria',
        'Microsoft Jenny',
        'Microsoft Guy',
        'Microsoft Mark'
      ];

      let selectedVoice = null;
      for (const premiumName of premiumEnglishVoices) {
        selectedVoice = voices.find(v => v.name.includes(premiumName));
        if (selectedVoice) break;
      }

      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang === 'en-US' || v.lang === 'en-GB' || v.lang.startsWith('en-'));
      }
      if (selectedVoice) utterence.voice = selectedVoice;
      utterence.rate = 1.0;
    }

    // Safety: Reset isSpeakingRef if it gets stuck for too long (e.g. 20s)
    const safetyTimeout = setTimeout(() => {
      if (isSpeakingRef.current) {
        console.warn("Speech synthesis safety timeout triggered");
        isSpeakingRef.current = false;
      }
    }, 20000);

    utterence.onstart = () => {
      isSpeakingRef.current = true;
      console.log("Assistant started speaking...");
    };

    utterence.onend = () => {
      clearTimeout(safetyTimeout);
      isSpeakingRef.current = false;
      console.log("Assistant finished speaking.");
      
      // Cleanup global reference
      if (window.utterances) {
        window.utterances = window.utterances.filter(u => u !== utterence);
      }
    };

    utterence.onerror = (e) => {
      clearTimeout(safetyTimeout);
      if (e.error !== 'interrupted') {
        console.error("SpeechSynthesisUtterance error:", e);
      }
      isSpeakingRef.current = false;
      if (window.utterances) {
        window.utterances = window.utterances.filter(u => u !== utterence);
      }
    };

    try {
      // 🚀 Only cancel if actually speaking something else to prevent unnecessary interruptions
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      window.speechSynthesis.resume(); 
      window.speechSynthesis.speak(utterence);
    } catch (err) {
      console.error("Synth.speak failed:", err);
      isSpeakingRef.current = false;
      clearTimeout(safetyTimeout);
    }
  }


  // ---------------------------------------------
  // Helper: normalize/extract phone number
  // Returns E.164-ish number string (e.g. +911234567890) or null
  // ---------------------------------------------
  const extractPhoneNumber = (text) => {
    if (!text) return null;
    // find sequences of digits (10+)
    const digits = text.replace(/\D/g, '');
    if (digits.length >= 10) {
      // take last 10 digits as local number (common pattern)
      const last10 = digits.slice(-10);
      // if there is a country code (more than 10), use it
      if (digits.length === 10) {
        // assume India if 10 digits
        return `+91${last10}`;
      } else if (digits.length === 11 && digits.startsWith('0')) {
        // leading 0 removed, assume +91
        return `+91${digits.slice(-10)}`;
      } else if (digits.length === 12 && digits.startsWith('91')) {
        return `+${digits}`;
      } else if (digits.length > 10) {
        // fallback: prefix with + if there's an international code present
        return `+${digits}`;
      } else {
        return `+91${last10}`;
      }
    }
    return null;
  }


  // ---------------------------------------------
  // COMMAND HANDLER (includes calling features)
  // ---------------------------------------------
  const handleCommand = (data) => {
    const { type, userInput, response } = data || {}

    // Detect the language the user typed in — and speak in THAT language
    const userLang = detectLang(userInput || '');

    // speak the response (if any) in the user's language
    if (response) speak(response, userLang);

    // PHONE CALL (opens dialer)
    if (type === 'call-phone' || type === 'phone-call') {
      // try provided number field, else extract from userInput
      const numberFromData = data?.number || extractPhoneNumber(userInput);
      if (numberFromData) {
        // open system dialer
        window.open(`tel:${numberFromData}`, '_self');
        return;
      } else {
        console.warn("No phone number found for call.");
      }
    }

    // WHATSAPP CHAT
    if (type === 'whatsapp-chat' || type === 'whatsapp-message') {
      const numberFromData = data?.number || extractPhoneNumber(userInput);
      if (numberFromData) {
        // remove leading '+' for wa.me
        const plain = numberFromData.replace(/\+/g, '');
        window.open(`https://wa.me/${plain}`, '_blank');
        return;
      } else {
        console.warn("No phone number found for WhatsApp chat.");
      }
    }

    // WHATSAPP VOICE CALL (Android/WhatsApp handler may open)
    if (type === 'whatsapp-call') {
      const numberFromData = data?.number || extractPhoneNumber(userInput);
      if (numberFromData) {
        const plain = numberFromData.replace(/\+/g, '');
        // ?call is not an official documented parameter but some clients handle it
        window.open(`https://wa.me/${plain}?call`, '_blank');
        return;
      } else {
        console.warn("No phone number found for WhatsApp call.");
      }
    }

    // WHATSAPP VIDEO CALL
    if (type === 'whatsapp-video') {
      const numberFromData = data?.number || extractPhoneNumber(userInput);
      if (numberFromData) {
        const plain = numberFromData.replace(/\+/g, '');
        window.open(`https://wa.me/${plain}?video`, '_blank');
        return;
      } else {
        console.warn("No phone number found for WhatsApp video.");
      }
    }

    // Existing command handlers preserved
    // !!!SYSTEM DEBUG!!!
    console.log("RECOGNIZED ACTION TYPE:", type, "TARGET:", data?.actionTarget);
    
    // Clear old generated image if this is a new type of command
    if (type !== 'generate-image') {
      setGeneratedImgUrl(null);
    }

    if (type !== 'general' && type !== 'coding-helper' && type !== 'career-mentor') {
       setAiText(response);
    }

    // Helper: open URL without popup blocker (anchor click method)
    const openUrl = (url) => {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    if (type === 'google-search') {
      openUrl(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`);
    }

    if (type === 'calculator-open') {
      openUrl(`https://www.google.com/search?q=calculator`);
    }

    if (type === 'instagram-open') {
      openUrl(`https://www.instagram.com/`);
    }

    if (type === 'facebook-open') {
      openUrl(`https://www.facebook.com/`);
    }

    if (type === 'weather-show') {
      openUrl(`https://www.google.com/search?q=weather`);
    }

    if (type === 'youtube-search' || type === 'youtube-play') {
      openUrl(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`);
    }

    if (type === 'open-website') {
      const target = data?.actionTarget || userInput.replace(/^open\s+/i, '').trim();
      if (target) {
        const url = target.includes('.') ? `https://${target}` : `https://www.${target}.com`;
        openUrl(url);
      }
    }

    if (type === 'play-song') {
      const target = data?.actionTarget || userInput.replace(/^play\s+/i, '').trim();
      if (target) {
        openUrl(`https://music.youtube.com/search?q=${encodeURIComponent(target)}`);
      }
    }

    if (type === 'open-app' || type === 'automation-command') {
      const target = data?.actionTarget;
      if (target) {
        axios.post(`${serverUrl}/api/user/open-app`, { appName: target }, { withCredentials: true })
          .then(res => console.log("Opened app:", res.data))
          .catch(err => console.error("Failed to open app:", err));
      }
    }

    if (type === 'set-reminder') {
      const target = data?.actionTarget; // e.g., "check oven in 10 minutes"
      if (target) {
        // Naive extraction of minutes: find first number in the string
        const match = target.match(/\d+/);
        const minutes = match ? parseInt(match[0], 10) : 1;
        setTimeout(() => {
          const utter = new SpeechSynthesisUtterance(`Reminder: ${target}`);
          // default to system voice
          window.speechSynthesis.speak(utter);
          alert(`Reminder: ${target}`);
        }, minutes * 60 * 1000);
      }
    }

    if (type === 'expense-tracker') {
      const target = data?.actionTarget || userInput.replace('spent ', '').replace('expense ', '').trim();
      if (target) {
        const entry = { 
          item: target, 
          id: Date.now(), 
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) 
        };
        const current = JSON.parse(localStorage.getItem("virtual_assistant_expenses") || "[]");
        current.unshift(entry);
        localStorage.setItem("virtual_assistant_expenses", JSON.stringify(current));
        setExpenses(current);
        
        // AUTO-SHOW Dashboard for instant feedback
        setShowExpenses(true);
        setTimeout(() => setShowExpenses(false), 2000); 
      }
    }

    if (type === 'expense-show') {
       const current = JSON.parse(localStorage.getItem("virtual_assistant_expenses") || "[]");
       setExpenses(current);
       setShowExpenses(true);
    }

    if (type === 'expense-clear') {
       localStorage.setItem("virtual_assistant_expenses", "[]");
       setExpenses([]);
       setShowExpenses(false);
    }

    if (type === 'mood-track') {
       const mood = data?.actionTarget || userInput.replace('feeling ', '').replace('mood ', '').trim();
       if (mood) {
         const entry = {
           id: Date.now(),
           text: mood,
           date: new Date().toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })
         };
         const current = JSON.parse(localStorage.getItem("virtual_assistant_moods") || "[]");
         current.unshift(entry);
         localStorage.setItem("virtual_assistant_moods", JSON.stringify(current));
         setMoods(current);
         setShowMoods(true);
         setTimeout(() => setShowMoods(false), 3000);
       }
    }

    if (type === 'mood-show') {
       const current = JSON.parse(localStorage.getItem("virtual_assistant_moods") || "[]");
       setMoods(current);
       setShowMoods(true);
    }

    // ── TODO LIST COMMANDS ──
    if (type === 'todo-add') {
      const target = data?.actionTarget;
      if (target) {
        setTodos(prev => {
          const newTodos = [...prev, { id: Date.now(), text: target, done: false }];
          localStorage.setItem("virtual_assistant_todos", JSON.stringify(newTodos));
          return newTodos;
        });
        setShowTodos(true);
      }
    }
    if (type === 'todo-remove') {
      const target = data?.actionTarget?.toLowerCase();
      if (target) {
        setTodos(prev => {
          const newTodos = prev.filter(t => !t.text.toLowerCase().includes(target));
          localStorage.setItem("virtual_assistant_todos", JSON.stringify(newTodos));
          return newTodos;
        });
        setShowTodos(true);
      }
    }
    if (type === 'todo-show') {
      setShowTodos(true);
    }

  if (type === 'generate-image') {
    if (data.image) {
      console.log("PIPELINE: Displaying generated image from backend directly.");
      setGeneratedImgUrl(data.image);
    } else {
      console.warn("PIPELINE: No image returned from backend.");
      setGeneratedImgUrl(null);
    }
  }

    if (type === 'youtube-summary') {
      const target = data?.actionTarget;
      if (target) {
        setAiText("Fetching and summarizing YouTube video...");
        axios.post(`${serverUrl}/api/user/summarize-youtube`, { url: target }, { withCredentials: true })
          .then(res => {
            setSummaryText(res.data.response);
            speak("Here is the summary of the video.");
          })
          .catch(err => console.error(err));
      }
    }

    if (type === 'summarize-pdf' || type === 'analyze-image') {
      // If we already have a response from the AI, just show it in the summary box
      // instead of re-calling the API.
      if (data.response) {
        setSummaryText(data.response);
        return;
      }

      // Fallback for voice commands if the file is already selected but no analysis done
      if (type === 'summarize-pdf') {
        if (!pdfFile) {
          setAiText("Please select a PDF file first.");
          speak("Please select a PDF file first.");
          return;
        }
        setAiText("Summarizing the PDF...");
        const formData = new FormData();
        formData.append("pdf", pdfFile);
        axios.post(`${serverUrl}/api/user/summarize-pdf`, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        })
          .then(res => {
            setSummaryText(res.data.response);
            speak("I have finished summarizing the PDF.");
          })
          .catch(err => console.error(err));
      }

      if (type === 'analyze-image') {
        const target = data?.actionTarget;
        if (!imageFile) {
          setAiText("Please select an image file first.");
          speak("Please select an image file first.");
          return;
        }
        setAiText("Analyzing the image...");
        const formData = new FormData();
        formData.append("image", imageFile);
        if (target) {
          formData.append("prompt", target);
        }
        axios.post(`${serverUrl}/api/user/analyze-image`, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        })
          .then(res => {
            setSummaryText(res.data.response);
            speak(res.data.response);
          })
          .catch(err => console.error(err));
      }
    }
  };


  // ---------------------------------------------
  // HANDLE TYPED MESSAGE (NEW)
  // ---------------------------------------------
  const handleTypedSend = async () => {
    // If there is no typed message and no file attached, do nothing
    if (!typedMessage.trim() && !imageFile && !pdfFile) return;

    let message = typedMessage;
    // If only a file is attached, create a default prompt for Gemini to route
    if (!message.trim()) {
      if (imageFile) message = "what is in this image?";
      else if (pdfFile) message = "summarize the uploaded pdf";
    }

    // stop recognition briefly so it doesn't capture the typed text
    recognitionRef.current?.stop();
    isRecognizingRef.current = false;

    // Show the actual typed message if present, or a placeholder just for visuals
    setUserText(typedMessage.trim() ? typedMessage : (imageFile ? "Sent an image..." : "Sent a file..."));
    
    // Capture files to send (prioritize image if both present, but typically only one is shown)
    const fileToSend = imageFile || pdfFile;
    
    setTypedMessage("");

    try {
      setAiText("Thinking...");
      const userLang = detectLang(message);
      console.log("!!!DEBUG!!! Sending message:", message, "File:", fileToSend?.name, "Type:", fileToSend?.type);
      const data = await getGeminiResponse(message, fileToSend, userLang);
      console.log("Typed Gemini response full data:", data);

      if (data && data.response) {
        handleCommand(data);
        setAiText(data.response);
        speak(data.response);
        
        // Mark conversation as active for the next 30 seconds (no wake word needed for follow-up)
        conversationActiveRef.current = true;
        if (activeTimerRef.current) clearTimeout(activeTimerRef.current);
        activeTimerRef.current = setTimeout(() => { conversationActiveRef.current = false; }, 30000);
      } else {
        const errorMsg = "I'm sorry, I'm having trouble thinking right now. Please check if your API key is valid.";
        setAiText(errorMsg);
        speak(errorMsg);
      }
    } catch (err) {
      console.error("Error in handleTypedSend:", err);
      setAiText("Connection error. Is the backend running?");
    } finally {
      setImageFile(null);
      setPdfFile(null);
    }
  };


  // ---------------------------------------------
  // ---------------------------------------------
  // USE EFFECT - SPEECH RECOGNITION ENGINE
  // ---------------------------------------------
  const userDataRef = useRef(userData);
  useEffect(() => {
    userDataRef.current = userData;
  }, [userData]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();

    recognition.continuous = false;  // one-shot: more reliable, no network loop
    recognition.lang = 'en-IN'; // English India — accepts English and Hinglish voice input
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;

    let isMounted = true;

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
      console.log("Recognition started successfully");
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      console.log("Recognition ended (mic turned off gracefully)");
      
      // 🎤 RESTART Visualizer after recognition ends so the UI stays alive
      setTimeout(() => {
        if (!isRecognizingRef.current) initAudioVisualizer();
      }, 300);
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);

      if (event.error === "not-allowed") {
        alert("🎤 Microphone access is blocked. Please allow it in browser settings.");
      } else if (event.error === "network") {
        // BRAVE BROWSER SPECIAL CHECK: 
        // If on Brave, 'network' error usually means 'Google Services for Voice' is disabled.
        navigator.brave?.isBrave().then(isBrave => {
           if (isBrave) {
             setAiText("Brave detected: Please enable 'Google Services for Voice' in Brave Settings to use Mic.");
           } else {
             setAiText("Mic error: Check your internet or speak again.");
           }
        }).catch(() => {
           setAiText("Mic error: Check your internet or speak again.");
        });
        console.warn("Network error — tap mic again to retry.");
      } else if (event.error === "no-speech") {
        setAiText(""); // silent if no speech detected
      }
    };

    // Diagnostic status exposure
    window.assistantStatus = {
      get isSpeaking() { return isSpeakingRef.current },
      get isRecognizing() { return isRecognizingRef.current },
      get listening() { return listening }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();

      console.log("Heard transcript:", transcript);

      // Process EVERY voice input — no wake word needed
      setUserText(transcript);
      setAiText("Thinking...");

      recognition.stop();
      isRecognizingRef.current = false;
      setListening(false);

      // 🚀 Intent Detection: Only pre-open if the command likely needs a popup
      const navIntentKeywords = ['open', 'search', 'play', 'go to', 'youtube', 'google', 'facebook', 'instagram', 'website', 'calculator', 'weather'];
      const hasNavIntent = navIntentKeywords.some(k => transcript.toLowerCase().includes(k));
      
      let preTab = null;
      if (hasNavIntent) {
        try { 
          preTab = window.open('about:blank', '_blank'); 
          console.log("Pre-opened blank tab for potential navigation.");
        } catch(e) { 
          console.warn("Popup blocked:", e); 
        }
      }

      const userLang = detectLang(transcript);
      try {
        const data = await getGeminiResponse(transcript, null, userLang);
        if (data && data.response) {
          const urlTypes = ['google-search','youtube-search','youtube-play','instagram-open','facebook-open','weather-show','open-website','play-song','calculator-open'];
          
          if (urlTypes.includes(data.type)) {
            let destUrl = null;
            if (data.type === 'google-search') destUrl = `https://www.google.com/search?q=${encodeURIComponent(data.userInput)}`;
            else if (data.type === 'youtube-search' || data.type === 'youtube-play') destUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(data.userInput)}`;
            else if (data.type === 'instagram-open') destUrl = 'https://www.instagram.com/';
            else if (data.type === 'facebook-open') destUrl = 'https://www.facebook.com/';
            else if (data.type === 'weather-show') destUrl = 'https://www.google.com/search?q=weather';
            else if (data.type === 'calculator-open') destUrl = 'https://www.google.com/search?q=calculator';
            else if (data.type === 'play-song') destUrl = `https://music.youtube.com/search?q=${encodeURIComponent(data.actionTarget || data.userInput)}`;
            else if (data.type === 'open-website') {
              const t = data.actionTarget || data.userInput.replace(/^open\s+/i, '').trim();
              destUrl = t.includes('.') ? `https://${t}` : `https://www.${t}.com`;
            }

            let opened = false;
            if (preTab) { 
              try { 
                preTab.location.href = destUrl; 
                opened = true; 
              } catch(ie) {
                console.warn("Failed to update preTab location:", ie);
              } 
            }
            if (!opened && destUrl) setPendingUrl(destUrl);
            if (preTab && !opened) preTab.close();
          } else {
            // Not a navigation type, close the pre-opened tab if any
            if (preTab) preTab.close();
          }

          handleCommand(data);
          setAiText(data.response);
          speak(data.response, userLang);
          conversationActiveRef.current = true;
          if (activeTimerRef.current) clearTimeout(activeTimerRef.current);
          activeTimerRef.current = setTimeout(() => { conversationActiveRef.current = false; }, 30000);
        } else {
          if (preTab) preTab.close();
        }
      } catch (err) {
        if (preTab) preTab.close();
        console.error("onresult final error:", err);
      }
    };

    return () => {
      isMounted = false;
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    };
  }, []);

  // ---------------------------------------------
  // SEPARATE GREETING EFFECT (Runs only once when user data loads)
  // ---------------------------------------------
  const greetedRef = useRef(false);
  useEffect(() => {
    if (userData && !greetedRef.current) {
      setTimeout(() => {
         speak(`Hello ${userData.name || 'there'}, how can I assist you?`, 'hi-IN');
      }, 1500);
      greetedRef.current = true;
    }
  }, [userData]);

  // ---------------------------------------------
  // AURORA CANVAS BACKGROUND — WOW Edition
  // ---------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Denser Stars with brighter sparkle ────────────────────────────
    const stars = Array.from({ length: 380 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.8 + 0.2,
      base: Math.random() * 0.8 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.025 + 0.006,
    }));

    // ── Shooting stars ──────────────────────────
    const shoots = [];
    const spawnShoot = () => {
      shoots.push({
        x: Math.random() * 0.7 + 0.1,
        y: Math.random() * 0.3,
        len: Math.random() * 0.12 + 0.06,
        speed: Math.random() * 0.007 + 0.004,
        life: 1,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.4,
      });
    };

    // ── Ultra-Vivid Galaxy Nebula blobs ────────────────────────────
    const blobs = [
      { x: 0.08, y: 0.15, r: 0.65, dx: 0.00025, dy: 0.00016, color: [100, 0, 255], a: 0.42 },   // Electric Violet
      { x: 0.88, y: 0.45, r: 0.60, dx: -0.00018, dy: 0.00022, color: [230, 0, 120], a: 0.38 }, // Neon Magenta
      { x: 0.45, y: 0.88, r: 0.55, dx: 0.00020, dy: -0.00014, color: [0, 210, 255], a: 0.40 }, // Laser Cyan
      { x: 0.92, y: 0.08, r: 0.48, dx: -0.00022, dy: 0.00025, color: [180, 0, 255], a: 0.32 }, // Deep Purple
      { x: 0.25, y: 0.65, r: 0.44, dx: 0.00019, dy: -0.00023, color: [0, 255, 160], a: 0.28 }, // Vivid Teal
      { x: 0.65, y: 0.28, r: 0.40, dx: -0.00015, dy: -0.00018, color: [255, 60, 80], a: 0.25 }, // Fire Pink
      { x: 0.50, y: 0.50, r: 0.30, dx: 0.00010, dy: 0.00012, color: [80, 140, 255], a: 0.20 }, // Center Blue
    ];

    // ── Grid (diagonal for premium feel) ────────────────────────────
    const drawGrid = (W, H) => {
      const size = 70;
      ctx.strokeStyle = 'rgba(100,60,255,0.06)';
      ctx.lineWidth = 0.6;
      for (let gx = 0; gx < W; gx += size) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
      }
      for (let gy = 0; gy < H; gy += size) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
      }
    };

    let t = 0;
    let nextShoot = 60;

    const draw = () => {
      t++;
      const W = canvas.width;
      const H = canvas.height;

      // ── Rich deep-space radial base (CSS-quality gradient) ──
      const baseGrad = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.85);
      baseGrad.addColorStop(0,   '#0d0525'); // deep indigo core
      baseGrad.addColorStop(0.4, '#08031a'); // near-black
      baseGrad.addColorStop(1,   '#020010'); // pitch space edge
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, W, H);

      // ── Diagonal Aurora sweep (slow breathing light) ──
      const auroraX = (Math.sin(t * 0.003) * 0.5 + 0.5) * W;
      const aurora  = ctx.createLinearGradient(auroraX - W * 0.5, 0, auroraX + W * 0.5, H);
      aurora.addColorStop(0,   'rgba(90,0,255,0)');
      aurora.addColorStop(0.35,'rgba(90,0,255,0.07)');
      aurora.addColorStop(0.55,'rgba(200,0,140,0.07)');
      aurora.addColorStop(0.75,'rgba(0,180,255,0.05)');
      aurora.addColorStop(1,   'rgba(0,180,255,0)');
      ctx.fillStyle = aurora;
      ctx.fillRect(0, 0, W, H);

      // ── Grid ──
      drawGrid(W, H);

      // ── Nebula blobs (vivid pulsing glow) ──
      blobs.forEach(b => {
        b.x += b.dx * Math.sin(t * 0.002 + b.r);
        b.y += b.dy * Math.cos(t * 0.0018 + b.r);
        if (b.x < 0.04 || b.x > 0.96) b.dx *= -1;
        if (b.y < 0.04 || b.y > 0.96) b.dy *= -1;
        const cx = b.x * W, cy = b.y * H;
        const rad = b.r * Math.min(W, H);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        const pulse = 0.18 * Math.sin(t * 0.014 + b.r); // stronger pulse
        const [r, gr, bl] = b.color;
        g.addColorStop(0,    `rgba(${r},${gr},${bl},${Math.min(0.9, b.a + pulse)})`);
        g.addColorStop(0.35, `rgba(${r},${gr},${bl},${(b.a + pulse) * 0.5})`);
        g.addColorStop(0.7,  `rgba(${r},${gr},${bl},${(b.a + pulse) * 0.15})`);
        g.addColorStop(1,    `rgba(${r},${gr},${bl},0)`);
        ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      });

      // ── Stars (twinkle) ──
      stars.forEach(s => {
        const opacity = s.base + 0.35 * Math.sin(t * s.speed + s.phase);
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0, Math.min(1, opacity))})`;
        ctx.fill();
      });

      // ── Shooting stars ──
      if (t >= nextShoot) { spawnShoot(); nextShoot = t + 90 + Math.random() * 180; }
      for (let i = shoots.length - 1; i >= 0; i--) {
        const s = shoots[i];
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.life -= 0.018;
        if (s.life <= 0) { shoots.splice(i, 1); continue; }
        const x1 = s.x * W, y1 = s.y * H;
        const x0 = x1 - Math.cos(s.angle) * s.len * W;
        const y0 = y1 - Math.sin(s.angle) * s.len * H;
        const sg = ctx.createLinearGradient(x0, y0, x1, y1);
        sg.addColorStop(0, `rgba(255,255,255,0)`);
        sg.addColorStop(0.6, `rgba(180,220,255,${s.life * 0.6})`);
        sg.addColorStop(1, `rgba(255,255,255,${s.life})`);
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
        ctx.strokeStyle = sg; ctx.lineWidth = 1.5; ctx.stroke();
      }

      // ── Centre vignette (depth) ──
      const vg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.75);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(0.6, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,8,0.55)');
      ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);


  // ---------------------------------------------
  // RENDER UI — Premium Aesthetic
  // ---------------------------------------------
  return (
    <React.Fragment>
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Aurora Canvas Background */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />

      {/* All content sits above canvas — Scrollable container */}
      <div className="custom-scrollbar" style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', gap: '12px', overflowY: 'auto', padding: 'clamp(48px, 8vw, 60px) clamp(8px, 4vw, 20px) 100px clamp(8px, 4vw, 20px)' }}>

   {/* ── Mobile hamburger ── */}
        <CgMenuRight
          className="lg:hidden text-white/70 absolute top-5 right-5 w-6 h-6 cursor-pointer hover:text-white transition-colors"
          onClick={() => setHam(true)}
        />

        {/* ── Mobile Sidebar ── */}
        <div
          className={`va-sidebar absolute lg:hidden top-0 right-0 w-[280px] h-full p-6 flex flex-col gap-5 z-50
          ${ham ? "translate-x-0" : "translate-x-full"} transition-transform duration-300`}
        >
          <RxCross1
            className="text-white/70 absolute top-5 right-5 w-5 h-5 cursor-pointer hover:text-white transition-colors"
            onClick={() => setHam(false)}
          />
          <h2 className="text-white/90 font-semibold text-lg mt-8">Menu</h2>
          <button className="va-btn" onClick={handleLogOut}>Log Out</button>
          <button className="va-btn" onClick={() => navigate("/customize")}>Customize Assistant</button>
          <button className="va-btn" onClick={() => { setShowHelp(true); setHam(false); }}>❓ How to Use</button>
          <div className="w-full h-px bg-white/10 my-1" />

          <div className="flex justify-between items-center mt-2">
            <h3 className="text-white/60 text-sm font-medium tracking-widest uppercase">History</h3>
            {userData.history?.length > 0 && (
              <button className="text-xs text-red-500 hover:text-red-400 bg-white/5 hover:bg-white/10 px-2 py-1 rounded transition-colors" onClick={handleDeleteHistory}>Clear</button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col gap-3 custom-scrollbar">
            {userData.history?.length === 0 ? (
              <p className="text-white/30 text-sm italic">No history yet</p>
            ) : (
              userData.history?.map((his, i) => (
                <div key={i} className="text-white/60 text-sm bg-white/5 p-3 rounded-lg border border-white/5 hover:bg-white/10 hover:text-white/90 transition-all cursor-default leading-relaxed text-left w-full break-words">
                  {his}
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Desktop History Panel (Left Side) ── Premium Redesign */}
        <div className={`hidden lg:flex flex-col absolute top-6 left-6 w-[280px] xl:w-[300px] h-[calc(100vh-48px)] z-40 transition-all duration-500 origin-left ${
          showHistory ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-16 scale-95 pointer-events-none'
        }`}>
          {/* Glass card */}
          <div className="flex flex-col h-full rounded-3xl overflow-hidden shadow-2xl" style={{ background: 'rgba(8,6,30,0.75)', backdropFilter: 'blur(24px)', border: '1px solid rgba(120,80,255,0.25)' }}>
            
            {/* Header */}
            <div className="relative px-5 pt-5 pb-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg,rgba(80,0,255,0.18) 0%,rgba(200,0,180,0.12) 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base" style={{ background: 'linear-gradient(135deg,#7c3aed,#db2777)' }}>🕐</div>
                <div>
                  <h3 className="text-white font-semibold text-sm tracking-wide">Command History</h3>
                  <p className="text-white/40 text-[10px] mt-0.5">{userData?.history?.length || 0} commands</p>
                </div>
              </div>
              {userData?.history?.length > 0 && (
                <button 
                  onClick={handleDeleteHistory}
                  className="text-[10px] font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-full transition-all border border-red-500/20"
                >Clear all</button>
              )}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(120,80,255,0.3) transparent' }}>
              {!userData?.history?.length ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40">
                  <span className="text-4xl">🎙️</span>
                  <p className="text-white/60 text-xs text-center">No commands yet.<br/>Start speaking or typing!</p>
                </div>
              ) : (
                [...(userData.history)].reverse().map((his, i) => (
                  <div key={i} className="group flex items-start gap-3 p-3 rounded-2xl transition-all duration-200 cursor-default" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(120,80,255,0.12)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  >
                    <div className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-purple-300 mt-0.5" style={{ background: 'rgba(120,80,255,0.25)' }}>{userData.history.length - i}</div>
                    <p className="text-white/70 text-xs leading-relaxed break-words group-hover:text-white/95 transition-colors flex-1">{his}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── Desktop Buttons — Vertical Stack (Right Side) ── */}
        <div className='hidden lg:flex flex-col items-end gap-2 absolute top-[20px] right-[20px] z-[50]'>
          
          {/* How to Use */}
          <button 
            onClick={() => setShowHelp(true)}
            title="How to Use"
            className='flex items-center gap-2 pl-3 pr-4 h-9 text-sm text-white/80 font-medium bg-white/8 border border-white/15 rounded-full hover:bg-purple-500/20 hover:border-purple-400/40 hover:text-white hover:scale-105 transition-all shadow-lg backdrop-blur-md'
          >
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white/10 font-bold text-xs">❓</span>
            How to Use
          </button>

          {/* History Toggle */}
          <button 
            onClick={() => setShowHistory(prev => !prev)}
            className={`flex items-center gap-2 pl-3 pr-4 h-9 text-sm font-medium border rounded-full hover:scale-105 transition-all shadow-lg backdrop-blur-md ${
              showHistory 
                ? 'text-blue-300 bg-blue-600/30 border-blue-400/50 hover:bg-blue-600/40' 
                : 'text-white/80 border-white/15 bg-white/8 hover:bg-white/15 hover:text-white'
            }`}
          >
            <span className="text-base">🗓</span>
            {showHistory ? 'Hide History' : 'History'}
          </button>

          {/* Log Out */}
          <button 
            onClick={handleLogOut}
            className='flex items-center gap-2 pl-3 pr-4 h-9 text-sm text-white/80 font-medium bg-white/8 border border-white/15 rounded-full hover:bg-red-500/20 hover:border-red-400/40 hover:text-white hover:scale-105 transition-all shadow-lg backdrop-blur-md'
          >
            <span className="text-base">🚪</span>
            Log Out
          </button>

          {/* Customize */}
          <button 
            onClick={() => navigate("/customize")}
            className='flex items-center gap-2 pl-3 pr-4 h-9 text-sm text-white/80 font-medium bg-white/8 border border-white/15 rounded-full hover:bg-indigo-500/20 hover:border-indigo-400/40 hover:text-white hover:scale-105 transition-all shadow-lg backdrop-blur-md'
          >
            <span className="text-base">✨</span>
            Customize
          </button>
        </div>

        {/* ── Assistant Glass Card ── */}
        <div className="va-card">
          <img src={userData?.assistantImage} alt="Assistant" className="w-full h-full object-cover" />
        </div>

        {/* ── Assistant Name ── */}
        <p className="va-name">I'm {userData?.assistantName}</p>

        {/* ── Listening indicator (no bubble) ── */}
        {listening ? (
          <div className="va-status">
            <span className="va-status-dot" />
            <span>Listening…</span>
          </div>
        ) : (
          <div className="va-status" style={{ opacity: 0.4 }}>
            <span className="va-status-dot" style={{ background: '#94a3b8', animationPlayState: 'paused' }} />
            <span>Ready</span>
          </div>
        )}

        {/* ── GIF indicator (Now Reactive Audio Wave) ── */}
        {!aiText && (
          <div className="relative flex items-center justify-center">
            <img 
               src={userImg} 
               alt="user" 
               className="w-[110px] sm:w-[140px] opacity-90 transition-transform duration-75" 
               style={{ transform: `scale(${1 + (audioLevel / 400)})` }} 
            />
            {/* Real-time Frequency Pulse */}
            {listening && (
               <div className="absolute inset-x-0 bottom-[-10px] flex items-center justify-center gap-1.5 h-12 pointer-events-none">
                 {[...Array(6)].map((_, i) => (
                   <div 
                      key={i} 
                      className="bg-blue-400 w-1.5 rounded-full transition-all duration-75 shadow-[0_0_15px_rgba(96,165,250,0.6)]" 
                      style={{ 
                        height: `${Math.max(6, audioLevel * (0.4 + Math.random() * 0.8))}px`,
                        opacity: 0.5 + (audioLevel / 255)
                      }} 
                   />
                 ))}
               </div>
            )}
          </div>
        )}
        {aiText && <img src={aiImg} alt="ai" className="w-[110px] sm:w-[140px] opacity-90" />}

        {/* ── Live text bubbles ── */}
        <div className="va-chat-container" ref={chatContainerRef}>
          {userText && (
            <div className="va-bubble !bg-black/40 !border-white/10 !text-white/90 self-end ml-auto text-right">{userText}</div>
          )}
          {aiText && (
            <div className="va-bubble !bg-blue-500/20 !border-blue-400/30 !text-white self-start mr-auto text-left">{aiText}</div>
          )}
          {/* Pending URL open button — shown when popup was blocked */}
          {pendingUrl && (
            <div className="self-center mt-2">
              <a
                href={pendingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setPendingUrl(null)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-500/30 border border-blue-400/50 text-blue-200 text-sm font-semibold hover:bg-blue-500/50 transition-all shadow-[0_0_20px_rgba(96,165,250,0.3)] animate-pulse"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                Tap to Open
              </a>
            </div>
          )}
        </div>
        

        {/* ── FILE PREVIEWS (Show above input bar if attached) ── */}
        <div className="w-[min(500px,92vw)] flex gap-2 mb-[-10px] z-10 px-2 mt-2">
          {pdfFile && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-lg text-xs text-white/90">
              <FiPaperclip className="text-blue-400" size={14} />
              <span className="truncate max-w-[100px]">{pdfFile.name}</span>
              <button onClick={() => setPdfFile(null)} className="hover:text-red-400 ml-1"><RxCross1 size={12} /></button>
            </div>
          )}
          {imageFile && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-lg text-xs text-white/90">
              <FiImage className="text-purple-400" size={14} />
              <span className="truncate max-w-[100px]">{imageFile.name}</span>
              <button onClick={() => setImageFile(null)} className="hover:text-red-400 ml-1"><RxCross1 size={12} /></button>
            </div>
          )}
        </div>


        {/* ── Input bar ── */}
        <div className="va-input-bar mt-1">

          {/* ChatGPT-style attach buttons */}
          <div className="flex items-center gap-1 text-white/50 shrink-0">
            <label className="cursor-pointer p-2 rounded-full hover:bg-white/10 hover:text-white transition-all flex items-center justify-center shadow-sm" title="Attach PDF">
              <FiPaperclip size={18} />
              <input type="file" accept="application/pdf" className="hidden" onChange={(e) => setPdfFile(e.target.files[0])} />
            </label>
            <label className="cursor-pointer p-2 rounded-full hover:bg-white/10 hover:text-white transition-all flex items-center justify-center mr-1 shadow-sm" title="Attach Image">
              <FiImage size={18} />
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files[0])} />
            </label>
          </div>

          <div className={`va-mic-wrapper ${listening ? 'listening' : 'idle'} mr-1`}>
            <button
              className={`va-mic-btn ${listening ? 'listening' : 'idle'}`}
              onClick={() => {
                if (listening) {
                  recognitionRef.current?.stop();
                  setListening(false);
                } else {
                  startRecognition();
                }
              }}
              title={listening ? "Listening..." : "Click to speak"}
            >
              <FiMic />
            </button>
          </div>

          <input
            type="text"
            value={typedMessage}
            onChange={(e) => setTypedMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTypedSend()}
            placeholder="Ask something…"
          />

          {/* Send button */}
          <button className="va-send-btn flex items-center justify-center p-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors" onClick={handleTypedSend}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>

        {/* ── ADVANCED ML OUTPUTS ── */}
        {(generatedImgUrl || showTodos || summaryText) && (
          <div className="flex flex-col gap-4 w-11/12 max-w-2xl mb-6 items-center z-10">
            {showTodos && (
              <div className="p-5 va-glass rounded-2xl w-full max-w-lg max-h-[350px] overflow-y-auto">
                <div className="flex justify-between items-center mb-4 sticky top-0 pb-2 border-b border-white/10 z-10 bg-black/20 backdrop-blur-md">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <span className="text-blue-400">✓</span> My Tasks
                  </h3>
                  <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors px-2 py-1 rounded hover:bg-white/5" onClick={() => setShowTodos(false)}>Close</button>
                </div>
                {todos.length === 0 ? (
                  <p className="text-white/40 text-sm text-center py-4 italic">No tasks. Tell me to "add buy milk to my todolist".</p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {todos.map(todo => (
                      <li key={todo.id} className="text-white/80 text-sm flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                        <span>{todo.text}</span>
                        <button 
                          onClick={() => {
                             setTodos(prev => {
                               const updated = prev.filter(t => t.id !== todo.id);
                               localStorage.setItem("virtual_assistant_todos", JSON.stringify(updated));
                               return updated;
                             });
                          }}
                          className="opacity-0 group-hover:opacity-100 text-xs text-red-400 hover:text-red-300 transition-opacity"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {generatedImgUrl && (
              <div className="p-4 va-glass rounded-2xl flex flex-col items-center w-full max-w-[480px]">
                <div className="w-full flex justify-between items-center mb-3 px-1">
                  <h3 className="text-white/90 font-medium text-sm flex items-center gap-2">
                    <span className="text-purple-400 text-lg">✨</span> Generated Image
                  </h3>
                  <div className="flex items-center gap-2">
                    <button 
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 flex items-center gap-1 font-medium shadow-sm"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = generatedImgUrl;
                        link.download = `AI_Generated_${Date.now()}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      title="Download Image"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      Download
                    </button>
                    <button className="text-xs text-purple-400 hover:text-purple-300 transition-colors px-2 py-1.5 rounded hover:bg-white/5 font-medium" onClick={() => setGeneratedImgUrl(null)}>Close</button>
                  </div>
                </div>
                <div className="relative w-full flex items-center justify-center min-h-[250px] rounded-xl overflow-hidden bg-black/40 border border-white/5 shadow-inner">
                  <div id="img-spinner" className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                    <span className="text-white/40 text-xs">Bringing imagination to life…</span>
                  </div>
                  <img
                    src={generatedImgUrl}
                    key={generatedImgUrl}
                    alt="AI Generated"
                    className="w-full h-auto object-contain rounded-xl"
                    style={{ opacity: 0, transition: 'opacity 0.6s ease-out' }}
                    onLoad={(e) => {
                      e.target.style.opacity = 1;
                      const spinner = document.getElementById('img-spinner');
                      if (spinner) spinner.style.display = 'none';
                    }}
                    onError={(e) => {
                      const spinner = document.getElementById('img-spinner');
                      if (spinner) {
                        spinner.style.display = 'flex';
                        spinner.innerHTML = '<span style="color:rgba(255,255,255,0.4);font-size:12px;padding:12px;text-align:center;line-height:1.5">Image generation timed out or was blocked. <br/> Please try a shorter or different prompt!</span>';
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {summaryText && (
              <div className="p-5 va-glass rounded-2xl w-full max-w-lg max-h-[350px] overflow-y-auto">
                <div className="flex justify-between items-center mb-2 sticky top-0 pb-2 z-10 border-b border-white/10 bg-black/20 backdrop-blur-md">
                  <h3 className="text-white font-medium">Analysis / Summary</h3>
                  <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors px-2 py-1 rounded hover:bg-white/5" onClick={() => setSummaryText("")}>Close</button>
                </div>
                <p className="text-white/80 whitespace-pre-wrap text-sm leading-relaxed">{summaryText}</p>
              </div>
            )}
          </div>
        )}

        {/* --- EXPENSE DASHBOARD MODAL --- */}
        {showExpenses && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="va-glass w-full max-w-[500px] max-h-[85vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              {/* Header */}
              <div className="p-6 pb-2 flex items-center justify-between border-b border-white/10">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <span className="p-2 bg-blue-500/20 rounded-xl text-blue-400">📊</span>
                    Expense Tracker
                  </h3>
                  <p className="text-white/50 text-xs mt-1">Your recent spending history</p>
                </div>
                <button 
                  onClick={() => setShowExpenses(false)}
                  className="p-2 hover:bg-white/10 rounded-full text-white/50 transition-all"
                >
                  <RxCross1 size={20} />
                </button>
              </div>

              {/* List Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {expenses.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center opacity-50">
                    <div className="text-5xl mb-4">📉</div>
                    <p className="text-white text-lg font-medium">No expenses yet</p>
                    <p className="text-white/60 text-sm mt-1">Tell me "Spent 500 on dinner"</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-3">
                      {expenses.map((ex, idx) => (
                        <div key={ex.id || idx} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/10 group transition-all">
                          <div className="flex flex-col">
                            <span className="text-white/90 font-medium">{ex.item}</span>
                            <span className="text-white/40 text-[10px] uppercase font-bold tracking-wider">{ex.date}</span>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-red-400/10 text-red-400 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all" 
                               onClick={() => {
                                 const updated = expenses.filter((_, i) => i !== idx);
                                 setExpenses(updated);
                                 localStorage.setItem("virtual_assistant_expenses", JSON.stringify(updated));
                               }}>
                            <RxCross1 size={12} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              {/* Total Footer */}
              {expenses.length > 0 && (
                <div className="p-6 bg-gradient-to-t from-blue-600/20 to-transparent border-t border-white/10">
                   <div className="flex items-center justify-between">
                      <span className="text-white/60 font-medium">Monthly Total Estimated</span>
                      <span className="text-2xl font-black text-blue-400 tracking-tighter">
                         ₹ {expenses.reduce((sum, e) => {
                            const val = e.item.match(/\d+/);
                            return sum + (val ? parseInt(val[0]) : 0);
                         }, 0).toLocaleString()}
                      </span>
                   </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* --- MENTAL HEALTH / MOOD MODAL --- */}
        {showMoods && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="va-glass w-full max-w-[480px] max-h-[85vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/20">
              {/* Wellness Header */}
              <div className="p-6 pb-2 flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <span className="p-2 bg-purple-500/20 rounded-xl text-purple-400">🧘‍♀️</span>
                    Mood Journey
                  </h3>
                  <p className="text-white/50 text-xs mt-1">Your emotional well-being timeline</p>
                </div>
                <button 
                  onClick={() => setShowMoods(false)}
                  className="p-2 hover:bg-white/10 rounded-full text-white/50 transition-all"
                >
                  <RxCross1 size={20} />
                </button>
              </div>

              {/* Mood Feed */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {moods.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center opacity-50">
                    <div className="text-5xl mb-4">🌈</div>
                    <p className="text-white text-lg font-medium">Clear mind, no logs yet</p>
                    <p className="text-white/60 text-sm mt-1">Say "I am feeling happy" to track</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {moods.map((m, idx) => {
                       const moodIcon = (str) => {
                          const s = str.toLowerCase();
                          if (s.includes('happy') || s.includes('good') || s.includes('great')) return "😊";
                          if (s.includes('sad') || s.includes('low') || s.includes('bad')) return "😢";
                          if (s.includes('angry') || s.includes('mad')) return "😠";
                          if (s.includes('tired') || s.includes('sleepy')) return "😴";
                          if (s.includes('stress') || s.includes('anxiety')) return "😰";
                          if (s.includes('productive') || s.includes('focus')) return "🚀";
                          return "🧘";
                       };
                       return (
                         <div key={m.id || idx} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-all transform hover:scale-[1.01]">
                           <span className="text-2xl">{moodIcon(m.text)}</span>
                           <div className="flex flex-col">
                             <span className="text-white/90 font-medium capitalize">{m.text}</span>
                             <span className="text-white/30 text-[10px] uppercase font-bold">{m.date}</span>
                           </div>
                         </div>
                       );
                    })}
                  </div>
                )}
              </div>

              {/* Action Suggestion */}
              {moods.length > 0 && (
                 <div className="p-6 bg-gradient-to-t from-purple-600/10 to-transparent border-t border-white/10">
                    <p className="text-white/60 text-xs italic text-center">
                       "Take a deep breath. You are doing great."
                    </p>
                 </div>
              )}
            </div>
          </div>
        )}

        {/* --- HELP / HOW TO USE MODAL --- */}
        {showHelp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="va-glass w-full max-w-[600px] max-h-[85vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-black/40 relative">
              
              {/* Animated Header */}
              <div className="p-6 relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-indigo-900/40">
                <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-blue-500/30 rounded-full blur-[40px]"></div>
                <div className="absolute bottom-[-50px] right-[-50px] w-32 h-32 bg-purple-500/30 rounded-full blur-[40px]"></div>
                
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 tabular-nums tracking-wide flex items-center gap-3 relative z-10">
                  <span className="text-3xl">✨</span> How to Use Assistant
                </h2>
                <p className="text-white/60 text-sm mt-1 relative z-10">Try saying or typing these commands</p>
                <button 
                  onClick={() => setShowHelp(false)}
                  className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-all z-20"
                >
                  <RxCross1 />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
                
                <div className="flex flex-col gap-2">
                  <h3 className="text-white font-semibold text-lg flex items-center gap-2 border-b border-white/10 pb-2">
                    <span className="text-amber-400">🎨</span> Multimedia & Vision
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <div className="bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors">
                      <p className="text-white/40 text-xs mb-1">Generate Artwork</p>
                      <p className="text-white/90 font-medium">"generate a photo of space"</p>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors">
                      <p className="text-white/40 text-xs mb-1">Music via YouTube</p>
                      <p className="text-white/90 font-medium">"play shape of you"</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-white font-semibold text-lg flex items-center gap-2 border-b border-white/10 pb-2">
                    <span className="text-emerald-400">📝</span> Productivity
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <div className="bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors">
                      <p className="text-white/40 text-xs mb-1">Manage Tasks</p>
                      <p className="text-white/90 font-medium">"add buy milk to todolist"</p>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors">
                      <p className="text-white/40 text-xs mb-1">Track Spending</p>
                      <p className="text-white/90 font-medium">"I spent 500 on lunch"</p>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors">
                      <p className="text-white/40 text-xs mb-1">Open Apps</p>
                      <p className="text-white/90 font-medium">"open calculator"</p>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors">
                      <p className="text-white/40 text-xs mb-1">Summarize Files</p>
                      <p className="text-white/90 font-medium">"summarize this pdf"</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-white font-semibold text-lg flex items-center gap-2 border-b border-white/10 pb-2">
                    <span className="text-pink-400">🧠</span> Memory & Chat
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <div className="bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors">
                      <p className="text-white/40 text-xs mb-1">Personalize Assistant</p>
                      <p className="text-white/90 font-medium">"remember I like pizza"</p>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors">
                      <p className="text-white/40 text-xs mb-1">Daily Planning</p>
                      <p className="text-white/90 font-medium">"give me my daily briefing"</p>
                    </div>
                  </div>
                </div>

              </div>
              
              <div className="p-4 border-t border-white/10 bg-black/20 text-center">
                <button 
                  onClick={() => setShowHelp(false)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-blue-500/25"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
    </React.Fragment>
  );
}

export default Home;
