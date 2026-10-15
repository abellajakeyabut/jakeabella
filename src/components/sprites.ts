export const palette: Record<string, string> = {
  k: "#1d1b2e", // outline / ink
  h: "#2e2a3f", // hair
  s: "#f6c9a0", // skin
  e: "#1d1b2e", // eyes
  g: "#3d3a52", // glasses frame
  m: "#c4564a", // mouth
  b: "#3f7cf0", // blazer
  w: "#ffffff", // white
  r: "#ff5d5d", // tie / red
  p: "#3a3550", // trousers
  d: "#14121f", // shoes
  y: "#ffd23f", // gold
  Y: "#e09a12", // gold shade
  c: "#d7ecff", // cloud shade
  G: "#57c26b", // green
  D: "#2f8f47", // dark green
  l: "#9a6a3c", // wood
  L: "#6f4723", // wood shade
  v: "#9b7bff", // violet
  t: "#b8f2d0", // mint
};

export const sprites = {
  hero: [
    ".....kkkkkk.....",
    "....khhhhhhk....",
    "...khhhhhhhhk...",
    "..khhhhhhhhhhk..",
    "..khhsssssshhk..",
    "..khsssssssshk..",
    "..ksgeggggegsk..",
    "..kssssssssssk..",
    "..kssssmmssssk..",
    "...kssssssssk...",
    "....kkssssskk...",
    "..kkbbwrrwbbkk..",
    ".kbbbbwrrwbbbbk.",
    ".kbbbbbrrbbbbbk.",
    "kbbkbbbrrbbbkbbk",
    "kbbkbbbbbbbbkbbk",
    "ksskbbbbbbbbkssk",
    ".kk.kppppppk.kk.",
    "....kppkkppk....",
    "...kpppkkpppk...",
    "..kddddkkddddk..",
  ],
  cloud: [
    ".....wwww.......",
    "...wwwwwwww.www.",
    ".wwwwwwwwwwwwwww",
    "wwwwwwwwwwwwwwww",
    ".cccccccccccccc.",
  ],
  coin: [
    "..kkkk..",
    ".kyyyyk.",
    "kyywyyYk",
    "kyywyyYk",
    "kyywyyYk",
    "kyyyyyYk",
    ".kYYYYk.",
    "..kkkk..",
  ],
  heart: [
    ".kk.kk.",
    "kwrkrrk",
    "krrrrrk",
    ".krrrk.",
    "..krk..",
    "...k...",
  ],
  star: [
    "....k....",
    "...kyk...",
    "kkkyyykkk",
    "kyyyyyyyk",
    ".kyyyyyk.",
    "..kyyyk..",
    ".kyykyyk.",
    "kyk...kyk",
    "kk.....kk",
  ],
  trophy: [
    "kkkkkkkkkk",
    "kyywyyyyYk",
    "kyywyyyyYk",
    ".kyyyyyYk.",
    "..kyyyYk..",
    "...kyyk...",
    "....kk....",
    "...kyyk...",
    "..kkkkkk..",
  ],
  lock: [
    "..kkkk..",
    ".k....k.",
    ".k....k.",
    "kkkkkkkk",
    "kyyyyyyk",
    "kyyykyyk",
    "kyyykyyk",
    "kYYYYYYk",
    "kkkkkkkk",
  ],
  tree: [
    "...kkkk...",
    "..kGGGGk..",
    ".kGGGGGGk.",
    "kGGtGGGGGk",
    "kGGGGGDGGk",
    "kGDGGGGGDk",
    ".kDDGGDDk.",
    "..kkllkk..",
    "....lL....",
    "....lL....",
  ],
  mail: [
    "kkkkkkkkkk",
    "kwkwwwwkwk",
    "kwwkwwkwwk",
    "kwwwkkwwwk",
    "kwwwwwwwwk",
    "kkkkkkkkkk",
  ],
  flag: [
    "k......",
    "krrrr..",
    "krrrrr.",
    "krrrr..",
    "k......",
    "k......",
    "k......",
  ],
} satisfies Record<string, string[]>;

export type SpriteName = keyof typeof sprites;
