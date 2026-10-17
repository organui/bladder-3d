export type Group = 'Urinary tract' | 'Reproductive organs' | 'Pelvic floor' | 'Neighbouring organs'
export type Structure = {
  id: string
  fma: string
  name: string
  sourceName: string
  group: Group
  color: string
  description: string
  note: string
  source: keyof typeof sources
}

export const sources = {
  urinary: {
    label: 'NIDDK',
    url: 'https://www.niddk.nih.gov/health-information/urologic-diseases/urinary-tract-how-it-works',
  },
  prostate: {
    label: 'NIDDK',
    url: 'https://www.niddk.nih.gov/health-information/urologic-diseases/prostate-problems',
  },
  digestive: {
    label: 'NIDDK',
    url: 'https://www.niddk.nih.gov/health-information/digestive-diseases/digestive-system-how-it-works',
  },
} as const
export const anatomySource = sources.urinary.url

export const structures: Structure[] = [
  {
    id: 'urinary-bladder',
    fma: 'FMA15900',
    name: 'Urinary bladder',
    sourceName: 'urinary bladder',
    group: 'Urinary tract',
    color: '#d39a7c',
    description:
      'A hollow, balloon-shaped muscular organ in the pelvis that stores urine until it is released.',
    note: 'Shown as its outer surface at one fill level. The bladder wall layers, its lining, and the trigone are not separate structures here.',
    source: 'urinary',
  },
  {
    id: 'right-ureter',
    fma: 'FMA15571',
    name: 'Right ureter',
    sourceName: 'right ureter',
    group: 'Urinary tract',
    color: '#dcad86',
    description:
      'A narrow muscular tube that carries urine from the right kidney down to the bladder.',
    note: 'Only the pelvic portion is shown. The tube is cut at the level of the top of the rectum; the kidney is outside this model.',
    source: 'urinary',
  },
  {
    id: 'left-ureter',
    fma: 'FMA15572',
    name: 'Left ureter',
    sourceName: 'left ureter',
    group: 'Urinary tract',
    color: '#e1b791',
    description:
      'A narrow muscular tube that carries urine from the left kidney down to the bladder.',
    note: 'Only the pelvic portion is shown. The tube is cut at the level of the top of the rectum; the kidney is outside this model.',
    source: 'urinary',
  },
  {
    id: 'urethra',
    fma: 'FMA19667',
    name: 'Urethra',
    sourceName: 'urethra',
    group: 'Urinary tract',
    color: '#c98572',
    description: 'The tube that lets urine leave the body from the bottom of the bladder.',
    note: 'This is a male reference model, so the urethra runs through the prostate. Only the part inside the pelvis is shown; the part in the penis is cut. Sphincter muscles are not shown.',
    source: 'urinary',
  },
  {
    id: 'prostate',
    fma: 'FMA9600',
    name: 'Prostate',
    sourceName: 'prostate',
    group: 'Reproductive organs',
    color: '#a8828f',
    description:
      'A walnut-sized gland that sits just below the bladder and surrounds the first part of the urethra.',
    note: 'Shown as one solid surface; its internal zones are not separated. The urethra runs through it.',
    source: 'prostate',
  },
  {
    id: 'right-seminal-vesicle',
    fma: 'FMA19387',
    name: 'Right seminal vesicle',
    sourceName: 'right seminal vesicle',
    group: 'Reproductive organs',
    color: '#b597a0',
    description:
      'A small gland behind the bladder that adds fluid to semen. It lies close to the bladder’s back wall.',
    note: 'Best seen from the posterior view. The vas deferens is not included.',
    source: 'prostate',
  },
  {
    id: 'left-seminal-vesicle',
    fma: 'FMA19388',
    name: 'Left seminal vesicle',
    sourceName: 'left seminal vesicle',
    group: 'Reproductive organs',
    color: '#bea2aa',
    description:
      'A small gland behind the bladder that adds fluid to semen. It lies close to the bladder’s back wall.',
    note: 'Best seen from the posterior view. The vas deferens is not included.',
    source: 'prostate',
  },
  {
    id: 'right-pubococcygeus',
    fma: 'FMA45854',
    name: 'Right pubococcygeus',
    sourceName: 'right pubococcygeus',
    group: 'Pelvic floor',
    color: '#b0675f',
    description:
      'Part of the pelvic floor muscles, which support the bladder and help hold urine in until it is released.',
    note: 'One part of the levator ani on the right side. The other pelvic floor muscles and fascia are omitted.',
    source: 'urinary',
  },
  {
    id: 'left-pubococcygeus',
    fma: 'FMA45855',
    name: 'Left pubococcygeus',
    sourceName: 'left pubococcygeus',
    group: 'Pelvic floor',
    color: '#b8736a',
    description:
      'Part of the pelvic floor muscles, which support the bladder and help hold urine in until it is released.',
    note: 'One part of the levator ani on the left side. The other pelvic floor muscles and fascia are omitted.',
    source: 'urinary',
  },
  {
    id: 'right-puborectalis',
    fma: 'FMA45856',
    name: 'Right puborectalis',
    sourceName: 'right puborectalis',
    group: 'Pelvic floor',
    color: '#9f5c57',
    description:
      'Part of the pelvic floor muscles. It forms a sling that loops behind the lower rectum.',
    note: 'One part of the levator ani on the right side. Hide the pubococcygeus to see it more clearly.',
    source: 'urinary',
  },
  {
    id: 'left-puborectalis',
    fma: 'FMA45857',
    name: 'Left puborectalis',
    sourceName: 'left puborectalis',
    group: 'Pelvic floor',
    color: '#a96862',
    description:
      'Part of the pelvic floor muscles. It forms a sling that loops behind the lower rectum.',
    note: 'One part of the levator ani on the left side. Hide the pubococcygeus to see it more clearly.',
    source: 'urinary',
  },
  {
    id: 'rectum',
    fma: 'FMA14544',
    name: 'Rectum',
    sourceName: 'rectum',
    group: 'Neighbouring organs',
    color: '#8f9e8a',
    description:
      'The last part of the large intestine, which stores stool. It lies behind the bladder and prostate.',
    note: 'Included to show what sits behind the bladder. The anal canal and the rest of the bowel are omitted.',
    source: 'digestive',
  },
]
export const groups = [
  'Urinary tract',
  'Reproductive organs',
  'Pelvic floor',
  'Neighbouring organs',
] as const
export const byId = Object.fromEntries(structures.map((s) => [s.id, s]))
export type View = 'Anterior' | 'Posterior' | 'Left lateral'
export const tour: { id: string; title: string; text: string; view: View; isolate?: boolean }[] = [
  {
    id: 'urinary-bladder',
    title: 'Where urine is stored',
    text: 'Begin at the bladder, low in the pelvis. Rotate the model to see how it rests on the pelvic floor.',
    view: 'Anterior',
  },
  {
    id: 'left-ureter',
    title: 'Where urine arrives',
    text: 'Turn to the back to follow a ureter down into the bladder. Each ureter brings urine from one kidney.',
    view: 'Posterior',
  },
  {
    id: 'urethra',
    title: 'The way out',
    text: 'From the side, follow the urethra from the base of the bladder down and forward. It is the only exit for urine.',
    view: 'Left lateral',
  },
  {
    id: 'prostate',
    title: 'Look a little closer',
    text: 'The prostate is isolated here. It sits just below the bladder and wraps around the start of the urethra. Restore all to see its neighbours.',
    view: 'Anterior',
    isolate: true,
  },
  {
    id: 'right-pubococcygeus',
    title: 'The floor beneath',
    text: 'The pelvic floor muscles form a supporting sling under the bladder. They also help keep urine in until it is time to go.',
    view: 'Posterior',
  },
]

export type Emphasis = 'normal' | 'selected' | 'ghosted'
// With nothing selected every structure keeps its own color. A selection
// keeps its structure solid and ghosts the rest so it stays visible even
// when it sits behind or inside other geometry (prostate, seminal vesicles).
export function emphasis(id: string, selected: string | null): Emphasis {
  if (!selected) return 'normal'
  return id === selected ? 'selected' : 'ghosted'
}
