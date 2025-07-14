import { EditorView, basicSetup } from "codemirror";
import { python } from "@codemirror/lang-python";
import { useEffect, useRef, useState } from "react";
import { autocompletion, completionKeymap } from "@codemirror/autocomplete";
import { indentWithTab } from "@codemirror/commands";
import { keymap, logException } from "@codemirror/view";
import Output from "./Output/Output.jsx";
import "./App.css";

export default function App({
  initialCode = "print('Hello world')",
  onChange,
}) {
  const editorRef = useRef(null);
  const viewRef = useRef(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const handleSubmit = () => {
    if (viewRef.current) {
      const currentCode = viewRef.current.state.doc.toString();

      const formattedCode = currentCode.replace(/\n/g, "\\n");

      console.log(currentCode);
      console.log(formattedCode);

      setLoading(true);
      setError("");
      setOutput("");

      // Simulate API delay
      setTimeout(() => {
        if (currentCode.includes("error")) {
          setError("Simulated runtime error");
        } else {
          setOutput(`Output:\n${currentCode}`);
        }
        setLoading(false);
      }, 1000);

      if (onChange) {
        onChange(currentCode);
      }
    }
  };

  useEffect(() => {
    if (editorRef.current && !viewRef.current) {
      // Python completions
      const pythonCompletions = [
        { label: "print", type: "function", info: "Print to console" },
        { label: "len", type: "function", info: "Get length of object" },
        { label: "range", type: "function", info: "Generate range of numbers" },
        { label: "for", type: "keyword", info: "For loop" },
        { label: "if", type: "keyword", info: "If statement" },
        { label: "elif", type: "keyword", info: "Else if statement" },
        { label: "else", type: "keyword", info: "Else statement" },
        { label: "def", type: "keyword", info: "Define function" },
        { label: "class", type: "keyword", info: "Define class" },
        { label: "import", type: "keyword", info: "Import module" },
        { label: "from", type: "keyword", info: "From import" },
        { label: "return", type: "keyword", info: "Return statement" },
        { label: "True", type: "keyword", info: "Boolean True" },
        { label: "False", type: "keyword", info: "Boolean False" },
        { label: "None", type: "keyword", info: "None value" },
      ];

      const customTheme = EditorView.theme({
        "&": {
          color: "white",
          backgroundColor: "rgb(186, 186, 186)",
        },
        ".cm-content": {
          padding: "10px",
          minHeight: "400px",
          color: "white",
        },
        ".cm-focused": {
          outline: "none",
        },
        ".cm-editor": {
          fontSize: "12px",
        },
        ".cm-scroller": {
          fontFamily: "'Fira Code', 'Consolas', monospace",
        },
        ".cm-lineNumbers": {
          color: "rgb(180, 180, 180)",
          backgroundColor: "rgb(116, 116, 116)",
          borderRight: "1px solid rgb(138, 138, 138)",
        },
        ".cm-lineNumbers .cm-gutterElement": {
          color: "rgb(180, 180, 180)",
        },
        ".cm-activeLine": {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        },
        ".cm-activeLineGutter": {
          backgroundColor: "rgba(208, 208, 208, 0.1)",
        },
        ".cm-gutters": {
          backgroundColor: "rgb(107, 107, 107)",
          borderRight: "1px solid rgb(100, 100, 100)",
        },

        // Syntax highlighting
        ".cm-keyword": { color: "#ff6b6b" },
        ".cm-string": { color: "#51cf66" },
        ".cm-comment": { color: "#868e96", fontStyle: "italic" },
        ".cm-number": { color: "#ffd43b" },
        ".cm-operator": { color: "#74c0fc" },
        ".cm-builtin": { color: "#e599f7" },
        ".cm-variable": { color: "#91a7ff" },
        ".cm-function": { color: "#ffd43b" },
        ".cm-punctuation": { color: "#adb5bd" },
        ".cm-bracket": { color: "#fd7e14" },
      });

      // Custom autocompletion
      const pythonAutocompletion = autocompletion({
        override: [
          (context) => {
            const word = context.matchBefore(/\w*/);
            if (!word) return null;
            if (word.from === word.to && !context.explicit) return null;

            return {
              from: word.from,
              options: pythonCompletions.filter((completion) =>
                completion.label.startsWith(word.text)
              ),
            };
          },
        ],
      });

      viewRef.current = new EditorView({
        doc: initialCode,
        extensions: [
          basicSetup, // This automatically adds line numbers, syntax highlighting, etc.
          python(),
          pythonAutocompletion,
          customTheme,
          keymap.of([indentWithTab, ...completionKeymap]), // Tab for indent, Enter/Tab for completions
        ],
        parent: editorRef.current,
      });
    }
    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, [initialCode]);

  return (
    <>
      <div ref={editorRef} className="code-editor" />
      <button onClick={handleSubmit}>Submit</button>
      <Output output={output} error={error} loading={loading} />
    </>
  );
}
