# Design Lead Agent

An AI design lead powered by **Claude Opus 4.6** with adaptive thinking.  
Reads a `spec.md` file, analyzes UX/UI flows, and designs frames on the Figma canvas.

---

## How it works

```
spec.md  ──►  read_spec
              │
              ▼ (adaptive thinking)
         plan_ux_flows  ──►  ux_flows.json
              │
              ▼
         create_figma_frames  ──►  figma_plugin.js  ──►  paste into Figma
              │
              ▼
         save_design_report  ──►  design_report.md
```

### Agent tools

| Tool | What it does |
|---|---|
| `read_spec` | Reads the Markdown spec from disk |
| `get_figma_file_info` | Fetches current pages/frames from Figma REST API |
| `plan_ux_flows` | Records the structured UX flow map as JSON |
| `create_figma_frames` | Generates Figma Plugin JS to draw frames on canvas |
| `post_figma_comment` | Posts annotation comments on the Figma file |
| `save_design_report` | Writes a Markdown design rationale document |

---

## Setup

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Configure credentials
cp .env.example .env
# Edit .env — add your ANTHROPIC_API_KEY
# Optionally add FIGMA_ACCESS_TOKEN + FIGMA_FILE_KEY for Figma REST features

# 3. Run the agent
python design_lead_agent.py
```

### Optional: point to your own spec

```bash
python design_lead_agent.py --spec path/to/your_spec.md
```

### Optional: add extra instructions

```bash
python design_lead_agent.py --prompt "Focus only on the onboarding flow"
```

---

## Outputs

After the agent finishes you'll find three files in the project directory:

| File | Description |
|---|---|
| `figma_plugin.js` | Paste into **Figma → Plugins → Development → Open console** (⌘Enter to run) |
| `ux_flows.json` | Structured JSON mapping of all screens and navigation |
| `design_report.md` | Design rationale, decisions, and next-step recommendations |

---

## Figma credentials (optional)

The agent works fully offline without Figma credentials — it still reads spec.md,
plans flows, and generates the plugin code.

To also enable **reading your existing Figma file** and **posting comments**:

1. Create a Personal Access Token: Figma → Settings → Account → Personal access tokens
2. Copy the file key from the URL: `figma.com/file/<FILE_KEY>/...`
3. Add both to your `.env`

---

## Project structure

```
design_lead_agent.py   Main agent — agentic loop with Claude Opus 4.6
figma_client.py        Figma REST API wrapper + plugin code generator
tools.py               Tool definitions (JSON Schema) + implementations
spec.md                Example product spec (Task Management App)
requirements.txt
.env.example
```
