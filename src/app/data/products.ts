import { Product } from '../types/product';

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Laptop Pro 15" - High Performance',
    price: 1299.99,
    originalPrice: 1599.99,
    rating: 4.5,
    reviews: 2847,
    image: 'https://images.unsplash.com/photo-1642943038577-eb4a59549766?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzcyMTAzMDY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Electronics',
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: '2',
    name: 'Wireless Noise-Canceling Headphones',
    price: 249.99,
    originalPrice: 349.99,
    rating: 4.8,
    reviews: 5420,
    image: 'https://images.unsplash.com/photo-1640300065113-738f2abb8ba6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXMlMjBhdWRpb3xlbnwxfHx8fDE3NzIwODA2MTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Electronics',
    inStock: true,
    badge: "Deal"
  },
  {
    id: '3',
    name: 'Latest Smartphone 5G - 256GB',
    price: 899.99,
    rating: 4.6,
    reviews: 3215,
    image: 'https://images.unsplash.com/photo-1646719223599-9864b351e242?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9iaWxlJTIwZGV2aWNlfGVufDF8fHx8MTc3MjE1OTUzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Electronics',
    inStock: true
  },
  {
    id: '4',
    name: 'Smart Watch Fitness Tracker',
    price: 399.99,
    originalPrice: 499.99,
    rating: 4.4,
    reviews: 1876,
    image: 'https://images.unsplash.com/photo-1758525747606-bd5d801ca87b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwd2VhcmFibGUlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3MjEwODQzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Wearables',
    inStock: true,
    badge: "New"
  },
  {
    id: '5',
    name: 'Professional DSLR Camera Kit',
    price: 1899.99,
    rating: 4.9,
    reviews: 956,
    image: 'https://images.unsplash.com/photo-1729655669048-a667a0b01148?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcmElMjBwaG90b2dyYXBoeSUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NzIwNzM4NDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Cameras',
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: '6',
    name: 'Tablet Pro 12.9" - WiFi & Cellular',
    price: 1099.99,
    rating: 4.7,
    reviews: 2134,
    image: 'https://images.unsplash.com/photo-1760708369071-e8a50a8979cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZXQlMjBjb21wdXRlciUyMGRldmljZXxlbnwxfHx8fDE3NzIwNTQ5OTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Electronics',
    inStock: true
  },
  {
    id: '7',
    name: 'Gaming Console with Controller',
    price: 499.99,
    originalPrice: 549.99,
    rating: 4.8,
    reviews: 4521,
    image: 'https://images.unsplash.com/photo-1695028644151-1ec92bae9fb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjb25zb2xlJTIwY29udHJvbGxlcnxlbnwxfHx8fDE3NzIwNDk5MDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Gaming',
    inStock: true,
    badge: "Deal"
  },
  {
    id: '8',
    name: 'Portable Bluetooth Speaker - Waterproof',
    price: 129.99,
    originalPrice: 179.99,
    rating: 4.5,
    reviews: 3687,
    image: 'https://images.unsplash.com/photo-1645020089957-608f1f0dfb61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVldG9vdGglMjBzcGVha2VyJTIwYXVkaW98ZW58MXx8fHwxNzcyMDg5ODE2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Electronics',
    inStock: true
  }
];

export const categories = [
  'All',
  'Electronics',
  'Wearables',
  'Cameras',
  'Gaming'
];
