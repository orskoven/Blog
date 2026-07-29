import React, { useState, useEffect, useRef, useMemo } from "react";

/**
 * MARGINALIA
 * A quiet, print-inspired reading space.
 *
 * Design concept
 * ── Palette   ink #121110 · parchment #ECE4CF · rule #34302A · brick #A8452E · gold #B79355
 * ── Display   "Fraunces" — a characterful, high-contrast serif for mastheads & titles
 * ── Body      "Source Serif 4" — a calm reading face
 * ── Utility   "IBM Plex Mono" — dates, indices, marginal notes
 * ── Signature Marginalia: a handwritten-feeling annotation that appears beside a
 *              paragraph on hover/focus, as if a previous reader left a note in the margin.
 */

const FONT_IMPORT_HREF =
  "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap";

const POSTS = [
  {
    id: "quiet-margin",
    index: "I",
    date: "2026.03.02",
    minutes: 6,
    title: "The quiet in the margin",
    dek: "On the strange privacy of writing notes no one asked for, in books that were never really ours to begin with.",
    note: "I used to think marginalia was vandalism. Then I found my mother's copy of Middlemarch.",
    body: [
      "Every book I love has been written in twice — once by its author, and once by me, in the thin white margin that publishers leave, I suspect, exactly for this purpose. A pencil mark beside a sentence is a small, private argument. It says: I was here, and I did not agree, or I did not understand, or I understood too well.",
      "There is a particular kind of intimacy in reading a used book. Someone else's underlining becomes a second, quieter narrator — pointing at what mattered to them, which is never quite what matters to you. You read against their attention as much as with it.",
      "I keep a shelf of books I bought secondhand for no reason but the handwriting inside them. A stranger's checkmark beside a line about grief. An exclamation point, twice underlined, next to a joke that (I checked) is not that funny. These are the only diaries most of us will ever keep — scattered across other people's books, unsigned, undated, and more honest for it.",
      "When I write in a margin now, I try to remember that I am not writing to myself. I am writing to whoever finds this next, in a used bookshop or a box left on a curb, ten or forty years from now. It is, in its own small way, a letter with no address.",
    ],
  },
  {
    id: "letterpress",
    index: "II",
    date: "2026.02.14",
    minutes: 8,
    title: "What the press left behind",
    dek: "A visit to a letterpress shop, and a slow argument for the value of things that resist being fast.",
    note: "The type cases smelled like machine oil and cut paper. I did not want to leave.",
    body: [
      "The letters arrive in trays, sorted by size and face, each one a small mirror of itself — you read them backwards, and if you have set enough type you stop noticing the reversal at all, the way a pianist stops seeing individual keys.",
      "There is no undo in letterpress. A misspelled word means pulling the whole line, letter by letter, with a tool called a bodkin that looks like it belongs in a different, older kind of violence. This should feel like a limitation. Instead it feels like a discipline — the same one that makes a sentence better when you know you cannot easily take it back.",
      "I asked the printer, an unhurried man named Basil, why he still did this by hand when a machine could do it in a tenth of the time. He didn't look up from the chase he was locking. 'The machine can do it faster,' he said, 'it can't do it slower.' I have thought about that sentence more than almost anything I read that year.",
      "Digital text is endlessly, silently correctable, which is its gift and also, I think, a small tax on our attention. Nothing asks to be gotten right the first time anymore. Letterpress, stubbornly, still does.",
    ],
  },
  {
    id: "unsent",
    index: "III",
    date: "2026.01.09",
    minutes: 5,
    title: "The unsent letter",
    dek: "Why the drafts we never send might be the most honest writing we do — and what that says about the writing we do send.",
    note: "I have four hundred and twelve drafts. I have sent maybe six of them.",
    body: [
      "Somewhere on an old hard drive is a letter I wrote to a friend after an argument neither of us ever really recovered from. I wrote it in one sitting, at two in the morning, and read it back once, and did not send it. I have read it perhaps a dozen times since. It remains, eleven years later, the truest thing I have ever written to another person.",
      "There is a particular clarity that arrives the moment you decide something will not be read. The audience falls away, and with it the small, constant calibrations we make for an audience — the softening, the qualifying, the jokes that exist only to make a hard thing easier to receive. What's left is closer to the actual shape of the feeling.",
      "I don't think the answer is to send more unsent letters. Some things are better left as private weather. But I have started keeping them, instead of deleting them, in a folder labeled simply Drafts. Not to send. Just to remember what I meant, before I remembered who was listening.",
    ],
  },
  {
    id: "footnote",
    index: "IV",
    date: "2025.12.20",
    minutes: 7,
    title: "In defense of the footnote",
    dek: "The footnote as an act of hospitality — a door left open for the reader who wants to go further, and a door easily ignored by the one who doesn't.",
    note: "A good footnote is a host, not a hallway. It shows you the door and lets you choose.",
    body: [
      "A footnote is one of the few devices in writing that respects two readers at once. The one who wants the clean, uninterrupted line of the argument, and the one who wants to know exactly where the third claim in paragraph two came from, and whether it holds up. Both readers get what they came for, on the same page, without apology to either.",
      "This is harder to do than it looks. A bad footnote is a tangent wearing a small font, dragging the reader sideways out of the sentence they were in the middle of trusting. A good footnote is closer to a door left ajar — visible, optional, and quietly generous.",
      "I think about this whenever a piece of writing tries to do everything in the main text, hedging every claim in real time, qualifying itself into paralysis. Sometimes the kindest thing a sentence can do is finish, cleanly, and let the footnote hold the rest.",
    ],
  },
];

