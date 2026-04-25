import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

const SPINE_COLORS = [
    "#1B2A4A", "#C9A84C", "#D4C5A9", "#7B2D3E",
    "#2D5A3D", "#C4704A", "#5C6B3A", "#4A5568", "#F5F0E8",
]

const SPINE_HEIGHTS = [220, 195, 240, 180, 215, 200, 235, 190, 210]

const DEMO_BOOKS = [
    { id: "d1", title: "Atomic Habits",               author: "James Clear",     status: "Finished",     genre: "Self-help",   spineColor: "#1B2A4A", notes: "Tiny changes, remarkable results." },
    { id: "d2", title: "The Design of Everyday Things", author: "Don Norman",    status: "Finished",     genre: "Design",      spineColor: "#7B2D3E", notes: "Why design matters." },
    { id: "d3", title: "Thinking, Fast and Slow",     author: "Daniel Kahneman", status: "Reading",      genre: "Psychology",  spineColor: "#2D5A3D", notes: "Two systems of thinking." },
    { id: "d4", title: "Deep Work",                   author: "Cal Newport",     status: "Finished",     genre: "Productivity",spineColor: "#C9A84C", notes: "Focus is the new IQ." },
    { id: "d5", title: "Dune",                        author: "Frank Herbert",   status: "Want to Read", genre: "Fiction",     spineColor: "#C4704A", notes: "A universe awaits." },
    { id: "d6", title: "Show Your Work",              author: "Austin Kleon",    status: "Finished",     genre: "Creativity",  spineColor: "#5C6B3A", notes: "Share your creative process." },
]

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return { r, g, b }
}
function lighten(hex, amount) {
    try { const { r, g, b } = hexToRgb(hex); return `rgb(${Math.min(255, r + amount)},${Math.min(255, g + amount)},${Math.min(255, b + amount)})` } catch { return hex }
}
function darken(hex, amount) {
    try { const { r, g, b } = hexToRgb(hex); return `rgb(${Math.max(0, r - amount)},${Math.max(0, g - amount)},${Math.max(0, b - amount)})` } catch { return hex }
}

