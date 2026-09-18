import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { BrokerProfile } from '../models/BrokerProfile';
import { Property } from '../models/Property';
import { Lead } from '../models/Lead';
import { Visit } from '../models/Visit';
import { Deal } from '../models/Deal';
import { AdminActivityLog } from '../models/AdminActivityLog';
import { Notification } from '../models/Notification';
import { AuthRequest } from '../middleware/auth.middleware';
import mongoose from 'mongoose';

// --- Dashboard ---
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalProperties = await Property.countDocuments();
    const publishedProperties = await Property.countDocuments({ status: 'PUBLISHED' });
    const pendingProperties = await Property.countDocuments({ status: 'PENDING_APPROVAL' });
    
    const totalBrokers = await User.countDocuments({ role: 'BROKER' });
    const activeBrokers = await User.countDocuments({ role: 'BROKER', accountStatus: 'ACTIVE' });
    
    const totalOwners = await User.countDocuments({ role: 'PROPERTY_OWNER' });
    
    const totalLeads = await Lead.countDocuments();
    const activeLeads = await Lead.countDocuments({ status: { $ne: 'DEAL_COMPLETED' } } as any); // Approx active
    
    const scheduledVisits = await Visit.countDocuments({ status: { $in: ['REQUESTED', 'CONFIRMED'] } });
    const completedDealsCount = await Deal.countDocuments({ status: 'COMPLETED' });
    
    const deals = await Deal.find({ status: 'COMPLETED' });
    const totalEstimatedCommission = deals.reduce((acc, deal) => acc + (deal.estimatedCommission || 0), 0);
    
    res.json({
      totalProperties,
      publishedProperties,
      pendingProperties,
      totalBrokers,
      activeBrokers,
      totalOwners,
      totalLeads,
      activeLeads,
      scheduledVisits,
      completedDeals: completedDealsCount,
      totalEstimatedCommission,
      propertiesSold: completedDealsCount
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- Properties ---
export const getProperties = async (req: AuthRequest, res: Response) => {
  try {
    const properties = await Property.find()
      .populate('ownerId', 'name email phone')
      .populate('brokerId', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPropertyById = async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('ownerId', 'name email phone')
      .populate('brokerId', 'name email phone');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updatePropertyStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const property = await Property.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    
    await new AdminActivityLog({
      adminId: req.user._id,
      action: 'UPDATE_PROPERTY_STATUS',
      targetType: 'PROPERTY',
      targetId: property._id,
      description: `Changed property ${property.propertyCode} status to ${status}`
    }).save();

    res.json(property);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const archiveProperty = async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, { 
      status: 'ARCHIVED',
      archivedAt: new Date(),
      archivedBy: req.user._id
    }, { new: true });
    
    if (!property) return res.status(404).json({ message: 'Property not found' });
    
    await new AdminActivityLog({
      adminId: req.user._id,
      action: 'ARCHIVE_PROPERTY',
      targetType: 'PROPERTY',
      targetId: property._id,
      description: `Archived property ${property.propertyCode}`
    }).save();

    res.json(property);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- Brokers ---
export const getBrokers = async (req: AuthRequest, res: Response) => {
  try {
    const brokers = await User.aggregate([
      { $match: { role: 'BROKER' } },
      {
        $lookup: {
          from: 'brokerprofiles',
          localField: '_id',
          foreignField: 'userId',
          as: 'profile'
        }
      },
      { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'properties',
          localField: '_id',
          foreignField: 'brokerId',
          as: 'properties'
        }
      },
      {
        $addFields: {
          managedPropertiesCount: { $size: '$properties' }
        }
      },
      { $project: { passwordHash: 0, properties: 0 } },
      { $sort: { createdAt: -1 } }
    ]);
    res.json(brokers);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createBroker = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, businessName, experienceYears, specialization, serviceAreas } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    
    const password = 'EstateX@123'; // Default password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const user = new User({
      name, email, phone, passwordHash, role: 'BROKER', accountStatus: 'ACTIVE'
    });
    await user.save();
    
    // Generate unique Broker ID
    const count = await BrokerProfile.countDocuments();
    const brokerId = `BRK-${1001 + count}`;
    
    const profile = new BrokerProfile({
      userId: user._id,
      brokerId,
      businessName,
      experienceYears,
      specialization,
      serviceAreas,
      status: 'ACTIVE'
    });
    await profile.save();
    
    await new AdminActivityLog({
      adminId: req.user._id,
      action: 'CREATE_BROKER',
      targetType: 'USER',
      targetId: user._id,
      description: `Created broker ${name} (${brokerId})`
    }).save();

    res.status(201).json({ message: 'Broker created successfully', user, profile });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateBrokerStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body; // ACTIVE, INACTIVE, SUSPENDED
    const user = await User.findOneAndUpdate({ _id: req.params.id, role: 'BROKER' }, { accountStatus: status }, { new: true });
    if (!user) return res.status(404).json({ message: 'Broker not found' });
    
    await BrokerProfile.findOneAndUpdate({ userId: user._id }, { status });
    
    await new AdminActivityLog({
      adminId: req.user._id,
      action: 'UPDATE_BROKER_STATUS',
      targetType: 'USER',
      targetId: user._id,
      description: `Changed broker ${user.name} status to ${status}`
    }).save();
    
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateBroker = async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, businessName, experienceYears, specialization, serviceAreas, brokerId } = req.body;
    
    const user = await User.findOneAndUpdate({ _id: req.params.id, role: 'BROKER' }, { name, phone }, { new: true });
    if (!user) return res.status(404).json({ message: 'Broker not found' });
    
    const profileUpdate: any = { businessName, experienceYears, specialization, serviceAreas };
    if (brokerId) profileUpdate.brokerId = brokerId;

    const profile = await BrokerProfile.findOneAndUpdate(
      { userId: user._id },
      profileUpdate,
      { new: true }
    );
    
    res.json({ user, profile });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- Owners ---
export const getPropertyOwners = async (req: AuthRequest, res: Response) => {
  try {
    const owners = await User.aggregate([
      { $match: { role: 'PROPERTY_OWNER' } },
      {
        $lookup: {
          from: 'properties',
          localField: '_id',
          foreignField: 'ownerId',
          as: 'properties'
        }
      },
      {
        $addFields: {
          totalProperties: { $size: '$properties' },
          publishedProperties: {
            $size: {
              $filter: {
                input: '$properties',
                as: 'p',
                cond: { $eq: ['$$p.status', 'PUBLISHED'] }
              }
            }
          },
          pendingProperties: {
            $size: {
              $filter: {
                input: '$properties',
                as: 'p',
                cond: { $eq: ['$$p.status', 'PENDING_APPROVAL'] }
              }
            }
          }
        }
      },
      { $project: { passwordHash: 0, properties: 0 } },
      { $sort: { createdAt: -1 } }
    ]);
    res.json(owners);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateOwnerStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body; 
    const user = await User.findOneAndUpdate({ _id: req.params.id, role: 'PROPERTY_OWNER' }, { accountStatus: status }, { new: true });
    if (!user) return res.status(404).json({ message: 'Owner not found' });
    
    await new AdminActivityLog({
      adminId: req.user._id,
      action: 'UPDATE_OWNER_STATUS',
      targetType: 'USER',
      targetId: user._id,
      description: `Changed owner ${user.name} status to ${status}`
    }).save();
    
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- Leads ---
export const getLeads = async (req: AuthRequest, res: Response) => {
  try {
    const leads = await Lead.find()
      .populate('propertyId', 'title propertyCode location')
      .populate('brokerId', 'name email')
      .sort({ createdAt: -1 });
    res.json(leads);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const reassignLead = async (req: AuthRequest, res: Response) => {
  try {
    const { brokerId } = req.body;
    const lead = await Lead.findByIdAndUpdate(req.params.id, { brokerId }, { new: true })
      .populate('brokerId', 'name');
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    
    await new AdminActivityLog({
      adminId: req.user._id,
      action: 'REASSIGN_LEAD',
      targetType: 'LEAD',
      targetId: lead._id,
      description: `Reassigned lead ${lead._id} to broker ${brokerId}`
    }).save();
    
    res.json(lead);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const reassignProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { brokerId } = req.body;
    const property = await Property.findByIdAndUpdate(req.params.id, { brokerId }, { new: true })
      .populate('brokerId', 'name');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    
    await new AdminActivityLog({
      adminId: req.user._id,
      action: 'REASSIGN_PROPERTY',
      targetType: 'PROPERTY',
      targetId: property._id,
      description: `Reassigned property ${property.propertyCode} to broker ${brokerId}`
    }).save();
    
    res.json(property);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- Visits, Deals, Analytics, Notifications, Logs ---
export const getVisits = async (req: AuthRequest, res: Response) => {
  try {
    const visits = await Visit.find()
      .populate('propertyId', 'title')
      .populate('brokerId', 'name')
      .populate('leadId', 'buyerName buyerPhone')
      .sort({ createdAt: -1 });
    res.json(visits);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getDeals = async (req: AuthRequest, res: Response) => {
  try {
    const deals = await Deal.find()
      .populate('propertyId', 'title propertyCode price')
      .populate('brokerId', 'name businessName')
      .populate('leadId', 'buyerName')
      .sort({ createdAt: -1 });
    res.json(deals);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    // Very simple aggregation for demonstration
    const propertyAnalytics = await Property.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const leadAnalytics = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const dealAnalytics = await Deal.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 }, totalCommission: { $sum: '$estimatedCommission' } } }
    ]);
    
    res.json({ propertyAnalytics, leadAnalytics, dealAnalytics });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getActivityLogs = async (req: AuthRequest, res: Response) => {
  try {
    const logs = await AdminActivityLog.find()
      .populate('adminId', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
