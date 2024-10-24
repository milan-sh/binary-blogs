import React, { useState, useEffect } from "react";
import { Container, PostCard } from "../components/index";
import service from "../appwrite/config";

function AllPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await service.getPosts([]);
        if (postsData) {
          setPosts(postsData.documents);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <div className=" w-full">
        <div className=" w-full flex md:flex-row flex-col justify-start gap-6">
          {posts.map((post) => (
            <div
              key={post.$id}
              className="md:w-1/3  h-full"
            >
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default AllPosts;