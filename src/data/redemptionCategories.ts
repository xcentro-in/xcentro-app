
import { 
  Plane,
  Hotel,
  Ticket,
  Car,
  Tag,
  Package
} from "lucide-react";
import { RedemptionCategory } from "@/types/rewards";

// Sample redemption categories data
export const redemptionCategories: RedemptionCategory[] = [
  {
    id: "flights",
    title: "Flight Partners",
    description: "Convert points to airline loyalty miles",
    icon: Plane,
    pointsNeeded: 10000,
    items: [
      { 
        id: "flight-1", 
        title: "Emirates Skywards", 
        description: "10,000 points = 5,000 Skywards Miles",
        pointsCost: 10000 
      },
      { 
        id: "flight-2", 
        title: "Star Alliance", 
        description: "10,000 points = 4,000 Star Alliance Miles",
        pointsCost: 10000 
      },
      { 
        id: "flight-3", 
        title: "Delta SkyMiles", 
        description: "10,000 points = 4,500 SkyMiles",
        pointsCost: 10000 
      }
    ]
  },
  {
    id: "hotels",
    title: "Hotel Partners",
    description: "Convert points to hotel loyalty rewards",
    icon: Hotel,
    pointsNeeded: 8000,
    items: [
      { 
        id: "hotel-1", 
        title: "Marriott Bonvoy", 
        description: "8,000 points = 3,000 Bonvoy Points",
        pointsCost: 8000 
      },
      { 
        id: "hotel-2", 
        title: "Hilton Honors", 
        description: "8,000 points = 3,500 Honors Points",
        pointsCost: 8000 
      }
    ]
  },
  {
    id: "events",
    title: "VIP Events & Experiences",
    description: "Exclusive access to premium events",
    icon: Ticket,
    pointsNeeded: 15000,
    items: [
      { 
        id: "event-1", 
        title: "Tech Conference VIP Pass", 
        description: "Access to VIP lounge and speaker meetings",
        pointsCost: 15000 
      },
      { 
        id: "event-2", 
        title: "Business Summit", 
        description: "Reserved seating and networking cocktail hour",
        pointsCost: 18000 
      }
    ]
  },
  {
    id: "travel",
    title: "Luxury Travel & Rentals",
    description: "Business-class transport, chauffeur services",
    icon: Car,
    pointsNeeded: 12000,
    items: [
      { 
        id: "travel-1", 
        title: "Premium Car Rental", 
        description: "One day luxury car rental",
        pointsCost: 12000 
      },
      { 
        id: "travel-2", 
        title: "Airport Chauffeur Service", 
        description: "Chauffeur pickup and dropoff",
        pointsCost: 8000 
      }
    ]
  },
  {
    id: "business",
    title: "Business Service Discounts",
    description: "Exclusive vendor deals, software discounts",
    icon: Tag,
    pointsNeeded: 5000,
    items: [
      { 
        id: "business-1", 
        title: "SaaS Subscription Discount", 
        description: "30% off annual subscription for business tools",
        pointsCost: 5000 
      },
      { 
        id: "business-2", 
        title: "Marketing Services Credit", 
        description: "$200 credit for digital marketing services",
        pointsCost: 7500 
      }
    ]
  },
  {
    id: "gifts",
    title: "Curated Luxury Gifts",
    description: "High-end business merchandise",
    icon: Package,
    pointsNeeded: 10000,
    items: [
      { 
        id: "gift-1", 
        title: "Premium Business Accessories", 
        description: "Leather portfolio, pen set, and card holder",
        pointsCost: 10000 
      },
      { 
        id: "gift-2", 
        title: "Executive Tech Package", 
        description: "Noise-cancelling headphones and smart accessories",
        pointsCost: 15000 
      }
    ]
  }
];
