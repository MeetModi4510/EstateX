import { Request, Response } from 'express';
import { Lead } from '../models/Lead';
import { Property } from '../models/Property';
import { User } from '../models/User';
import { Notification } from '../models/Notification';
import { BrokerNote } from '../models/BrokerNote';
import { AuthRequest } from '../middleware/auth.middleware';
import mongoose from 'mongoose';

// Public: Create Lead (Buyer Inquires)
export const createLead = async (req: Request, res: Response) => {
  try {
    const { propertyId, buyerName, buyerEmail, buyerPhone, budget, message, preferredContactTime, inquiryType } = req.body;
    
    // Find property
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    // Assign broker. If property has no broker, fallback to a system admin/broker
    let assignedBrokerId = property.brokerId;
    if (!assignedBrokerId) {
      const defaultBroker = await User.findOne({ role: 'BROKER' });
      assignedBrokerId = defaultBroker?._id as mongoose.Types.ObjectId;
    }

    // Lead Scoring logic
    let score = 0;
    if (budget) score += 20;
    if (buyerPhone) score += 20;
    if (buyerEmail) score += 10;
    if (inquiryType === 'VISIT') score += 30;
    if (message) score += 10;
    if (preferredContactTime) score += 10;
    score = Math.min(score, 100);

    const newLead = new Lead({
      propertyId,
      brokerId: assignedBrokerId,
      buyerName,
      buyerEmail,
      buyerPhone,
      budget,
      message,
      preferredContactTime,
      inquiryType: inquiryType || 'INFORMATION',
      leadScore: score,
      status: 'NEW'
    });
    
    await newLead.save();

    // Create Notification for broker
    if (assignedBrokerId) {
      await new Notification({
        userId: assignedBrokerId,
        title: `New ${inquiryType || 'INFORMATION'} Lead`,
        message: `${buyerName} inquired about ${property.title}.`,
        type: 'LEAD'
      }).save();
    }

    res.status(201).json(newLead);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Broker: Get all leads assigned to this broker
export const getBrokerLeads = async (req: AuthRequest, res: Response) => {
  try {
    const { status, inquiryType, sort } = req.query;
    
    const filter: any = { brokerId: req.user._id };
    if (status) filter.status = status;
    if (inquiryType) filter.inquiryType = inquiryType;

    let sortOption: any = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'score') sortOption = { leadScore: -1 };
    if (sort === 'followup') sortOption = { nextFollowUpAt: 1 };

    const leads = await Lead.find(filter)
      .sort(sortOption)
      .populate('propertyId');
    res.json(leads);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Broker: Update lead status
export const updateLeadStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, brokerId: req.user._id },
      { status },
      { new: true }
    );
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Broker: Get lead by id
export const getBrokerLeadById = async (req: AuthRequest, res: Response) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, brokerId: req.user._id }).populate('propertyId');
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Broker: Update contact info (last contacted)
export const markLeadContacted = async (req: AuthRequest, res: Response) => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, brokerId: req.user._id },
      { lastContactedAt: new Date() },
      { new: true }
    );
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Broker: Add note
export const addLeadNote = async (req: AuthRequest, res: Response) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, brokerId: req.user._id });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    
    const newNote = new BrokerNote({
      brokerId: req.user._id,
      leadId: lead._id,
      propertyId: lead.propertyId,
      note: req.body.note
    });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getLeadNotes = async (req: AuthRequest, res: Response) => {
  try {
    const notes = await BrokerNote.find({ leadId: req.params.id, brokerId: req.user._id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
