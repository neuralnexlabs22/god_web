export type DevotionalImage = {
  src: string;
  alt: string;
};

export type Deity = {
  slug: string;
  name: string;
  tamilName: string;
  title: string;
  description: string;
  symbol: string;
  image: DevotionalImage;
  objectPosition: string;
  cropPosition: string;
};

export const devotionalAssets = {
  hero: {
    src: "/assets/devotional/hero-nataraja-temple.png",
    alt: "Nataraja-inspired bronze Shiva sculpture in a Tamil temple corridor",
  },
  deityMontage: {
    src: "/assets/devotional/deity-gallery-montage.png",
    alt: "Editorial montage of Hindu deity devotional artworks",
  },
  temple: {
    src: "/assets/devotional/temple-heritage.png",
    alt: "Tamil temple gopuram with carved yali pillars and a pillared corridor",
  },
  sculptures: {
    src: "/assets/devotional/sacred-sculptures.png",
    alt: "Sacred South Indian sculpture gallery with yali carvings and bronze icons",
  },
};

export const deities: Deity[] = [
  {
    slug: "shiva-nataraja",
    name: "Lord Shiva Nataraja",
    tamilName: "நடராஜர்",
    title: "The cosmic rhythm of creation and dissolution.",
    description:
      "Nataraja embodies the sacred dance of time, fire, silence, and renewal. The form is central to South Indian bronze traditions and temple worship.",
    symbol: "Damaru, flame, dancing pose",
    image: devotionalAssets.deityMontage,
    objectPosition: "12.5% 16.6%",
    cropPosition: "0% 0%",
  },
  {
    slug: "murugan",
    name: "Lord Murugan",
    tamilName: "முருகன்",
    title: "The radiant Tamil deity of wisdom and courage.",
    description:
      "Murugan is beloved across Tamil Nadu, associated with the vel, the peacock, hill shrines, and devotional poetry.",
    symbol: "Vel and peacock",
    image: devotionalAssets.deityMontage,
    objectPosition: "37.5% 16.6%",
    cropPosition: "33.333% 0%",
  },
  {
    slug: "ganesha",
    name: "Lord Ganesha",
    tamilName: "விநாயகர்",
    title: "The remover of obstacles and guardian of beginnings.",
    description:
      "Ganesha is invoked before sacred journeys, rituals, study, and creative work, appearing in temples, homes, and processions.",
    symbol: "Modakam and mouse",
    image: devotionalAssets.deityMontage,
    objectPosition: "62.5% 16.6%",
    cropPosition: "66.666% 0%",
  },
  {
    slug: "vishnu",
    name: "Lord Vishnu",
    tamilName: "பெருமாள்",
    title: "The preserver, protector, and sustainer of dharma.",
    description:
      "Vishnu is worshipped in grand Vaishnava temples through forms connected with compassion, protection, and cosmic order.",
    symbol: "Conch and discus",
    image: devotionalAssets.deityMontage,
    objectPosition: "87.5% 16.6%",
    cropPosition: "100% 0%",
  },
  {
    slug: "krishna",
    name: "Lord Krishna",
    tamilName: "கிருஷ்ணர்",
    title: "Divine joy, music, wisdom, and loving devotion.",
    description:
      "Krishna's flute, pastoral grace, and teachings of the Bhagavad Gita make him one of the most intimate devotional forms.",
    symbol: "Flute and peacock feather",
    image: devotionalAssets.deityMontage,
    objectPosition: "12.5% 50%",
    cropPosition: "0% 50%",
  },
  {
    slug: "amman",
    name: "Goddess Amman",
    tamilName: "அம்மன்",
    title: "The fierce, protective mother of Tamil temple towns.",
    description:
      "Amman worship carries living village, city, and temple traditions of protection, healing, fertility, and local sacred identity.",
    symbol: "Crown, trident, blessing hand",
    image: devotionalAssets.deityMontage,
    objectPosition: "37.5% 50%",
    cropPosition: "33.333% 50%",
  },
  {
    slug: "durga",
    name: "Goddess Durga",
    tamilName: "துர்கை",
    title: "The warrior goddess who restores balance.",
    description:
      "Durga represents courage and divine power, often shown defeating forces of disorder while seated on a lion.",
    symbol: "Lion and weapons",
    image: devotionalAssets.deityMontage,
    objectPosition: "62.5% 50%",
    cropPosition: "66.666% 50%",
  },
  {
    slug: "lakshmi",
    name: "Goddess Lakshmi",
    tamilName: "லட்சுமி",
    title: "The goddess of abundance, grace, and auspiciousness.",
    description:
      "Lakshmi is worshipped for prosperity, generosity, beauty, and spiritual wellbeing, often seated upon a lotus.",
    symbol: "Lotus and gold",
    image: devotionalAssets.deityMontage,
    objectPosition: "87.5% 50%",
    cropPosition: "100% 50%",
  },
  {
    slug: "saraswati",
    name: "Goddess Saraswati",
    tamilName: "சரஸ்வதி",
    title: "The flowing presence of learning, music, and speech.",
    description:
      "Saraswati is honored by artists, students, musicians, and teachers as the patron of knowledge and refined expression.",
    symbol: "Veena and manuscript",
    image: devotionalAssets.deityMontage,
    objectPosition: "12.5% 83.3%",
    cropPosition: "0% 100%",
  },
  {
    slug: "rama",
    name: "Lord Rama",
    tamilName: "ராமர்",
    title: "The ideal king and embodiment of righteous conduct.",
    description:
      "Rama's story carries themes of devotion, duty, courage, exile, return, and the moral imagination of the Ramayana.",
    symbol: "Bow and arrow",
    image: devotionalAssets.deityMontage,
    objectPosition: "37.5% 83.3%",
    cropPosition: "33.333% 100%",
  },
  {
    slug: "hanuman",
    name: "Lord Hanuman",
    tamilName: "அனுமன்",
    title: "The fearless servant of devotion, strength, and loyalty.",
    description:
      "Hanuman is revered for courage, humility, protection, and unwavering devotion to Lord Rama.",
    symbol: "Gada and folded devotion",
    image: devotionalAssets.deityMontage,
    objectPosition: "62.5% 83.3%",
    cropPosition: "66.666% 100%",
  },
  {
    slug: "ayyappan",
    name: "Lord Ayyappan",
    tamilName: "ஐயப்பன்",
    title: "The ascetic lord of discipline and pilgrimage.",
    description:
      "Ayyappan devotion is marked by vrata, pilgrimage, equality, self-control, and the sacred call of Swamiye Saranam Ayyappa.",
    symbol: "Yogic seated posture",
    image: devotionalAssets.deityMontage,
    objectPosition: "87.5% 83.3%",
    cropPosition: "100% 100%",
  },
];

