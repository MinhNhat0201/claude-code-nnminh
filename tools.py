"""
Tool definitions and implementations for the Design Lead Agent.

Each TOOL_DEF entry is passed directly to the Anthropic messages.create()
`tools` parameter.  The matching execute_tool() dispatcher calls the real
Python implementation.
"""

from __future__ import annotations

import json
import os
from pathlib import Path

from figma_client import FigmaClient

# ── Global Figma client (shared across tool calls) ────────────────────────────
_figma = FigmaClient()


# ─────────────────────────────────────────────────────────────────────────────
# Tool definitions (JSON Schema)
# ─────────────────────────────────────────────────────────────────────────────

TOOL_DEFS = [
    {
        "name": "read_spec",
        "description": (
            "Read a Markdown spec file from disk and return its full content. "
            "Use this first to understand the product requirements, user flows, "
            "screen inventory, and design tokens before planning any frames."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "Relative or absolute path to the spec file. Defaults to 'spec.md'.",
                }
            },
            "required": [],
        },
    },
    {
        "name": "read_design_system",
        "description": (
            "Read the MISA Design System reference file (design.md). "
            "Call this after reading the spec to load exact token values: "
            "colors, spacing, typography, border radius, component sizes, and layout constants. "
            "Always consult this before designing any frame so every element uses the correct token."
        ),
        "input_schema": {
            "type": "object",
            "properties": {},
            "required": [],
        },
    },
    {
        "name": "get_figma_file_info",
        "description": (
            "Fetch metadata about the Figma file: its name, pages, and existing "
            "top-level frames.  Use this to understand the current canvas state "
            "before adding new frames."
        ),
        "input_schema": {
            "type": "object",
            "properties": {},
            "required": [],
        },
    },
    {
        "name": "plan_ux_flows",
        "description": (
            "Store a structured UX flow plan that you have analyzed from the spec. "
            "This persists the plan as a JSON file so later tools can reference it. "
            "The plan should list screens, their purposes, and navigation connections."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "flows": {
                    "type": "array",
                    "description": "List of UX flows extracted from the spec.",
                    "items": {
                        "type": "object",
                        "properties": {
                            "flow_name": {"type": "string"},
                            "screens": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "screen_id": {"type": "string"},
                                        "name": {"type": "string"},
                                        "description": {"type": "string"},
                                        "next_screens": {
                                            "type": "array",
                                            "items": {"type": "string"},
                                        },
                                    },
                                    "required": ["screen_id", "name"],
                                },
                            },
                        },
                        "required": ["flow_name", "screens"],
                    },
                }
            },
            "required": ["flows"],
        },
    },
    {
        "name": "create_figma_frames",
        "description": (
            "Generate Figma frames for one or more screens.  This tool produces "
            "two outputs:\n"
            "1. A Figma Plugin JavaScript snippet the user can paste into Figma's "
            "   Plugin Runner to draw the frames on the canvas.\n"
            "2. A summary of what was designed.\n\n"
            "Each frame should capture the essential UI elements: header, body, "
            "navigation bar, buttons, text, cards, etc., using the design tokens "
            "from the spec (colors, typography, spacing, corner radius)."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "frames": {
                    "type": "array",
                    "description": "List of frame specifications to create.",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": {
                                "type": "string",
                                "description": "Frame name, e.g. 'S-04 Home Dashboard'",
                            },
                            "width": {
                                "type": "integer",
                                "description": "Frame width in pixels. Use 390 for mobile.",
                                "default": 390,
                            },
                            "height": {
                                "type": "integer",
                                "description": "Frame height in pixels. Use 844 for iPhone 14.",
                                "default": 844,
                            },
                            "x": {
                                "type": "integer",
                                "description": "Canvas X position (frames placed side by side).",
                            },
                            "y": {
                                "type": "integer",
                                "description": "Canvas Y position.",
                                "default": 0,
                            },
                            "bg_color": {
                                "type": "string",
                                "description": "Background hex color, e.g. '#F9F9FB'.",
                            },
                            "corner_radius": {
                                "type": "integer",
                                "description": "Frame corner radius. 0 for full-screen frames.",
                                "default": 0,
                            },
                            "elements": {
                                "type": "array",
                                "description": "UI elements inside the frame.",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "type": {
                                            "type": "string",
                                            "enum": ["rect", "text"],
                                            "description": "'rect' for shapes/cards/buttons, 'text' for labels.",
                                        },
                                        "name": {"type": "string"},
                                        "x": {"type": "integer"},
                                        "y": {"type": "integer"},
                                        "width": {"type": "integer"},
                                        "height": {"type": "integer"},
                                        "color": {
                                            "type": "string",
                                            "description": "Fill hex color.",
                                        },
                                        "corner_radius": {"type": "integer"},
                                        "stroke_color": {"type": "string"},
                                        "stroke_weight": {"type": "integer"},
                                        "text": {
                                            "type": "string",
                                            "description": "Text content (only for type='text').",
                                        },
                                        "font_size": {"type": "integer"},
                                        "font_style": {
                                            "type": "string",
                                            "enum": [
                                                "Regular",
                                                "Medium",
                                                "SemiBold",
                                                "Bold",
                                            ],
                                        },
                                    },
                                    "required": ["type", "name", "x", "y"],
                                },
                            },
                        },
                        "required": ["name"],
                    },
                }
            },
            "required": ["frames"],
        },
    },
    {
        "name": "post_figma_comment",
        "description": (
            "Post a design annotation or review note as a comment on the Figma file. "
            "Use this to leave design rationale, open questions, or handoff notes."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string",
                    "description": "The comment text.",
                },
                "x": {
                    "type": "number",
                    "description": "Canvas X coordinate for the comment pin.",
                    "default": 0,
                },
                "y": {
                    "type": "number",
                    "description": "Canvas Y coordinate for the comment pin.",
                    "default": 0,
                },
            },
            "required": ["message"],
        },
    },
    {
        "name": "save_design_report",
        "description": (
            "Save a Markdown design report summarizing what was analyzed and created. "
            "This is the final deliverable — call it after all frames have been designed."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "title": {"type": "string", "description": "Report title."},
                "summary": {
                    "type": "string",
                    "description": "Executive summary of the design work.",
                },
                "screens_designed": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "screen_id": {"type": "string"},
                            "name": {"type": "string"},
                            "rationale": {"type": "string"},
                        },
                        "required": ["screen_id", "name", "rationale"],
                    },
                },
                "design_decisions": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Key design decisions and their justifications.",
                },
                "next_steps": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Recommended follow-up actions.",
                },
            },
            "required": ["title", "summary", "screens_designed"],
        },
    },
]


