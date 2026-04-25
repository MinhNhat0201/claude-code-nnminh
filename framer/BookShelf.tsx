import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

// Baseline book height in px — per-book height = BASE_H * book.height
const BASE_H = 220

// Fallback spine colors when no spine data is provided (old CMS format compat)
const FALLBACK_COLORS = [
    "#3b1f1a", "#1b2a36", "#5a3a52", "#2d3a2a",
    "#3d3528", "#23304a", "#4a3a1f", "#2a3a2f",
]

// ── Demo books matching the books.jsx schema ─────────────────────────────────
const DEMO_BOOKS = [
    {
        id: "frankenstein",
        title: "Frankenstein",       author: "Mary Shelley",
        year: 1818,                  category: "Fiction",      status: "read",
        spine: { bg: "#3b1f1a", fg: "#e7d4a8", accent: "#b08a4a", texture: "leather" },
        height: 0.94, width: 1.0,
        blurb: "A young scientist assembles a creature from dead matter, animates it, and abandons what he has made.",
        review: "Read it for the monster, stay for Victor — he is the more terrifying of the two.",
        rating: 5,
    },
    {
        id: "moby-dick",
        title: "Moby-Dick",          author: "Herman Melville",
        year: 1851,                  category: "Fiction",      status: "reading",
        spine: { bg: "#1b2a36", fg: "#d8c48a", accent: "#a47438", texture: "cloth" },
        height: 1.0, width: 1.18,
        blurb: "A sailor signs onto a whaling voyage commanded by a captain hunting one specific whale.",
        review: "I am 400 pages in and have not regretted a single tangent on cetacean taxonomy.",
        rating: 5,
    },
    {
        id: "pride-prejudice",
        title: "Pride and Prejudice", author: "Jane Austen",
        year: 1813,                  category: "Fiction",      status: "read",
        spine: { bg: "#5a3a52", fg: "#f0e3cf", accent: "#c9a96a", texture: "cloth" },
        height: 0.88, width: 0.86,
        blurb: "Five sisters, one ambitious mother, and a marriage market in Regency England.",
        review: "The dialogue is sharper than anything written this century.",
        rating: 5,
    },
    {
        id: "dracula",
        title: "Dracula",            author: "Bram Stoker",
        year: 1897,                  category: "Fiction",      status: "read",
        spine: { bg: "#1a0d0d", fg: "#c8a25a", accent: "#7a1f1f", texture: "leather" },
        height: 0.96, width: 1.04,
        blurb: "A solicitor travels to a remote castle to finalize a property sale and meets his client.",
        review: "The epistolary format makes the dread sneak up on you.",
        rating: 4,
    },
    {
        id: "meditations",
        title: "Meditations",        author: "Marcus Aurelius",
        year: 180,                   category: "Philosophy",   status: "read",
        spine: { bg: "#3d3528", fg: "#e8d8a8", accent: "#b08a4a", texture: "leather" },
        height: 0.82, width: 0.78,
        blurb: "A Roman emperor's private notebook, written to himself, in twelve short books.",
        review: "I keep a copy on the nightstand. The Hays translation reads like a firm friend.",
        rating: 5,
    },
    {
        id: "walden",
        title: "Walden",             author: "Henry David Thoreau",
        year: 1854,                  category: "Philosophy",   status: "read",
        spine: { bg: "#2f3d2a", fg: "#dfd0a0", accent: "#8a6a3a", texture: "cloth" },
        height: 0.86, width: 0.84,
        blurb: "Thoreau builds a small cabin on a pond and lives there for two years.",
        review: "Skip the lecturing chapters. The descriptions of the pond are quiet, perfect prose.",
        rating: 4,
    },
    {
        id: "leaves-of-grass",
        title: "Leaves of Grass",    author: "Walt Whitman",
        year: 1855,                  category: "Poetry",       status: "reading",
        spine: { bg: "#4a3a1f", fg: "#ead29a", accent: "#c9a86a", texture: "leather" },
        height: 0.96, width: 1.02,
        blurb: "Whitman's lifelong poem-collection. Long lines, catalogues of America, the body and the soul.",
        review: "I read one section before bed. The 1855 edition still hits hardest.",
        rating: 5,
    },
    {
        id: "divine-comedy",
        title: "The Divine Comedy",  author: "Dante Alighieri",
        year: 1321,                  category: "Poetry",       status: "read",
        spine: { bg: "#5e1f1a", fg: "#e8c878", accent: "#c9a04a", texture: "leather" },
        height: 1.02, width: 1.1,
        blurb: "A guided tour of hell, purgatory, and paradise, written in terza rima.",
        review: "Inferno is famous; Purgatorio is the one that surprised me.",
        rating: 5,
    },
    {
        id: "origin",
        title: "On the Origin of Species", author: "Charles Darwin",
        year: 1859,                  category: "Science",      status: "want",
        spine: { bg: "#2a3a2f", fg: "#dccf9a", accent: "#8a6a3a", texture: "cloth" },
        height: 0.94, width: 0.98,
        blurb: "Darwin's argument for descent with modification by natural selection.",
        review: "On the shelf because I keep meaning to read primary sources. Soon.",
        rating: null,
    },
]

