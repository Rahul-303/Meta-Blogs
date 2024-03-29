import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleKeyPress1 = (event) => {
    if (event.key === 'Enter') {
      emailRef.current.focus();
    }
  };

  const handleKeyPress2 = (event) => {
    if (event.key === 'Enter') {
      passwordRef.current.focus();
    }
  };

  const HandleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all the fields!");
    }
    const config = {
      headers: { "Contet-Type": "application/json" },
    };
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await axios.post(
        `/api/auth/signup`,
        formData,
        config
      );
      //setFormData({});
      toast.success(res.data.message);
      navigate("/sign-in");
      setLoading(false);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-green-400 via-cyan-600 to-blue-500 rounded-lg text-white">
              META
            </span>
            Blogs
          </Link>
          <p className="text-sm mt-5">
            sign up to add your meta posts in META Blogs
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="your username" />
              <TextInput
                type="text"
                placeholder="username"
                id="username"
                onChange={HandleChange}
                autoFocus
                onKeyDown={handleKeyPress1}
                ref={usernameRef}
              />
            </div>
            <div>
              <Label value="your email" />
              <TextInput
                type="email"
                placeholder="name@email.com"
                id="email"
                onChange={HandleChange}
                onKeyDown={handleKeyPress2}
                ref={emailRef}
              />
            </div>
            <div>
              <Label value="your password" />
              <div className="mt-1 relative">
                <TextInput
                  type={visible ? "text" : "password"}
                  placeholder="*******"
                  id="password"
                  onChange={HandleChange}
                  ref={passwordRef}
                />
                {
                visible ? (
                  <AiOutlineEye
                    className="absolute right-2 top-2 cursor-pointer"
                    size={25}
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-2 top-2 cursor-pointer"
                    size={25}
                    onClick={() => setVisible(true)}
                  />
                )
              }
              </div>
            </div>
            <Button
              gradientDuoTone="greenToBlue"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>
          <div className="text-md self-center">
            <p className="text-red-700 mt-5">{errorMessage && <>{errorMessage}</>}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
