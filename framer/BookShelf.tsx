import { useState, useRef, useCallback } from "react"
import { motion, useAnimate, AnimatePresence } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

// ── Spine colour palette — auto-assigned by index when CMS has no spineColor ──
const SPINE_COLORS = [
    "#1B2A4A", // navy
    "#C9A84C", // gold
    "#D4C5A9", // sand
    "#7B2D3E", // burgundy
    "#2D5A3D", // forest green
    "#C4704A", // terracotta
    "#5C6B3A", // olive
    "#4A5568", // slate
    "#F5F0E8", // cream
]

// ── Height cycle — varied heights simulate real shelf irregularity ──
const SPINE_HEIGHTS = [220, 195, 240, 180, 215, 200, 235, 190, 210]

// ── Demo books shown in Framer canvas before CMS is connected ──────────────
const DEMO_BOOKS: Book[] = [
    { id: "d1", title: "Atomic Habits", author: "James Clear", status: "Finished", genre: "Self-help", spineColor: "#1B2A4A", notes: "Tiny changes, remarkable results." },
    { id: "d2", title: "The Design of Everyday Things", author: "Don Norman", status: "Finished", genre: "Design", spineColor: "#7B2D3E", notes: "Why design matters." },
    { id: "d3", title: "Thinking, Fast and Slow", author: "Daniel Kahneman", status: "Reading", genre: "Psychology", spineColor: "#2D5A3D", notes: "Two systems of thinking." },
    { id: "d4", title: "Deep Work", author: "Cal Newport", status: "Finished", genre: "Productivity", spineColor: "#C9A84C", notes: "Focus is the new IQ." },
    { id: "d5", title: "Dune", author: "Frank Herbert", status: "Want to Read", genre: "Fiction", spineColor: "#C4704A", notes: "A universe awaits." },
    { id: "d6", title: "Show Your Work", author: "Austin Kleon", status: "Finished", genre: "Creativity", spineColor: "#5C6B3A", notes: "Share your creative process." },
]

interface Book {
    id: string
    title: string
    author?: string
    spineColor?: string
    coverImage?: string
    status?: string
    genre?: string
    notes?: string
}

interface BookShelfProps {
    books?: Book[]
    perspective?: number
    shelfTilt?: number
    idleDrift?: boolean
    previewMode?: boolean
    maxBooks?: number
    previewHref?: string
}

