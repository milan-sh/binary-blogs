import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import service from "../appwrite/config";
import { Button, Container } from "../components/index";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import {formateDate} from "../utils/dateFormatter.js"

function Post() {
  const [post, setPost] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);

  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  // console.log(post)
  // const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (slug) {
      service.getPost(slug).then((post) => {
        if (post) {
          setPost(post);
          if (userData) {
            setIsAuthor(post.userId === userData.$id);
          }
        } else navigate("/");
      });
    } else navigate("/");
  }, [slug, userData, navigate]);

  const deletePost = () => {
    service.deletePost(post.$id).then((status) => {
      if (status) {
        service.deleteFile(post.featuredImage);
        navigate("/");
      }
    });
  };

  return post ? (
    <div className="py-8 w-full h-full relative">
      <Container className="md:w-[60%] md:mx-28">
        <div className="w-full md:mb-12 mb-8">
          <h1 className="md:text-4xl text-3xl font-semibold mb-1 md:mt-6 mt-2">
            {post.title}
          </h1>
          <p className="text-lg text-gray-500 ">{formateDate(post.$createdAt)}</p>
        </div>
        <div className="w-fit h-full mb-2">
        <img
              className="md:object-contain object-cover w-full md:w-fit m-auto md:h-[40vh] h-[30vh] rounded-lg"
              src={service.getFilePreview(post.featuredImage)}
              alt={post.title}
            />
          {isAuthor && (
            <div className="mt-4 md:mt-0 absolute md:top-12 md:right-8 top-4 right-4 flex md:p-3 justify-between gap-3 text-xl">
              <Link to={`/edit-post/${post.$id}`}>
                <Button className="bg-green-600 rounded-md">Edit</Button>
              </Link>
              <Button className="bg-red-600 rounded-md" onClick={deletePost}>
                Delete
              </Button>
            </div>
          )}
        </div>
        <div className="md:text-lg text-base mt-12 md:mt-6 md:mb-10 tracking-wide leading-6">
          {parse(post.content)}
        </div>
      </Container>
    </div>
  ) : null;
}

export default Post;
