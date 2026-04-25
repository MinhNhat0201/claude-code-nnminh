import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

const SPINE_COLORS = [
    "#1B2A4A", "#C9A84C", "#D4C5A9", "#7B2D3E",
    "#2D5A3D", "#C4704A", "#5C6B3A", "#4A5568", "#F5F0E8",
]
const SPINE_HEIGHTS = [220, 195, 240, 180, 215, 200, 235, 190, 210]

const DEMO_BOOKS = [
    { id: "d1", title: "Atomic Habits",                 author: "James Clear",     status: "Finished",     genre: "Self-help",    spineColor: "#1B2A4A", notes: "Tiny changes, remarkable results." },
    { id: "d2", title: "The Design of Everyday Things", author: "Don Norman",      status: "Finished",     genre: "Design",       spineColor: "#7B2D3E", notes: "Why design matters." },
    { id: "d3", title: "Thinking, Fast and Slow",       author: "Daniel Kahneman", status: "Reading",      genre: "Psychology",   spineColor: "#2D5A3D", notes: "Two systems of thinking." },
    { id: "d4", title: "Deep Work",                     author: "Cal Newport",     status: "Finished",     genre: "Productivity", spineColor: "#C9A84C", notes: "Focus is the new IQ." },
    { id: "d5", title: "Dune",                          author: "Frank Herbert",   status: "Want to Read", genre: "Fiction",      spineColor: "#C4704A", notes: "A universe awaits." },
    { id: "d6", title: "Show Your Work",                author: "Austin Kleon",    status: "Finished",     genre: "Creativity",   spineColor: "#5C6B3A", notes: "Share your creative process." },
]

// Status → accent color for badges
const STATUS_COLORS: Record<string, { bg: string; border: string; dot: string }> = {
    "Finished":     { bg: "rgba(48,164,108,0.15)",  border: "rgba(48,164,108,0.35)",  dot: "#30A46C" },
    "Reading":      { bg: "rgba(0,144,255,0.15)",   border: "rgba(0,144,255,0.35)",   dot: "#0090FF" },
    "Want to Read": { bg: "rgba(255,255,255,0.08)", border: "rgba(255,255,255,0.15)", dot: "#888" },
}

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

