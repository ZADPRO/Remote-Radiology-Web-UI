import React, { useEffect, useId, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import QuillToolbar, { createModules, formats } from "./QuillToolbar";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Mic } from "lucide-react";

interface TextEditorProps {
  value: string;
  onChange?: (
    content: string,
    delta: any,
    source: "user" | "api" | "silent" | "voice",
    editor: any
  ) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  onManualEdit?: () => void;
  height?: string;
}

const TextEditor: React.FC<TextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing...",
  className = "",
  readOnly,
  onManualEdit,
  height,
}) => {
  const quillRef = useRef<ReactQuill | null>(null);
  const toolbarId = useId();

  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(false);
  const [lastTranscript, setLastTranscript] = useState("");

  // Restore censored terms
  const restoreMedicalTerms = (text: string) => {
    return text.replace(/\*{3,}/g, (match) => {
      const medicalTerms = ["nipple", "breast"];
      for (const word of medicalTerms) {
        if (text.toLowerCase().includes(word[0])) {
          return word;
        }
      }
      return match;
    });
  };

  // Insert transcript into editor
  useEffect(() => {
    const editor = quillRef.current?.getEditor?.(); // ✅ safe access
    if (!editor || !focused || !active) return;

    const restoredTranscript = restoreMedicalTerms(transcript);

    const oldWords = lastTranscript.trim().split(/\s+/);
    const newWords = restoredTranscript.trim().split(/\s+/);

    const newPart = newWords.slice(oldWords.length).join(" ");

    if (newPart) {
      const selection = editor.getSelection(true);
      const index = selection?.index ?? editor.getLength();

      editor.insertText(index, newPart + " ");
      editor.setSelection(index + newPart.length + 1);

      onChange?.(editor.root.innerHTML, "", "voice", editor);
    }

    setLastTranscript(restoredTranscript);
  }, [transcript, focused, active]);

  const startListening = async () => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    try {
      resetTranscript();
      setActive(true);

      await SpeechRecognition.startListening({
        continuous: false,
        language: "en-US",
        interimResults: true,
      });
    } catch (error) {
      console.error("Speech recognition error:", error);
      alert("Microphone not accessible. Please check your permissions or device settings.");
      setActive(false);
    }
  };

  const stopListening = () => {
    setActive(false);
    SpeechRecognition.stopListening();
  };

  // Manual edit tracker
  useEffect(() => {
    const editor = quillRef.current?.getEditor?.(); // ✅ safe access
    if (!editor) return;

    const handleTextChange = (_delta: any, _oldDelta: any, source: string) => {
      if (source === "user") {
        onManualEdit?.();
      }
    };

    editor.on("text-change", handleTextChange);
    return () => {
      editor.off("text-change", handleTextChange);
    };
  }, [onManualEdit]);

  // Focus + selection change tracker
  useEffect(() => {
    const editor = quillRef.current?.getEditor?.(); // ✅ safe access
    if (!editor) return;

    const handleSelectionChange = (range: any) => {
      if (range) {
        setFocused(true);
      } else {
        setFocused(false);
        stopListening();
      }
    };

    const handleTextChange = (_delta: any, _oldDelta: any, source: string) => {
      if (source === "api") {
        onManualEdit?.();
      }
    };

    editor.on("text-change", handleTextChange);
    editor.on("selection-change", handleSelectionChange);

    return () => {
      editor.off("text-change", handleTextChange);
      editor.off("selection-change", handleSelectionChange);
    };
  }, [onManualEdit]);

  return (
    <div
      className={`relative border rounded-xl bg-background p-4 shadow-sm ${className} ${
        readOnly ? "cursor-not-allowed" : ""
      }`}
    >
      <style>{`
        .ql-container {
          height: ${height ? height : "auto"};
        }
      `}</style>

      <QuillToolbar id={toolbarId} />
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={onChange}
        modules={createModules(toolbarId)}
        formats={formats}
        theme="snow"
        placeholder={placeholder}
        readOnly={readOnly}
      />

      <div className="w-full flex justify-end items-center mt-2">
        {focused && !readOnly && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={listening ? stopListening : startListening}
            className={`p-3 rounded-full shadow-lg transition-colors ${
              listening && active
                ? "bg-[red] hover:bg-[red] text-[#fff]"
                : "bg-[#f4e7e1] hover:bg-[#f9e2d7] text-[#3f3f3d]"
            }`}
          >
            <Mic size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TextEditor;
