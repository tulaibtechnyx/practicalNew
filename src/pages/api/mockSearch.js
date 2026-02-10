export default function handler(req, res) {
    const { query } = req.query;
  
    const items = [
      {
        id: 1,
        title: 'VIDrate Electrolytes 12 pack Strawberry Flavour',
        price: 32,
        allergen: 'Peanuts',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ08LuqQNtNWmjAIZQy3hGlJRQGwzITKqjRWg&s',
      },
      {
        id: 2,
        title: 'Vitamin C Sachets Orange Flavour',
        price: 25,
        allergen: 'None',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ08LuqQNtNWmjAIZQy3hGlJRQGwzITKqjRWg&s',
      },
      {
        id: 3,
        title: 'Hydration Booster with B12',
        price: 28,
        allergen: 'None',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ08LuqQNtNWmjAIZQy3hGlJRQGwzITKqjRWg&s',
      },
      {
        id: 4,
        title: 'Immunity Mix Elderberry & Zinc',
        price: 30,
        allergen: 'Tree nuts',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ08LuqQNtNWmjAIZQy3hGlJRQGwzITKqjRWg&s',
      },
      {
        id: 5,
        title: 'Protein Bar Chocolate Chip',
        price: 15,
        allergen: 'Milk',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ08LuqQNtNWmjAIZQy3hGlJRQGwzITKqjRWg&s',
      },
      {
        id: 6,
        title: 'Protein Bar Peanut Butter',
        price: 15,
        allergen: 'Peanuts',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ08LuqQNtNWmjAIZQy3hGlJRQGwzITKqjRWg&s',
      },
      {
        id: 7,
        title: 'Energy Drink Natural Lemon',
        price: 18,
        allergen: 'None',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ08LuqQNtNWmjAIZQy3hGlJRQGwzITKqjRWg&s',
      },
      {
        id: 8,
        title: 'Green Tea Detox Sachets',
        price: 20,
        allergen: 'None',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ08LuqQNtNWmjAIZQy3hGlJRQGwzITKqjRWg&s',
      },
      {
        id: 9,
        title: 'Multivitamin Gummies for Adults',
        price: 40,
        allergen: 'Gelatin',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ08LuqQNtNWmjAIZQy3hGlJRQGwzITKqjRWg&s',
      },
      {
        id: 10,
        title: 'Electrolyte Mix - Coconut Flavour',
        price: 35,
        allergen: 'Coconut',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ08LuqQNtNWmjAIZQy3hGlJRQGwzITKqjRWg&s',
      },
      {
        id: 11,
        title: 'Vitamin D3 Drops 1000 IU',
        price: 22,
        allergen: 'None',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ08LuqQNtNWmjAIZQy3hGlJRQGwzITKqjRWg&s',
      },
      {
        id: 12,
        title: 'Magnesium Calm Powder',
        price: 38,
        allergen: 'None',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ08LuqQNtNWmjAIZQy3hGlJRQGwzITKqjRWg&s',
      }
    ];
  
    const results = items.filter((item) =>
      item.title.toLowerCase().includes(query?.toLowerCase() || '')
    );
  
    res.status(200).json(results);
  }
  