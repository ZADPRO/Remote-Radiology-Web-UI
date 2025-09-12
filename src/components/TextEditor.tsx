import React, { useEffect, useId, useRef, useState } from "react";
import ReactQuill from "react-quill-new"; // or 'react-quill'
import "react-quill-new/dist/quill.snow.css";
import QuillToolbar, { createModules, formats } from "./QuillToolbar";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Mic, MicOff } from "lucide-react";

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

  // Local speech recognition for THIS editor only
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(false); // mic active state

  const [lastTranscript, setLastTranscript] = useState("");

  // New state to track the starting index of transcription
  // const [transcriptStartIndex, setTranscriptStartIndex] = useState<
  //   number | null
  // >(null);

  // Update the editor with the full transcript

  const restoreMedicalTerms = (text: string) => {
    return text.replace(/\*{3,}/g, (match) => {
      // If censorship detected, try to replace based on context
      // Expand this dictionary with real terms
      const medicalTerms = ["nipple", "breast"];
      for (const word of medicalTerms) {
        if (text.toLowerCase().includes(word[0])) {
          return word;
        }
      }
      return match;
    });
  };
  useEffect(() => {
    if (focused && active && quillRef.current) {
      const editor = quillRef.current.getEditor();
      const restoredTranscript = restoreMedicalTerms(transcript);

      if (restoredTranscript.length > lastTranscript.length) {
        const newText = restoredTranscript.slice(lastTranscript.length);
        const selection = editor.getSelection(true);
        const index = selection?.index ?? editor.getLength();

        editor.insertText(index, newText);
        editor.setSelection(index + newText.length);
      }

      onChange?.(
        editor.root.innerHTML,
        "", // delta-like object
        "voice",
        editor
      );
      setLastTranscript(restoredTranscript);
    }
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
        interimResults: false,
      });
    } catch (error) {
      console.error("Speech recognition error:", error);
      alert(
        "Microphone not accessible. Please check your permissions or device settings."
      );
      setActive(false);
    }
  };

  const stopListening = () => {
    setActive(false);
    SpeechRecognition.stopListening();
    // setTranscriptStartIndex(null); // Reset the start index
  };

  // Manual edit tracker
  useEffect(() => {
    const editor = quillRef.current?.getEditor();
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

  // Focus tracking
  useEffect(() => {
    const editor = quillRef.current?.getEditor();
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
      editor.on("text-change", handleTextChange);
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
        {/* Mic button – scoped to this editor */}
        {focused && !readOnly && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()} // keep focus in editor
            onClick={listening ? stopListening : startListening}
            className={`p-3 rounded-full shadow-lg transition-colors ${
              listening && active
                ? "bg-[#a3b1a0] hover:bg-[#a6baa1] text-white"
                : "bg-[#f4e7e1] hover:bg-[#f9e2d7] text-[#3f3f3d]"
            }`}
          >
            {listening && active ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default TextEditor;
