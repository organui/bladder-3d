# Model provenance and preparation

## Source and license

The runtime model is a curated subset of **BodyParts3D 3.0** (archive release `20110915`, the `BodyParts3D_3.0_obj_95` set; “95” is the source's polygon-reduction label, not an accuracy claim). The geometry was retrieved on **2026-10-16** from the public [Kevin-Mattheus-Moerman/BodyParts3D](https://github.com/Kevin-Mattheus-Moerman/BodyParts3D) mirror, pinned at commit `f0eeb6e843380cfe6b83797cf8c3e1af74de5e61`. The mirror downloaded release `20110915` from the official archive and converted each OBJ to binary STL without other changes, according to its README. Files are named by FMA concept ID.

License: **[CC BY-SA 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en)** ([legal code](https://creativecommons.org/licenses/by-sa/2.1/jp/legalcode)). This is the license the original BodyParts3D service attaches to its contour data and rendered images, and the license the mirror redistributes these files under ([mirror notice](model-source/mirror-license-content.txt); [inert snapshot of the original service notice](model-source/original-license.html.txt)). It governs `public/models/bladder.glb`, the adapted model data, and model screenshots, separately from the MIT application code.

Credit: **BodyParts3D, © The Database Center for Life Science licensed under CC Attribution-Share Alike 2.1 Japan.** See [ATTRIBUTION.md](../public/models/ATTRIBUTION.md).

The [LSDB archive license](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html), updated 2025-02-27, grants CC BY 4.0 for the archived database, and the heart, brain, kidney, and liver explorers rely on it for files downloaded directly from that archive. These files came through a mirror instead, so, like the lungs and pancreas explorers, this explorer follows the share-alike notice that came with them and does **not** rely on the archive's newer grant.

### Why this source

- The official archive (`dbarchive.biosciencedbc.jp`) was not reachable from the build sandbox, so the 4.0 archive used by the heart explorer could not be downloaded.
- The [olivercase/body_parts_3d_api](https://github.com/olivercase/body_parts_3d_api) 4.3 mirror used by the lungs explorer was checked first. It has the same concepts, but its 4.3 bladder (FJ3149) is a 226-triangle surface and its urethra is a zero-width strip, both too coarse for close inspection. The 3.0 meshes are smooth (4,016 triangles for the bladder) and are used instead.

## Selected structures

| Display name | FMA concept | Source file | Source triangles | Runtime triangles |
| --- | --- | --- | ---: | ---: |
| Urinary bladder | FMA15900 | FMA15900.stl | 4,016 | 4,016 |
| Right ureter | FMA15571 | FMA15571.stl | 2,210 | 353 |
| Left ureter | FMA15572 | FMA15572.stl | 2,226 | 390 |
| Urethra | FMA19667 | FMA19667.stl | 1,186 | 685 |
| Prostate | FMA9600 | FMA9600.stl | 1,754 | 1,754 |
| Right seminal vesicle | FMA19387 | FMA19387.stl | 1,084 | 1,084 |
| Left seminal vesicle | FMA19388 | FMA19388.stl | 1,080 | 1,080 |
| Right pubococcygeus | FMA45854 | FMA45854.stl | 23,080 | 23,080 |
| Left pubococcygeus | FMA45855 | FMA45855.stl | 23,362 | 23,362 |
| Right puborectalis | FMA45856 | FMA45856.stl | 17,924 | 17,924 |
| Left puborectalis | FMA45857 | FMA45857.stl | 17,838 | 17,838 |
| Rectum | FMA14544 | FMA14544.stl | 8,824 | 8,824 |

Concept names were checked against the mirror's copy of the source `parts_list_e.txt` (SHA-256 `824a34ed…c2ab2e4af`); the rows used are in [selected-parts.tsv](model-source/selected-parts.tsv). The same FMA IDs map to the same concepts in the official 4.3 concept table preserved in the lungs explorer. Every STL is pinned by SHA-256 in [model-inputs.json](../scripts/model-inputs.json), and [manifest.json](../public/models/manifest.json) records each structure's input hash, counts, cuts, bounds, transform, and the runtime hash.

### Cuts

Two meshes are trimmed so the explorer stays on the pelvis. Whole faces are dropped; no vertex is moved.

- **Ureters**: faces with any vertex above z = 890 mm (the top of the rectum) are dropped. Only the pelvic course into the bladder remains; the cut ends are visible.
- **Urethra**: faces with any vertex in front of y = −125 mm (just behind the bladder's front surface) are dropped. The prostatic, membranous, and start of the bulbous urethra remain; the part in the penis is cut.

### Omitted

The kidneys, bladder wall layers and lining, the trigone and ureteric openings, the sphincters, the vas deferens, the other pelvic floor muscles and fascia, the anal canal, vessels, nerves, and the bony pelvis. The source is a single adult male reference model, so it shows male pelvic anatomy only; it is not a universal or patient-specific reference. The bladder is one fill state. Colors are illustrative.

## Reproduce the runtime asset

The 1.8 MB runtime `public/models/bladder.glb` is included; ordinary setup downloads nothing. To regenerate it:

```sh
bun install --frozen-lockfile
bun run prepare:model
bun run verify:model
```

The script downloads the twelve pinned STL files (about 6 MB) into ignored `.asset-cache/` only when they are absent, and checks each SHA-256 **before** reading it. Steps:

1. Read each binary STL and reject malformed files and non-finite vertices; drop degenerate triangles (none occur in these inputs).
2. Apply the two cuts above.
3. Weld identical corners into an indexed mesh, one mesh per structure.
4. Center the whole selection on its source bounding box, map `(x, y, z)` to `(x, z, −y)`, and scale by `0.02` (display units, not a measurement calibration). Viewer +x is patient-left, +y superior, +z anterior.
5. Recompute vertex normals and assign illustrative colors.
6. Export GLB with the structure ID and FMA ID on each node, and write the manifest.

`bun run verify:model` decodes the runtime independently, checks its SHA-256, every structure/FMA pair, finite coordinates, and valid indices.

## Anatomy text and review

Descriptions are original, concise summaries of the US National Institute of Diabetes and Digestive and Kidney Diseases pages on [the urinary tract](https://www.niddk.nih.gov/health-information/urologic-diseases/urinary-tract-how-it-works), [the prostate](https://www.niddk.nih.gov/health-information/urologic-diseases/prostate-problems), and [the digestive system](https://www.niddk.nih.gov/health-information/digestive-diseases/digestive-system-how-it-works), linked from each structure's notes. Those pages were not reachable from the build sandbox, so the summaries were written from general anatomy knowledge and the links were not re-checked on 2026-10-16. No text or images from them are redistributed.

**Not completed: review by a clinical anatomy expert, or any clinical or physiological validation.** The app, README, and model dialog say so. This is an educational interface demonstration, not a diagnostic or measurement tool.
