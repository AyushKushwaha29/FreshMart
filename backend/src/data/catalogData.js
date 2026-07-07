export const categories = [
  {
    name: "Fruits",
    description: "Seasonal, exotic, and everyday fruits sourced fresh each morning.",
    displayOrder: 1,
    image: {
      url: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=900&q=80"
    }
  },
  {
    name: "Vegetables",
    description: "Leafy greens, roots, and kitchen staples with clear stock visibility.",
    displayOrder: 2,
    image: {
      url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80"
    }
  }
];

export const products = [
  {
    name: "Alphonso Mango",
    shortDescription: "Sweet Ratnagiri Alphonso mangoes",
    description: "Naturally ripened Alphonso mangoes with fragrant flesh, rich sweetness, and a smooth texture that works for slicing, smoothies, or desserts.",
    price: 360,
    discountPrice: 299,
    stock: 40,
    unit: "Kg",
    categoryName: "Fruits",
    availability: true,
    isFeatured: true,
    origin: "Ratnagiri",
    images: [
      {
        url: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=900&q=80"
      }
    ],
    keywords: ["mango", "alphonso", "fruit"]
  },
  {
    name: "Banana Premium",
    shortDescription: "Farm-fresh Cavendish bananas",
    description: "A ripe bunch of premium bananas packed for easy snacking, breakfast bowls, and kid-friendly lunch boxes.",
    price: 80,
    discountPrice: 65,
    stock: 60,
    unit: "Dozen",
    categoryName: "Fruits",
    availability: true,
    isFeatured: true,
    origin: "Jalgaon",
    images: [
      {
        url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=80"
      }
    ],
    keywords: ["banana", "fruit", "fresh"]
  },
  {
    name: "Washington Apple",
    shortDescription: "Crisp apples with a balanced sweet bite",
    description: "Juicy red apples selected for consistency, crunch, and shelf life so they stay fresh through the week.",
    price: 240,
    discountPrice: 210,
    stock: 30,
    unit: "Kg",
    categoryName: "Fruits",
    availability: true,
    isFeatured: true,
    origin: "Imported",
    images: [
      {
        url: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=900&q=80"
      }
    ],
    keywords: ["apple", "fruit", "red apple"]
  },
  {
    name: "Pomegranate",
    shortDescription: "Ruby arils and antioxidant-rich fruit",
    description: "Heavy, fresh pomegranates selected for deep color, abundant seeds, and vibrant flavor.",
    price: 220,
    discountPrice: 189,
    stock: 24,
    unit: "Kg",
    categoryName: "Fruits",
    availability: true,
    isFeatured: false,
    origin: "Solapur",
    images: [
      {
        url: "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80"
      }
    ],
    keywords: ["pomegranate", "fruit"]
  },
  {
    name: "Avocado Hass",
    shortDescription: "Creamy avocados ready for salads and toast",
    description: "Small-batch Hass avocados with creamy flesh and consistent ripeness ideal for modern produce baskets.",
    price: 140,
    discountPrice: 119,
    stock: 35,
    unit: "Piece",
    categoryName: "Fruits",
    availability: true,
    isFeatured: true,
    origin: "Coorg",
    images: [
      {
        url: "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?auto=format&fit=crop&w=900&q=80"
      }
    ],
    keywords: ["avocado", "fruit", "healthy"]
  },
  {
    name: "Strawberry Box",
    shortDescription: "Handpicked strawberries in a ready-to-chill box",
    description: "Bright and sweet strawberries packed in a premium box to reduce bruising during delivery.",
    price: 190,
    discountPrice: 159,
    stock: 20,
    unit: "Piece",
    categoryName: "Fruits",
    availability: true,
    isFeatured: false,
    origin: "Mahabaleshwar",
    images: [
      {
        url: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=900&q=80"
      }
    ],
    keywords: ["strawberry", "fruit", "berries"]
  },
  {
    name: "Farm Tomato",
    shortDescription: "Firm tomatoes for curry, salad, and sauces",
    description: "Uniformly packed tomatoes with a bright red finish, good shelf life, and kitchen-ready freshness.",
    price: 60,
    discountPrice: 48,
    stock: 80,
    unit: "Kg",
    categoryName: "Vegetables",
    availability: true,
    isFeatured: true,
    origin: "Nashik",
    images: [
      {
        url: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=900&q=80"
      }
    ],
    keywords: ["tomato", "vegetable"]
  },
  {
    name: "Baby Spinach",
    shortDescription: "Tender leaves washed and packed fresh",
    description: "Fresh baby spinach for smoothies, sauteed sides, soups, and nutrient-rich bowls.",
    price: 55,
    discountPrice: 45,
    stock: 55,
    unit: "Bundle",
    categoryName: "Vegetables",
    availability: true,
    isFeatured: true,
    origin: "Pune",
    images: [
      {
        url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=80"
      }
    ],
    keywords: ["spinach", "leafy greens", "vegetable"]
  },
  {
    name: "Broccoli Crown",
    shortDescription: "Dense florets with fresh green finish",
    description: "Broccoli crowns that stay crisp in stir fry, roasting trays, and meal prep boxes.",
    price: 95,
    discountPrice: 79,
    stock: 32,
    unit: "Piece",
    categoryName: "Vegetables",
    availability: true,
    isFeatured: false,
    origin: "Ooty",
    images: [
      {
        url: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=900&q=80"
      }
    ],
    keywords: ["broccoli", "vegetable"]
  },
  {
    name: "Purple Onion",
    shortDescription: "Kitchen staple with great shelf life",
    description: "Premium onions sorted for consistency, strong flavor, and daily cooking reliability.",
    price: 50,
    discountPrice: 42,
    stock: 90,
    unit: "Kg",
    categoryName: "Vegetables",
    availability: true,
    isFeatured: false,
    origin: "Lasalgaon",
    images: [
      {
        url: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=900&q=80"
      }
    ],
    keywords: ["onion", "vegetable"]
  },
  {
    name: "Cucumber Green",
    shortDescription: "Cool and crunchy salad cucumbers",
    description: "Hydrating cucumbers selected for crispness, balanced size, and easy slicing.",
    price: 45,
    discountPrice: 36,
    stock: 70,
    unit: "Kg",
    categoryName: "Vegetables",
    availability: true,
    isFeatured: true,
    origin: "Bengaluru Rural",
    images: [
      {
        url: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=900&q=80"
      }
    ],
    keywords: ["cucumber", "vegetable", "salad"]
  },
  {
    name: "Carrot Orange",
    shortDescription: "Crunchy carrots for snacks and cooking",
    description: "Bright, sweet carrots ideal for juices, soups, and quick stir fries with low wastage on delivery.",
    price: 58,
    discountPrice: 49,
    stock: 65,
    unit: "Kg",
    categoryName: "Vegetables",
    availability: true,
    isFeatured: false,
    origin: "Nilgiris",
    images: [
      {
        url: "https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=900&q=80"
      }
    ],
    keywords: ["carrot", "vegetable"]
  }
];

export const coupons = [
  {
    code: "FRESH10",
    description: "10% off on orders above ₹299",
    discountType: "percent",
    discountValue: 10,
    minOrderValue: 299,
    maxDiscount: 120,
    usageLimit: 500,
    perUserLimit: 3
  },
  {
    code: "VEGGIE50",
    description: "Flat ₹50 off on orders above ₹499",
    discountType: "flat",
    discountValue: 50,
    minOrderValue: 499,
    maxDiscount: 50,
    usageLimit: 300,
    perUserLimit: 2
  }
];

