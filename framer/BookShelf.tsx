import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

const SPINE_COLORS = [
    "#1B2A4A",
    "#C9A84C",
    "#D4C5A9",
    "#7B2D3E",
    "#2D5A3D",
    "#C4704A",
    "#5C6B3A",
    "#4A5568",
    "#F5F0E8",
]

const SPINE_HEIGHTS = [220, 195, 240, 180, 215, 200, 235, 190, 210]

const DEMO_BOOKS = [
    { id: "d1", title: "Atomic Habits", author: "James Clear", status: "Finished", genre: "Self-help", spineColor: "#1B2A4A", notes: "Tiny changes, remarkable results." },
    { id: "d2", title: "The Design of Everyday Things", author: "Don Norman", status: "Finished", genre: "Design", spineColor: "#7B2D3E", notes: "Why design matters." },
    { id: "d3", title: "Thinking, Fast and Slow", author: "Daniel Kahneman", status: "Reading", genre: "Psychology", spineColor: "#2D5A3D", notes: "Two systems of thinking." },
    { id: "d4", title: "Deep Work", author: "Cal Newport", status: "Finished", genre: "Productivity", spineColor: "#C9A84C", notes: "Focus is the new IQ." },
    { id: "d5", title: "Dune", author: "Frank Herbert", status: "Want to Read", genre: "Fiction", spineColor: "#C4704A", notes: "A universe awaits." },
    { id: "d6", title: "Show Your Work", author: "Austin Kleon", status: "Finished", genre: "Creativity", spineColor: "#5C6B3A", notes: "Share your creative process." },
]

