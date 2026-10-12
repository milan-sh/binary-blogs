import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor, useEditorState, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  BoldIcon,
  CodeIcon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  MinusIcon,
  Redo2Icon,
  SquareCodeIcon,
  StrikethroughIcon,
  TextQuoteIcon,
  UnderlineIcon,
  Undo2Icon,
  type LucideIcon,
} from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Toggle } from '@/components/ui/toggle'
import { cn, proseClasses } from '@/lib/utils'

interface RTEProps {
  value: string
  onChange: (html: string) => void
  onBlur?: () => void
  invalid?: boolean
  placeholder?: string
  id?: string
}

function RTE({ value, onChange, onBlur, invalid, placeholder = 'Tell your story…', id }: RTEProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true },
      }),
      //kept so images in posts written with the previous editor survive an edit
      Image,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-label': 'Post content',
        class: cn(proseClasses, 'min-h-80 px-4 py-3 outline-none'),
      },
    },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? '' : editor.getHTML()),
    onBlur,
  })

  return (
    <div
      aria-invalid={invalid}
      className={cn(
        'overflow-hidden rounded-lg border border-input transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30',
        invalid && 'border-destructive ring-3 ring-destructive/20'
      )}
    >
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  )
}

interface ToolbarButtonProps {
  label: string
  icon: LucideIcon
  pressed?: boolean
  disabled?: boolean
  onClick: () => void
}

function ToolbarButton({ label, icon: Icon, pressed = false, disabled, onClick }: ToolbarButtonProps) {
  return (
    <Toggle
      size="sm"
      aria-label={label}
      title={label}
      pressed={pressed}
      disabled={disabled}
      onPressedChange={onClick}
      //keeps the selection inside the editor when a button is clicked
      onMouseDown={(event) => event.preventDefault()}
    >
      <Icon />
    </Toggle>
  )
}

function Toolbar({ editor }: { editor: Editor }) {
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive('bold'),
      italic: editor.isActive('italic'),
      underline: editor.isActive('underline'),
      strike: editor.isActive('strike'),
      code: editor.isActive('code'),
      h2: editor.isActive('heading', { level: 2 }),
      h3: editor.isActive('heading', { level: 3 }),
      bulletList: editor.isActive('bulletList'),
      orderedList: editor.isActive('orderedList'),
      blockquote: editor.isActive('blockquote'),
      codeBlock: editor.isActive('codeBlock'),
      link: editor.isActive('link'),
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
    }),
  })

  const chain = () => editor.chain().focus()

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/40 p-1 text-foreground">
      <ToolbarButton label="Bold" icon={BoldIcon} pressed={state.bold} onClick={() => chain().toggleBold().run()} />
      <ToolbarButton label="Italic" icon={ItalicIcon} pressed={state.italic} onClick={() => chain().toggleItalic().run()} />
      <ToolbarButton label="Underline" icon={UnderlineIcon} pressed={state.underline} onClick={() => chain().toggleUnderline().run()} />
      <ToolbarButton label="Strikethrough" icon={StrikethroughIcon} pressed={state.strike} onClick={() => chain().toggleStrike().run()} />
      <ToolbarButton label="Inline code" icon={CodeIcon} pressed={state.code} onClick={() => chain().toggleCode().run()} />
      <LinkButton editor={editor} active={state.link} />

      <Separator orientation="vertical" className="mx-1 h-5!" />

      <ToolbarButton label="Heading" icon={Heading2Icon} pressed={state.h2} onClick={() => chain().toggleHeading({ level: 2 }).run()} />
      <ToolbarButton label="Subheading" icon={Heading3Icon} pressed={state.h3} onClick={() => chain().toggleHeading({ level: 3 }).run()} />
      <ToolbarButton label="Bullet list" icon={ListIcon} pressed={state.bulletList} onClick={() => chain().toggleBulletList().run()} />
      <ToolbarButton label="Numbered list" icon={ListOrderedIcon} pressed={state.orderedList} onClick={() => chain().toggleOrderedList().run()} />
      <ToolbarButton label="Quote" icon={TextQuoteIcon} pressed={state.blockquote} onClick={() => chain().toggleBlockquote().run()} />
      <ToolbarButton label="Code block" icon={SquareCodeIcon} pressed={state.codeBlock} onClick={() => chain().toggleCodeBlock().run()} />
      <ToolbarButton label="Divider" icon={MinusIcon} onClick={() => chain().setHorizontalRule().run()} />

      <Separator orientation="vertical" className="mx-1 h-5!" />

      <ToolbarButton label="Undo" icon={Undo2Icon} disabled={!state.canUndo} onClick={() => chain().undo().run()} />
      <ToolbarButton label="Redo" icon={Redo2Icon} disabled={!state.canRedo} onClick={() => chain().redo().run()} />
    </div>
  )
}

function LinkButton({ editor, active }: { editor: Editor; active: boolean }) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')

  const handleOpenChange = (next: boolean) => {
    if (next) setUrl((editor.getAttributes('link').href as string | undefined) ?? '')
    setOpen(next)
  }

  const applyLink = (event: FormEvent) => {
    event.preventDefault()
    //the editor lives inside the post form, which must not submit here
    event.stopPropagation()
    const href = url.trim()
    if (href) {
      const withProtocol = /^(https?:\/\/|mailto:|\/)/i.test(href) ? href : `https://${href}`
      editor.chain().focus().extendMarkRange('link').setLink({ href: withProtocol }).run()
    } else {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    }
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Toggle size="sm" aria-label="Link" title="Link" pressed={active}>
          <LinkIcon />
        </Toggle>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        <form onSubmit={applyLink} className="flex items-center gap-2">
          <Input
            autoFocus
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com"
            aria-label="Link URL"
          />
          <Button type="submit">{url.trim() || !active ? 'Apply' : 'Remove'}</Button>
        </form>
      </PopoverContent>
    </Popover>
  )
}

export default RTE