function useFontLoader() {
  useEffect(() => {
    if (document.getElementById("marginalia-fonts")) return;
    const link = document.createElement("link");
    link.id = "marginalia-fonts";
    link.rel = "stylesheet";
    link.href = FONT_IMPORT_HREF;
    document.head.appendChild(link);
  }, []);
}

function Rule({ style }) {
  return (
    <div
      style={{
        height: 1,
        background:
          "linear-gradient(90deg, transparent, var(--rule) 12%, var(--rule) 88%, transparent)",
        ...style,
      }}
    />
  );
}

function Masthead({ onHome, active }) {
  return (
    <header className="masthead">
      <button className="wordmark" onClick={onHome} aria-label="Marginalia — home">
        <span className="wordmark-glyph">§</span>
        <span className="wordmark-text">Marginalia</span>
      </button>
      <div className="masthead-meta">
        <span>Notes on reading &amp; writing, kept slowly</span>
        <span className="masthead-dot">·</span>
        <span>{active}</span>
      </div>
    </header>
  );
}

function Index({ n }) {
  return <span className="index-mark">{n}</span>;
}

function PostRow({ post, onOpen, showMargin, setShowMargin }) {
  return (
    <article
      className="row"
      onMouseEnter={() => setShowMargin(post.id)}
      onMouseLeave={() => setShowMargin(null)}
      onFocus={() => setShowMargin(post.id)}
      onBlur={() => setShowMargin(null)}
    >
      <div className="row-rail">
        <Index n={post.index} />
        <span className="row-date">{post.date}</span>
      </div>

      <button className="row-main" onClick={() => onOpen(post.id)}>
        <h2 className="row-title">{post.title}</h2>
        <p className="row-dek">{post.dek}</p>
        <span className="row-meta">
          {post.minutes} min read <span className="row-arrow">read →</span>
        </span>
      </button>

      <div
        className={
          "row-margin" + (showMargin === post.id ? " row-margin--visible" : "")
        }
        aria-hidden={showMargin !== post.id}
      >
        <span className="margin-mark">✎</span>
        <p>{post.note}</p>
      </div>
    </article>
  );
}

function Paragraph({ text, note, isOpen, onToggle }) {
  return (
    <div
      className="para"
      onMouseEnter={onToggle}
      onMouseLeave={() => onToggle(false)}
    >
      <p className="para-text">{text}</p>
      {note && (
        <div className={"para-note" + (isOpen ? " para-note--visible" : "")}>
          <span className="margin-mark">✎</span>
          <p>{note}</p>
        </div>
      )}
    </div>
  );
}

