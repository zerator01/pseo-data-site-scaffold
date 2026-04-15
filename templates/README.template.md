# {{PROJECT_NAME}}

{{PROJECT_NAME}} is a data-led pSEO site built around {{ENTITY_TYPE}} comparisons using public datasets, documented estimates, and editorial scoring rules.

## Focus

- `src/` or `app/`: page templates
- `data/`: ETL and processed datasets
- `docs/solutions/`: reusable learnings
- `scaffold.config.json`: project identity, route bases, and starter copy

## Working Rules

- Data layer first
- Representative views separated from full rankings
- Drip-feed sitemap by default
- Independent publisher positioning
- Major pages need next-step navigation

## Bootstrap

```bash
npm install
# 1) edit scaffold.config.json
npm run init:project
# 2) regenerate sample data and governance artifacts
npm run refresh:data
# 3) verify the starter still passes gates
npm run validate:ops
npm run build
```

## Create A New Project

```bash
npm run create:project -- ../my-new-site
cd ../my-new-site
npm install
npm run init:project
npm run refresh:data
```

The creation script copies the scaffold into a new directory, skips local build artifacts, and pre-fills the copied `scaffold.config.json` from the target directory name.

For a one-shot flow:

```bash
npm run create:project -- ../my-new-site --install --init --refresh
```

To verify the generator end to end in a fresh temporary directory:

```bash
npm run smoke:create-project
```

## First 15 Minutes

1. Edit `scaffold.config.json`.
2. Set your project identity:
   `projectName`, `siteName`, `siteUrl`, `siteDescription`.
3. Set your page families:
   `entitySingular`, `entityPlural`, `entityRouteBase`, `categorySingular`, `categoryPlural`, `categoryRouteBase`.
4. Set your default navigation surfaces:
   `defaultCategoryHubLabel`, `defaultCategoryHubSlug`, ranking labels, metric families.
5. Run `npm run init:project`.
6. Run `npm run refresh:data`.
7. Review generated docs in `docs/` and sample data in `data/`.

## What Init Changes

- Rewrites `package.json` project name
- Rewrites `src/lib/site.ts` from config
- Regenerates starter docs from templates
- Regenerates sample raw and processed data
- Regenerates anomaly baseline inputs

## What Create Changes

- Copies the scaffold into a new target directory
- Skips `.next`, `node_modules`, `dist`, `coverage`, and `out`
- Updates copied `scaffold.config.json` with a target-derived `projectName`, `siteName`, and default `siteUrl`
- Optionally runs `npm install`, `npm run init:project`, and `npm run refresh:data`

## Smoke Test

- `npm run smoke:create-project` creates a fresh temp project, runs install/init/refresh, then runs a target-project build
- Use this before changing generator scripts or config semantics

## Config Guide

See `docs/scaffold-config-reference.md` for every supported config field and what it controls.

## Data Ops

```bash
npm run fetch:sample
npm run transform:sample
npm run ops:refresh-queue
npm run rebuild:baseline
npm run refresh:data
```

`npm run ops:refresh-queue` generates a human-in-the-loop refresh queue from
`data/source-registry.json` and writes:

- `docs/ops/generated/data-refresh-queue.json`
- `docs/ops/generated/data-refresh-queue.md`

Use this to see which sources are fresh, due, overdue, blocked, or waiting on review before a
publish decision.

## Quality Audit

Run:

```bash
npm run audit:page-quality
```

This writes:

- `docs/ops/generated/page-quality-audit.md`
- `docs/ops/generated/page-quality-audit.json`
- `docs/ops/generated/page-narrative-diff.md`
- `docs/ops/generated/page-narrative-diff.json`

Use these with:

- `docs/page-quality-audit-framework.md`
- `docs/seo-signal-response-map.md`
- `docs/checklists/page-family-audit-checklist.md`

The goal is to make page-family quality review repeatable instead of relying on ad hoc judgment when Search Console starts moving.

## Starter Surface

- `app/`: page families and routes
- `src/lib/site.ts`: generated site constants, route helpers, family configuration
- `src/lib/page-sections.ts`: config-driven section registry for major page families
- `data/raw/`: starter raw inputs
- `data/source-registry.json`: machine-readable source registry for refresh coordination
- `data/processed/`: generated entity datasets
- `data/governance/`: anomaly baseline and override registry
- `state/`: refresh run records and approval records
- `scripts/`: init, refresh, validation, and publish-gate commands
- `docs/`: blueprint, refresh, governance, and source documentation

## Operations Starter

`init:project` also generates a minimal operations scaffold under `docs/ops/` so each new site starts with:

- an operating model
- a publishing SOP
- a quality review SOP
- an incident response SOP
- an automation backlog
- an execution log template for recording what actually got done

For the first planning loop, run:

```bash
npm run ops:cycle
```

This writes starter outputs into `docs/ops/generated/`:

- `refresh-digest.md`
- `page-narrative-diff.md`
- `page-narrative-diff.json`
- `qa-sampling-queue.md`
- `qa-sampling-queue.json`
- `weekly-ops-summary.md`
- `weekly-ops-plan.md`
- `weekly-ops-review.md`
- `weekly-ops-replan.md`
- `weekly-ops-replan-input.json`

The intended loop is:

1. Generate the weekly plan.
2. Review `page-narrative-diff.md` before making a publish decision.
3. Record actual work in `docs/ops/ops-execution-log.md`.
4. Generate the weekly review.
5. Generate the replan brief for the next cycle.
6. Use the replan brief to drive the next plan cycle, either manually or through an LLM / agent layer.

To let an OpenAI-compatible model turn that brief into a proposed next-week plan:

```bash
export OPS_REPLAN_API_KEY=...
export OPS_REPLAN_BASE_URL=https://api.openai.com/v1
export OPS_REPLAN_MODEL=gpt-5-mini
npm run ops:replan:llm
```

Model selection guidance:

- Prefer a stronger reasoning model for `ops:replan:llm` than for lightweight copy tasks.
- For long-context replanning, agentic work, or coding-style task decomposition, prefer a `MiniMax` reasoning / high-speed tier when your provider exposes one.
- For cheaper general-purpose planning, bilingual drafting, or simpler structured output, a `Qwen` plus-tier model is usually sufficient.
- Do not treat the provider SKU name as universal truth. Hosted platforms often rename or route models differently, so validate against your actual provider's output quality and latency.
- Keep the prompt input compact and structured. Better model choice does not compensate for dumping full historical markdown into the request.

Optional:

- `OPS_REPLAN_API_STYLE=responses` for OpenAI Responses-compatible APIs
- `OPS_REPLAN_API_STYLE=chat_completions` for OpenAI Chat Completions-compatible APIs

This writes:

- `weekly-ops-next-plan.json`
- `weekly-ops-next-plan.md`
- `weekly-ops-llm-response.json`

GitHub Actions includes a weekly `Ops Snapshot` workflow plus manual `workflow_dispatch` support so these artifacts can be generated, archived, and upserted into a dated GitHub issue.
