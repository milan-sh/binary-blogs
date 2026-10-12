import { zodResolver } from '@hookform/resolvers/zod'
import { AppwriteException } from 'appwrite'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import service, { type Post } from '@/appwrite/config'
import RTE from '@/components/editor/RTE'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { useSavePost } from '@/hooks/use-posts'
import { getErrorMessage, htmlToText, slugify, SLUG_MAX_LENGTH } from '@/lib/utils'
import ImageUpload from './ImageUpload'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024

//a new post must have a cover image, an existing one can keep the image it has
function createPostSchema(requireImage: boolean) {
  return z.object({
    title: z
      .string()
      .trim()
      .min(3, 'Give your post a title of at least 3 characters.')
      .max(120, 'Keep the title under 120 characters.'),
    slug: z
      .string()
      .min(1, 'A slug is required.')
      .max(SLUG_MAX_LENGTH, `Slugs can be at most ${SLUG_MAX_LENGTH} characters.`)
      .regex(/^[a-z\d][a-z\d-]*$/, 'Use lowercase letters, numbers and hyphens only.'),
    content: z
      .string()
      .refine((html) => htmlToText(html).length >= 20, 'Write at least a sentence or two.'),
    status: z.enum(['active', 'inactive']),
    image: z
      .instanceof(File)
      .nullable()
      .refine((file) => !requireImage || file !== null, 'Add a cover image.')
      .refine((file) => !file || file.type.startsWith('image/'), 'The cover must be an image file.')
      .refine((file) => !file || file.size <= MAX_IMAGE_BYTES, 'Keep the cover image under 5 MB.'),
  })
}

type PostFormValues = z.infer<ReturnType<typeof createPostSchema>>

//if a post is passed we are in edit mode, otherwise a new post is being created
function PostForm({ post }: { post?: Post }) {
  const navigate = useNavigate()
  const savePost = useSavePost(post)
  //once the slug is edited by hand it stops following the title
  const [slugTouched, setSlugTouched] = useState(false)

  const { control, handleSubmit, setValue, setError, formState } = useForm<PostFormValues>({
    resolver: zodResolver(createPostSchema(!post)),
    defaultValues: {
      title: post?.title ?? '',
      slug: post?.$id ?? '',
      content: post?.content ?? '',
      status: post?.status ?? 'active',
      image: null,
    },
  })

  const onSubmit = async (values: PostFormValues) => {
    try {
      const saved = await savePost.mutateAsync(values)
      toast.success(post ? 'Post updated.' : 'Post created.')
      navigate(`/post/${saved.$id}`)
    } catch (error) {
      if (error instanceof AppwriteException && error.code === 409) {
        setError('slug', { message: 'That slug is already taken. Try another one.' }, { shouldFocus: true })
        return
      }
      toast.error(getErrorMessage(error))
    }
  }

  const isSubmitting = formState.isSubmitting

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <FieldGroup>
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="post-title">Title</FieldLabel>
              <Input
                {...field}
                id="post-title"
                placeholder="A headline worth clicking"
                aria-invalid={fieldState.invalid}
                className="h-10 text-base"
                onChange={(event) => {
                  field.onChange(event)
                  //the slug follows the title until it is edited by hand
                  if (!post && !slugTouched) {
                    setValue('slug', slugify(event.target.value), {
                      shouldValidate: formState.isSubmitted,
                    })
                  }
                }}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="slug"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="post-slug">Slug</FieldLabel>
              <Input
                {...field}
                id="post-slug"
                placeholder="a-headline-worth-clicking"
                className="font-mono"
                disabled={Boolean(post)}
                aria-invalid={fieldState.invalid}
                onChange={(event) => {
                  setSlugTouched(true)
                  field.onChange(slugify(event.target.value))
                }}
              />
              <FieldDescription>
                {post
                  ? 'The slug is the address of the post and cannot be changed after publishing.'
                  : `The address of your post: /post/${field.value || 'your-slug'}`}
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="content"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="post-content">Content</FieldLabel>
              <RTE
                id="post-content"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <aside className="lg:sticky lg:top-20 lg:self-start">
        <Card>
          <CardContent>
            <FieldGroup>
              <Controller
                name="image"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="post-image">Cover image</FieldLabel>
                    <ImageUpload
                      id="post-image"
                      value={field.value}
                      onChange={(file) =>
                        setValue('image', file, { shouldValidate: true, shouldDirty: true })
                      }
                      onBlur={field.onBlur}
                      existingUrl={post ? service.getFilePreview(post.featuredImage) : undefined}
                      invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="status"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="post-status">Status</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="post-status" className="w-full" aria-invalid={fieldState.invalid}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="active">Published</SelectItem>
                          <SelectItem value="inactive">Draft</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FieldDescription>Drafts are hidden from the home page.</FieldDescription>
                  </Field>
                )}
              />

              <div className="flex flex-col gap-2">
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting && <Spinner data-icon="inline-start" />}
                  {post ? 'Save changes' : 'Create post'}
                </Button>
                <Button asChild variant="ghost" size="lg">
                  <Link to={post ? `/post/${post.$id}` : '/'}>Cancel</Link>
                </Button>
              </div>
            </FieldGroup>
          </CardContent>
        </Card>
      </aside>
    </form>
  )
}

export default PostForm