# ─────────────────────────────────────────────────────────────────────────────
# Tool implementations
# ─────────────────────────────────────────────────────────────────────────────

def _read_spec(path: str = "spec.md") -> str:
    p = Path(path)
    if not p.exists():
        return f"Error: file '{path}' not found."
    return p.read_text(encoding="utf-8")


def _get_figma_file_info() -> str:
    info = _figma.get_file_info()
    return json.dumps(info, indent=2)


def _plan_ux_flows(flows: list) -> str:
    out_path = Path("ux_flows.json")
    out_path.write_text(json.dumps({"flows": flows}, indent=2), encoding="utf-8")
    flow_names = [f["flow_name"] for f in flows]
    total_screens = sum(len(f["screens"]) for f in flows)
    return (
        f"UX flow plan saved to ux_flows.json.\n"
        f"Flows: {', '.join(flow_names)}\n"
        f"Total screens mapped: {total_screens}"
    )


def _create_figma_frames(frames: list) -> str:
    # Auto-position frames side by side if x not specified
    x_cursor = 0
    gap = 40  # pixels between frames
    positioned = []
    for f in frames:
        if "x" not in f:
            f = dict(f, x=x_cursor)
        positioned.append(f)
        x_cursor = f.get("x", x_cursor) + f.get("width", 390) + gap

    plugin_code = FigmaClient.generate_frame_plugin_code(positioned)

    # Save plugin code to disk
    out_path = Path("figma_plugin.js")
    out_path.write_text(plugin_code, encoding="utf-8")

    frame_names = [f["name"] for f in positioned]
    return (
        f"Plugin code written to figma_plugin.js\n"
        f"Frames designed: {len(positioned)}\n"
        f"  • " + "\n  • ".join(frame_names) + "\n\n"
        f"To apply in Figma:\n"
        f"  1. Open the Figma file\n"
        f"  2. Go to Plugins → Development → Open console\n"
        f"  3. Paste the contents of figma_plugin.js and press ⌘Enter / Ctrl+Enter\n\n"
        f"─── Plugin code preview (first 300 chars) ───\n"
        f"{plugin_code[:300]}…"
    )


def _post_figma_comment(message: str, x: float = 0, y: float = 0) -> str:
    result = _figma.post_comment(message, x=x, y=y)
    if "error" in result:
        return f"Comment skipped (no Figma credentials): {result['error']}"
    return f"Comment posted (id={result.get('id', 'unknown')}): {message[:80]}"


def _save_design_report(
    title: str,
    summary: str,
    screens_designed: list,
    design_decisions: list | None = None,
    next_steps: list | None = None,
) -> str:
    lines = [
        f"# {title}",
        "",
        "## Summary",
        summary,
        "",
        "## Screens Designed",
    ]
    for s in screens_designed:
        lines.append(f"\n### {s['screen_id']} — {s['name']}")
        lines.append(s.get("rationale", ""))

    if design_decisions:
        lines += ["", "## Design Decisions"]
        for d in design_decisions:
            lines.append(f"- {d}")

    if next_steps:
        lines += ["", "## Next Steps"]
        for n in next_steps:
            lines.append(f"- {n}")

    report = "\n".join(lines)
    out_path = Path("design_report.md")
    out_path.write_text(report, encoding="utf-8")
    return f"Design report saved to design_report.md ({len(screens_designed)} screens documented)."


# ─────────────────────────────────────────────────────────────────────────────
# Dispatcher
# ─────────────────────────────────────────────────────────────────────────────

def _read_design_system() -> str:
    p = Path("design.md")
    if not p.exists():
        return "Error: design.md not found. Make sure it exists in the project root."
    return p.read_text(encoding="utf-8")


def execute_tool(name: str, tool_input: dict) -> str:
    """Route a tool call from Claude to the correct Python function."""
    if name == "read_spec":
        return _read_spec(tool_input.get("path", "spec.md"))
    if name == "read_design_system":
        return _read_design_system()
    if name == "get_figma_file_info":
        return _get_figma_file_info()
    if name == "plan_ux_flows":
        return _plan_ux_flows(tool_input["flows"])
    if name == "create_figma_frames":
        return _create_figma_frames(tool_input["frames"])
    if name == "post_figma_comment":
        return _post_figma_comment(
            tool_input["message"],
            x=tool_input.get("x", 0),
            y=tool_input.get("y", 0),
        )
    if name == "save_design_report":
        return _save_design_report(
            title=tool_input["title"],
            summary=tool_input["summary"],
            screens_designed=tool_input["screens_designed"],
            design_decisions=tool_input.get("design_decisions"),
            next_steps=tool_input.get("next_steps"),
        )
    return f"Unknown tool: {name}"
