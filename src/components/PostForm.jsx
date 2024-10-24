import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, RTE, Select } from "./index";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import service from "../appwrite/config";

//if post present he is edit mode otherwise creating post
function PostForm({ post }) {
  //setvalue is used for setting value of elements, control is which will be passed for RTE and getValues will be used for getting value of components

  const { handleSubmit, register, watch, setValue, control, getValues, formState:{errors} } =
    useForm({
      //here definig default values so if user creating new post or editing post, both case will be handled
      defaultValues: {
        title: post?.title || "",
        slug: post?.$id || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);

  const onSubmit = async (data) => {
    //this is edit mode as we're having post
    if (post) {
      //handling file first
      //if has image then upload it
      const file = data.image[0]
        ? await service.uploadFile(data.image[0])
        : null;

      //as uploaded new image then delete the old image from database
      if (file) {
        service.deleteFile(post.featuredImage);
      }

      //updating post
      const dbPost = await service.updatePost(post.$id, {
        //all data wil be same from form data
        ...data,
        //updatig the featuredImage
        featuredImage: file ? file.$id : undefined,
      });
      if (dbPost) {
        //navigate user to updated post
        navigate(`/post/${dbPost.$id}`);
      }
      //when creating post
    } else {
      //upload file first
      const file = await service.uploadFile(data.image[0]);
      //ToDo if don't have file then handle it

      if (file) {
        //after uploading file there will be an id generated
        // console.log("This is file id", file.$id)
        const fileId = file.$id;
        //updating form data featuredImage with the id of file
        data.featuredImage = fileId;
        console.log("file id isssss", fileId);

        //creating post
        const dbPost = await service.createPost({
          ...data,
          userId: userData.$id,
        });

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      }
    }
  };

  //this is for generating slug where we watching the title and generating the slug
  const slugTransForm = useCallback((value) => {
    if (value && typeof value === "string") {
      return (
        value
          .trim()
          .toLowerCase()
          // Replaces non-alphanumeric characters with -
          .replace(/[^a-zA-Z\d]+/g, "-")
      );
    }
    return "";
  }, []);

  useEffect(() => {
    //here optimizing useEffect
    // make variable of the used method
    //watch is monitoring title cahnge
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        //if the title changes it will change slug using slugTransForm function using setValue
        setValue("slug", slugTransForm(value.title), { shouldValidate: true });
      }
    });

    //clean up using that variable, can name anything but try to name it subscription
    return () => subscription.unsubscribe();
  }, [watch, setValue, slugTransForm]);

  return (
    <div className="w-full">
      <form
        className="flex md:flex-row flex-col"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="md:w-2/3 p-5">
          <Input
            label="Title"
            type="text"
            placeholder="Title"
            {...register("title", { required: true })}
          />
          {errors.title && <span className="text-red-600">Title is empty.</span>}
          <Input
            label="Slug"
            type="text"
            placeholder="Slug"
            {...register("slug", { required: true })}
            onChange={(e) => {
              console.log(e.currentTarget.value)
              setValue("slug", slugTransForm(e.currentTarget.value), {
                shouldValidate: true
              });
            }}
          />
          <div className="">
            <RTE
              name="content"
              label="Content"
              control={control}
              defaultValue={getValues("content")}
            />
          </div>
            {errors.content &&  <span className="text-red-600">Content is empty.</span>}
        </div>
        <div className="md:w-1/3 p-5">
          <Input
            label="Featured Image"
            type="file"
            {...register("image", { required: !post })}
          />
          {errors.image && <span className="text-red-600">Select an Image.</span>}
          {post && post.featuredImage && (
            <img
              src={service.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-lg w-full"
            />
          )}
          <Select
            label="Status"
            className="border border-black rounded-lg p-2 outline-none cursor-pointer"
            options={["active", "inactive"]}
            {...register("status", { required: true })}
          />
          <Button
            bgColor="bg-[#D9D9D9]"
            textColor="black"
            type="submit"
            className="rounded-xl font-semibold px-8 py-3 md:mt-4 mt-8 hover:border-2 hover:border-gray-600 hover:bg-inherit"
          >
            {post ? "Update" : "Create Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PostForm;
