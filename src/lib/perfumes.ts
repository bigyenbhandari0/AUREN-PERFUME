export type Size = "50" | "100";

export type Perfume = {
  id: string;
  name: string;
  character: string;
  notes: string[];
  description: string;
  prices: Record<Size, number>;
  /** oklch accent used for niche lighting */
  glow: string;
};

export const perfumes: Perfume[] = [
  {
    id: "ember-veil",
    name: "Ember Veil",
    character: "Warm, smoky, intimate",
    notes: ["Saffron", "Smoked cedar", "Vanilla"],
    description:
      "Golden saffron settles into smoked cedar and soft vanilla. A warm, lingering fragrance for evenings that unfold slowly.",
    prices: { "50": 3900, "100": 6500 },
    glow: "oklch(0.78 0.14 70)",
  },
  {
    id: "rose-static",
    name: "Rose Static",
    character: "Floral, textured, modern",
    notes: ["Pink pepper", "Rose petals", "White musk"],
    description:
      "Fresh rose meets the quiet spark of pink pepper, softened by a veil of white musk. Delicate, with an unmistakable edge.",
    prices: { "50": 3700, "100": 6200 },
    glow: "oklch(0.78 0.09 10)",
  },
  {
    id: "moss-theory",
    name: "Moss Theory",
    character: "Green, clean, grounded",
    notes: ["Bergamot", "Fig leaf", "Oakmoss"],
    description:
      "Bright bergamot and green fig leaf open onto earthy oakmoss. A crisp escape into the stillness of a shaded garden.",
    prices: { "50": 3600, "100": 6000 },
    glow: "oklch(0.82 0.07 140)",
  },
  {
    id: "blue-hour",
    name: "Blue Hour",
    character: "Cool, mineral, woody",
    notes: ["Sea salt", "Iris", "Sandalwood"],
    description:
      "Cool sea air meets soft iris and smooth sandalwood. An understated fragrance inspired by the moment daylight turns to night.",
    prices: { "50": 3900, "100": 6500 },
    glow: "oklch(0.7 0.12 255)",
  },
  {
    id: "velvet-after",
    name: "Velvet After",
    character: "Rich, soft, mysterious",
    notes: ["Black cherry", "Amber", "Tonka"],
    description:
      "Dark cherry melts into glowing amber and mellow tonka. Rich and enveloping, with a soft finish that stays close.",
    prices: { "50": 4100, "100": 6900 },
    glow: "oklch(0.62 0.15 15)",
  },
];

export const formatNPR = (n: number) => `NPR ${n.toLocaleString("en-US")}`;