function Reader({ post, onBack, all }) {
  const [hoverIdx, setHoverIdx] = useState(null);
  const marginNotes = useMemo(
    () => ({
      0: post.note,
    }),
    [post]
  );

  const idx = all.findIndex((p) => p.id === post.id);
  const next = all[(idx + 1) % all.length];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [post]);

  return (
    <article className="reader">
      <button className="back-link" onClick={onBack}>
        ← All notes
      </button>

      <div className="reader-head">
        <div className="reader-rail">
          <Index n={post.index} />
          <span className="row-date">{post.date}</span>
          <span className="row-meta">{post.minutes} min read</span>
        </div>
        <h1 className="reader-title">{post.title}</h1>
        <p className="reader-dek">{post.dek}</p>
      </div>

      <Rule style={{ margin: "2.25rem 0 2.5rem" }} />

      <div className="reader-body">
        {post.body.map((text, i) => (
          <Paragraph
            key={i}
            text={text}
            note={marginNotes[i]}
            isOpen={hoverIdx === i}
            onToggle={(v) => setHoverIdx(v === false ? null : i)}
          />
        ))}
      </div>

      <Rule style={{ margin: "3rem 0 2rem" }} />

      <button className="next-card" onClick={() => onBack(next.id)}>
        <span className="next-label">Next note</span>
        <span className="next-title">{next.title}</span>
      </button>
    </article>
  );
}

