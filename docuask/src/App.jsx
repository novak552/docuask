import { useState, useRef, useEffect, useCallback } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #f7f5f1; min-height: 100vh; color: #1c1c1a; }
  .app { display: flex; flex-direction: column; min-height: 100vh; max-width: 860px; margin: 0 auto; padding: 0 1.5rem; }
  .header { display: flex; align-items: baseline; gap: 10px; padding: 2rem 0 1.5rem; border-bottom: 1px solid #e0ddd6; margin-bottom: 2rem; }
  .logo { font-family: 'Lora', serif; font-size: 1.35rem; font-weight: 600; color: #1c1c1a; letter-spacing: -0.01em; }
  .logo-dot { color: #b07b4a; }
  .header-sub { font-size: 0.8rem; font-weight: 300; color: #888; letter-spacing: 0.04em; text-transform: uppercase; }
  .upload-zone { border: 1.5px dashed #c5bfb3; border-radius: 16px; background: #faf9f7; padding: 4rem 2rem; text-align: center; cursor: pointer; transition: all 0.2s; }
  .upload-zone:hover, .upload-zone.drag { border-color: #b07b4a; background: #fdf8f3; }
  .upload-icon { font-size: 2.5rem; margin-bottom: 1rem; color: #b07b4a; }
  .upload-title { font-family: 'Lora', serif; font-size: 1.25rem; color: #3a3732; margin-bottom: 0.5rem; }
  .upload-sub { font-size: 0.875rem; color: #888; font-weight: 300; }
  .upload-types { display: inline-flex; gap: 0.5rem; margin-top: 1.25rem; }
  .badge { background: #ece9e3; color: #6b6660; font-size: 0.72rem; padding: 3px 10px; border-radius: 20px; font-weight: 500; letter-spacing: 0.03em; }
  .doc-bar { display: flex; align-items: center; gap: 12px; background: #1c1c1a; color: #f5f2ec; border-radius: 12px; padding: 0.875rem 1.25rem; margin-bottom: 1.5rem; }
  .doc-icon { font-size: 1.1rem; color: #d4945a; flex-shrink: 0; }
  .doc-name { font-size: 0.9rem; font-weight: 500; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .doc-change { font-size: 0.78rem; color: #888; cursor: pointer; flex-shrink: 0; transition: color 0.15s; }
  .doc-change:hover { color: #d4945a; }
  .chat-area { flex: 1; display: flex; flex-direction: column; overflow-y: auto; margin-bottom: 1.5rem; min-height: 320px; max-height: 52vh; }
  .empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; padding: 3rem 0; }
  .empty-title { font-family: 'Lora', serif; font-size: 1.05rem; color: #9c9690; font-style: italic; }
  .empty-sub { font-size: 0.8rem; color: #b8b3ac; font-weight: 300; }
  .chips { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-top: 1rem; }
  .chip { background: #fff; border: 1px solid #ddd9d0; color: #5a5750; font-size: 0.78rem; padding: 5px 12px; border-radius: 20px; cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif; }
  .chip:hover { border-color: #b07b4a; color: #b07b4a; background: #fdf8f3; }
  .msg { padding: 0.85rem 0; border-bottom: 1px solid #edeae4; }
  .msg:last-child { border-bottom: none; }
  .msg-label { font-size: 0.68rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 0.4rem; }
  .msg-user .msg-label { color: #b07b4a; }
  .msg-assistant .msg-label { color: #888; }
  .msg-text { font-size: 0.95rem; line-height: 1.75; color: #2c2a26; white-space: pre-wrap; }
  .msg-assistant .msg-text { color: #3a3730; }
  .input-row { display: flex; gap: 10px; padding-bottom: 2rem; }
  .input-wrap { flex: 1; position: relative; }
  .q-input { width: 100%; border: 1.5px solid #ddd9d0; border-radius: 10px; padding: 0.8rem 1rem; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; background: #fff; color: #1c1c1a; outline: none; resize: none; height: 50px; transition: border-color 0.2s; }
  .q-input:focus { border-color: #b07b4a; }
  .q-input::placeholder { color: #bbb; }
  .send-btn { background: #1c1c1a; color: #f5f2ec; border: none; border-radius: 10px; width: 50px; height: 50px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; transition: all 0.15s; flex-shrink: 0; }
  .send-btn:hover:not(:disabled) { background: #b07b4a; }
  .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .thinking { display: flex; gap: 5px; align-items: center; padding: 1rem 0; }
  .dot { width: 6px; height: 6px; background: #c5bfb3; border-radius: 50%; animation: bounce 1.2s infinite; }
  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
  .hidden { display: none; }
  .upload-btn-text { font-size: 0.82rem; color: #b07b4a; font-weight: 500; margin-top: 0.75rem; display: block; }
  .error-bar { background: #fff0ee; border: 1px solid #f5c4b3; color: #993c1d; border-radius: 8px; padding: 0.6rem 1rem; font-size: 0.85rem; margin-bottom: 1rem; }
`;

const SUGGESTIONS = [
  "What is this document about?",
  "Summarize the key points",
  "What are the main conclusions?",
  "List any action items or recommendations",
];

export default function DocumentAI() {
  const [doc, setDoc] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef();
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const processFile = useCallback((file) => {
    if (!file) return;
    const isPdf = file.type === "application/pdf";
    const isText =
      file.type.startsWith("text/") ||
      /\.(txt|md|csv|json|xml|html|js|py|ts|jsx|tsx)$/i.test(file.name);

    if (!isPdf && !isText) {
      setError("Please upload a PDF, text, or markdown file.");
      return;
    }

    setError(null);
    const reader = new FileReader();
    if (isPdf) {
      reader.onload = (e) => {
        const base64 = e.target.result.split(",")[1];
        setDoc({ name: file.name, type: "pdf", base64 });
        setMessages([]);
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = (e) => {
        setDoc({ name: file.name, type: "text", content: e.target.result });
        setMessages([]);
      };
      reader.readAsText(file);
    }
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      processFile(e.dataTransfer.files[0]);
    },
    [processFile]
  );

  const ask = async (question) => {
    if (!question.trim() || loading) return;
    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);

    try {
      let userContent;
      if (doc.type === "pdf") {
        userContent = [
          {
            type: "document",
            source: {
              type: "base64",
              media_type: "application/pdf",
              data: doc.base64,
            },
          },
          { type: "text", text: question },
        ];
      } else {
        userContent = `Document: "${doc.name}"\n\n${doc.content}\n\n---\n\nQuestion: ${question}`;
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system:
            "You are a precise document assistant. Answer questions based solely on the provided document. Be clear and concise. If the answer is not in the document, say so. Use plain text only — no markdown formatting.",
          messages: [{ role: "user", content: userContent }],
        }),
      });

      const data = await res.json();
      const answer =
        data.content?.[0]?.text ?? "Sorry, I couldn't generate a response.";
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch {
      setError("Request failed. Check your connection and try again.");
    }
    setLoading(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      ask(input);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <header className="header">
          <span className="logo">
            Docu<span className="logo-dot">.</span>ask
          </span>
          <span className="header-sub">Document AI Assistant</span>
        </header>

        {error && <div className="error-bar">⚠ {error}</div>}

        {!doc ? (
          <div
            className={`upload-zone${dragOver ? " drag" : ""}`}
            onClick={() => fileRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
          >
            <div className="upload-icon">📄</div>
            <div className="upload-title">Drop your document here</div>
            <div className="upload-sub">or click to browse files</div>
            <div className="upload-types">
              <span className="badge">PDF</span>
              <span className="badge">TXT</span>
              <span className="badge">MD</span>
              <span className="badge">CSV</span>
              <span className="badge">JSON</span>
            </div>
            <span className="upload-btn-text">Select file →</span>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.txt,.md,.csv,.json,.xml,.html,.js,.py,.ts,.jsx,.tsx,text/*,application/pdf"
              className="hidden"
              onChange={(e) => processFile(e.target.files[0])}
            />
          </div>
        ) : (
          <>
            <div className="doc-bar">
              <span className="doc-icon">📄</span>
              <span className="doc-name">{doc.name}</span>
              <span
                className="doc-change"
                onClick={() => { setDoc(null); setMessages([]); setError(null); }}
              >
                Change file
              </span>
            </div>

            <div className="chat-area">
              {messages.length === 0 && !loading && (
                <div className="empty-state">
                  <div className="empty-title">What would you like to know?</div>
                  <div className="empty-sub">Ask anything about your document</div>
                  <div className="chips">
                    {SUGGESTIONS.map((s) => (
                      <button key={s} className="chip" onClick={() => ask(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`msg msg-${m.role}`}>
                  <div className="msg-label">
                    {m.role === "user" ? "You" : "Assistant"}
                  </div>
                  <div className="msg-text">{m.content}</div>
                </div>
              ))}

              {loading && (
                <div className="thinking">
                  <div className="dot" />
                  <div className="dot" />
                  <div className="dot" />
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="input-row">
              <div className="input-wrap">
                <textarea
                  className="q-input"
                  placeholder="Ask a question about your document…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  rows={1}
                />
              </div>
              <button
                className="send-btn"
                onClick={() => ask(input)}
                disabled={!input.trim() || loading}
                aria-label="Send"
              >
                ↑
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
