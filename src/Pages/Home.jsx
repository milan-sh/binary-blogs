import React, { useState, useEffect } from "react";
import service from "../appwrite/config";
import { Container, PostCard } from "../components/index";
import { useSelector } from "react-redux";

function Home() {
  const [posts, setPosts] = useState([]);
  const [userStatus, setUserStatus] = useState(false);
  const authStatus = useSelector((state)=> state.auth.status)

  useEffect(()=>{
    // console.log(authStatus)
    if(authStatus) setUserStatus(true)
    else setUserStatus(false)
  }, [authStatus])

  
  useEffect(() => {
    service.getPosts().then((posts) => {
      if (posts) {
        setPosts(posts.documents);
      }
    });

  }, []);

  if (posts.length === 0 && !userStatus) {
    return (
      <div className="w-full border-blue-500 py-8 text-center ">
        <h1 className="text-black font-semibold text-2xl md:text-4xl">
          Login to read and create Posts
        </h1>
      </div>
    );  
  }
  if (userStatus && posts.length===0) {
    return (
      <div className="w-full border-blue-500 py-8 text-center ">
        <h1 className="text-black font-semibold text-2xl md:text-4xl">
          No post available....
        </h1>
      </div>
    );
  }

  return (
    <div className="py-8 w-full test flex justify-start">
      <Container>
        <div className="flex w-full flex-wrap justify-start gap-5">
          {posts.map((post) => {
            return (
              <div key={post.$id} className="md:w-[30%] w-full  h-full">
                <PostCard {...post} />
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}

export default Home;
