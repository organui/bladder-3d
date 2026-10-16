# Anatomy-tree registry integration

The anatomy panel uses the OrganUI registry item `anatomy-tree`, installed with the shadcn CLI. The installed source is tracked in version control; runtime and ordinary setup never contact a registry.

## Exact installation

Installed on 2026-10-16:

```sh
REGISTRY_URL=http://127.0.0.1:4412 bunx shadcn@4.21.0 add http://127.0.0.1:4412/anatomy-tree.json -y -o
```

The build sandbox could not reach `organui.com` or `ui.shadcn.com`, so the item was served from a local static server (`python3 -m http.server 4412`) holding the registry built with `bun run build` in `packages/registry` of the OrganUI repository at `master` commit **42dc34f** (organui PR #12 merged), plus shadcn's `colors/neutral.json` from the shadcn GitHub repository. With network access, the equivalent public command is `bunx shadcn@4.21.0 add https://organui.com/r/anatomy-tree.json -y -o`.

| Artifact                                     | SHA-256                                                            |
| -------------------------------------------- | ------------------------------------------------------------------ |
| Served `anatomy-tree.json`                   | `719c1547afb1453e809ee1b2fca0dc99858083aa3ff712477a493c77e8f5f389` |
| Tracked `src/components/ui/anatomy-tree.tsx` | `3d5554cdc179f1ad778fd6321cc1414c293c4cca0535efd9aab679c686893538` |

Both match the heart explorer's install. The CLI reported the component file as identical and wrote `@base-ui/react@^1.8.0` to `package.json`; it was changed back to the exact `1.8.0` pin, and `bun.lock` was unchanged.

## API used

- `data`: four group rows (`selectable: false`), each with its structure leaves (`color` set to the structure's mesh colour);
- `selectedId` / `onSelectionChange`: the app's single controlled selection;
- `visibility` / `onVisibilityChange`: a map keyed by leaf IDs, where a missing entry means visible;
- `defaultExpandedIds`: all four groups, so the tree initially lists every structure;
- `label="Bladder anatomy"` and `className="registry-tree"`.

Search and expansion stay internal to the component. The component's built-in reveal expands a collapsed group and scrolls the row into view when the selection changes to a row that is not shown, for example after a 3D pick or a tour step.

## Application adapter

Scene-specific logic lives in `src/anatomy-adapter.ts`, built from the existing `structures` and `groups` in `src/anatomy.ts`:

| Tree ID                     | Scene leaves (GLB `structureId`)                                                         |
| --------------------------- | ---------------------------------------------------------------------------------------- |
| `group-urinary-tract`       | `urinary-bladder`, `right-ureter`, `left-ureter`, `urethra`                              |
| `group-reproductive-organs` | `prostate`, `right-seminal-vesicle`, `left-seminal-vesicle`                              |
| `group-pelvic-floor`        | `right-pubococcygeus`, `left-pubococcygeus`, `right-puborectalis`, `left-puborectalis`   |
| `group-neighbouring-organs` | `rectum`                                                                                 |

Groups are interface groupings only and do not claim anatomical containment (for example, the prostate is a reproductive organ that the urethra runs through). Every leaf ID is exactly one application structure ID and one GLB node.

Leaves carry `color` from `structures` in `src/anatomy.ts`, the same value the renderer applies to the mesh material; group rows set `selectable: false`. The adapter provides `anatomyTree`, `sceneIdsForNode`, `normalizeVisibility`, `visibilityFromHidden` / `hiddenFromVisibility` (the app keeps its existing `hidden` set and converts at the boundary), `isStructureId`, and `assertAnatomyMapping`, which runs at import and throws on missing, unknown, or duplicate leaves. `src/anatomy-adapter.test.ts` covers these with `bun test`.

## Decisions

These are carried over unchanged from heart-3d, the reference explorer.

- **Group rows do not select.** Emphasis, the details card, and the selection chip all describe one structure. Clicking a group row or pressing Enter on it expands or collapses it; its visibility button shows or hides all its structures (`Mixed` when partly hidden).
- **Visibility** is the app's `hidden` set. The tree, Hide/Show, Isolate, Restore all, the guided tour, and Reset all write that one set.
- **Reset** increments the tree's React `key`, remounting it to clear its internal search and expansion.
- **Search** matches row labels only; FMA IDs are shown in the details card.
- **Hidden structures are not pickable** in 3D (`src/picking.ts`) but remain selectable in the tree.
- **Reveal** uses the component's built-in reveal. When the panel opens, the app scrolls an already-selected row into the tree's own scroll area (never the page), because a selection made while the panel was closed could not be revealed then.
- Shared behaviour: selected structure glows in its colour at 0.35 emissive with the rest ghosted; clicking a structure keeps the view label; the panel is closed by default, opened from the header, takes focus, and returns it on Escape/close; the chip name opens the panel; toolbar order is view menu, zoom in, zoom out, reset. `src/framing.ts` is identical to heart-3d's.

## Theme setup

`src/styles.css` is heart-3d's: Tailwind CSS 4 with shadcn tokens mapped to the warm neutral palette, global resets in `@layer base` after preflight, and unlayered `.registry-tree` rules that fit the component into the panel.

## Observations

1. The CLI loosens the exact dependency pin to `^1.8.0`; it was restored to `1.8.0`.
2. Search and expansion are internal to the component, so clearing them needs a remount (Reset does this).
3. Reveal runs only when `selectedId` changes, so a selection made while the tree is hidden is not scrolled into view when it is shown again (handled by the app, see Reveal).

Screen-reader testing of the tree was not done.
