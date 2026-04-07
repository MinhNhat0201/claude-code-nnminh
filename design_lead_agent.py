#!/usr/bin/env python3
"""
Design Lead Agent
=================
An AI design lead powered by Claude Opus 4.6 with adaptive thinking.

Workflow:
  1. Reads spec.md (or any Markdown spec) to understand product requirements
  2. Analyzes UX/UI flows and maps out all screens
  3. Designs Figma frames with precise element layouts
  4. Outputs a Figma Plugin JS file → paste into Figma to draw on the canvas
  5. Saves a Markdown design report

Usage:
  python design_lead_agent.py
  python design_lead_agent.py --spec path/to/my_spec.md
  python design_lead_agent.py --spec spec.md --prompt "Focus on the onboarding flow"
"""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

import anthropic
from dotenv import load_dotenv
from rich.console import Console
from rich.markdown import Markdown
from rich.panel import Panel
from rich.rule import Rule
from rich.syntax import Syntax

from tools import TOOL_DEFS, execute_tool

# ── Bootstrap ─────────────────────────────────────────────────────────────────
load_dotenv()

console = Console()

SYSTEM_PROMPT = """\
You are a senior UX/UI Design Lead with expertise in mobile and web product design.
Your role is to take a product specification and produce a complete set of Figma frames
that capture the essential screens and user flows described in the spec.

Your process:
1. **Read the spec** — use `read_spec` to ingest the full specification.
2. **Understand the file** — optionally use `get_figma_file_info` to see the current canvas.
3. **Map UX flows** — use `plan_ux_flows` to record your analysis of all user journeys
   and screens extracted from the spec.
4. **Design frames** — use `create_figma_frames` to design each screen.
   - Prioritize High-priority screens first.
   - Apply the design tokens (colors, typography, spacing) from the spec.
   - Place frames left-to-right in order of the user journey.
   - Each frame must contain meaningful UI elements (header, nav, cards, buttons, text).
   - Use 390×844px for mobile frames (iPhone 14 portrait).
5. **Annotate** — use `post_figma_comment` for key design decisions or handoff notes.
6. **Report** — use `save_design_report` to document what you built and why.

Design principles to apply:
- One primary action per screen
- Consistent spacing (8px base unit)
- Accessible color contrast
- Clear visual hierarchy (size + weight + color)
- Mobile-first, thumb-friendly touch targets (min 44px)

Always use adaptive thinking to reason deeply about layout, hierarchy, and flow
before issuing tool calls.
"""


