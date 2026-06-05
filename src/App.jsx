import { useState, useRef, useEffect, useCallback } from "react";

const RAINBOW = "linear-gradient(90deg, #FF6B6B, #FF8E53, #FFD93D, #6BCB77, #4D96FF, #9B59B6)";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #f9f9f9; min-height: 100vh; color: #111; }

  .app { display: flex; flex-direction: column; min-height: 100vh; max-width: 820px; margin: 0 auto; padding: 0 1.5rem; }

  .header { display: flex; align-items: center; justify-content: space-between; padding: 1.75rem 0 1.5rem; margin-bottom: 2rem; }
  .logo-wrap { display: flex; align-items: center; gap: 10px; }
  .logo-icon { width: 32px; height: 32px; border-radius: 8px; background: ${RAINBOW}; flex-shrink: 0; }
  .logo { font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 800; color: #111; letter-spacing: -0.02em; }
  .header-badge { font-size: 0.7rem; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; background: #111; color: #fff; padding: 4px 10px; border-radius: 20px; }

  .rainbow-bar { height: 3px; width: 100%; background: ${RAINBOW}; border-radius: 99px; margin-bottom: 2rem; }

  .upload-zone { border: 2px dashed #e0e0e0; border-radius: 20px; background: #fff; padding: 3.5rem 2rem; text-align: center; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; }
  .upload-zone::before { content: ''; position: absolute; inset: 0; background: ${RAINBOW}; opacity: 0; transition: opacity 0.2s; z-index: 0; }
  .upload-zone:hover::before, .upload-zone.drag::before { opacity: 0.04; }
  .upload-zone:hover, .upload-zone.drag { border-color: transparent; box-shadow: 0 0 0 2px #FF6B6B, 0 0 0 3px #FFD93D, 0 0 0 4px #4D96FF; }
  .upload-inner { position: relative; z-index: 1; }
  .upload-emoji { font-size: 2.8rem; margin-bottom: 1rem; display: block; }
  .upload-title { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 700; color: #111; margin-bottom: 0.4rem; letter-spacing: -0.02em; }
  .upload-sub { font-size: 0.875rem; color: #888; font-weight: 300; }
  .upload-types { display: flex; gap: 0.4rem; margin-top: 1.5rem; justify-content: center; flex-wrap: wrap; }
  .type-pill { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.04em; padding: 4px 11px; border-radius: 20px; border: 1.5px solid; }
  .type-pill:nth-child(1) { color: #FF6B6B; border-color: #FF6B6B; background: #FF6B6B18; }
  .type-pill:nth-child(2) { color: #FF8E53; border-color: #FF8E53; background: #FF8E5318; }
  .type-pill:nth-child(3) { color: #d4a800; border-color: #FFD93D; background: #FFD93D18; }
  .type-pill:nth-child(4) { color: #339966; border-color: #6BCB77; background: #6BCB7718; }
  .type-pill:nth-child(5) { color: #4D96FF; border-color: #4D96FF; background: #4D96FF18; }
  .upload-cta { margin-top: 1.25rem; font-size: 0.82rem; font-weight: 600; color: #111; display: inline-flex; align-items: center; gap: 5px; }

  .doc-bar { display: flex; align-items: center; gap: 12px; background: #111; color: #f9f9f9; border-radius: 14px; padding: 0.9rem 1.25rem; margin-bottom: 1.5rem; }
  .doc-dot { width: 10px; height: 10px; border-radius: 50%; background: ${RAINBOW}; flex-shrink: 0; background-size: 200%; }
  .doc-name { font-size: 0.875rem; font-weight: 500; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .doc-change { font-size: 0.75rem; color: #666; cursor: pointer; flex-shrink: 0; transition: color 0.15s; }
  .doc-change:hover { color: #FF6B6B; }

  .chat-area { flex: 1; display: flex; flex-direction: column; overflow-y: auto; margin-bottom: 1.5rem; min-height: 300px; max-height: 50vh; }
  .empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.4rem; padding: 2.5rem 0; }
  .empty-title { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700; color: #222; letter-spacing: -0.02em; }
  .empty-sub { font-size: 0.82rem; color: #aaa; }
  .chips { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-top: 1.25rem; }
  .chip { background: #fff; border: 1.5px solid #e8e8e8; color: #444; font-size: 0.78rem; padding: 6px 13px; border-radius: 20px; cursor: pointer; transition: all 0.15s; font-family: 'Inter', sans-serif; font-weight: 400; }
  .chip:nth-child(1):hover { border-color: #FF6B6B; color: #FF6B6B; background: #FF6B6B08; }
  .chip:nth-child(2):hover { border-color: #FF8E53; color: #FF8E53; background: #FF8E5308; }
  .chip:nth-child(3):hover { border-color: #6BCB77; color: #339966; background: #6BCB7708; }
  .chip:nth-child(4):hover { border-color: #4D96FF; color: #4D96FF; background: #4D96FF08; }

  .msg { padding: 1rem 0; border-bottom: 1px solid #f0f0f0; display: flex; gap: 12px; align-items: flex-start; }
  .msg:last-child { border-bottom: none; }
  .msg-avatar { width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.02em; margin-top: 1px; }
  .msg-user .msg-avatar { background: #111; color: #fff; }
  .msg-assistant .msg-avatar { background: ${RAINBOW}; color: #fff; font-size: 0.65rem; }
  .msg-body { flex: 1; }
  .msg-label { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 0.3rem; color: #bbb; }
  .msg-text { font-size: 0.93rem; line-height: 1.75; color: #222; white-space: pre-wrap; }

  .input-row { display: flex; gap: 8px; padding-bottom: 2rem; }
  .q-input { flex: 1; border: 2px solid #e8e8e8; border-radius: 12px; padding: 0.8rem 1rem; font-family: 'Inter', sans-serif; font-size: 0.9rem; background: #fff; color: #111; outline: none; resize: none; height: 50px; transition: border-color 0.2s; }
  .q-input:focus { border-color: #4D96FF; }
  .q-input::placeholder { color: #ccc; }
  .send-btn { background: #111; color: #fff; border: none; border-radius: 12px; width: 50px; height: 50px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; transition: all 0.15s; flex-shrink: 0; position: relative; overflow: hidden; }
  .send-btn::after { content: ''; position: absolute; inset: 0; background: ${RAINBOW}; opacity: 0; transition: opacity 0.2s; }
  .send-btn:hover:not(:disabled)::after { opacity: 1; }
  .send-btn span { position: relative; z-index: 1; }
  .send-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  .thinking { display: flex; gap: 5px; align-items: center; padding: 1rem 0 1rem 40px; }
  .dot { width: 6px; height: 6px; border-radius: 50%; animation: bounce 1.2s infinite; }
  .dot:nth-child(1) { background: #FF6B6B; }
  .dot:nth-child(2) { background: #FFD93D; animation-delay: 0.2s; }
  .dot:nth-child(3) { background: #4D96FF; animation-delay: 0.4s; }
  @keyframes bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-7px); } }

  .error-bar { background: #fff0f0; border: 1.5px solid #ffcdd2; color: #c62828; border-radius: 10px; padding: 0.65rem 1rem; font-size: 0.84rem; margin-bottom: 1rem; }
  .hidden { display: none; }
`;

const SUGGESTIONS = [
  "What is this document about?",
  "Summarize the key points",
  "What are the main conclusions?",
  "List any action items",
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
        setDoc({ name: file.name, type: "pdf", base64: e.target.result.split(",")[1] });
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

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  }, [processFile]);

  const ask = async (question) => {
    if (!question.trim() || loading) return;
    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);

    try {
      const userContent = doc.type === "pdf"
        ? [
            { type: "document", source: { type: "base64", media_type: "application/pdf", data: doc.base64 } },
            { type: "text", text: question },
          ]
        : `Document: "${doc.name}"\n\n${doc.content}\n\n---\n\nQuestion: ${question}`;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 1000,
          system: "You are a precise document assistant. Answer questions based solely on the provided document. Be clear and concise. If the answer is not in the document, say so. Use plain text only — no markdown formatting.",
          messages: [{ role: "user", content: userContent }],
        }),
      });

      const data = await res.json();
      const answer = data.content?.[0]?.text ?? "Sorry, I couldn't generate a response.";
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch {
      setError("Request failed. Check your connection and try again.");
    }
    setLoading(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(input); }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <header className="header">
          <div className="logo-wrap">
            <div className="logo-icon" />
            <span className="logo">Docu.ask</span>
          </div>
          <span className="header-badge">AI Assistant</span>
        </header>

        <div className="rainbow-bar" />

        {error && <div className="error-bar">⚠ {error}</div>}

        {!doc ? (
          <div
            className={`upload-zone${dragOver ? " drag" : ""}`}
            onClick={() => fileRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
          >
            <div className="upload-inner">
              <span className="upload-emoji">📄</span>
              <div className="upload-title">Drop your document here</div>
              <div className="upload-sub">or click to browse files</div>
              <div className="upload-types">
                {["PDF", "TXT", "MD", "CSV", "JSON"].map((t) => (
                  <span key={t} className="type-pill">{t}</span>
                ))}
              </div>
              <span className="upload-cta">Select file →</span>
            </div>
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
              <div className="doc-dot" />
              <span className="doc-name">{doc.name}</span>
              <span className="doc-change" onClick={() => { setDoc(null); setMessages([]); setError(null); }}>
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
                      <button key={s} className="chip" onClick={() => ask(s)}>{s}</button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`msg msg-${m.role}`}>
                  <div className="msg-avatar">
                    {m.role === "user" ? "YOU" : "AI"}
                  </div>
                  <div className="msg-body">
                    <div className="msg-label">{m.role === "user" ? "You" : "Assistant"}</div>
                    <div className="msg-text">{m.content}</div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="thinking">
                  <div className="dot" /><div className="dot" /><div className="dot" />
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="input-row">
              <textarea
                className="q-input"
                placeholder="Ask a question about your document…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
              />
              <button
                className="send-btn"
                onClick={() => ask(input)}
                disabled={!input.trim() || loading}
                aria-label="Send"
              >
                <span>↑</span>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
