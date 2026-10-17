# Verification record

Checked locally on 2026-10-16. No deployment was performed.

## Automated checks

- `bun run typecheck`, `bun run test` (11 tests), and `bun run build` pass.
- `bun run verify:model`: 12 structure/FMA mappings, **100,390 triangles**, **1,817,148 bytes**; checksum, finite coordinates, and indices verified.
- `bun run prepare:model` from the checksum-pinned cache regenerates a byte-identical GLB.
- `bun run format:check` passes.
- `src/framing.ts` is byte-identical to heart-3d's copy.

## Browser checks

Headless Chromium (Playwright) with software WebGL against `bun run preview`, at 1440 × 900 and 390 × 844. No console errors.

| Check | Result |
| --- | --- |
| Initial load | Twelve structures render in the anterior view; status reads “12 of 12 structures visible”. |
| View presets | Anterior, posterior, and left lateral each fit the model. |
| Panel | Closed by default. Opening moves focus into the panel; Escape returns focus to the **Anatomy** button. |
| Tree selection | Selecting “Urinary bladder” highlights the row, glows the bladder, ghosts the rest, and shows its details and FMA ID. |
| 3D selection | Clicking the bladder in the left lateral view selects it and shows the chip; the view label stays “Left lateral”. |
| Isolate / hide / restore | Isolating the prostate shows 1 of 12; Restore all returns 12 of 12; Hide gives 11 of 12. |
| Guided tour | All five stops step through with the expected views (Anterior, Posterior, Left lateral, Anterior isolated, Posterior). |
| Reset | Restores all structures and the anterior view. |
| Mobile | Header, **Anatomy** label, canvas, and toolbar fit at 390 × 844 without horizontal overflow. |

Not checked: physical iOS/Android devices, a screen reader, or induced GPU context loss.
