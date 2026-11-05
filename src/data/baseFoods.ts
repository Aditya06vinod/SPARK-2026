import { FoodItem } from '../types';

export const BASE_FOODS: FoodItem[] = [
  // Breads & Staples
  {
    name: 'Roti / Chapati',
    synonyms: ['roti', 'chapati', 'phulka', 'rotis', 'chapatis', 'rooti', 'flatbread'],
    serving: '1 medium (40g)',
    grams: 40,
    calories: 120,
    protein: 3.5,
    carbs: 22,
    fat: 1.5,
    category: 'staples'
  },
  {
    name: 'Plain Paratha',
    synonyms: ['paratha', 'parantha', 'parathas', 'plain paratha'],
    serving: '1 medium (80g)',
    grams: 80,
    calories: 260,
    protein: 5.0,
    carbs: 34,
    fat: 11.0,
    category: 'staples'
  },
  {
    name: 'Aloo Paratha',
    synonyms: ['aloo paratha', 'potato paratha', 'aloo parantha'],
    serving: '1 medium (120g)',
    grams: 120,
    calories: 300,
    protein: 6.0,
    carbs: 45,
    fat: 11.5,
    category: 'staples'
  },
  {
    name: 'Butter Naan',
    synonyms: ['naan', 'butter naan', 'naan bread', 'nan'],
    serving: '1 piece (90g)',
    grams: 90,
    calories: 260,
    protein: 8.0,
    carbs: 42,
    fat: 7.5,
    category: 'staples'
  },
  {
    name: 'Puri',
    synonyms: ['puri', 'poori', 'puris'],
    serving: '1 piece (30g)',
    grams: 30,
    calories: 100,
    protein: 2.0,
    carbs: 12,
    fat: 5.0,
    category: 'staples'
  },
  {
    name: 'White Rice (Cooked)',
    synonyms: ['rice', 'white rice', 'chawal', 'steamed rice', 'plain rice'],
    serving: '1 cup (160g)',
    grams: 160,
    calories: 205,
    protein: 4.2,
    carbs: 45,
    fat: 0.4,
    category: 'staples'
  },
  {
    name: 'Brown Rice (Cooked)',
    synonyms: ['brown rice'],
    serving: '1 cup (160g)',
    grams: 160,
    calories: 215,
    protein: 5.0,
    carbs: 45,
    fat: 1.8,
    category: 'staples'
  },
  {
    name: 'Jeera Rice',
    synonyms: ['jeera rice', 'cumin rice'],
    serving: '1 cup (170g)',
    grams: 170,
    calories: 260,
    protein: 4.5,
    carbs: 46,
    fat: 6.0,
    category: 'staples'
  },
  {
    name: 'Chicken Biryani',
    synonyms: ['chicken biryani', 'biryani', 'biriyani', 'chicken biriyani'],
    serving: '1 plate (300g)',
    grams: 300,
    calories: 490,
    protein: 24.0,
    carbs: 58,
    fat: 18.0,
    category: 'staples'
  },
  {
    name: 'Veg Biryani',
    synonyms: ['veg biryani', 'vegetable biryani'],
    serving: '1 plate (300g)',
    grams: 300,
    calories: 400,
    protein: 9.0,
    carbs: 62,
    fat: 13.0,
    category: 'staples'
  },
  {
    name: 'Dal Khichdi',
    synonyms: ['khichdi', 'khichri', 'dal khichdi'],
    serving: '1 bowl (200g)',
    grams: 200,
    calories: 230,
    protein: 8.0,
    carbs: 40,
    fat: 4.5,
    category: 'staples'
  },

  // Dals & Curries
  {
    name: 'Dal Tadka / Toor Dal',
    synonyms: ['dal', 'daal', 'dal tadka', 'toor dal', 'arhar dal', 'lentil curry', 'dhal'],
    serving: '1 katori (150g)',
    grams: 150,
    calories: 150,
    protein: 8.0,
    carbs: 22,
    fat: 4.0,
    category: 'curries'
  },
  {
    name: 'Moong Dal',
    synonyms: ['moong dal', 'mung dal', 'moong'],
    serving: '1 katori (150g)',
    grams: 150,
    calories: 135,
    protein: 9.0,
    carbs: 20,
    fat: 2.5,
    category: 'curries'
  },
  {
    name: 'Chana Masala / Chole',
    synonyms: ['chana masala', 'chole', 'chickpea curry', 'chhole'],
    serving: '1 katori (150g)',
    grams: 150,
    calories: 210,
    protein: 9.0,
    carbs: 32,
    fat: 6.0,
    category: 'curries'
  },
  {
    name: 'Rajma Masala',
    synonyms: ['rajma', 'rajma masala', 'kidney bean curry'],
    serving: '1 katori (150g)',
    grams: 150,
    calories: 190,
    protein: 9.0,
    carbs: 29,
    fat: 4.5,
    category: 'curries'
  },
  {
    name: 'Sambar',
    synonyms: ['sambar', 'sambhar'],
    serving: '1 katori (150g)',
    grams: 150,
    calories: 100,
    protein: 5.0,
    carbs: 16,
    fat: 2.0,
    category: 'curries'
  },
  {
    name: 'Rasam',
    synonyms: ['rasam', 'charu'],
    serving: '1 katori (150g)',
    grams: 150,
    calories: 50,
    protein: 2.0,
    carbs: 8,
    fat: 1.5,
    category: 'curries'
  },
  {
    name: 'Paneer Butter Masala',
    synonyms: ['paneer butter masala', 'paneer makhani', 'butter paneer', 'shahi paneer'],
    serving: '1 katori (150g)',
    grams: 150,
    calories: 320,
    protein: 12.0,
    carbs: 12,
    fat: 24.0,
    category: 'curries'
  },
  {
    name: 'Palak Paneer',
    synonyms: ['palak paneer', 'spinach paneer'],
    serving: '1 katori (150g)',
    grams: 150,
    calories: 250,
    protein: 12.0,
    carbs: 9,
    fat: 18.0,
    category: 'curries'
  },
  {
    name: 'Butter Chicken',
    synonyms: ['butter chicken', 'murgh makhani'],
    serving: '1 katori (150g)',
    grams: 150,
    calories: 300,
    protein: 20.0,
    carbs: 10,
    fat: 20.0,
    category: 'curries'
  },
  {
    name: 'Chicken Curry',
    synonyms: ['chicken curry', 'chicken gravy', 'murgh curry'],
    serving: '1 katori (150g)',
    grams: 150,
    calories: 240,
    protein: 20.0,
    carbs: 8,
    fat: 14.0,
    category: 'curries'
  },
  {
    name: 'Tandoori Chicken',
    synonyms: ['tandoori chicken', 'chicken tandoori'],
    serving: '1 leg piece (150g)',
    grams: 150,
    calories: 260,
    protein: 30.0,
    carbs: 4,
    fat: 13.0,
    category: 'protein'
  },
  {
    name: 'Egg Curry',
    synonyms: ['egg curry', 'anda curry', 'egg masala'],
    serving: '2 eggs with gravy (200g)',
    grams: 200,
    calories: 280,
    protein: 14.0,
    carbs: 8,
    fat: 20.0,
    category: 'curries'
  },
  {
    name: 'Fish Curry',
    synonyms: ['fish curry', 'machli curry', 'meen curry'],
    serving: '1 katori (150g)',
    grams: 150,
    calories: 220,
    protein: 22.0,
    carbs: 6,
    fat: 12.0,
    category: 'curries'
  },

  // Breakfast Items
  {
    name: 'Idli',
    synonyms: ['idli', 'idly', 'idlis'],
    serving: '1 piece (40g)',
    grams: 40,
    calories: 58,
    protein: 2.0,
    carbs: 12,
    fat: 0.2,
    category: 'breakfast'
  },
  {
    name: 'Plain Dosa',
    synonyms: ['dosa', 'plain dosa', 'dosai', 'dosas'],
    serving: '1 medium (90g)',
    grams: 90,
    calories: 135,
    protein: 3.0,
    carbs: 26,
    fat: 2.5,
    category: 'breakfast'
  },
  {
    name: 'Masala Dosa',
    synonyms: ['masala dosa', 'masala dosai'],
    serving: '1 medium (180g)',
    grams: 180,
    calories: 280,
    protein: 6.0,
    carbs: 45,
    fat: 9.0,
    category: 'breakfast'
  },
  {
    name: 'Uttapam',
    synonyms: ['uttapam', 'uthappam', 'oothappam'],
    serving: '1 medium (120g)',
    grams: 120,
    calories: 190,
    protein: 5.0,
    carbs: 34,
    fat: 4.0,
    category: 'breakfast'
  },
  {
    name: 'Medu Vada',
    synonyms: ['vada', 'medu vada', 'vadai', 'vadas'],
    serving: '1 piece (50g)',
    grams: 50,
    calories: 140,
    protein: 4.0,
    carbs: 16,
    fat: 7.0,
    category: 'breakfast'
  },
  {
    name: 'Rava Upma',
    synonyms: ['upma', 'uppuma', 'rava upma'],
    serving: '1 cup (200g)',
    grams: 200,
    calories: 250,
    protein: 6.0,
    carbs: 40,
    fat: 7.5,
    category: 'breakfast'
  },
  {
    name: 'Poha',
    synonyms: ['poha', 'aval', 'flattened rice'],
    serving: '1 cup (150g)',
    grams: 150,
    calories: 250,
    protein: 5.0,
    carbs: 44,
    fat: 6.0,
    category: 'breakfast'
  },
  {
    name: 'Cooked Oats / Oatmeal',
    synonyms: ['oats', 'oatmeal', 'porridge', 'oats cooked'],
    serving: '1 cup (240g)',
    grams: 240,
    calories: 160,
    protein: 6.0,
    carbs: 28,
    fat: 2.5,
    category: 'breakfast'
  },
  {
    name: 'Bread Slice',
    synonyms: ['bread', 'white bread', 'toast', 'bread slice'],
    serving: '1 slice (28g)',
    grams: 28,
    calories: 75,
    protein: 2.5,
    carbs: 14,
    fat: 1.0,
    category: 'breakfast'
  },

  // Protein & Dairy
  {
    name: 'Paneer (Raw / Cubes)',
    synonyms: ['paneer', 'cottage cheese', 'paneer cubes'],
    serving: '100g',
    grams: 100,
    calories: 265,
    protein: 18.0,
    carbs: 6,
    fat: 20.0,
    category: 'protein'
  },
  {
    name: 'Boiled Egg',
    synonyms: ['boiled egg', 'egg', 'eggs', 'anda'],
    serving: '1 large (50g)',
    grams: 50,
    calories: 78,
    protein: 6.3,
    carbs: 0.6,
    fat: 5.3,
    category: 'protein'
  },
  {
    name: 'Omelette (2 Eggs)',
    synonyms: ['omelette', 'omelet', 'egg omelette'],
    serving: '2 eggs (110g)',
    grams: 110,
    calories: 200,
    protein: 13.0,
    carbs: 2,
    fat: 15.0,
    category: 'protein'
  },
  {
    name: 'Whey Protein Shake',
    synonyms: ['whey protein', 'protein shake', 'whey', 'protein powder'],
    serving: '1 scoop (30g)',
    grams: 30,
    calories: 120,
    protein: 24.0,
    carbs: 3,
    fat: 1.5,
    category: 'protein'
  },
  {
    name: 'Soya Chunks (Dry)',
    synonyms: ['soya chunks', 'soy chunks', 'nutrela', 'meal maker'],
    serving: '30g dry',
    grams: 30,
    calories: 100,
    protein: 15.0,
    carbs: 10,
    fat: 0.5,
    category: 'protein'
  },
  {
    name: 'Curd / Dahi',
    synonyms: ['curd', 'dahi', 'yogurt', 'yoghurt', 'plain curd'],
    serving: '1 katori (100g)',
    grams: 100,
    calories: 60,
    protein: 3.5,
    carbs: 4.7,
    fat: 3.0,
    category: 'protein'
  },
  {
    name: 'Greek Yogurt',
    synonyms: ['greek yogurt', 'hung curd'],
    serving: '100g',
    grams: 100,
    calories: 90,
    protein: 10.0,
    carbs: 4.0,
    fat: 3.5,
    category: 'protein'
  },

  // Snacks & Street Food
  {
    name: 'Samosa',
    synonyms: ['samosa', 'samosas'],
    serving: '1 piece (80g)',
    grams: 80,
    calories: 260,
    protein: 4.0,
    carbs: 32,
    fat: 13.0,
    category: 'snacks'
  },
  {
    name: 'Pakora / Bhajiya',
    synonyms: ['pakora', 'pakoda', 'bhajiya', 'bajji', 'pakoras'],
    serving: '4 pieces (80g)',
    grams: 80,
    calories: 220,
    protein: 5.0,
    carbs: 24,
    fat: 12.0,
    category: 'snacks'
  },
  {
    name: 'Vada Pav',
    synonyms: ['vada pav', 'wada pav'],
    serving: '1 piece (130g)',
    grams: 130,
    calories: 290,
    protein: 7.0,
    carbs: 42,
    fat: 10.5,
    category: 'snacks'
  },
  {
    name: 'Pav Bhaji',
    synonyms: ['pav bhaji', 'pao bhaji'],
    serving: '1 plate (250g)',
    grams: 250,
    calories: 400,
    protein: 9.0,
    carbs: 58,
    fat: 15.0,
    category: 'snacks'
  },
  {
    name: 'Dhokla',
    synonyms: ['dhokla', 'khaman'],
    serving: '2 pieces (60g)',
    grams: 60,
    calories: 100,
    protein: 4.0,
    carbs: 16,
    fat: 2.5,
    category: 'snacks'
  },
  {
    name: 'Methi Thepla',
    synonyms: ['thepla', 'methi thepla'],
    serving: '1 piece (50g)',
    grams: 50,
    calories: 120,
    protein: 3.0,
    carbs: 18,
    fat: 4.0,
    category: 'snacks'
  },

  // Fruits & Nuts & Sweets
  {
    name: 'Banana',
    synonyms: ['banana', 'kela'],
    serving: '1 medium (118g)',
    grams: 118,
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.3,
    category: 'fruits'
  },
  {
    name: 'Apple',
    synonyms: ['apple', 'seb'],
    serving: '1 medium (180g)',
    grams: 180,
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    category: 'fruits'
  },
  {
    name: 'Mango',
    synonyms: ['mango', 'aam'],
    serving: '1 cup sliced (165g)',
    grams: 165,
    calories: 100,
    protein: 1.4,
    carbs: 25,
    fat: 0.6,
    category: 'fruits'
  },
  {
    name: 'Almonds',
    synonyms: ['almonds', 'badam'],
    serving: '10 pieces (12g)',
    grams: 12,
    calories: 70,
    protein: 2.5,
    carbs: 2.5,
    fat: 6.0,
    category: 'fruits'
  },
  {
    name: 'Roasted Peanuts',
    synonyms: ['peanuts', 'moongphali', 'groundnuts', 'peanuts roasted'],
    serving: '1 handful (30g)',
    grams: 30,
    calories: 170,
    protein: 7.5,
    carbs: 6,
    fat: 14.0,
    category: 'fruits'
  },
  {
    name: 'Gulab Jamun',
    synonyms: ['gulab jamun', 'gulab jamuns'],
    serving: '1 piece (50g)',
    grams: 50,
    calories: 150,
    protein: 2.0,
    carbs: 26,
    fat: 4.5,
    category: 'fruits'
  },

  // Beverages & Extras
  {
    name: 'Chai / Milk Tea',
    synonyms: ['chai', 'tea', 'milk tea', 'tea with milk and sugar'],
    serving: '1 cup (150ml)',
    grams: 150,
    calories: 60,
    protein: 1.5,
    carbs: 9,
    fat: 2.0,
    category: 'beverages'
  },
  {
    name: 'Filter Coffee',
    synonyms: ['coffee', 'filter coffee', 'coffee with milk and sugar'],
    serving: '1 cup (150ml)',
    grams: 150,
    calories: 70,
    protein: 2.0,
    carbs: 10,
    fat: 2.5,
    category: 'beverages'
  },
  {
    name: 'Buttermilk / Chaas',
    synonyms: ['buttermilk', 'chaas', 'moru', 'salted lassi'],
    serving: '1 glass (250ml)',
    grams: 250,
    calories: 40,
    protein: 2.0,
    carbs: 5,
    fat: 1.5,
    category: 'beverages'
  },
  {
    name: 'Sweet Lassi',
    synonyms: ['sweet lassi', 'lassi'],
    serving: '1 glass (250ml)',
    grams: 250,
    calories: 180,
    protein: 6.0,
    carbs: 28,
    fat: 5.0,
    category: 'beverages'
  },
  {
    name: 'Whole Milk',
    synonyms: ['milk', 'doodh', 'full fat milk', 'cow milk'],
    serving: '1 glass (250ml)',
    grams: 250,
    calories: 150,
    protein: 8.0,
    carbs: 12,
    fat: 8.0,
    category: 'beverages'
  },
  {
    name: 'Ghee',
    synonyms: ['ghee', 'clarified butter'],
    serving: '1 tsp (5g)',
    grams: 5,
    calories: 45,
    protein: 0,
    carbs: 0,
    fat: 5.0,
    category: 'staples'
  }
];