def run_agent(spec_path: str = "spec.md", extra_prompt: str = "") -> None:
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        console.print("[red]Error:[/red] ANTHROPIC_API_KEY not set. Copy .env.example → .env and fill it in.")
        sys.exit(1)

    client = anthropic.Anthropic(api_key=api_key)

    user_message = (
        f"Please design the Figma frames for the specification at `{spec_path}`. "
        "Start by reading the spec, then map the UX flows, design all High-priority "
        "screens, and finish with a design report."
    )
    if extra_prompt:
        user_message += f"\n\nAdditional instructions: {extra_prompt}"

    messages: list[dict] = [{"role": "user", "content": user_message}]

    console.print(Panel.fit(
        "[bold cyan]Design Lead Agent[/bold cyan]\n"
        f"Spec: [green]{spec_path}[/green] · Model: claude-opus-4-6",
        border_style="cyan",
    ))
    console.print()

    iteration = 0
    max_iterations = 20  # safety cap

    while iteration < max_iterations:
        iteration += 1
        console.print(Rule(f"[dim]Agent turn {iteration}[/dim]", style="dim"))

        # ── Call Claude ──────────────────────────────────────────────────────
        with console.status("[bold green]Thinking…[/bold green]"):
            response = client.messages.create(
                model="claude-opus-4-6",
                max_tokens=16000,
                thinking={"type": "adaptive"},
                system=SYSTEM_PROMPT,
                tools=TOOL_DEFS,
                messages=messages,
            )

        # ── Display thinking blocks ──────────────────────────────────────────
        for block in response.content:
            if block.type == "thinking" and block.thinking:
                console.print(Panel(
                    block.thinking[:800] + ("…" if len(block.thinking) > 800 else ""),
                    title="[dim italic]💭 Thinking[/dim italic]",
                    border_style="dim",
                    expand=False,
                ))

        # ── Display text blocks ──────────────────────────────────────────────
        for block in response.content:
            if block.type == "text" and block.text:
                console.print(Markdown(block.text))

        # ── Collect tool-use blocks ──────────────────────────────────────────
        tool_use_blocks = [b for b in response.content if b.type == "tool_use"]

        # ── Check stop condition ─────────────────────────────────────────────
        if response.stop_reason == "end_turn" and not tool_use_blocks:
            console.print()
            console.print(Panel.fit(
                "[bold green]✅ Design Lead Agent finished.[/bold green]\n"
                "Outputs:\n"
                "  • [cyan]figma_plugin.js[/cyan]   — paste into Figma Plugin Runner\n"
                "  • [cyan]ux_flows.json[/cyan]      — structured UX flow map\n"
                "  • [cyan]design_report.md[/cyan]   — design rationale & handoff notes",
                border_style="green",
            ))
            _show_output_files()
            break

        # ── Append assistant turn ────────────────────────────────────────────
        messages.append({"role": "assistant", "content": response.content})

        # ── Execute tools ────────────────────────────────────────────────────
        tool_results = []
        for tool_block in tool_use_blocks:
            tool_name = tool_block.name
            tool_input = tool_block.input

            console.print(f"\n[bold yellow]🔧 Tool:[/bold yellow] [cyan]{tool_name}[/cyan]")
            if tool_name not in ("read_spec",):  # don't dump full spec input
                _print_tool_input(tool_input)

            result = execute_tool(tool_name, tool_input)

            console.print(f"[dim]↳ Result:[/dim] {str(result)[:300]}")

            tool_results.append({
                "type": "tool_result",
                "tool_use_id": tool_block.id,
                "content": result,
            })

        # ── Append tool results as user turn ─────────────────────────────────
        messages.append({"role": "user", "content": tool_results})

    else:
        console.print(f"[yellow]Warning:[/yellow] Reached {max_iterations} iterations — stopping.")


def _print_tool_input(tool_input: dict) -> None:
    """Pretty-print tool input, truncating large values."""
    import json as _json
    try:
        text = _json.dumps(tool_input, indent=2, ensure_ascii=False)
        if len(text) > 600:
            text = text[:600] + "\n…(truncated)"
        console.print(Syntax(text, "json", theme="monokai", word_wrap=True))
    except Exception:
        console.print(str(tool_input)[:300])


def _show_output_files() -> None:
    """Show a preview of each generated output file."""
    outputs = [
        ("figma_plugin.js", "javascript"),
        ("ux_flows.json", "json"),
        ("design_report.md", "markdown"),
    ]
    for filename, lexer in outputs:
        p = Path(filename)
        if not p.exists():
            continue
        content = p.read_text(encoding="utf-8")
        preview = content[:500] + ("\n…(see full file)" if len(content) > 500 else "")
        console.print(Rule(f"[bold]{filename}[/bold]"))
        if lexer == "markdown":
            console.print(Markdown(preview))
        else:
            console.print(Syntax(preview, lexer, theme="monokai", word_wrap=True))


# ── CLI ────────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Design Lead Agent — reads a spec and designs Figma frames."
    )
    parser.add_argument(
        "--spec",
        default="spec.md",
        help="Path to the Markdown spec file (default: spec.md)",
    )
    parser.add_argument(
        "--prompt",
        default="",
        help="Additional instructions to pass to the agent",
    )
    args = parser.parse_args()
    run_agent(spec_path=args.spec, extra_prompt=args.prompt)


if __name__ == "__main__":
    main()
