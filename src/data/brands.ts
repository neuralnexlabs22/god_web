// Devotional categories and sacred deities/themes
export const devotionalCategories = [
  { name: "Deity Prints", slug: "deity-prints", description: "Premium framed and unframed Hindu deity photo prints" },
  { name: "Temple Prints", slug: "temple-prints", description: "Tamil temple gopuram, corridor, and architecture artwork" },
  { name: "Sculpture Prints", slug: "sculpture-prints", description: "Yali pillars, bronze icons, and sacred carving studies" },
  { name: "Premium Sets", slug: "premium-sets", description: "Curated devotional photo sets for pooja rooms and gifting" }
];

export const allBrands = [
  { name: "Lord Shiva Nataraja", category: "deity-prints", description: "The cosmic dancer of time, rhythm, and renewal", featured: true },
  { name: "Lord Murugan", category: "deity-prints", description: "Radiant Tamil deity of wisdom, courage, and the sacred Vel", featured: true },
  { name: "Lord Ganesha", category: "deity-prints", description: "Remover of obstacles and lord of auspicious beginnings", featured: true },
  { name: "Goddess Meenakshi", category: "deity-prints", description: "Divine queen and mother deity of Madurai", featured: true },
  { name: "Lord Venkateswara", category: "deity-prints", description: "Supreme protector and radiant manifestation of Vishnu", featured: true },
  { name: "Goddess Mahalakshmi", category: "deity-prints", description: "Goddess of wealth, grace, light, and prosperity", featured: true },
  { name: "Lord Dakshinamurthy", category: "deity-prints", description: "Silent teacher of cosmic knowledge under the banyan tree", featured: false },
  { name: "Bhairava", category: "deity-prints", description: "Fierce protector of temples, cosmic time, and sacred space", featured: false },
  { name: "Thanjavur Brihadisvara", category: "temple-prints", description: "Great Living Chola temple architecture & Vimana majesty", featured: true },
  { name: "Madurai Meenakshi Amman", category: "temple-prints", description: "Celebrated thousand-pillared halls and soaring gopurams", featured: true },
  { name: "Rameswaram Ramanathaswamy", category: "temple-prints", description: "Historic long sculpted corridors of sacred coastal sanctuary", featured: true },
  { name: "Chidambaram Nataraja", category: "temple-prints", description: "The golden roof shrine of cosmic akasha and divine dance", featured: true },
  { name: "Chola Bronzes", category: "sculpture-prints", description: "Lost-wax cast bronze icons with divine fluidity and elegance", featured: true },
  { name: "Yali Stone Pillars", category: "sculpture-prints", description: "Mythical guardian lions carved from massive monolithic granite", featured: true },
  { name: "Sacred Reliefs", category: "sculpture-prints", description: "Intricate granite reliefs of celestial dancers and sacred lore", featured: false },
  { name: "Pooja Room Sanctum Set", category: "premium-sets", description: "Complete five-piece framed devotional gallery for pooja rooms", featured: true },
  { name: "Dravidian Heritage Series", category: "premium-sets", description: "Curated fine art archival collection of sacred temple corridors", featured: true },
  { name: "Festival & Gifting Edits", category: "premium-sets", description: "Gold-accented devotional prints suited for housewarmings and gifts", featured: false }
];

export const brandsByCategory = {
  "deity-prints": allBrands.filter((b) => b.category === "deity-prints"),
  "temple-prints": allBrands.filter((b) => b.category === "temple-prints"),
  "sculpture-prints": allBrands.filter((b) => b.category === "sculpture-prints"),
  "premium-sets": allBrands.filter((b) => b.category === "premium-sets"),
  watches: [],
  clothing: [],
  accessories: [],
  shoes: []
};

export const categories = devotionalCategories;

// Helper function to get brand slug
export const getBrandSlug = (brandName: string): string => {
  return brandName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
};
