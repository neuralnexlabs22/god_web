export interface Product {
  id: string;
  name: string;
  brand: string; // Deity / Religious Theme
  price: number;
  originalPrice?: number;
  category: "Deity Prints" | "Temple Prints" | "Sculpture Prints" | "Premium Sets";
  images: string[];
  description: string;
  sizes: string[]; // Dimensions (e.g. 12x18 in, 16x24 in, 20x30 in)
  colors: string[]; // Framing / Finish Options (e.g. Teak Wood Frame, 22KT Gold Foil Accent, Archival Canvas Print)
  stock: number;
  isNew: boolean;
  isTrending?: boolean;
}

export const products: Product[] = [
  {
    id: "prod-shiva-nataraja",
    name: "Lord Shiva Nataraja Devotional Print",
    brand: "Lord Shiva Nataraja",
    price: 899,
    originalPrice: 1299,
    category: "Deity Prints",
    stock: 25,
    images: [
      "/assets/devotional/deity-gallery-montage.png"
    ],
    description: "Nataraja embodies the sacred dance of time, cosmic fire, silence, and spiritual renewal. Handcrafted archival print suited for pooja rooms and spiritual sanctums.",
    sizes: ["12 x 18 in", "16 x 24 in", "20 x 30 in"],
    colors: ["Teak Wood Frame", "22KT Gold Foil Accent", "Archival Canvas Print"],
    isNew: true,
    isTrending: true
  },
  {
    id: "prod-murugan-vel",
    name: "Lord Murugan with Sacred Vel Print",
    brand: "Lord Murugan",
    price: 949,
    originalPrice: 1399,
    category: "Deity Prints",
    stock: 20,
    images: [
      "/assets/devotional/deity-gallery-montage.png"
    ],
    description: "The radiant divine deity of wisdom, spiritual courage, and protective grace. Features the sacred Vel and divine peacock motif on museum-quality paper.",
    sizes: ["12 x 18 in", "16 x 24 in", "20 x 30 in"],
    colors: ["Teak Wood Frame", "22KT Gold Foil Accent", "Archival Canvas Print"],
    isNew: true,
    isTrending: true
  },
  {
    id: "prod-ganesha-auspicious",
    name: "Lord Ganesha Auspicious Beginnings",
    brand: "Lord Ganesha",
    price: 999,
    originalPrice: 1499,
    category: "Deity Prints",
    stock: 30,
    images: [
      "/images/ganesha_sketch.jpg",
      "/assets/devotional/deity-gallery-montage.png"
    ],
    description: "Venerated remover of obstacles and lord of auspicious beginnings. Premium devotional photo print ideal for home entrances, housewarming gifts, and pooja mandirs.",
    sizes: ["12 x 18 in", "16 x 24 in", "20 x 30 in"],
    colors: ["Teak Wood Frame", "22KT Gold Foil Accent", "Archival Canvas Print"],
    isNew: true,
    isTrending: true
  },
  {
    id: "prod-lakshmi-tanjore",
    name: "Goddess Gaja Lakshmi Tanjore Artwork Print",
    brand: "Goddess Mahalakshmi",
    price: 1299,
    originalPrice: 1899,
    category: "Deity Prints",
    stock: 15,
    images: [
      "/images/tanjore_lakshmi_hero.jpg"
    ],
    description: "Goddess of wealth, grace, and divine abundance flanked by sacred elephants. Features rich 22KT gold relief aesthetics, jewel tones, and intricate traditional floral borders.",
    sizes: ["12 x 18 in", "16 x 24 in", "20 x 30 in", "24 x 36 in"],
    colors: ["Teak Wood Frame", "22KT Gold Foil Accent", "Archival Canvas Print"],
    isNew: true,
    isTrending: true
  },
  {
    id: "prod-vishnu-perumal",
    name: "Lord Vishnu & Perumal Cosmic Protector",
    brand: "Lord Venkateswara",
    price: 1049,
    originalPrice: 1549,
    category: "Deity Prints",
    stock: 18,
    images: [
      "/assets/devotional/deity-gallery-montage.png"
    ],
    description: "Supreme protector and radiant manifestation of Vishnu in grand Vaishnava temple tradition, holding the sacred conch and discus with blessing abhaya mudra.",
    sizes: ["12 x 18 in", "16 x 24 in", "20 x 30 in"],
    colors: ["Teak Wood Frame", "22KT Gold Foil Accent", "Archival Canvas Print"],
    isNew: false,
    isTrending: false
  },
  {
    id: "prod-krishna-melody",
    name: "Lord Krishna Divine Melody Print",
    brand: "Lord Krishna",
    price: 999,
    originalPrice: 1449,
    category: "Deity Prints",
    stock: 22,
    images: [
      "/assets/devotional/deity-gallery-montage.png"
    ],
    description: "Depicting divine joy, pastoral grace, the sacred flute, and loving devotion. Printed on archival 310 GSM canvas with rich tonal gradation.",
    sizes: ["12 x 18 in", "16 x 24 in", "20 x 30 in"],
    colors: ["Teak Wood Frame", "22KT Gold Foil Accent", "Archival Canvas Print"],
    isNew: false,
    isTrending: true
  },
  {
    id: "prod-thanjavur-brihadisvara",
    name: "Thanjavur Brihadisvara Temple Gopuram Print",
    brand: "Thanjavur Brihadisvara",
    price: 1199,
    originalPrice: 1699,
    category: "Temple Prints",
    stock: 14,
    images: [
      "/assets/devotional/temple-heritage.png"
    ],
    description: "The iconic Vimana and monolithic granite architecture of the Great Living Chola Temple at Thanjavur under golden dawn lighting.",
    sizes: ["16 x 24 in", "20 x 30 in", "24 x 36 in"],
    colors: ["Teak Wood Frame", "Matte Black Minimalist Frame", "Archival Canvas Print"],
    isNew: true,
    isTrending: true
  },
  {
    id: "prod-madurai-meenakshi",
    name: "Madurai Meenakshi Thousand Pillar Corridor",
    brand: "Madurai Meenakshi Amman",
    price: 1399,
    originalPrice: 1999,
    category: "Temple Prints",
    stock: 12,
    images: [
      "/images/vintage_temple_wide.jpg",
      "/assets/devotional/temple-heritage.png"
    ],
    description: "Masterwork photography capturing the breathtaking geometric symmetry and sculpted stone pillars of the sacred Madurai sanctum corridor.",
    sizes: ["16 x 24 in", "20 x 30 in", "24 x 36 in"],
    colors: ["Teak Wood Frame", "Matte Black Minimalist Frame", "Archival Canvas Print"],
    isNew: false,
    isTrending: true
  },
  {
    id: "prod-yali-stone-pillars",
    name: "Sacred Yali Granite Pillar Study",
    brand: "Yali Stone Pillars",
    price: 1299,
    originalPrice: 1799,
    category: "Sculpture Prints",
    stock: 16,
    images: [
      "/assets/devotional/sacred-sculptures.png"
    ],
    description: "Dramatic black-and-white editorial study of mythical guardian Yali pillars carved from monolithic South Indian temple granite.",
    sizes: ["12 x 18 in", "16 x 24 in", "20 x 30 in"],
    colors: ["Teak Wood Frame", "Matte Black Minimalist Frame", "Archival Canvas Print"],
    isNew: true,
    isTrending: false
  },
  {
    id: "prod-chola-bronze-icons",
    name: "Chola Bronze Icons Masterpiece",
    brand: "Chola Bronzes",
    price: 1499,
    originalPrice: 2199,
    category: "Sculpture Prints",
    stock: 10,
    images: [
      "/assets/devotional/sacred-sculptures.png"
    ],
    description: "Celebrated lost-wax cast Chola bronze sculpture series depicting divine posture, timeless fluidity, and sacred elegance.",
    sizes: ["16 x 24 in", "20 x 30 in"],
    colors: ["Teak Wood Frame", "22KT Gold Foil Accent", "Archival Canvas Print"],
    isNew: false,
    isTrending: true
  },
  {
    id: "prod-pooja-room-set",
    name: "Pooja Room Complete Sanctum 5-Piece Set",
    brand: "Pooja Room Sanctum Set",
    price: 3999,
    originalPrice: 5499,
    category: "Premium Sets",
    stock: 8,
    images: [
      "/images/tanjore_lakshmi_hero.jpg",
      "/assets/devotional/deity-gallery-montage.png"
    ],
    description: "Curated 5-piece framed devotional gallery set featuring Ganesha, Lakshmi, Shiva, Murugan, and Saraswati in matched seasoned teak-finish frames.",
    sizes: ["Set of 5 (12 x 18 in each)"],
    colors: ["Teak Wood Frame Set", "22KT Gold Foil Border Edition"],
    isNew: true,
    isTrending: true
  },
  {
    id: "prod-dravidian-heritage-set",
    name: "Dravidian Sacred Heritage Collector Edition",
    brand: "Dravidian Heritage Series",
    price: 4999,
    originalPrice: 6999,
    category: "Premium Sets",
    stock: 6,
    images: [
      "/assets/devotional/temple-heritage.png",
      "/images/vintage_temple_wide.jpg"
    ],
    description: "Limited museum-grade framed collection of historical temple corridors and monumental gopurams from sacred temple sanctuaries on 350 GSM cotton rag paper.",
    sizes: ["Set of 3 (16 x 24 in each)", "Set of 3 (20 x 30 in each)"],
    colors: ["Seasoned Teakwood Framing", "Museum Glass Archival Edition"],
    isNew: true,
    isTrending: false
  }
];

export const collections = [
  {
    id: "col-deity-prints",
    name: "Deity Prints",
    image: "/assets/devotional/deity-gallery-montage.png",
    description: "Sacred Hindu deity framed photo prints for pooja rooms and spiritual spaces."
  },
  {
    id: "col-temple-prints",
    name: "Temple Prints",
    image: "/assets/devotional/temple-heritage.png",
    description: "Magnificent sacred temple architecture, soaring gopurams, and sculpted corridors."
  },
  {
    id: "col-sculpture-prints",
    name: "Sculpture Prints",
    image: "/assets/devotional/sacred-sculptures.png",
    description: "Yali pillars, Chola bronzes, and sacred monolithic granite reliefs."
  },
  {
    id: "col-premium-sets",
    name: "Premium Sets",
    image: "/images/tanjore_lakshmi_hero.jpg",
    description: "Curated multi-frame devotional collections for pooja rooms, housewarmings, and divine gifting."
  }
];
