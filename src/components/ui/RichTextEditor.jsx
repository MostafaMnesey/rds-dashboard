import { useEffect, useId, memo, useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Code,
  Minus,
  Pilcrow,
  Type,
  Check,
  ChevronDown,
} from "lucide-react";
import Label from "./Label";

/* ---------- Font Family options ---------- */
const FONT_FAMILIES = [
  {
    value: "Poppins, system-ui, sans-serif",
    label: "Poppins",
    className: "font-poppins",
  },
  {
    value: "Oswald, system-ui, sans-serif",
    label: "Oswald",
    className: "font-oswald",
  },
  {
    value: "EB Garamond, Georgia, serif",
    label: "EB Garamond",
    className: "font-garamond",
  },
];

/* ---------- Toolbar Button ---------- */
const ToolbarButton = ({ active, onClick, disabled, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition disabled:cursor-not-allowed disabled:opacity-40 ${
      active
        ? "bg-main/10 text-main"
        : "text-secondary hover:bg-black/[0.04] hover:text-soft-black"
    }`}
  >
    {children}
  </button>
);

const Divider = () => <span className="mx-0.5 h-5 w-px bg-black/10" />;

/* ---------- Font Family Dropdown ---------- */
const FontFamilyDropdown = ({ editor }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const currentFont = editor?.getAttributes("textStyle")?.fontFamily || "";
  const currentLabel =
    FONT_FAMILIES.find((f) => currentFont.includes(f.label))?.label ||
    "Default";

  const applyFont = (fontValue) => {
    if (!editor) return;
    editor.chain().focus().setFontFamily(fontValue).run();
    setOpen(false);
  };

  const clearFont = () => {
    if (!editor) return;
    editor.chain().focus().unsetFontFamily().run();
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="Font family"
        className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-secondary transition hover:bg-black/[0.04] hover:text-soft-black"
      >
        <Type size={14} />
        <span className="min-w-[60px] text-left">{currentLabel}</span>
        <ChevronDown size={12} className={open ? "rotate-180" : ""} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-xl border border-black/5 bg-white shadow-rds-lg">
          <button
            type="button"
            onClick={clearFont}
            className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs text-secondary transition hover:bg-black/[0.03]"
          >
            <span>Default</span>
            {!currentFont && <Check size={12} className="text-main" />}
          </button>
          <div className="border-t border-black/5">
            {FONT_FAMILIES.map((font) => {
              const isActive = currentFont.includes(font.label);
              return (
                <button
                  key={font.value}
                  type="button"
                  onClick={() => applyFont(font.value)}
                  className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition hover:bg-black/[0.03] ${font.className} ${
                    isActive ? "text-main" : "text-soft-black"
                  }`}
                >
                  <span>{font.label}</span>
                  {isActive && <Check size={12} className="text-main" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------- Toolbar ---------- */
const Toolbar = ({ editor }) => {
  if (!editor) return null;

  const setLink = () => {
    const previous = editor.getAttributes("link").href || "";
    const url = window.prompt("Enter URL", previous);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url, target: "_blank" })
      .run();
  };

  const addImage = () => {
    const url = window.prompt("Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-black/10 bg-[#fafaf9] px-2 py-1.5">
      {/* History */}
      <ToolbarButton
        title="Undo"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo size={15} />
      </ToolbarButton>
      <ToolbarButton
        title="Redo"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo size={15} />
      </ToolbarButton>

      <Divider />

      {/* Font family */}
      <FontFamilyDropdown editor={editor} />

      <Divider />

      {/* Headings */}
      <ToolbarButton
        title="Paragraph"
        active={editor.isActive("paragraph")}
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        <Pilcrow size={15} />
      </ToolbarButton>
      <ToolbarButton
        title="Heading 1"
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 size={15} />
      </ToolbarButton>
      <ToolbarButton
        title="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 size={15} />
      </ToolbarButton>
      <ToolbarButton
        title="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 size={15} />
      </ToolbarButton>

      <Divider />

      {/* Marks */}
      <ToolbarButton
        title="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={15} />
      </ToolbarButton>
      <ToolbarButton
        title="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={15} />
      </ToolbarButton>
      <ToolbarButton
        title="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon size={15} />
      </ToolbarButton>
      <ToolbarButton
        title="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={15} />
      </ToolbarButton>

      <Divider />

      {/* Lists */}
      <ToolbarButton
        title="Bullet List"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={15} />
      </ToolbarButton>
      <ToolbarButton
        title="Numbered List"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={15} />
      </ToolbarButton>
      <ToolbarButton
        title="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={15} />
      </ToolbarButton>
      <ToolbarButton
        title="Horizontal Rule"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus size={15} />
      </ToolbarButton>

      <Divider />

      {/* Alignment */}
      <ToolbarButton
        title="Align Left"
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft size={15} />
      </ToolbarButton>
      <ToolbarButton
        title="Align Center"
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter size={15} />
      </ToolbarButton>
      <ToolbarButton
        title="Align Right"
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight size={15} />
      </ToolbarButton>

      <Divider />

      {/* Insert */}
      <ToolbarButton
        title="Add Link"
        active={editor.isActive("link")}
        onClick={setLink}
      >
        <LinkIcon size={15} />
      </ToolbarButton>
      <ToolbarButton title="Add Image" onClick={addImage}>
        <ImageIcon size={15} />
      </ToolbarButton>
    </div>
  );
};

/* ---------- Main Component ---------- */
const RichTextEditor = ({
  label,
  required = false,
  value = "",
  onChange,
  error,
  hint,
  placeholder = "Start writing...",
  minHeight = 240,
  dir = "ltr",
  id,
  className = "",
}) => {
  const reactId = useId();
  const fieldId = id || reactId;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        // disable inline code (no toolbar entry needed)
        code: false,
        codeBlock: false,
      }),
      Underline,
      TextStyle,
      FontFamily.configure({
        types: ["textStyle"],
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: "text-main underline underline-offset-2",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-xl my-3 max-w-full h-auto",
        },
      }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        id: fieldId,
        dir,
        class: "tiptap-prose focus:outline-none",
        style: `min-height: ${minHeight}px;`,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html === "<p></p>" ? "" : html);
    },
  });

  /* Keep editor in sync when external value changes */
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || "";
    if (next !== current && next !== "<p></p>") {
      editor.commands.setContent(next, false);
    }
  }, [value, editor]);

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
      )}

      <div
        className={`overflow-hidden rounded-xl border bg-white transition ${
          error
            ? "border-red-400 focus-within:border-red-500"
            : "border-black/10 focus-within:border-main focus-within:shadow-[0_0_0_2px_rgba(104,188,82,0.1)]"
        }`}
      >
        <Toolbar editor={editor} />
        <EditorContent
          editor={editor}
          className="max-h-[480px] overflow-y-auto px-4 py-3 text-sm text-soft-black"
        />
      </div>

      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-secondary">{hint}</p>
      ) : null}
    </div>
  );
};

export default memo(RichTextEditor);
