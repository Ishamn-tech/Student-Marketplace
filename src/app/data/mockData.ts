import { Product } from '../types';

export const mockProducts: Product[] = [
  // Sell Products
  {
    id: '1',
    name: 'Modern Art Poster - Abstract Design',
    description: 'Beautiful abstract art poster perfect for dorm room decoration',
    price: 150,
    category: 'poster',
    image: 'https://images.unsplash.com/photo-1613759007428-9d918fe2d36f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBwb3N0ZXIlMjBkZXNpZ258ZW58MXx8fHwxNzcyMTY4MjM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    sellerId: 'seller1',
    sellerName: 'Priya Sharma',
    available: 5,
    sold: 12,
    type: 'sell',
    reviews: [
      {
        id: 'r1',
        userId: 'u1',
        userName: 'Rahul Kumar',
        rating: 5,
        comment: 'Excellent quality! Looks great in my room.',
        date: '2026-02-20'
      }
    ]
  },
  {
    id: '2',
    name: 'Geometric Wallpaper Design',
    description: 'Premium quality geometric pattern wallpaper for room makeover',
    price: 300,
    category: 'wallpaper',
    image: 'https://images.unsplash.com/photo-1675783385707-365fe9c76dde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YWxscGFwZXIlMjBwYXR0ZXJuJTIwZGVzaWdufGVufDF8fHx8MTc3MjE2ODIzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    sellerId: 'seller2',
    sellerName: 'Ankit Verma',
    available: 8,
    sold: 5,
    type: 'sell',
    reviews: []
  },
  {
    id: '3',
    name: 'Hand-drawn Portrait Sketch',
    description: 'Custom portrait sketch, great for gifts',
    price: 500,
    category: 'sketch',
    image: 'https://images.unsplash.com/photo-1720248090619-95d555f01bfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW5jaWwlMjBza2V0Y2glMjBkcmF3aW5nfGVufDF8fHx8MTc3MjE2ODIzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    sellerId: 'seller3',
    sellerName: 'Sneha Patel',
    available: 3,
    sold: 15,
    type: 'sell',
    reviews: [
      {
        id: 'r2',
        userId: 'u2',
        userName: 'Meera Singh',
        rating: 4,
        comment: 'Beautiful work! Very detailed.',
        date: '2026-02-15'
      }
    ]
  },
  {
    id: '4',
    name: 'Professional Lab Coat - Size M',
    description: 'High quality white lab coat, perfect condition',
    price: 800,
    category: 'labcoat',
    image: 'https://images.unsplash.com/photo-1581094487815-d1df47182343?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGxhYiUyMGNvYXR8ZW58MXx8fHwxNzcyMTY4MjM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    sellerId: 'seller1',
    sellerName: 'Priya Sharma',
    available: 2,
    sold: 8,
    type: 'sell',
    reviews: []
  },
  {
    id: '5',
    name: 'Casio Scientific Calculator',
    description: 'FX-991ES Plus, barely used, all functions working',
    price: 600,
    category: 'calculator',
    image: 'https://images.unsplash.com/photo-1574607383077-47ddc2dc51c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbnRpZmljJTIwY2FsY3VsYXRvcnxlbnwxfHx8fDE3NzIwODE2NTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    sellerId: 'seller4',
    sellerName: 'Arjun Mehta',
    available: 1,
    sold: 3,
    type: 'sell',
    reviews: [
      {
        id: 'r3',
        userId: 'u3',
        userName: 'Vijay Reddy',
        rating: 5,
        comment: 'Works perfectly! Great deal.',
        date: '2026-02-18'
      }
    ]
  },
  {
    id: '6',
    name: 'Engineering Textbooks Bundle',
    description: 'Set of 5 core engineering textbooks in excellent condition',
    price: 2500,
    category: 'textbook',
    image: 'https://images.unsplash.com/photo-1588912914017-923900a34710?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwdGV4dGJvb2tzJTIwc3R1ZHl8ZW58MXx8fHwxNzcyMTY4MjM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    sellerId: 'seller5',
    sellerName: 'Kavya Iyer',
    available: 1,
    sold: 2,
    type: 'sell',
    reviews: []
  },
  {
    id: '7',
    name: 'Hostel Essential Kit',
    description: 'Complete hostel essentials: bucket, mug, hangers, toiletries organizer',
    price: 400,
    category: 'hostel-essential',
    image: 'https://images.unsplash.com/photo-1549881567-c622c1080d78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3N0ZWwlMjBkb3JtJTIwcm9vbXxlbnwxfHx8fDE3NzIxNjgyMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    sellerId: 'seller2',
    sellerName: 'Ankit Verma',
    available: 4,
    sold: 10,
    type: 'sell',
    reviews: []
  },
  {
    id: '8',
    name: 'Abstract Canvas Painting',
    description: 'Original hand-painted abstract art on canvas',
    price: 1200,
    category: 'painting',
    image: 'https://images.unsplash.com/photo-1681235014294-588fea095706?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHBhaW50aW5nJTIwYXJ0fGVufDF8fHx8MTc3MjEwNjc1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    sellerId: 'seller3',
    sellerName: 'Sneha Patel',
    available: 2,
    sold: 4,
    type: 'sell',
    reviews: []
  },

  // Rental Products
  {
    id: 'r1',
    name: 'Previous Year Question Papers - CSE',
    description: 'Complete set of last 5 years question papers for all subjects',
    price: 0,
    rentPrice: 50,
    rentDuration: 7,
    lateFeePerDay: 10,
    category: 'textbook',
    image: 'https://images.unsplash.com/photo-1588912914017-923900a34710?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwdGV4dGJvb2tzJTIwc3R1ZHl8ZW58MXx8fHwxNzcyMTY4MjM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    sellerId: 'seller4',
    sellerName: 'Arjun Mehta',
    available: 3,
    sold: 0,
    type: 'rent',
    reviews: []
  },
  {
    id: 'r2',
    name: 'Module Prints - Semester 5',
    description: 'All module prints for 5th semester, spiral bound',
    price: 0,
    rentPrice: 30,
    rentDuration: 14,
    lateFeePerDay: 5,
    category: 'textbook',
    image: 'https://images.unsplash.com/photo-1588912914017-923900a34710?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwdGV4dGJvb2tzJTIwc3R1ZHl8ZW58MXx8fHwxNzcyMTY4MjM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    sellerId: 'seller5',
    sellerName: 'Kavya Iyer',
    available: 5,
    sold: 0,
    type: 'rent',
    reviews: []
  },
];

export const categories = {
  sell: ['All', 'Poster', 'Wallpaper', 'Drawing', 'Sketch', 'Painting', 'Lab Coat', 'Calculator', 'Textbook', 'Hostel Essential'],
  rent: ['All', 'Question Papers', 'Module Prints', 'Textbooks']
};
