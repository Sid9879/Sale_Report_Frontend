import { loginUser } from "@/store/UserSlice";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const [email, setemail] = useState();
  const [password, setpassword] = useState();

  let dispatch = useDispatch();

  let navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [transform, setTransform] = useState("rotateY(0deg) rotateX(0deg)");

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  };

  const handleMouseLeave = () => {
    setTransform("rotateX(0deg) rotateY(0deg)");
  };

  useEffect(() => {
    const canvas = document.getElementById("stars");
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const numStars = 150;
    const stars = [];

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5,
        velocity: Math.random() * 0.3 + 0.05,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "white";
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
        ctx.fill();

        star.y -= star.velocity;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }
      });
      requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    });
  }, []);
  const submit = async (e) => {
    e.preventDefault();
    try {
      let res = await axios.post(
        `https://sale-report.onrender.com/user/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      // console.log(res)
      if (res.data?.success) {
        toast(res.data?.msg || "login successfully");
        setpassword("");
        setemail("");
        navigate("/");
        dispatch(loginUser(res.data.user));
      }
    } catch (error) {
      console.log(error);
      toast(error.response?.data?.error||error.response?.data?.msg || "Login failed");
    }
  };
  return (
    <>
      <style>{`
        body {
          margin: 0;
          padding: 0;
          display: flex;
  justify-content: center;  
  align-items: center;      
  height: 100vh;           
  width: 100vw;             
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  overflow: hidden;

        }
        .background {
          background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
          min-height: 100vh;
          width: 90vw;
          // overflow: hidden;
          position: relative;
          overflow-y: auto;
        }
        .floating-border {
          position: absolute;
          inset: -2px;
          border: 2px solid;
          border-image: linear-gradient(45deg, #ff00cc, #3333ff, #00ffcc, #ffcc00) 1;
          border-radius: 1rem;
          pointer-events: none;
          animation: borderAnimation 6s linear infinite;
        }
        @keyframes borderAnimation {
          0% { border-image-source: linear-gradient(45deg, #ff00cc, #3333ff, #00ffcc, #ffcc00); }
          25% { border-image-source: linear-gradient(90deg, #3333ff, #00ffcc, #ffcc00, #ff00cc); }
          50% { border-image-source: linear-gradient(135deg, #00ffcc, #ffcc00, #ff00cc, #3333ff); }
          75% { border-image-source: linear-gradient(180deg, #ffcc00, #ff00cc, #3333ff, #00ffcc); }
          100% { border-image-source: linear-gradient(225deg, #ff00cc, #3333ff, #00ffcc, #ffcc00); }
        }
        .gloss {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0.2),
            transparent 40%
          );
          animation: shineMove 10s linear infinite;
          pointer-events: none;
          border-radius: inherit;
        }
        @keyframes shineMove {
          0% { transform: translate(0%, 0%) rotate(0deg); }
          100% { transform: translate(0%, 0%) rotate(360deg); }
        }
        .breathe {
          animation: breatheGlow 6s ease-in-out infinite;
        }
        // @keyframes breatheGlow {
        //   0%, 100% {
        //     box-shadow: 0 0 15px 3px rgba(255, 0, 255, 0.4),
        //                 0 0 30px 5px rgba(0, 255, 255, 0.4);
        //   }
        //   50% {
        //     box-shadow: 0 0 30px 10px rgba(255, 0, 255, 0.7),
        //                 0 0 50px 15px rgba(0, 255, 255, 0.7);
        //   }
        // }
      `}</style>

      <div className="background flex items-center justify-center relative">
        <canvas
          id="stars"
          className="absolute top-0 left-0 w-full h-full"
        ></canvas>

        <div className="perspective relative z-10 flex justify-center">
          <div
            className="card3D relative bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 w-[90vw] max-w-md overflow-hidden breathe"
            style={{ transform }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="floating-border"></div>
            <div className="gloss"></div>

            <h2 className="text-3xl font-bold text-white text-center mb-6">
              Welcome Back
            </h2>
            <form>
              <div className="mb-4">
                <label className="block text-white mb-1">Email</label>
                <input
                  onChange={(e) => setemail(e.target.value)}
                  value={email || ""}
                  type="email"
                  className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="mb-4 relative">
                <label className="block text-white mb-1">Password</label>
                <input
                  onChange={(e) => setpassword(e.target.value)}
                  value={password || ""}
                  type={showPassword ? "text" : "password"}
                  className="w-full p-3 pr-10 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute top-9 right-3 text-white/70 hover:text-white focus:outline-none"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <button
                type="submit"
                onClick={submit}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition duration-300"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