export const templeCollections = [
  {
    slug: "gopuram-silhouettes",
    title: "Tamil Temple Gopurams",
    kicker: "Dravidian Verticality",
    description:
      "Towering gateways announce sacred geography through layered sculpture, mythic narratives, and architectural rhythm.",
    image: devotionalAssets.temple,
  },
  {
    slug: "yali-pillars",
    title: "Yali Pillars",
    kicker: "Stone Guardians",
    description:
      "Yali forms animate mandapam corridors with protective energy, intricate carving, and dramatic silhouettes.",
    image: devotionalAssets.temple,
  },
  {
    slug: "temple-corridors",
    title: "Mandapam Corridors",
    kicker: "Sacred Procession",
    description:
      "Long pillared halls shape movement, sound, shade, and ritual memory across Tamil temple complexes.",
    image: devotionalAssets.sculptures,
  },
];

export const artworks = [
  {
    slug: "nataraja-bronze-study",
    title: "Nataraja Bronze Study",
    type: "Devotional Artwork",
    description:
      "A dramatic bronze-inspired study of Shiva as cosmic dancer, designed as the visual anchor for the gallery.",
    image: devotionalAssets.hero,
  },
  {
    slug: "yali-stone-gallery",
    title: "Yali Stone Gallery",
    type: "Sacred Sculpture",
    description:
      "A close editorial view of carved guardians, temple friezes, and South Indian sculpture details.",
    image: devotionalAssets.sculptures,
  },
  {
    slug: "dawn-gopuram",
    title: "Dawn Gopuram",
    type: "Temple Architecture",
    description:
      "A golden dawn view of a Tamil temple gopuram, yali-lined mandapam, and carved stone architecture.",
    image: devotionalAssets.temple,
  },
];

export function getDeity(slug: string) {
  return deities.find((deity) => deity.slug === slug);
}

export function getArtwork(slug: string) {
  return artworks.find((artwork) => artwork.slug === slug);
}
