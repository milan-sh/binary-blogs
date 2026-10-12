import { ImagePlusIcon, XIcon } from 'lucide-react'
import { useEffect, useId, useMemo, useState, type DragEvent } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value: File | null
  onChange: (file: File | null) => void
  onBlur?: () => void
  //image already stored for the post, shown until a new file is picked
  existingUrl?: string
  invalid?: boolean
  id?: string
}

function ImageUpload({ value, onChange, onBlur, existingUrl, invalid, id }: ImageUploadProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const [dragging, setDragging] = useState(false)

  const objectUrl = useMemo(() => (value ? URL.createObjectURL(value) : null), [value])
  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [objectUrl])

  const preview = objectUrl ?? existingUrl

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setDragging(false)
    const file = event.dataTransfer.files[0]
    if (file) onChange(file)
  }

  return (
    <div className="relative">
      <label
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'group relative flex aspect-[16/10] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed border-input bg-muted/40 text-center text-foreground transition-colors hover:bg-muted has-focus-visible:border-ring has-focus-visible:ring-3 has-focus-visible:ring-ring/50',
          dragging && 'border-primary bg-primary/5',
          invalid && 'border-destructive'
        )}
      >
        {preview ? (
          <>
            <img src={preview} alt="Cover preview" className="size-full object-cover" />
            <span className="absolute inset-x-0 bottom-0 bg-black/60 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
              Click or drop to replace
            </span>
          </>
        ) : (
          <>
            <ImagePlusIcon className="size-6 text-muted-foreground" />
            <span className="text-sm font-medium">Click to upload or drag an image here</span>
            <span className="text-xs text-muted-foreground">PNG, JPG, WebP or GIF up to 5 MB</span>
          </>
        )}
        <input
          id={inputId}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="sr-only"
          aria-invalid={invalid}
          onBlur={onBlur}
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) onChange(file)
            //lets the same file be picked again after it was removed
            event.target.value = ''
          }}
        />
      </label>

      {value && (
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          className="absolute top-2 right-2 shadow-sm"
          aria-label="Remove selected image"
          onClick={() => onChange(null)}
        >
          <XIcon />
        </Button>
      )}
    </div>
  )
}

export default ImageUpload
