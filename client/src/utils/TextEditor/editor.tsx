import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { MenuBar } from "./menu";

import "./editor.scss";
import { Card } from "antd";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";

export const TextEditor = ({ eData, eContent }: any) => {
  const [editorContent, setEditorContent] = useState("");
  const [editorContentJson, setEditorContentJson] = useState({});

  useEffect(() => {
    eData(editorContentJson);
  }, [editorContentJson]);

  let extensions = [
    StarterKit,
    Placeholder.configure({
      placeholder: "Start typing here...",
    }),
  ];

  const editor = useEditor({
    extensions: extensions,
    content: eContent ? eContent : null,
    onCreate({ editor }) {
      setEditorContent(editor.getHTML());
      setEditorContentJson(editor.getJSON());
    },
    onUpdate({ editor }) {
      setEditorContent(editor.getHTML());
      setEditorContentJson(editor.getJSON());
    },
    autofocus: true,
    immediatelyRender: true,
    shouldRerenderOnTransaction: false,
  });

  setTimeout(() => {
    if (editor) {
      editor.commands.setContent(eContent);
    }
  }, 0);

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
      {/* <div className="outputHTML">{editorContent}</div>
      <div className="outputJSON">{JSON.stringify(editorContentJson)}</div> */}
    </Card>
  );
};