export function BookShelf({
    books        = [],
    shelfHeight  = 360,
    perspective  = 900,
    bookAngle    = 58,
    shelfTilt    = 15,
    bookWidth    = 56,
    bookDepth    = 14,
    bookOverlap  = 20,
    zDepth       = 30,
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
    const shelfBoardHeight = 14
    const totalBooks = displayBooks.length

    return (
        <div style={{ width: "100%", height: shelfHeight, position: "relative" }}>

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
                        paddingLeft: 48,
                        height: "100%",
                        cursor: "grab",
                        touchAction: "none",
                        rotateX: shelfTilt,
                        transformOrigin: "bottom center",
                        transformStyle: "preserve-3d",
                        justifyContent: "flex-end",
                        paddingBottom: 0,
                    }}
                >
                    {/* ── BOOKS ROW ─────────────────────────────────────── */}
                    <div style={{
                        display: "inline-flex",
                        alignItems: "flex-end",
                        transformStyle: "preserve-3d",
                    }}>
                        {displayBooks.map((book, i) => {
                            const color      = book.spineColor || SPINE_COLORS[i % SPINE_COLORS.length]
                            const height     = SPINE_HEIGHTS[i % SPINE_HEIGHTS.length]
                            const isSelected = selectedId === book.id
                            const baseZ      = i * -zDepth

                            return (
                                <motion.div
                                    key={book.id}
                                    onClick={() => handleSelect(book)}
                                    /*
                                      ALL transform values go here — never set style.transform
                                      alongside animate on the same motion.div; framer-motion
                                      owns the transform property and would silently drop style.transform
                                    */
                                    initial={{ rotateY: -bookAngle, z: baseZ, y: 0 }}
                                    animate={{
                                        rotateY: isSelected ? 0      : -bookAngle,
                                        z:       isSelected ? baseZ + 70 : baseZ,
                                        y:       isSelected ? -18    : 0,
                                    }}
                                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                                    whileHover={!isSelected ? { y: -10, z: baseZ + 22, transition: { duration: 0.18 } } : {}}
                                    style={{
                                        width: bookWidth,
                                        height,
                                        marginLeft: i === 0 ? 0 : -bookOverlap,
                                        flexShrink: 0,
                                        cursor: "pointer",
                                        userSelect: "none",
                                        position: "relative",
                                        transformOrigin: "left center",
                                        transformStyle: "preserve-3d",
                                        // ⚠️ NO filter here — filter creates a stacking context
                                        // that flattens preserve-3d children (same bug as overflow:hidden).
                                        // Shadow is on the spine face child div instead.
                                    }}
                                >
                                    {/* ── SPINE FACE (front) ──────────────────────── */}
                                    <div style={{
                                        position: "absolute",
                                        inset: 0,
                                        background: `linear-gradient(
                                            155deg,
                                            ${lighten(color, 22)} 0%,
                                            ${color}             40%,
                                            ${darken(color, 14)} 100%
                                        )`,
                                        borderRadius: "3px 3px 2px 2px",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 6,
                                        overflow: "hidden",
                                        // Shadow lives here — NOT on the preserve-3d container above
                                        boxShadow: "4px 18px 32px rgba(0,0,0,0.55), -1px 0 6px rgba(0,0,0,0.2)",
                                    }}>
                                        <span style={{
                                            writingMode: "vertical-rl",
                                            fontSize: 9,
                                            fontWeight: 600,
                                            fontVariant: "small-caps",
                                            letterSpacing: 1.5,
                                            opacity: isSelected ? 0 : 0.85,
                                            color: "#fff",
                                            pointerEvents: "none",
                                            overflow: "hidden",
                                            maxHeight: height - 36,
                                            whiteSpace: "nowrap",
                                            textShadow: "0 1px 4px rgba(0,0,0,0.7)",
                                            transition: "opacity 0.2s",
                                        }}>
                                            {book.title}
                                        </span>
                                        {book.author && (
                                            <span style={{
                                                writingMode: "vertical-rl",
                                                fontSize: 7,
                                                letterSpacing: 1,
                                                opacity: isSelected ? 0 : 0.45,
                                                color: "#fff",
                                                pointerEvents: "none",
                                                overflow: "hidden",
                                                maxHeight: 60,
                                                whiteSpace: "nowrap",
                                                textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                                                transition: "opacity 0.2s",
                                            }}>
                                                {book.author}
                                            </span>
                                        )}
                                    </div>

                                    {/* ── PAGES FACE (right side — book thickness) ─
                                        Geometry: child at left=bookWidth, rotateY(90°)
                                        around its left edge → extends perpendicular
                                        behind the spine (into -Z).
                                        In world space at -58° + 90° = 32° from face-on
                                        → clearly visible to viewer.                   */}
                                    <div style={{
                                        position: "absolute",
                                        top: 3,
                                        left: bookWidth,
                                        width: bookDepth,
                                        height: height - 6,
                                        background: `linear-gradient(
                                            to right,
                                            #b8b3ab 0%,
                                            #ddd9d1 30%,
                                            #eee9e1 70%,
                                            #f4f0e8 100%
                                        )`,
                                        transformOrigin: "left center",
                                        transform: "rotateY(90deg)",
                                        borderRadius: "0 2px 2px 0",
                                    }} />

                                    {/* ── TOP CAP (top of book) ───────────────────
                                        rotateX(90°) from top edge: normal rotates
                                        from +Z to -Y (upward). World-space normal
                                        after shelf tilt ≈ upward+slightly toward viewer
                                        → visible as a horizontal dark strip on top.   */}
                                    <div style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 2,
                                        width: bookWidth - 4,
                                        height: bookDepth,
                                        background: `linear-gradient(
                                            to bottom,
                                            ${darken(color, 5)} 0%,
                                            ${darken(color, 20)} 100%
                                        )`,
                                        transformOrigin: "top center",
                                        transform: "rotateX(90deg)",
                                        borderRadius: "2px 2px 0 0",
                                    }} />
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* ── SHELF BOARD ─────────────────────────────────────
                        A wooden plank sitting directly under the books.
                        Width tracks the actual books span so it looks
                        like a real shelf surface.                          */}
                    <div style={{
                        display: "inline-flex",
                        flexShrink: 0,
                        width: Math.max(totalBooks * (bookWidth - bookOverlap) + bookOverlap + 80, 300),
                        height: shelfBoardHeight,
                        background: "linear-gradient(to bottom, #c8aa82 0%, #a8845a 40%, #8a6840 100%)",
                        borderRadius: "0 0 4px 4px",
                        boxShadow: "0 6px 24px rgba(0,0,0,0.55), inset 0 2px 0 rgba(255,255,255,0.12)",
                        position: "relative",
                        transformStyle: "preserve-3d",
                        marginLeft: -48,
                        paddingLeft: 48,
                    }}>
                        {/* Wood grain lines */}
                        <div style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "0 0 4px 4px",
                            background: `repeating-linear-gradient(
                                90deg,
                                transparent 0px,
                                transparent 18px,
                                rgba(0,0,0,0.04) 18px,
                                rgba(0,0,0,0.04) 19px
                            )`,
                            pointerEvents: "none",
                        }} />
                        {/* Shelf front lip (thickness face) */}
                        <div style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: shelfBoardHeight,
                            background: "linear-gradient(to bottom, #8a6840 0%, #6b4e2c 100%)",
                            transformOrigin: "top center",
                            transform: "rotateX(-90deg)",
                            borderRadius: "0 0 3px 3px",
                        }} />
                    </div>

                    {/* ── FLOOR SHADOW ────────────────────────────────────
                        Elliptical shadow cast on the floor beneath the shelf.
                        rotateX(90°) lays it flat on the "ground".             */}
                    <div style={{
                        width: Math.max(totalBooks * (bookWidth - bookOverlap) + bookOverlap + 80, 300),
                        height: 20,
                        background: "radial-gradient(ellipse at 40% 50%, rgba(0,0,0,0.45) 0%, transparent 70%)",
                        transformOrigin: "top center",
                        transform: "rotateX(90deg)",
                        marginLeft: -48,
                        pointerEvents: "none",
                        flexShrink: 0,
                    }} />
                </motion.div>
            </div>

            {/* ── Detail panel ───────────────────────────────────────────────── */}
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
                            overflow: "hidden",
                            color: "#fff",
                            zIndex: 20,
                            boxShadow: "0 24px 64px rgba(0,0,0,0.75)",
                        }}
                    >
                        {/* Accent bar — spine color of selected book */}
                        <div style={{
                            height: 3,
                            background: selectedBook.spineColor || SPINE_COLORS[0],
                            opacity: 0.85,
                        }} />

                        <div style={{ padding: 20 }}>
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
                                {selectedBook.status && (() => {
                                    const s = STATUS_COLORS[selectedBook.status] ?? STATUS_COLORS["Want to Read"]
                                    return (
                                        <span style={{
                                            fontSize: 10,
                                            padding: "2px 8px",
                                            borderRadius: 20,
                                            background: s.bg,
                                            border: `1px solid ${s.border}`,
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 4,
                                        }}>
                                            <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, display: "inline-block", flexShrink: 0 }} />
                                            {selectedBook.status}
                                        </span>
                                    )
                                })()}
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
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

