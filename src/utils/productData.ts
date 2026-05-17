// Product images
const wildImage = "/assets/products/wild/primary.png";
const glitchImage = "/assets/products/glitch/primary.png";
const greenImage = "/assets/products/green/primary.png";
const spikeImage = "/assets/products/spike/primary.png";
const altImage = "/assets/products/alt/primary.png";

// Video paths
const wildVid = "/assets/wild.mp4";
const glitchVid = "/assets/glitch.mp4";
const bgVideo = "/assets/Background.mp4";

// Merchandise images
const whiteBackImage = "/assets/merchandise/white back.png";
const whiteFrontImage = "/assets/merchandise/white front.png";
const blackBackImage = "/assets/merchandise/black back.png";
const blackFrontImage = "/assets/merchandise/black front.png";
const blackCapImage = "/assets/merchandise/black cap.png";

export const ALL_PRODUCTS = [
  {
    id: 1,
    name: "Green (100ml)",
    description: "Classic green chilli with citrus undertones, with coriander seeds, black pepper, capsicum and kaffir lime",
    heatLevel: 2,
    rating: 4.7,
    price: "₹250.00",
    color: "#548c50",
    features: ["Green chilli", "Lemon", "Balanced Heat", "Versatile"],
    image: greenImage,
    imageFolder: "green",
    videos: [bgVideo],
    productLogo: "/assets/green.png",
    available: true,
    premium: false,
    slug: "green-sauce",
    category: "sauce"
  },
  {
    id: 2,
    name: "Wild (100ml)",
    description: "This is the peak of the Tears spectrum, our spiciest variant yet. Crafted with a heavy-hitting chili base",
    heatLevel: 4,
    rating: 4.9,
    price: "₹333.00",
    color: "#ff3b30",
    features: ["Extra Hot", "Herb Infused", "Smoky Finish"],
    image: wildImage,
    imageFolder: "wild",
    videos: [wildVid],
    productLogo: "/assets/wild.png",
    available: true,
    premium: true,
    slug: "wild-sauce",
    category: "sauce"
  },
  {
    id: 3,
    name: "Glitch (100ml)",
    description: "Innovative fusion of red chilli and grape fruit",
    heatLevel: 3,
    rating: 4.8,
    price: "₹333.00",
    color: "#ff00ff",
    features: ["Exotic Spices", "Complex Heat"],
    image: glitchImage,
    imageFolder: "glitch",
    videos: [glitchVid],
    productLogo: "/assets/glitch.png",
    available: true,
    premium: true,
    slug: "glitch-sauce",
    category: "sauce"
  },
  {
    id: 4,
    name: "Spike (100ml)",
    description: "Sharp, piercing heat with a bold chilli profile. Perfect for heat enthusiasts seeking an intense kick",
    heatLevel: 2,
    rating: 4.6,
    price: "₹301.00",
    color: "#cc4400",
    features: ["Intense Heat", "Bold Flavor", "Spicy Kick"],
    image: spikeImage,
    imageFolder: "spike",
    videos: [],
    productLogo: "/assets/spike.PNG",
    available: true,
    premium: false,
    slug: "spike-sauce",
    category: "sauce"
  },
  {
    id: 5,
    name: "ALT (100ml)",
    description: "Designed for the Discerning Palate with amla chilli, slow-fused for an unparalleled sensory journey",
    heatLevel: 3,
    rating: 4.8,
    price: "₹326.00",
    color: "#8B9B17",
    features: ["Amla", "Chilli", "slow-fused"],
    image: altImage,
    imageFolder: "alt",
    videos: [],
    productLogo: "/assets/alt.PNG",
    available: true,
    premium: false,
    slug: "alt-sauce",
    category: "sauce"
  },
  {
    id: 101,
    name: "White T-Shirt",
    description: "Premium quality Tears branded t-shirt in classic white",
    price: "₹999.00",
    rating: 4.5,
    color: "#f5f5f5",
    sizes: [
      { size: "S", inStock: false },
      { size: "M", inStock: false },
      { size: "L", inStock: true },
      { size: "XL", inStock: true },
    ],
    material: "100% Cotton",
    images: [whiteFrontImage, whiteBackImage],
    image: whiteFrontImage,
    available: true,
    category: "apparel",
    slug: "white-tshirt"
  },
  {
    id: 102,
    name: "Black T-Shirt",
    description: "Bold statement piece with Tears branding in sleek black",
    price: "₹999.00",
    rating: 4.7,
    color: "#1a1a1a",
    sizes: [
      { size: "S", inStock: false },
      { size: "M", inStock: false },
      { size: "L", inStock: true },
      { size: "XL", inStock: true },
    ],
    material: "100% Cotton",
    images: [blackFrontImage, blackBackImage],
    image: blackFrontImage,
    available: true,
    category: "apparel",
    slug: "black-tshirt"
  },
  {
    id: 103,
    name: "Black Cap",
    description: "Stylish black cap to showcase your Tears passion anywhere",
    price: "₹300.00",
    rating: 4.6,
    color: "#1a1a1a",
    sizes: [{ size: "One Size", inStock: true }],
    material: "Cotton Twill",
    images: [blackCapImage],
    image: blackCapImage,
    available: true,
    category: "accessories",
    slug: "black-cap"
  },
];
