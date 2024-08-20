import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import Bold from "@tiptap/extension-bold";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import CodeBlock from "@tiptap/extension-code-block";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import History from "@tiptap/extension-history";
import { MenuBar } from "./menu";

import "./editor.scss";
import { Card } from "antd";
import Placeholder from "@tiptap/extension-placeholder";

const limit = 280;

export const TextEditor = ({ eData, eContent }: any) => {
  const [editorContent, setEditorContent] = useState("");
  const [editorContentJson, setEditorContentJson] = useState({});


  useEffect(() => {
    eData(editorContentJson);
  }, [editorContentJson]);

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Heading.configure({
        levels: [2, 3],
      }),
      CodeBlock,
      BulletList,
      OrderedList,
      ListItem,
      History,
      Placeholder.configure({
        placeholder: "Start typing here...",
      })
    ],
    content: eContent ? eContent : "",
    onCreate({ editor }) {
      setEditorContent(editor.getHTML());
      setEditorContentJson(editor.getJSON());
    },
    onUpdate({ editor }) {
      setEditorContent(editor.getHTML());
      setEditorContentJson(editor.getJSON());
    },
    autofocus: false,
  });

  return (
    <Card title={<MenuBar editor={editor} />} size="small">
      <EditorContent
        editor={editor}
        style={{
          height: "400px",
          overflow: "auto",
          padding: "0 10px",
          border: "1px solid #d9d9d9",
          borderRadius: "4px",
          margin: "10px 0",
          boxShadow: "inset 0 1px 1px rgba(0,0,0,.075)",
        }}
      />
      <div className="outputHTML">{editorContent}</div>
      <div className="outputJSON">{JSON.stringify(editorContentJson)}</div>
    </Card>
  );
};