export function BookShelf({
    books = [],
    perspective = 800,
    shelfTilt = 15,
    idleDrift = true,
    previewMode = false,
    maxBooks = 0,
    previewHref = "/library",
}: BookShelfProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [scope, animate] = useAnimate()
    const isDragging = useRef(false)
    const dragStart = useRef({ x: 0, scrollLeft: 0 })
    const scrollRef = useRef<HTMLDivElement>(null)

    // Fall back to demo books in the canvas when no CMS data is connected
    const sourceBooks = books.length > 0 ? books : DEMO_BOOKS
    const displayBooks = maxBooks > 0 ? sourceBooks.slice(0, maxBooks) : sourceBooks

    // ── Drag-to-scroll on desktop ─────────────────────────────────────────────
    const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        isDragging.current = true
        dragStart.current = { x: e.clientX, scrollLeft: scrollRef.current?.scrollLeft ?? 0 }
    }, [])

    const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging.current || !scrollRef.current) return
        const dx = e.clientX - dragStart.current.x
        scrollRef.current.scrollLeft = dragStart.current.scrollLeft - dx
    }, [])

    const stopDrag = useCallback(() => { isDragging.current = false }, [])

    // ── Book select: lift → gap close → pivot to cover ────────────────────────
    const handleSelect = async (book: Book, index: number) => {
        if (previewMode) {
            window.location.href = previewHref
            return
        }
        // Lift
        await animate(`[data-book-id="${book.id}"]`, { y: -12 }, { duration: 0.1 })
        // Pivot spine → cover
        await animate(
            `[data-book-id="${book.id}"]`,
            { rotateY: 0 },
            { duration: 0.3, ease: "easeOut" }
        )
        setSelectedId(book.id)
    }

    // ── Book close: pivot to spine → settle → nudge neighbours ───────────────
    const handleClose = async (book: Book, index: number) => {
        setSelectedId(null)
        await animate(
            `[data-book-id="${book.id}"]`,
            { rotateY: -25 },
            { duration: 0.3, ease: "easeIn" }
        )
        animate(`[data-book-id="${book.id}"]`, { y: 0 }, { duration: 0.1 })
    }

    return (
        <div
            style={{
                perspective: `${perspective}px`,
                width: "100%",
                height: "100%",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* ── Horizontally scrollable track ── */}
            <div
                ref={scrollRef}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={stopDrag}
                onMouseLeave={stopDrag}
                style={{
                    overflowX: "auto",
                    overflowY: "visible",
                    width: "100%",
                    height: "100%",
                    // Hide scrollbar while keeping it functional
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    cursor: isDragging.current ? "grabbing" : "grab",
                    position: "absolute",
                    bottom: 0,
                }}
            >
                {/* ── Idle drift wrapper ── */}
                <motion.div
                    ref={scope}
                    animate={idleDrift ? { y: [0, -3, 0, 3, 0] } : {}}
                    transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
                    style={{
                        display: "inline-flex",
                        alignItems: "flex-end",
                        paddingLeft: "10%",
                        paddingRight: 40,
                        paddingBottom: 0,
                        height: "100%",
                        rotateX: shelfTilt,
                        transformStyle: "preserve-3d",
                        gap: 4,
                    }}
                >
                    {displayBooks.map((book, i) => {
                        const color = book.spineColor || SPINE_COLORS[i % SPINE_COLORS.length]
                        const height = SPINE_HEIGHTS[i % SPINE_HEIGHTS.length]
                        const isSelected = selectedId === book.id

                        return (
                            <motion.div
                                key={book.id}
                                data-book-id={book.id}
                                onClick={() =>
                                    isSelected ? handleClose(book, i) : handleSelect(book, i)
                                }
                                initial={{ rotateY: -25 }}
                                style={{
                                    width: 28,
                                    height,
                                    background: color,
                                    borderRight: "2px solid rgba(255,255,255,0.08)",
                                    transformOrigin: "left center",
                                    transformStyle: "preserve-3d",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    position: "relative",
                                    userSelect: "none",
                                }}
                                whileHover={!isSelected ? { y: -6, transition: { duration: 0.15 } } : {}}
                            >
                                {/* Spine label */}
                                <span
                                    style={{
                                        writingMode: "vertical-rl",
                                        fontSize: 9,
                                        fontVariant: "small-caps",
                                        fontFamily: "inherit",
                                        letterSpacing: 1,
                                        opacity: 0.4,
                                        color: "#fff",
                                        pointerEvents: "none",
                                        overflow: "hidden",
                                        maxHeight: height - 16,
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {book.title}
                                </span>

                                {/* Edge highlight — top rim */}
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: 2,
                                        background: "rgba(255,255,255,0.15)",
                                        pointerEvents: "none",
                                    }}
                                />
                            </motion.div>
                        )
                    })}
                </motion.div>
            </div>

            {/* ── Detail panel — slides in from right when a book is selected ── */}
            <AnimatePresence>
                {selectedId &&
                    (() => {
                        const book = displayBooks.find((b) => b.id === selectedId)
                        if (!book) return null
                        return (
                            <motion.div
                                key="detail-panel"
                                initial={{ opacity: 0, x: 48 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 48 }}
                                transition={{ duration: 0.28, ease: "easeOut" }}
                                style={{
                                    position: "absolute",
                                    top: "8%",
                                    right: "5%",
                                    width: 280,
                                    background: "rgba(14, 14, 18, 0.96)",
                                    backdropFilter: "blur(12px)",
                                    borderRadius: 14,
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    padding: 24,
                                    color: "#fff",
                                    zIndex: 10,
                                    boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
                                }}
                            >
                                {/* Cover image */}
                                {book.coverImage && (
                                    <img
                                        src={book.coverImage}
                                        alt={book.title}
                                        style={{
                                            width: "100%",
                                            aspectRatio: "2/3",
                                            objectFit: "cover",
                                            borderRadius: 8,
                                            marginBottom: 16,
                                            display: "block",
                                        }}
                                    />
                                )}

                                {/* Title & Author */}
                                <h2
                                    style={{
                                        margin: 0,
                                        fontSize: 17,
                                        fontWeight: 600,
                                        lineHeight: 1.3,
                                    }}
                                >
                                    {book.title}
                                </h2>
                                {book.author && (
                                    <p
                                        style={{
                                            margin: "5px 0 12px",
                                            opacity: 0.55,
                                            fontSize: 13,
                                        }}
                                    >
                                        {book.author}
                                    </p>
                                )}

                                {/* Badges row */}
                                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                                    {book.status && (
                                        <span
                                            style={{
                                                fontSize: 11,
                                                padding: "3px 9px",
                                                borderRadius: 20,
                                                background: "rgba(255,255,255,0.1)",
                                                border: "1px solid rgba(255,255,255,0.12)",
                                            }}
                                        >
                                            {book.status}
                                        </span>
                                    )}
                                    {book.genre && (
                                        <span
                                            style={{
                                                fontSize: 11,
                                                padding: "3px 9px",
                                                borderRadius: 20,
                                                background: "rgba(255,255,255,0.06)",
                                                border: "1px solid rgba(255,255,255,0.08)",
                                                opacity: 0.7,
                                            }}
                                        >
                                            {book.genre}
                                        </span>
                                    )}
                                </div>

                                {/* Notes */}
                                {book.notes && (
                                    <p
                                        style={{
                                            fontSize: 13,
                                            lineHeight: 1.65,
                                            opacity: 0.65,
                                            margin: "0 0 16px",
                                        }}
                                    >
                                        {book.notes}
                                    </p>
                                )}

                                {/* Close button */}
                                <button
                                    onClick={() =>
                                        handleClose(
                                            book,
                                            displayBooks.findIndex((b) => b.id === selectedId)
                                        )
                                    }
                                    style={{
                                        background: "transparent",
                                        border: "1px solid rgba(255,255,255,0.18)",
                                        borderRadius: 8,
                                        color: "rgba(255,255,255,0.7)",
                                        padding: "8px 16px",
                                        fontSize: 13,
                                        cursor: "pointer",
                                        width: "100%",
                                    }}
                                >
                                    ← Back to shelf
                                </button>
                            </motion.div>
                        )
                    })()}
            </AnimatePresence>
        </div>
    )
}

// ── Property controls exposed in the Framer right panel ──────────────────────
addPropertyControls(BookShelf, {
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
        description: "0 = show all",
    },
    previewHref: {
        type: ControlType.String,
        title: "Preview Link",
        defaultValue: "/library",
        hidden: (props) => !props.previewMode,
    },
})
