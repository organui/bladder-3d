import { mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { Document, NodeIO } from '@gltf-transform/core'
import { BufferGeometry, Float32BufferAttribute, Color } from 'three'
import inputs from './model-inputs.json'
import { structures } from '../src/anatomy'

// Keep the explorer on the pelvis. The ureters run up to the kidneys, so only
// their pelvic course is kept: faces with any vertex above the top of the
// rectum are dropped. The urethra continues through the penis, so faces with
// any vertex in front of the bladder's front surface are dropped. Source
// coordinates are in mm; z points up and -y points forward.
const URETER_CUT_MM = 890
const URETHRA_CUT_MM = -125
const clip: Record<string, { axis: 1 | 2; keep: (value: number) => boolean }> = {
  'right-ureter': { axis: 2, keep: (z) => z <= URETER_CUT_MM },
  'left-ureter': { axis: 2, keep: (z) => z <= URETER_CUT_MM },
  urethra: { axis: 1, keep: (y) => y >= URETHRA_CUT_MM },
}

const sha = (data: Uint8Array) => createHash('sha256').update(data).digest('hex')
await mkdir('.asset-cache', { recursive: true })
await mkdir('public/models', { recursive: true })
for (const input of inputs) {
  const file = Bun.file(`.asset-cache/${input.file}`)
  if (!(await file.exists())) {
    console.log(`Downloading ${input.file}…`)
    const response = await fetch(input.url)
    if (!response.ok) throw new Error(`${input.file}: HTTP ${response.status}`)
    await Bun.write(file, response)
  }
  if (sha(new Uint8Array(await file.arrayBuffer())) !== input.sha256) {
    throw new Error(
      `Checksum mismatch: ${input.file}. Refusing changed upstream data; review it before updating the pin.`,
    )
  }
}
const doc = new Document()
doc.getRoot().getAsset().copyright =
  'BodyParts3D, © The Database Center for Life Science licensed under CC Attribution-Share Alike 2.1 Japan'
const scene = doc.createScene('OrganUI Bladder — BodyParts3D 3.0')
const buffer = doc.createBuffer()
const min = [Infinity, Infinity, Infinity],
  max = [-Infinity, -Infinity, -Infinity]
const prepared = await Promise.all(
  structures.map(async (structure) => {
    const input = inputs.find((i) => i.file === `${structure.fma}.stl`)
    if (!input) throw new Error(`Missing input: ${structure.fma}`)
    const bytes = new Uint8Array(await Bun.file(`.asset-cache/${input.file}`).arrayBuffer())
    const view = new DataView(bytes.buffer)
    const count = view.getUint32(80, true)
    if (bytes.length !== 84 + 50 * count) throw new Error(`Not a binary STL: ${input.file}`)
    // STL stores every triangle's corners separately; weld identical corners
    // so the mesh is indexed and normals can be smoothed across faces.
    const positions: number[] = [],
      indices: number[] = []
    const welded = new Map<string, number>()
    let kept = 0
    for (let t = 0; t < count; t++) {
      const corners: number[][] = []
      for (let k = 0; k < 3; k++) {
        const o = 84 + 50 * t + 12 + 12 * k
        const v = [0, 4, 8].map((d) => view.getFloat32(o + d, true))
        if (!v.every(Number.isFinite)) throw new Error(`Invalid vertex: ${input.file}`)
        corners.push(v)
      }
      const cut = clip[structure.id]
      if (cut && corners.some((v) => !cut.keep(v[cut.axis]))) continue
      if (corners.some((a, i) => corners.some((b, j) => i < j && a.join() === b.join()))) continue
      for (const v of corners) {
        const key = v.join()
        let index = welded.get(key)
        if (index === undefined) {
          index = positions.length / 3
          welded.set(key, index)
          positions.push(...v)
          v.forEach((p, i) => {
            min[i] = Math.min(min[i], p)
            max[i] = Math.max(max[i], p)
          })
        }
        indices.push(index)
      }
      kept++
    }
    if (!kept) throw new Error(`Empty geometry: ${input.file}`)
    return {
      structure,
      positions,
      indices,
      source: {
        file: input.file,
        sha256: input.sha256,
        bytes: bytes.length,
        sourceTriangles: count,
        triangles: kept,
        vertices: positions.length / 3,
        ...(structure.id === 'urethra'
          ? { droppedFacesInFrontOfYmm: URETHRA_CUT_MM }
          : clip[structure.id]
            ? { droppedFacesAboveZmm: URETER_CUT_MM }
            : {}),
      },
    }
  }),
)
const center = min.map((v, i) => (v + max[i]) / 2)
const scale = 0.02 // millimeters to display units; uniform scale, no anatomical reshaping
for (const { structure, positions, indices } of prepared) {
  const transformed = new Float32Array(positions.length)
  for (let i = 0; i < positions.length; i += 3) {
    transformed[i] = (positions[i] - center[0]) * scale
    transformed[i + 1] = (positions[i + 2] - center[2]) * scale
    transformed[i + 2] = -(positions[i + 1] - center[1]) * scale
  }
  const geometry = new BufferGeometry()
    .setAttribute('position', new Float32BufferAttribute(transformed, 3))
    .setIndex(indices)
  geometry.computeVertexNormals()
  const color = new Color(structure.color)
  const material = doc
    .createMaterial(structure.id)
    .setBaseColorFactor([color.r, color.g, color.b, 1])
    .setRoughnessFactor(0.65)
    .setMetallicFactor(0)
    .setDoubleSided(true)
  const indexArray =
    transformed.length / 3 <= 65535 ? new Uint16Array(indices) : new Uint32Array(indices)
  const primitive = doc
    .createPrimitive()
    .setAttribute(
      'POSITION',
      doc.createAccessor().setType('VEC3').setArray(transformed).setBuffer(buffer),
    )
    .setAttribute(
      'NORMAL',
      doc
        .createAccessor()
        .setType('VEC3')
        .setArray(new Float32Array(geometry.getAttribute('normal').array))
        .setBuffer(buffer),
    )
    .setIndices(doc.createAccessor().setType('SCALAR').setArray(indexArray).setBuffer(buffer))
    .setMaterial(material)
  const mesh = doc.createMesh(structure.id).addPrimitive(primitive)
  scene.addChild(
    doc
      .createNode(structure.id)
      .setMesh(mesh)
      .setExtras({ structureId: structure.id, fma: structure.fma }),
  )
  geometry.dispose()
}
const runtime = await new NodeIO().writeBinary(doc)
await Bun.write('public/models/bladder.glb', runtime)
const manifest = {
  dataset: 'BodyParts3D',
  version: '3.0 (20110915), BodyParts3D_3.0_obj_95, as binary STL',
  mirror: 'https://github.com/Kevin-Mattheus-Moerman/BodyParts3D',
  mirrorCommit: 'f0eeb6e843380cfe6b83797cf8c3e1af74de5e61',
  retrieved: '2026-10-16',
  license: 'CC-BY-SA-2.1-JP',
  licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en',
  credit: doc.getRoot().getAsset().copyright,
  inputs,
  transform: { sourceBoundsMm: { min, max }, centerMm: center, scale, axes: '[x, z, -y]' },
  runtime: { file: 'bladder.glb', bytes: runtime.byteLength, sha256: sha(runtime) },
  structures: prepared.map(({ structure, source }) => ({
    id: structure.id,
    fma: structure.fma,
    sourceName: structure.sourceName,
    source,
  })),
}
await Bun.write('public/models/manifest.json', JSON.stringify(manifest, null, 2) + '\n')
console.log(
  `Prepared ${structures.length} structures, ${prepared.reduce((n, p) => n + p.indices.length / 3, 0)} triangles, ${runtime.byteLength} bytes. SHA-256 ${sha(runtime)}`,
)