export function BookShelf({
    books        = [],
    shelfHeight  = 360,
    perspective  = 900,
    bookAngle    = 58,
    shelfTilt    = 12,
    bookWidth    = 56,
    bookOverlap  = 18,
    zDepth       = 28,
    idleDrift    = true,
    previewMode  = false,
    maxBooks     = 0,
    previewHref  = "/library",
}) {
    const [selectedId, setSelectedId] = useState(null)

    const sourceBooks  = books.length > 0 ? books : DEMO_BOOKS
    const displayBooks = maxBooks > 0 ? sourceBooks.slice(0, maxBooks) : sourceBooks

    const handleSelect = (book) => {
        if (previewMode) { window.location.href = previewHref; return }
        setSelectedId((prev) => (prev === book.id ? null : book.id))
    }

    const selectedBook = displayBooks.find((b) => b.id === selectedId)

    return (
        <div style={{ width: "100%", height: shelfHeight, position: "relative" }}>

            {/*
              Perspective wrapper.
              MUST be overflow:visible — any other overflow value creates a
              stacking context that flattens transform-style:preserve-3d children.
            */}
            <div
                style={{
                    perspective: `${perspective}px`,
                    perspectiveOrigin: "30% 85%",
                    width: "100%",
                    height: "100%",
                    overflow: "visible",
                }}
            >
                {/*
                  Drag replaces CSS overflow:auto for horizontal scrolling.
                  overflow:auto on this element would break preserve-3d on children.
                  framer-motion drag adds translateX without a new stacking context.
                */}
                <motion.div
                    drag="x"
                    dragConstraints={{ right: 0, left: -(displayBooks.length * (bookWidth - bookOverlap) + 200) }}
                    dragElastic={0.08}
                    whileDrag={{ cursor: "grabbing" }}
                    animate={idleDrift ? { y: [0, -3, 0, 3, 0] } : {}}
                    transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
                    style={{
                        display: "inline-flex",
                        alignItems: "flex-end",
                        paddingLeft: 40,
                        paddingBottom: 8,
                        height: "100%",
                        cursor: "grab",
                        touchAction: "none",
                        // Shelf tilt — whole row leans back toward horizon
                        rotateX: shelfTilt,
                        transformOrigin: "bottom center",
                        // preserve-3d propagates rotateX and each book's z/rotateY
                        transformStyle: "preserve-3d",
                    }}
                >
                    {displayBooks.map((book, i) => {
                        const color     = book.spineColor || SPINE_COLORS[i % SPINE_COLORS.length]
                        const height    = SPINE_HEIGHTS[i % SPINE_HEIGHTS.length]
                        const isSelected = selectedId === book.id
                        const baseZ     = i * -zDepth   // each book recedes behind the previous

                        return (
                            <motion.div
                                key={book.id}
                                onClick={() => handleSelect(book)}
                                /*
                                  ALL transform values live in animate — never mix
                                  style.transform with animate on the same motion.div,
                                  framer-motion owns the transform property entirely.
                                */
                                initial={{
                                    rotateY: -bookAngle,
                                    z: baseZ,
                                    y: 0,
                                }}
                                animate={{
                                    rotateY: isSelected ? 0 : -bookAngle,
                                    z:       isSelected ? baseZ + 60 : baseZ,
                                    y:       isSelected ? -16 : 0,
                                }}
                                transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
                                whileHover={!isSelected ? { y: -10, z: baseZ + 20, transition: { duration: 0.18 } } : {}}
                                style={{
                                    width: bookWidth,
                                    height,
                                    marginLeft: i === 0 ? 0 : -bookOverlap,
                                    flexShrink: 0,
                                    transformOrigin: "left center",
                                    transformStyle: "preserve-3d",
                                    cursor: "pointer",
                                    userSelect: "none",
                                    borderRadius: "3px 3px 2px 2px",
                                    background: `linear-gradient(160deg, ${lighten(color, 18)} 0%, ${color} 45%, ${darken(color, 10)} 100%)`,
                                    boxShadow: `
                                        inset -4px 0 8px rgba(0,0,0,0.4),
                                        inset 0 2px 0 rgba(255,255,255,0.18),
                                        6px 14px 32px rgba(0,0,0,0.5)
                                    `,
                                    position: "relative",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {/* Spine label */}
                                <span
                                    style={{
                                        writingMode: "vertical-rl",
                                        fontSize: 9,
                                        fontVariant: "small-caps",
                                        letterSpacing: 1.5,
                                        opacity: isSelected ? 0 : 0.55,
                                        color: "#fff",
                                        pointerEvents: "none",
                                        overflow: "hidden",
                                        maxHeight: height - 20,
                                        whiteSpace: "nowrap",
                                        textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                                        transition: "opacity 0.2s",
                                    }}
                                >
                                    {book.title}
                                </span>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </div>

            {/* Detail panel */}
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
                            top: 12,
                            right: 12,
                            width: 240,
                            background: "rgba(12,12,16,0.97)",
                            backdropFilter: "blur(20px)",
                            borderRadius: 14,
                            border: "1px solid rgba(255,255,255,0.08)",
                            padding: 20,
                            color: "#fff",
                            zIndex: 20,
                            boxShadow: "0 24px 64px rgba(0,0,0,0.75)",
                        }}
                    >
                        {selectedBook.coverImage && (
                            <img src={selectedBook.coverImage} alt={selectedBook.title}
                                style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", borderRadius: 8, marginBottom: 14, display: "block" }} />
                        )}
                        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>
                            {selectedBook.title}
                        </h2>
                        {selectedBook.author && (
                            <p style={{ margin: "4px 0 10px", opacity: 0.45, fontSize: 12 }}>
                                {selectedBook.author}
                            </p>
                        )}
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
                            {selectedBook.status && (
                                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                    {selectedBook.status}
                                </span>
                            )}
                            {selectedBook.genre && (
                                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
                                    {selectedBook.genre}
                                </span>
                            )}
                        </div>
                        {selectedBook.notes && (
                            <p style={{ fontSize: 12, lineHeight: 1.6, opacity: 0.55, margin: "0 0 14px" }}>
                                {selectedBook.notes}
                            </p>
                        )}
                        <button
                            onClick={() => setSelectedId(null)}
                            style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "rgba(255,255,255,0.6)", padding: "7px 14px", fontSize: 12, cursor: "pointer", width: "100%" }}
                        >
                            ← Back to shelf
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

addPropertyControls(BookShelf, {
    shelfHeight: {
        type: ControlType.Number, title: "Shelf Height",
        defaultValue: 360, min: 200, max: 600, step: 10, unit: "px", displayStepper: true,
    },
    perspective: {
        type: ControlType.Number, title: "Perspective",
        defaultValue: 900, min: 400, max: 1600, step: 50, unit: "px", displayStepper: true,
    },
    bookAngle: {
        type: ControlType.Number, title: "Book Angle",
        defaultValue: 58, min: 20, max: 80, step: 1, unit: "°", displayStepper: true,
    },
    shelfTilt: {
        type: ControlType.Number, title: "Shelf Tilt",
        defaultValue: 12, min: 0, max: 30, step: 1, unit: "°", displayStepper: true,
    },
    bookWidth: {
        type: ControlType.Number, title: "Book Width",
        defaultValue: 56, min: 28, max: 100, step: 2, unit: "px", displayStepper: true,
    },
    bookOverlap: {
        type: ControlType.Number, title: "Overlap",
        defaultValue: 18, min: 0, max: 50, step: 1, unit: "px", displayStepper: true,
    },
    zDepth: {
        type: ControlType.Number, title: "Z Depth",
        defaultValue: 28, min: 5, max: 80, step: 1, unit: "px", displayStepper: true,
    },
    idleDrift: {
        type: ControlType.Boolean, title: "Idle Drift",
        defaultValue: true, enabledTitle: "On", disabledTitle: "Off",
    },
    previewMode: {
        type: ControlType.Boolean, title: "Preview Mode",
        defaultValue: false, enabledTitle: "Homepage (link out)", disabledTitle: "Full library",
    },
    maxBooks: {
        type: ControlType.Number, title: "Max Books",
        defaultValue: 0, min: 0, max: 20, step: 1, displayStepper: true,
    },
    previewHref: {
        type: ControlType.String, title: "Preview Link",
        defaultValue: "/library", hidden: (props) => !props.previewMode,
    },
})
