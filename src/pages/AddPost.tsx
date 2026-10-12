import PageHeader from '@/components/PageHeader'
import PostForm from '@/components/posts/PostForm'

function AddPost() {
  return (
    <div className="container-page py-10 sm:py-14">
      <PageHeader
        eyebrow="New post"
        title="Write something"
        description="Add a title, a cover and your story. You can keep it as a draft until it’s ready."
      />
      <PostForm />
    </div>
  )
}

export default AddPost