export default function App() {
  useFontLoader();
  const [openId, setOpenId] = useState(null);
  const [hoverRow, setHoverRow] = useState(null);
  const containerRef = useRef(null);

  const post = POSTS.find((p) => p.id === openId);

  const handleOpen = (id) => {
    if (id === undefined) return;
    if (id === false) return setOpenId(null);
    setOpenId(id);
  };

  return (
    <div className="app" ref={containerRef}>
      <style>{`
        :root {
          --ink: #121110;
          --ink-raised: #171513;
          --parchment: #ECE4CF;
          --parchment-dim: #B8AF98;
          --parchment-faint: #7d7666;
          --rule: #34302A;
          --brick: #C1603F;
          --gold: #B79355;
        }

        * { box-sizing: border-box; }

        .app {
          background: var(--ink);
          color: var(--parchment);
          min-height: 100vh;
          font-family: 'Source Serif 4', Georgia, serif;
          -webkit-font-smoothing: antialiased;
          padding: 0 1.5rem 6rem;
        }

        .app :focus-visible {
          outline: 1px solid var(--gold);
          outline-offset: 3px;
        }

        /* ---------- masthead ---------- */

        .masthead {
          max-width: 760px;
          margin: 0 auto;
          padding: 4.5rem 0 2.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .wordmark {
          display: inline-flex;
          align-items: baseline;
          gap: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          width: fit-content;
          color: var(--parchment);
        }

        .wordmark-glyph {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-weight: 500;
          font-size: 2rem;
          color: var(--brick);
          line-height: 1;
        }

        .wordmark-text {
          font-family: 'Fraunces', serif;
          font-optical-sizing: auto;
          font-weight: 600;
          font-size: 2rem;
          letter-spacing: -0.01em;
        }

        .masthead-meta {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.02em;
          color: var(--parchment-faint);
          display: flex;
          gap: 0.6rem;
          align-items: center;
          text-transform: uppercase;
        }

        .masthead-dot { color: var(--rule); }

        /* ---------- index list ---------- */

        .list {
          max-width: 760px;
          margin: 0 auto;
        }

        .row {
          position: relative;
          display: grid;
          grid-template-columns: 84px 1fr;
          gap: 1.75rem;
          padding: 2.5rem 0;
          border-top: 1px solid var(--rule);
        }

        .row:last-child { border-bottom: 1px solid var(--rule); }

        .row-rail {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          padding-top: 0.2rem;
        }

        .index-mark {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 1.5rem;
          color: var(--gold);
          line-height: 1;
        }

        .row-date {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          color: var(--parchment-faint);
          letter-spacing: 0.02em;
        }

        .row-main {
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          padding: 0;
          color: inherit;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }

        .row-title {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 1.55rem;
          line-height: 1.25;
          margin: 0;
          letter-spacing: -0.01em;
          transition: color 0.15s ease;
        }

        .row-main:hover .row-title,
        .row-main:focus-visible .row-title { color: var(--brick); }

        .row-dek {
          margin: 0;
          font-size: 1rem;
          line-height: 1.6;
          color: var(--parchment-dim);
          max-width: 54ch;
        }

        .row-meta {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          color: var(--parchment-faint);
          text-transform: uppercase;
          letter-spacing: 0.03em;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 0.3rem;
        }

        .row-arrow {
          color: var(--brick);
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 0.15s ease, transform 0.15s ease;
        }

        .row-main:hover .row-arrow,
        .row-main:focus-visible .row-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        /* ---------- signature: the margin note ---------- */

        .row-margin,
        .para-note {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 0.92rem;
          line-height: 1.5;
          color: var(--gold);
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.25s ease, transform 0.25s ease;
          pointer-events: none;
        }

        .row-margin {
          position: absolute;
          right: -2px;
          top: 2.6rem;
          width: 220px;
          display: none;
        }

        .margin-mark {
          display: inline-block;
          color: var(--brick);
          margin-right: 0.35rem;
          font-style: normal;
        }

        .row-margin p, .para-note p { margin: 0.25rem 0 0; display: inline; }

        @media (min-width: 1040px) {
          .row-margin {
            display: block;
            left: calc(100% + 2.25rem);
            right: auto;
            top: 3rem;
          }
          .row-margin--visible { opacity: 1; transform: translateY(0); }
        }

        /* ---------- reader ---------- */

        .reader {
          max-width: 640px;
          margin: 0 auto;
          padding-top: 3rem;
          position: relative;
        }

        .back-link {
          background: none;
          border: none;
          color: var(--parchment-faint);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          cursor: pointer;
          padding: 0;
          margin-bottom: 2.5rem;
          transition: color 0.15s ease;
        }

        .back-link:hover, .back-link:focus-visible { color: var(--brick); }

        .reader-rail {
          display: flex;
          align-items: baseline;
          gap: 0.9rem;
          margin-bottom: 1rem;
        }

        .reader-title {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: clamp(2rem, 4.5vw, 2.9rem);
          line-height: 1.12;
          letter-spacing: -0.015em;
          margin: 0 0 1rem;
        }

        .reader-dek {
          font-size: 1.15rem;
          line-height: 1.6;
          color: var(--parchment-dim);
          margin: 0;
          max-width: 56ch;
        }

        .reader-body {
          display: flex;
          flex-direction: column;
          gap: 1.6rem;
        }

        .para { position: relative; }

        .para-text {
          font-size: 1.15rem;
          line-height: 1.85;
          margin: 0;
          color: var(--parchment);
        }

        .para-note {
          position: absolute;
          left: calc(100% + 2.25rem);
          top: 0.2rem;
          width: 210px;
        }

        @media (min-width: 1100px) {
          .para-note--visible { opacity: 1; transform: translateY(0); }
        }

        .next-card {
          width: 100%;
          background: var(--ink-raised);
          border: 1px solid var(--rule);
          border-radius: 2px;
          padding: 1.6rem 1.8rem;
          text-align: left;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          color: inherit;
          transition: border-color 0.15s ease;
        }

        .next-card:hover, .next-card:focus-visible {
          border-color: var(--brick);
        }

        .next-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--parchment-faint);
        }

        .next-title {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 1.3rem;
        }

        /* ---------- footer ---------- */

        .footer {
          max-width: 760px;
          margin: 5rem auto 0;
          padding-top: 2rem;
          border-top: 1px solid var(--rule);
          display: flex;
          justify-content: space-between;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.68rem;
          color: var(--parchment-faint);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        @media (max-width: 640px) {
          .row { grid-template-columns: 1fr; gap: 0.6rem; }
          .row-rail { flex-direction: row; align-items: baseline; gap: 0.6rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .row-title, .row-arrow, .row-margin, .para-note, .next-card, .back-link {
            transition: none !important;
          }
        }
      `}</style>

      <Masthead
        onHome={() => setOpenId(null)}
        active={post ? `Reading — ${post.title}` : `${POSTS.length} notes`}
      />

      {post ? (
        <Reader post={post} onBack={handleOpen} all={POSTS} />
      ) : (
        <div className="list">
          {POSTS.map((p) => (
            <PostRow
              key={p.id}
              post={p}
              onOpen={setOpenId}
              showMargin={hoverRow}
              setShowMargin={setHoverRow}
            />
          ))}
        </div>
      )}

      <footer className="footer">
        <span>Marginalia, kept since 2025</span>
        <span>No newsletter. No noise.</span>
      </footer>
    </div>
  );
}