// Status metadata — supports both new keys ("read") and legacy ("Finished")
const STATUS_META: Record<string, { label: string; dot: string; bg: string; border: string }> = {
    read:           { label: "Read",         dot: "#5a8a4a", bg: "rgba(90,138,74,0.15)",   border: "rgba(90,138,74,0.4)"   },
    reading:        { label: "Reading",      dot: "#c9a04a", bg: "rgba(201,160,74,0.15)",  border: "rgba(201,160,74,0.4)"  },
    want:           { label: "Want to read", dot: "#9a8a7a", bg: "rgba(154,138,122,0.1)",  border: "rgba(154,138,122,0.3)" },
    // legacy CMS compat
    "Finished":     { label: "Finished",     dot: "#5a8a4a", bg: "rgba(90,138,74,0.15)",   border: "rgba(90,138,74,0.4)"   },
    "Reading":      { label: "Reading",      dot: "#c9a04a", bg: "rgba(201,160,74,0.15)",  border: "rgba(201,160,74,0.4)"  },
    "Want to Read": { label: "Want to read", dot: "#9a8a7a", bg: "rgba(154,138,122,0.1)",  border: "rgba(154,138,122,0.3)" },
}

// ── Color helpers ─────────────────────────────────────────────────────────────
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return { r, g, b }
}
function lighten(hex, a) {
    try { const { r, g, b } = hexToRgb(hex); return `rgb(${Math.min(255,r+a)},${Math.min(255,g+a)},${Math.min(255,b+a)})` } catch { return hex }
}
function darken(hex, a) {
    try { const { r, g, b } = hexToRgb(hex); return `rgb(${Math.max(0,r-a)},${Math.max(0,g-a)},${Math.max(0,b-a)})` } catch { return hex }
}

// Spine gradient differs between leather (richer, contrasty) and cloth (softer)
function spineGradient(bg: string, texture: string) {
    if (texture === "leather") {
        return `linear-gradient(155deg, ${lighten(bg,16)} 0%, ${bg} 38%, ${darken(bg,22)} 100%)`
    }
    return `linear-gradient(155deg, ${lighten(bg,30)} 0%, ${bg} 45%, ${darken(bg,10)} 100%)`
}

function spineBoxShadow(texture: string) {
    if (texture === "leather") {
        return "5px 20px 36px rgba(0,0,0,0.65), -2px 0 8px rgba(0,0,0,0.3), inset 1px 0 0 rgba(255,255,255,0.06)"
    }
    return "4px 18px 32px rgba(0,0,0,0.55), -1px 0 6px rgba(0,0,0,0.2)"
}

