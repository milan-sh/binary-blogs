import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import service from "../appwrite/config";
import { Button, Container } from "../components/index";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

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
    <div className="md:py-8 py-16 w-full h-full relative">
      <Container>
        <div className="w-full h-full border-2 border-[#D9D9D9] p-4 rounded-lg mb-2">
        <img
              className="md:object-contain object-cover w-full  md:w-fit m-auto md:h-[80vh] rounded-lg"
              src={service.getFilePreview(post.featuredImage)}
              alt={post.title}
            />
          {isAuthor && (
            <div className="mt-4 md:mt-0 absolute md:top-20 md:right-8  top-0  flex md:p-3 justify-between gap-3 text-xl">
              <Link to={`/edit-post/${post.$id}`}>
                <Button className="bg-green-600 rounded-md">Edit</Button>
              </Link>
              <Button className="bg-red-600 rounded-md" onClick={deletePost}>
                Delete
              </Button>
            </div>
          )}
        </div>
        <div className="w-full">
          <h1 className="md:text-8xl text-4xl font-semibold mb-8">
            {post.title}
          </h1>
        </div>

        <div className="md:text-3xl text-xl mt-5 md:mt-10">
          {parse(post.content)}
        </div>
      </Container>
    </div>
  ) : null;
}

export default Post;
