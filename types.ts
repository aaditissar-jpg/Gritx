import React from 'react';

export interface Facility {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  capacity: number;
  features: string[];
  hourlyRate: number;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  category: 'Wellness' | 'Social' | 'Professional' | 'Competition';
  highlights?: string[];
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  recommended?: boolean;
}

export interface Booking {
  id: string;
  facilityId: string;
  facilityName: string;
  userId: string;
  userName: string;
  userPhone?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
  equipmentNeeded?: string;
  medicalConcerns?: string;
}

export interface AvailabilitySlot {
  time: string;
  available: boolean;
}

export interface EventRsvp {
  id: string;
  eventId: string;
  eventTitle?: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}
