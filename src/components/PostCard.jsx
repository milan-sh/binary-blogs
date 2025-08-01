import React from "react";
import { Link } from "react-router-dom";
import service from "../appwrite/config";
import parse from 'html-react-parser'

function PostCard({ $id, title, featuredImage, content }) {
  return (
    //using link so anyone click on the card directly can go to that page post

    <Link to={`/post/${$id}`}>
      <div className="postCard border-[1px] border-gray-600 rounded-lg pb-4 min-h-full">
        {/* will get src from appwriteservice getFilePreview, which needs an id that id will be faturedImage  */}
        <img
          className="rounded-t-lg md:h-[40vh] md:object-cover  md:object-top w-full"
          src={service.getFilePreview(featuredImage)}
          alt={title}
        />

        <div className="min-h-[15vh] flex flex-col items-start justify-start p-3">
          <h1 className="font-semibold text-2xl mb-2">{title?.toUpperCase()}</h1>
          <div className="flex items-center gap-8">
            {/* <p className="text-[#0029FF] font-semibold">Author: {} </p>
            <p className="text-gray-600 ">0 min ago</p> */}
          </div>
          <div className="font-semibold flex text-gray-700">{parse(`${content.substring(0, 80)}...`)}</div>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