addPropertyControls(BookShelf, {
    shelfHeight: { type: ControlType.Number, title: "Shelf Height",  defaultValue: 360, min: 200, max: 600, step: 10, unit: "px", displayStepper: true },
    perspective:  { type: ControlType.Number, title: "Perspective",   defaultValue: 900, min: 400, max: 1600, step: 50, unit: "px", displayStepper: true },
    bookAngle:    { type: ControlType.Number, title: "Book Angle",    defaultValue: 58,  min: 20,  max: 80,   step: 1,  unit: "°",  displayStepper: true },
    shelfTilt:    { type: ControlType.Number, title: "Shelf Tilt",    defaultValue: 15,  min: 0,   max: 30,   step: 1,  unit: "°",  displayStepper: true },
    bookWidth:    { type: ControlType.Number, title: "Book Width",    defaultValue: 56,  min: 28,  max: 100,  step: 2,  unit: "px", displayStepper: true },
    bookDepth:    { type: ControlType.Number, title: "Book Depth",    defaultValue: 14,  min: 4,   max: 40,   step: 1,  unit: "px", displayStepper: true },
    bookOverlap:  { type: ControlType.Number, title: "Overlap",       defaultValue: 20,  min: 0,   max: 50,   step: 1,  unit: "px", displayStepper: true },
    zDepth:       { type: ControlType.Number, title: "Z Depth",       defaultValue: 30,  min: 5,   max: 80,   step: 1,  unit: "px", displayStepper: true },
    idleDrift:    { type: ControlType.Boolean, title: "Idle Drift",   defaultValue: true, enabledTitle: "On", disabledTitle: "Off" },
    previewMode:  { type: ControlType.Boolean, title: "Preview Mode", defaultValue: false, enabledTitle: "Homepage (link out)", disabledTitle: "Full library" },
    maxBooks:     { type: ControlType.Number, title: "Max Books",     defaultValue: 0,   min: 0,   max: 20,   step: 1,  displayStepper: true },
    previewHref:  { type: ControlType.String,  title: "Preview Link", defaultValue: "/library", hidden: (props) => !props.previewMode },
})
