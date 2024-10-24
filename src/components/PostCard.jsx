import React from "react";
import { Link } from "react-router-dom";
import service from "../appwrite/config";

function PostCard({ $id, title, featuredImage }) {
  return (
    //using link so anyone click on the card directly can go to that page post

    <Link to={`/post/${$id}`}>
      <div className="postCard border-2  border-gray-600 rounded-lg pb-4 flex flex-col justify-between items-center gap-3 ">
        {/* will get src from appwriteservice getFilePreview, which needs an id that id will be faturedImage  */}
        <img
          className="rounded-t-lg md:h-[50vh] md:object-cover  md:object-top w-full"
          src={service.getFilePreview(featuredImage)}
          alt={title}
        />

        <h1 className="font-bold text-xl text-center">{title}</h1>
      </div>
    </Link>
  );
}

export default PostCard;