// ── Sub-components ────────────────────────────────────────────────────────────
function RatingStars({ rating, accentColor }: { rating: number | null; accentColor: string }) {
    if (!rating) return null
    return (
        <div style={{ display: "flex", gap: 2, marginBottom: 10 }}>
            {[1,2,3,4,5].map(n => (
                <span key={n} style={{ fontSize: 13, color: n <= rating ? accentColor : "rgba(255,255,255,0.12)", lineHeight: 1 }}>
                    ★
                </span>
            ))}
        </div>
    )
}

// ── Main component ────────────────────────────────────────────────────────────
export function BookShelf({
    books        = [],
    shelfHeight  = 400,
    perspective  = 900,
    bookAngle    = 58,
    shelfTilt    = 15,
    bookWidth    = 56,
    bookDepth    = 14,
    bookOverlap  = 20,
    zDepth       = 30,
    idleDrift    = true,
    previewMode  = false,
    showFilter   = true,
    maxBooks     = 0,
    previewHref  = "/library",
}) {
    const [selectedId, setSelectedId]     = useState<string | null>(null)
    const [activeCategory, setActiveCategory] = useState("All")

    const sourceBooks = books.length > 0 ? books : DEMO_BOOKS

    // Derive available categories from actual data
    const availCategories = ["All", ...Array.from(new Set(sourceBooks.map((b: any) => b.category ?? b.genre).filter(Boolean)))]

    const filtered = activeCategory === "All"
        ? sourceBooks
        : sourceBooks.filter((b: any) => (b.category ?? b.genre) === activeCategory)

    const displayBooks = maxBooks > 0 ? filtered.slice(0, maxBooks) : filtered

    const handleSelect = (book: any) => {
        if (previewMode) { window.location.href = previewHref; return }
        setSelectedId(prev => prev === book.id ? null : book.id)
    }

    const selectedBook = displayBooks.find((b: any) => b.id === selectedId)

    const filterBarH   = showFilter && !previewMode ? 44 : 0
    const shelfAreaH   = shelfHeight - filterBarH
    const shelfBoardH  = 14
    const totalBooks   = displayBooks.length
    const shelfWidth   = Math.max(totalBooks * (bookWidth - bookOverlap) + bookOverlap + 80, 300)

    return (
        <div style={{ width: "100%", height: shelfHeight, position: "relative", display: "flex", flexDirection: "column" }}>

            {/* ── Category filter bar ──────────────────────────────────────── */}
            {showFilter && !previewMode && (
                <div style={{
                    height: filterBarH,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    paddingLeft: 48,
                    paddingRight: 16,
                    flexShrink: 0,
                    overflowX: "auto",
                }}>
                    {availCategories.map(cat => {
                        const active = activeCategory === cat
                        return (
                            <motion.button
                                key={cat}
                                onClick={() => { setActiveCategory(cat); setSelectedId(null) }}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                style={{
                                    flexShrink: 0,
                                    background: active ? "rgba(255,255,255,0.11)" : "transparent",
                                    border: active ? "1px solid rgba(255,255,255,0.22)" : "1px solid rgba(255,255,255,0.07)",
                                    borderRadius: 20,
                                    color: active ? "#fff" : "rgba(255,255,255,0.38)",
                                    fontSize: 11,
                                    padding: "3px 11px",
                                    cursor: "pointer",
                                    fontWeight: active ? 600 : 400,
                                    letterSpacing: 0.3,
                                    transition: "all 0.15s",
                                }}
                            >
                                {cat}
                            </motion.button>
                        )
                    })}
                </div>
            )}

            {/* ── Shelf area ───────────────────────────────────────────────── */}
            <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
                {/* Perspective context — overflow MUST be visible; any other value
                    creates a stacking context that destroys preserve-3d children    */}
                <div style={{
                    perspective: `${perspective}px`,
                    perspectiveOrigin: "30% 85%",
                    width: "100%",
                    height: "100%",
                    overflow: "visible",
                }}>
                    {/* Drag for horizontal scroll — avoids overflow:auto which also
                        breaks preserve-3d. framer drag adds translateX cleanly.     */}
                    <motion.div
                        drag="x"
                        dragConstraints={{ right: 0, left: -(totalBooks * (bookWidth - bookOverlap) + 300) }}
                        dragElastic={0.06}
                        whileDrag={{ cursor: "grabbing" }}
                        animate={idleDrift ? { y: [0, -3, 0, 3, 0] } : {}}
                        transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
                        style={{
                            display: "inline-flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "flex-end",
                            paddingLeft: 48,
                            height: "100%",
                            cursor: "grab",
                            touchAction: "none",
                            rotateX: shelfTilt,
                            transformOrigin: "bottom center",
                            transformStyle: "preserve-3d",
                        }}
                    >
                        {/* ── Books row ──────────────────────────────────── */}
                        <div style={{
                            display: "inline-flex",
                            alignItems: "flex-end",
                            transformStyle: "preserve-3d",
                        }}>
                            <AnimatePresence mode="popLayout">
                                {displayBooks.map((book: any, i: number) => {
                                    const spine   = book.spine ?? {}
                                    const spineHex = spine.bg ?? book.spineColor ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length]
                                    const spineFg  = spine.fg ?? "#fff"
                                    const accent   = spine.accent ?? spineHex
                                    const texture  = spine.texture ?? "cloth"
                                    const bH = Math.round(BASE_H * (book.height ?? 1.0))
                                    const bW = Math.round(bookWidth * (book.width ?? 1.0))
                                    const isSelected = selectedId === book.id
                                    const baseZ = i * -zDepth

                                    return (
                                        <motion.div
                                            key={book.id}
                                            layout
                                            onClick={() => handleSelect(book)}
                                            /*
                                              ALL transform values here — never mix style.transform
                                              with animate on the same motion.div; framer-motion owns
                                              the transform property and silently drops style.transform
                                            */
                                            initial={{ rotateY: -bookAngle, z: baseZ, y: 0, opacity: 0 }}
                                            animate={{
                                                rotateY: isSelected ? 0      : -bookAngle,
                                                z:       isSelected ? baseZ + 70 : baseZ,
                                                y:       isSelected ? -18    : 0,
                                                opacity: 1,
                                            }}
                                            exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.18 } }}
                                            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                                            whileHover={!isSelected ? { y: -10, z: baseZ + 22, transition: { duration: 0.18 } } : {}}
                                            style={{
                                                width: bW,
                                                height: bH,
                                                marginLeft: i === 0 ? 0 : -bookOverlap,
                                                flexShrink: 0,
                                                cursor: "pointer",
                                                userSelect: "none",
                                                position: "relative",
                                                transformOrigin: "left center",
                                                transformStyle: "preserve-3d",
                                                // ⚠️ NO filter here — filter creates a stacking context
                                                // that flattens preserve-3d children.
                                            }}
                                        >
                                            {/* ── SPINE FACE ───────────────────────────── */}
                                            <div style={{
                                                position: "absolute",
                                                inset: 0,
                                                background: spineGradient(spineHex, texture),
                                                borderRadius: "3px 3px 2px 2px",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: 6,
                                                overflow: "hidden",
                                                boxShadow: spineBoxShadow(texture),
                                            }}>
                                                {/* Leather grain */}
                                                {texture === "leather" && (
                                                    <div style={{
                                                        position: "absolute", inset: 0, pointerEvents: "none",
                                                        background: "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.035) 3px, rgba(0,0,0,0.035) 4px)",
                                                    }} />
                                                )}
                                                {/* Cloth weave */}
                                                {texture === "cloth" && (
                                                    <div style={{
                                                        position: "absolute", inset: 0, pointerEvents: "none",
                                                        background: "repeating-linear-gradient(45deg, transparent 0px, transparent 2px, rgba(255,255,255,0.025) 2px, rgba(255,255,255,0.025) 3px)",
                                                    }} />
                                                )}
                                                {/* Accent rule — top */}
                                                <div style={{
                                                    position: "absolute", top: 11, left: 5, right: 5, height: 1,
                                                    background: `${accent}60`, borderRadius: 1,
                                                }} />
                                                {/* Accent rule — bottom */}
                                                <div style={{
                                                    position: "absolute", bottom: 11, left: 5, right: 5, height: 1,
                                                    background: `${accent}60`, borderRadius: 1,
                                                }} />

                                                {/* Title */}
                                                <span style={{
                                                    writingMode: "vertical-rl",
                                                    fontSize: 9, fontWeight: 600, fontVariant: "small-caps",
                                                    letterSpacing: 1.5,
                                                    opacity: isSelected ? 0 : 0.9,
                                                    color: spineFg,
                                                    pointerEvents: "none",
                                                    overflow: "hidden",
                                                    maxHeight: bH - 42,
                                                    whiteSpace: "nowrap",
                                                    textShadow: "0 1px 4px rgba(0,0,0,0.75)",
                                                    transition: "opacity 0.2s",
                                                    position: "relative", zIndex: 1,
                                                }}>
                                                    {book.title}
                                                </span>

                                                {/* Author */}
                                                {book.author && (
                                                    <span style={{
                                                        writingMode: "vertical-rl",
                                                        fontSize: 7, letterSpacing: 1,
                                                        opacity: isSelected ? 0 : 0.42,
                                                        color: spineFg,
                                                        pointerEvents: "none",
                                                        overflow: "hidden",
                                                        maxHeight: 60,
                                                        whiteSpace: "nowrap",
                                                        textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                                                        transition: "opacity 0.2s",
                                                        position: "relative", zIndex: 1,
                                                    }}>
                                                        {book.author}
                                                    </span>
                                                )}
                                            </div>

                                            {/* ── PAGES FACE (right side — book thickness) ─
                                                Geometry: child at left=bW, rotateY(90°)
                                                around its left edge → extends perpendicular
                                                behind the spine (into -Z).                 */}
                                            <div style={{
                                                position: "absolute",
                                                top: 3, left: bW,
                                                width: bookDepth, height: bH - 6,
                                                background: "linear-gradient(to right, #b8b3ab 0%, #ddd9d1 30%, #eee9e1 70%, #f4f0e8 100%)",
                                                transformOrigin: "left center",
                                                transform: "rotateY(90deg)",
                                                borderRadius: "0 2px 2px 0",
                                            }} />

                                            {/* ── TOP CAP ─────────────────────────────────
                                                rotateX(90°) from top edge: normal tilts upward,
                                                visible as a strip on top of the book.         */}
                                            <div style={{
                                                position: "absolute",
                                                top: 0, left: 2,
                                                width: bW - 4, height: bookDepth,
                                                background: `linear-gradient(to bottom, ${darken(spineHex, 5)} 0%, ${darken(spineHex, 22)} 100%)`,
                                                transformOrigin: "top center",
                                                transform: "rotateX(90deg)",
                                                borderRadius: "2px 2px 0 0",
                                            }} />
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>
                        </div>

                        {/* ── SHELF BOARD ──────────────────────────────────────
                            Wooden plank under the books with grain lines
                            and a 3D front-lip face via rotateX(-90deg).        */}
                        <div style={{
                            flexShrink: 0,
                            width: shelfWidth,
                            height: shelfBoardH,
                            background: "linear-gradient(to bottom, #c8aa82 0%, #a8845a 40%, #8a6840 100%)",
                            borderRadius: "0 0 4px 4px",
                            boxShadow: "0 6px 24px rgba(0,0,0,0.55), inset 0 2px 0 rgba(255,255,255,0.12)",
                            position: "relative",
                            transformStyle: "preserve-3d",
                            marginLeft: -48,
                        }}>
                            {/* Wood grain lines */}
                            <div style={{
                                position: "absolute", inset: 0,
                                borderRadius: "0 0 4px 4px",
                                background: "repeating-linear-gradient(90deg, transparent 0px, transparent 18px, rgba(0,0,0,0.04) 18px, rgba(0,0,0,0.04) 19px)",
                                pointerEvents: "none",
                            }} />
                            {/* Front lip */}
                            <div style={{
                                position: "absolute", bottom: 0, left: 0, right: 0,
                                height: shelfBoardH,
                                background: "linear-gradient(to bottom, #8a6840 0%, #6b4e2c 100%)",
                                transformOrigin: "top center",
                                transform: "rotateX(-90deg)",
                                borderRadius: "0 0 3px 3px",
                            }} />
                        </div>

                        {/* ── FLOOR SHADOW ──────────────────────────────────── */}
                        <div style={{
                            flexShrink: 0,
                            width: shelfWidth,
                            height: 20,
                            background: "radial-gradient(ellipse at 40% 50%, rgba(0,0,0,0.45) 0%, transparent 70%)",
                            transformOrigin: "top center",
                            transform: "rotateX(90deg)",
                            marginLeft: -48,
                            pointerEvents: "none",
                        }} />
                    </motion.div>
                </div>

                {/* ── Detail panel ─────────────────────────────────────────── */}
                <AnimatePresence>
                    {selectedBook && (
                        <motion.div
                            key="detail"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            style={{
                                position: "absolute",
                                top: 12, right: 12,
                                width: 252,
                                background: "rgba(10,10,14,0.98)",
                                backdropFilter: "blur(20px)",
                                borderRadius: 14,
                                border: "1px solid rgba(255,255,255,0.08)",
                                overflow: "hidden",
                                color: "#fff",
                                zIndex: 20,
                                boxShadow: "0 24px 64px rgba(0,0,0,0.75)",
                            }}
                        >
                            {/* Spine-color accent bar */}
                            <div style={{
                                height: 3,
                                background: selectedBook.spine?.accent
                                    ?? selectedBook.spine?.bg
                                    ?? selectedBook.spineColor
                                    ?? "#888",
                            }} />

                            <div style={{
                                padding: 18,
                                maxHeight: shelfAreaH - 80,
                                overflowY: "auto",
                            }}>
                                {selectedBook.coverImage && (
                                    <img
                                        src={selectedBook.coverImage}
                                        alt={selectedBook.title}
                                        style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", borderRadius: 8, marginBottom: 14, display: "block" }}
                                    />
                                )}

                                <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, lineHeight: 1.3, color: "#f5efe0" }}>
                                    {selectedBook.title}
                                </h2>

                                <p style={{ margin: "4px 0 10px", fontSize: 12, color: "rgba(255,255,255,0.38)", lineHeight: 1.4 }}>
                                    {selectedBook.author}
                                    {selectedBook.year != null ? ` · ${selectedBook.year < 0 ? Math.abs(selectedBook.year) + " BC" : selectedBook.year}` : ""}
                                </p>

                                {/* Star rating */}
                                <RatingStars
                                    rating={selectedBook.rating}
                                    accentColor={selectedBook.spine?.accent ?? "#c9a04a"}
                                />

                                {/* Status + category pills */}
                                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
                                    {selectedBook.status && (() => {
                                        const s = STATUS_META[selectedBook.status] ?? STATUS_META["want"]
                                        return (
                                            <span style={{
                                                fontSize: 10, padding: "2px 8px", borderRadius: 20,
                                                background: s.bg, border: `1px solid ${s.border}`,
                                                display: "inline-flex", alignItems: "center", gap: 4,
                                            }}>
                                                <span style={{
                                                    width: 5, height: 5, borderRadius: "50%",
                                                    background: s.dot, flexShrink: 0, display: "inline-block",
                                                }} />
                                                {s.label}
                                            </span>
                                        )
                                    })()}
                                    {(selectedBook.category ?? selectedBook.genre) && (
                                        <span style={{
                                            fontSize: 10, padding: "2px 8px", borderRadius: 20,
                                            background: "rgba(255,255,255,0.05)",
                                            border: "1px solid rgba(255,255,255,0.07)",
                                            color: "rgba(255,255,255,0.5)",
                                        }}>
                                            {selectedBook.category ?? selectedBook.genre}
                                        </span>
                                    )}
                                </div>

                                {/* Blurb (italic summary) */}
                                {selectedBook.blurb && (
                                    <p style={{
                                        fontSize: 11.5, lineHeight: 1.7,
                                        color: "rgba(255,255,255,0.42)",
                                        margin: "0 0 10px",
                                        fontStyle: "italic",
                                    }}>
                                        {selectedBook.blurb}
                                    </p>
                                )}

                                {/* Personal review / notes */}
                                {(selectedBook.review ?? selectedBook.notes) && (
                                    <div style={{
                                        borderTop: "1px solid rgba(255,255,255,0.06)",
                                        paddingTop: 10, marginBottom: 14,
                                    }}>
                                        <p style={{
                                            fontSize: 10, margin: "0 0 5px",
                                            color: "rgba(255,255,255,0.22)",
                                            textTransform: "uppercase", letterSpacing: 1,
                                        }}>
                                            My notes
                                        </p>
                                        <p style={{ fontSize: 12, lineHeight: 1.65, color: "rgba(255,255,255,0.62)", margin: 0 }}>
                                            {selectedBook.review ?? selectedBook.notes}
                                        </p>
                                    </div>
                                )}

                                <button
                                    onClick={() => setSelectedId(null)}
                                    style={{
                                        background: "transparent",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: 8, color: "rgba(255,255,255,0.45)",
                                        padding: "7px 14px", fontSize: 12,
                                        cursor: "pointer", width: "100%",
                                    }}
                                >
                                    ← Back to shelf
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

addPropertyControls(BookShelf, {
    shelfHeight: { type: ControlType.Number,  title: "Shelf Height",  defaultValue: 400,  min: 200, max: 600,  step: 10, unit: "px", displayStepper: true },
    perspective:  { type: ControlType.Number,  title: "Perspective",   defaultValue: 900,  min: 400, max: 1600, step: 50, unit: "px", displayStepper: true },
    bookAngle:    { type: ControlType.Number,  title: "Book Angle",    defaultValue: 58,   min: 20,  max: 80,   step: 1,  unit: "°",  displayStepper: true },
    shelfTilt:    { type: ControlType.Number,  title: "Shelf Tilt",    defaultValue: 15,   min: 0,   max: 30,   step: 1,  unit: "°",  displayStepper: true },
    bookWidth:    { type: ControlType.Number,  title: "Book Width",    defaultValue: 56,   min: 28,  max: 100,  step: 2,  unit: "px", displayStepper: true },
    bookDepth:    { type: ControlType.Number,  title: "Book Depth",    defaultValue: 14,   min: 4,   max: 40,   step: 1,  unit: "px", displayStepper: true },
    bookOverlap:  { type: ControlType.Number,  title: "Overlap",       defaultValue: 20,   min: 0,   max: 50,   step: 1,  unit: "px", displayStepper: true },
    zDepth:       { type: ControlType.Number,  title: "Z Depth",       defaultValue: 30,   min: 5,   max: 80,   step: 1,  unit: "px", displayStepper: true },
    idleDrift:    { type: ControlType.Boolean, title: "Idle Drift",    defaultValue: true,  enabledTitle: "On",                    disabledTitle: "Off" },
    previewMode:  { type: ControlType.Boolean, title: "Preview Mode",  defaultValue: false, enabledTitle: "Homepage (link out)",   disabledTitle: "Full library" },
    showFilter:   { type: ControlType.Boolean, title: "Show Filter",   defaultValue: true,  enabledTitle: "On",                    disabledTitle: "Off",          hidden: (p) => p.previewMode },
    maxBooks:     { type: ControlType.Number,  title: "Max Books",     defaultValue: 0,    min: 0,   max: 20,   step: 1,  displayStepper: true },
    previewHref:  { type: ControlType.String,  title: "Preview Link",  defaultValue: "/library", hidden: (props) => !props.previewMode },
})
