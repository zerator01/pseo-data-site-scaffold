# My Data Site

My Data Site is a data-led pSEO site built around cities and city detail pages comparisons using public datasets, documented estimates, and editorial scoring rules.

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
npm run rebuild:baseline
npm run refresh:data
```

## Starter Surface

- `app/`: page families and routes
- `src/lib/site.ts`: generated site constants, route helpers, family configuration
- `src/lib/page-sections.ts`: config-driven section registry for major page families
- `data/raw/`: starter raw inputs
- `data/processed/`: generated entity datasets
- `data/governance/`: anomaly baseline and override registry
- `scripts/`: init, refresh, validation, and publish-gate commands
- `docs/`: blueprint, refresh, governance, and source documentation

## Operations Starter

`init:project` also generates a minimal operations scaffold under `docs/ops/` so each new site starts with:

- an operating model
- a publishing SOP
- a quality review SOP
- an incident response SOP
- an automation backlog that can later map into GitHub Actions, OpenClaw, or another orchestrator

For the first layer of operations automation, generate review artifacts with:

```bash
npm run ops:generate
```

This writes starter outputs into `docs/ops/generated/`:

- `refresh-digest.md`
- `qa-sampling-queue.md`
- `qa-sampling-queue.json`
- `weekly-ops-summary.md`

GitHub Actions also includes a weekly `Ops Snapshot` workflow plus manual `workflow_dispatch` support so the same artifacts can be generated and archived remotely.

The scheduled workflow also upserts a dated GitHub issue with the generated weekly summary, refresh digest, and QA queue so the artifacts have a default review surface even before Slack or OpenClaw integration.