export function BookShelf({
    books = [],
    shelfHeight = 320,
    perspective = 800,
    shelfTilt = 15,
    idleDrift = true,
    previewMode = false,
    maxBooks = 0,
    previewHref = "/library",
}) {
    const [selectedId, setSelectedId] = useState(null)
    const [animatingId, setAnimatingId] = useState(null)
    const scrollRef = useRef(null)
    const isDragging = useRef(false)
    const dragStart = useRef({ x: 0, scrollLeft: 0 })

    const sourceBooks = books.length > 0 ? books : DEMO_BOOKS
    const displayBooks = maxBooks > 0 ? sourceBooks.slice(0, maxBooks) : sourceBooks

    const onMouseDown = useCallback((e) => {
        isDragging.current = true
        dragStart.current = { x: e.clientX, scrollLeft: scrollRef.current?.scrollLeft ?? 0 }
    }, [])

    const onMouseMove = useCallback((e) => {
        if (!isDragging.current || !scrollRef.current) return
        scrollRef.current.scrollLeft = dragStart.current.scrollLeft - (e.clientX - dragStart.current.x)
    }, [])

    const stopDrag = useCallback(() => { isDragging.current = false }, [])

    const handleSelect = (book) => {
        if (previewMode) { window.location.href = previewHref; return }
        setAnimatingId(book.id)
        setTimeout(() => { setSelectedId(book.id); setAnimatingId(null) }, 400)
    }

    const handleClose = () => {
        setSelectedId(null)
    }

    const selectedBook = displayBooks.find((b) => b.id === selectedId)

    return (
        // Root: explicit height, overflow visible so 3D is not clipped
        <div style={{ width: "100%", height: shelfHeight, position: "relative" }}>

            {/* Perspective container — must NOT have overflow:hidden */}
            <div style={{ perspective: `${perspective}px`, width: "100%", height: "100%" }}>

                {/* Scroll track */}
                <div
                    ref={scrollRef}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={stopDrag}
                    onMouseLeave={stopDrag}
                    style={{
                        width: "100%",
                        height: "100%",
                        overflowX: "auto",
                        overflowY: "visible",
                        scrollbarWidth: "none",
                        cursor: "grab",
                    }}
                >
                    {/* Idle drift + shelf tilt wrapper */}
                    <motion.div
                        animate={idleDrift ? { y: [0, -3, 0, 3, 0] } : {}}
                        transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
                        style={{
                            display: "inline-flex",
                            alignItems: "flex-end",
                            height: "100%",
                            paddingLeft: 40,
                            paddingRight: 40,
                            gap: 4,
                            // Shelf tilt — rotateX on a separate element from perspective
                            transform: `rotateX(${shelfTilt}deg)`,
                            transformStyle: "preserve-3d",
                            transformOrigin: "bottom center",
                        }}
                    >
                        {displayBooks.map((book, i) => {
                            const color = book.spineColor || SPINE_COLORS[i % SPINE_COLORS.length]
                            const height = SPINE_HEIGHTS[i % SPINE_HEIGHTS.length]
                            const isSelected = selectedId === book.id
                            const isAnimating = animatingId === book.id

                            return (
                                <motion.div
                                    key={book.id}
                                    onClick={() => isSelected ? handleClose() : handleSelect(book)}
                                    animate={{
                                        rotateY: isSelected || isAnimating ? 0 : -25,
                                        y: isAnimating ? -12 : 0,
                                        scaleX: isSelected ? 4 : 1,
                                        scaleY: isSelected ? 1.2 : 1,
                                    }}
                                    transition={{ duration: 0.35, ease: "easeOut" }}
                                    whileHover={!isSelected && !isAnimating ? { y: -8 } : {}}
                                    style={{
                                        width: 28,
                                        height,
                                        background: color,
                                        borderRight: "2px solid rgba(255,255,255,0.1)",
                                        borderTop: "2px solid rgba(255,255,255,0.15)",
                                        transformOrigin: "left center",
                                        transformStyle: "preserve-3d",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        position: "relative",
                                        userSelect: "none",
                                        borderRadius: "2px 2px 0 0",
                                    }}
                                >
                                    <span
                                        style={{
                                            writingMode: "vertical-rl",
                                            fontSize: 9,
                                            fontVariant: "small-caps",
                                            letterSpacing: 1,
                                            opacity: isSelected ? 0 : 0.45,
                                            color: "#fff",
                                            pointerEvents: "none",
                                            overflow: "hidden",
                                            maxHeight: height - 16,
                                            whiteSpace: "nowrap",
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
            </div>

            {/* Detail panel */}
            <AnimatePresence>
                {selectedBook && (
                    <motion.div
                        key="detail"
                        initial={{ opacity: 0, x: 32 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 32 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            width: 260,
                            background: "rgba(14,14,18,0.97)",
                            backdropFilter: "blur(16px)",
                            borderRadius: 12,
                            border: "1px solid rgba(255,255,255,0.08)",
                            padding: 20,
                            color: "#fff",
                            zIndex: 20,
                            boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
                        }}
                    >
                        {selectedBook.coverImage && (
                            <img
                                src={selectedBook.coverImage}
                                alt={selectedBook.title}
                                style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", borderRadius: 6, marginBottom: 14, display: "block" }}
                            />
                        )}
                        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, lineHeight: 1.3 }}>
                            {selectedBook.title}
                        </h2>
                        {selectedBook.author && (
                            <p style={{ margin: "4px 0 10px", opacity: 0.5, fontSize: 12 }}>
                                {selectedBook.author}
                            </p>
                        )}
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                            {selectedBook.status && (
                                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.12)" }}>
                                    {selectedBook.status}
                                </span>
                            )}
                            {selectedBook.genre && (
                                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                    {selectedBook.genre}
                                </span>
                            )}
                        </div>
                        {selectedBook.notes && (
                            <p style={{ fontSize: 12, lineHeight: 1.6, opacity: 0.6, margin: "0 0 14px" }}>
                                {selectedBook.notes}
                            </p>
                        )}
                        <button
                            onClick={handleClose}
                            style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 7, color: "rgba(255,255,255,0.65)", padding: "7px 14px", fontSize: 12, cursor: "pointer", width: "100%" }}
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
        type: ControlType.Number,
        title: "Shelf Height",
        defaultValue: 320,
        min: 200,
        max: 600,
        step: 10,
        unit: "px",
        displayStepper: true,
    },
    perspective: {
        type: ControlType.Number,
        title: "Perspective",
        defaultValue: 800,
        min: 400,
        max: 1600,
        step: 50,
        unit: "px",
        displayStepper: true,
    },
    shelfTilt: {
        type: ControlType.Number,
        title: "Shelf Tilt",
        defaultValue: 15,
        min: 0,
        max: 35,
        step: 1,
        unit: "°",
        displayStepper: true,
    },
    idleDrift: {
        type: ControlType.Boolean,
        title: "Idle Drift",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    previewMode: {
        type: ControlType.Boolean,
        title: "Preview Mode",
        defaultValue: false,
        enabledTitle: "Homepage (link out)",
        disabledTitle: "Full library",
    },
    maxBooks: {
        type: ControlType.Number,
        title: "Max Books",
        defaultValue: 0,
        min: 0,
        max: 20,
        step: 1,
        displayStepper: true,
    },
    previewHref: {
        type: ControlType.String,
        title: "Preview Link",
        defaultValue: "/library",
        hidden: (props) => !props.previewMode,
    },
})
