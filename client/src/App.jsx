import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Header from "./components/Header";
import FooterCom from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import { useSelector } from "react-redux";
import PrivateRouteCreator from "./components/PrivateRouteCreator";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import Post from "./pages/Post";
import GoToTop from "./components/GoToTop";
import Search from "./pages/Search";

const App = () => {

  const {theme} = useSelector(state => state.theme);

  return (
    <BrowserRouter>
    <GoToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<PrivateRouteCreator />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/search" element={<Search />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/post/:postId" element={<Post />} />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme= {theme === 'dark' ? 'dark' : "light"}
      />
      <FooterCom />
    </BrowserRouter>
  );
};

export default App;
