import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { User } from './models/User';
import { BrokerProfile } from './models/BrokerProfile';
import { PropertyOwnerProfile } from './models/PropertyOwnerProfile';
import { Property } from './models/Property';
import { AdminActivityLog } from './models/AdminActivityLog';
import { connectDB } from './config/database';

dotenv.config();

const seedDB = async () => {
  await connectDB();
  
  console.log('Clearing database...');
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  console.log('Creating Admin...');
  const admin = await new User({
    name: 'Admin User', email: 'admin@estatex.com', phone: '9999999999', passwordHash, role: 'ADMIN', accountStatus: 'ACTIVE'
  }).save();

  console.log('Creating Brokers...');
  const brokerUser = await new User({
    name: 'Arjun Broker', email: 'arjun@estatex.com', phone: '9876543210', passwordHash, role: 'BROKER', accountStatus: 'ACTIVE'
  }).save();
  await new BrokerProfile({
    userId: brokerUser._id, brokerId: 'BRK-001', businessName: 'Prime Properties', experienceYears: 10, serviceAreas: ['Mumbai', 'Pune'], rating: 4.8, totalDeals: 142
  }).save();

  console.log('Creating Property Owners...');
  const ownerUser = await new User({
    name: 'Rahul Sharma', email: 'rahul@example.com', phone: '8765432109', passwordHash, role: 'PROPERTY_OWNER', accountStatus: 'ACTIVE'
  }).save();
  await new PropertyOwnerProfile({ userId: ownerUser._id, city: 'Mumbai', state: 'MH' }).save();

  console.log('Creating Properties...');
  await new Property({
    propertyCode: 'PRP-1001', ownerId: ownerUser._id, brokerId: brokerUser._id,
    title: 'Luxury Sea View Penthouse', description: 'Stunning 4BHK with panoramic sea views.',
    propertyType: 'APARTMENT', listingType: 'SALE', status: 'PUBLISHED',
    price: 45000000, builtUpArea: 2500, carpetArea: 2100, bedrooms: 4, bathrooms: 5,
    city: 'Mumbai', state: 'Maharashtra', locality: 'Bandra West', address: 'Sea Face Road',
    approvedAt: new Date(), publishedAt: new Date()
  }).save();
  
  await new Property({
    propertyCode: 'PRP-1002', ownerId: ownerUser._id, brokerId: brokerUser._id,
    title: 'Modern 3BHK Apartment', description: 'Spacious apartment in a premium society.',
    propertyType: 'APARTMENT', listingType: 'RENT', status: 'PUBLISHED',
    price: 85000, builtUpArea: 1600, carpetArea: 1400, bedrooms: 3, bathrooms: 3,
    city: 'Mumbai', state: 'Maharashtra', locality: 'Powai', address: 'Hiranandani Gardens',
    approvedAt: new Date(), publishedAt: new Date()
  }).save();

  await new Property({
    propertyCode: 'PRP-1003', ownerId: ownerUser._id, brokerId: brokerUser._id,
    title: 'Luxury Villa with Pool', description: 'Experience the epitome of luxury living in this magnificent 5-bedroom villa located in the heart of Amreli. Designed with impeccable attention to detail, this residence offers a seamless blend of modern architecture and elegant comfort.',
    propertyType: 'VILLA', listingType: 'SALE', status: 'PUBLISHED',
    price: 25000000, builtUpArea: 4500, carpetArea: 4200, bedrooms: 5, bathrooms: 5,
    city: 'Amreli', state: 'Gujarat', locality: 'Lathi Road', address: 'Plot 42, Lathi Road',
    approvedAt: new Date(), publishedAt: new Date(), isVerified: true, isFeatured: true
  }).save();

  await new Property({
    propertyCode: 'PRP-1004', ownerId: ownerUser._id, brokerId: brokerUser._id,
    title: 'Cozy 2BHK in City Center', description: 'Great 2BHK for a small family.',
    propertyType: 'APARTMENT', listingType: 'RENT', status: 'PUBLISHED',
    price: 15000, builtUpArea: 900, carpetArea: 800, bedrooms: 2, bathrooms: 2,
    city: 'Amreli', state: 'Gujarat', locality: 'City Center', address: 'Station Road',
    approvedAt: new Date(), publishedAt: new Date()
  }).save();

  console.log('Creating Mock Activity Logs...');
  await new AdminActivityLog({
    adminId: admin._id,
    action: 'SYSTEM_INIT',
    targetType: 'SYSTEM',
    description: 'System seeded and initialized'
  }).save();

  console.log('Seeding Complete!');
  process.exit();
};

seedDB().catch(console.error);
