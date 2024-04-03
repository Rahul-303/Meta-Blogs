import { Button, Textarea } from "flowbite-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

const Comment = (props) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const commentData = {
      content: comment,
      postId: props.postId,
      userId: currentUser._id,
    };

    try {
      const res = await axios.post(`/api/comment/create`, commentData, config);
      setComment("");
      setError(null);
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as : </p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt=""
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-teal-500 my-5 flex gap-1">
          You must sign in to comment
          <Link to={"/sign-in"} className="text-blue-500 hover:underline">
            Sign In{" "}
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-tl-xl rounded-bl-none rounded-tr-none rounded-br-xl p-3"
        >
          <Textarea
            placeholder="Add a comment..."
            rows={3}
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5 ">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
        </form>
      )}
      {error && <span className=" text-red-700">{error}</span>}
    </div>
  );
};

export default Comment;