import React, { useState, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Mic } from "lucide-react";

interface VoiceEditorProps {
  placeholder?: string;
}

const VoiceRecognition: React.FC<VoiceEditorProps> = ({ placeholder }) => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [focused, setFocused] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement | null>(null);

  // Start listening
  const startListening = () => {
    resetTranscript(); // clear previous text
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
      interimResults: true,
    });
  };

  // Stop listening
  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  // When transcript updates, insert into the editor
  React.useEffect(() => {
    if (editorRef.current && focused) {
      editorRef.current.value = transcript;
    }
  }, [transcript, focused]);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
    stopListening();
  };

  return (
    <div className="relative w-full">
      <textarea
        ref={editorRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="border px-3 py-2 w-full rounded resize-none"
        placeholder={placeholder || "Type or speak..."}
        rows={4}
      />

      {/* Mic button only visible when focused */}
      {focused && (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()} // keep focus on editor
          onClick={listening ? stopListening : startListening}
          className={`absolute right-2 bottom-2 p-2 rounded-full shadow-lg transition-colors ${
            listening
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          } text-white`}
        >
          <Mic size={20} />
        </button>
      )}
    </div>
  );
};

export default VoiceRecognition;
