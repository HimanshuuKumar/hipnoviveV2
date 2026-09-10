import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const togglePass = () => {
    setShowPassword(!showPassword);
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://hipnovivev2.onrender.com/user/login",
        {
          email,
          password,
        },
      );
      console.log(res.data);
      localStorage.setItem("token", res.data.token);
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message);
    }
  };
  return (
    <>
      <div className="mx-auto max-w-2xl">
        <h1 className="font-bold text-2xl text-zinc-800 mb-5">Login</h1>
        <form className="space-y-5" onSubmit={loginHandler}>
          <div>
            <label htmlFor="email" className="font-semibold text-sm block mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 outline-none rounded-lg border border-zinc-400 focus:border-violet-700"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="font-semibold text-sm block mb-2"
            >
              Password
            </label>
            <div className="w-[100%] relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 outline-none rounded-lg border border-zinc-400 focus:border-violet-700"
              />
              <button
                type="button"
                className="absolute right-2 top-[30%] border-none bg-none cursor-pointer"
                onClick={togglePass}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <input
            type="submit"
            value={"login"}
            className="w-full text-sm font-medium text-white bg-violet-500 px-3 py-2 sm:px-4 sm:py-3 hover:bg-violet-700 rounded-lg cursor-pointer block"
          />
          <span className="block text-center text-sm text-zinc-500 ">
            New Here?{" "}
            <Link to={"/signup"} className="font-medium text-zinc-700">
              Signup
            </Link>
          </span>
        </form>
      </div>
    </>
  );
};

export default Login;
