import React, { useContext, useState } from "react";
import bg from "../assets/authBg.png";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import axios from "axios";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const { serverUrl, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        {
          withCredentials: true, // 🔥 IMPORTANT (COOKIE ENABLE)
        }
      );

      // backend returns user object
      setUserData(result.data.user);

      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);

      setLoading(false);
      setUserData(null);

      setErr(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div
      className="w-full h-[100vh] bg-cover flex justify-center items-center overflow-auto py-8"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleSignIn}
        className="w-[90%] min-h-[500px] py-[40px] max-w-[450px] bg-black/40 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center gap-[20px] px-[20px] rounded-3xl border border-white/10"
      >
        <h1 className="text-white text-[24px] sm:text-[30px] font-semibold mb-[20px] sm:mb-[30px] text-center">
          Sign In to{" "}
          <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] rounded-full text-[18px]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* PASSWORD */}
        <div className="w-full h-[60px] border-2 border-white rounded-full relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full h-full bg-transparent text-white px-[20px] rounded-full outline-none placeholder-gray-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {!showPassword ? (
            <IoEye
              className="absolute right-5 top-4 text-white text-2xl cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          ) : (
            <IoEyeOff
              className="absolute right-5 top-4 text-white text-2xl cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          )}
        </div>

        {/* ERROR */}
        {err && (
          <p className="text-red-500 text-[16px]">*{err}</p>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-[150px] h-[60px] bg-white text-black font-semibold rounded-full"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>

        {/* SIGNUP LINK */}
        <p
          className="text-white cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Don’t have an account?{" "}
          <span className="text-blue-400">Sign Up</span>
        </p>
      </form>
    </div>
  );
}

export default SignIn;