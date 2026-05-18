import { Request, Response } from 'express';
import { Deal } from '../models/Deal';
import { Lead } from '../models/Lead';
import { Property } from '../models/Property';
import { AuthRequest } from '../middleware/auth.middleware';
import { Notification } from '../models/Notification';

export const createDeal = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId, leadId, propertyPrice, commissionPercentage } = req.body;
    
    // IDOR Check: Ensure lead belongs to the requesting broker
    const lead = await Lead.findOne({ _id: leadId, brokerId: req.user._id });
    if (!lead) {
      return res.status(403).json({ message: 'Unauthorized: Lead does not belong to you' });
    }

    const estimatedCommission = (propertyPrice * commissionPercentage) / 100;

    const newDeal = new Deal({
      propertyId,
      leadId,
      brokerId: req.user._id,
      propertyPrice,
      commissionPercentage,
      estimatedCommission,
      status: 'NEGOTIATION'
    });
    
    await newDeal.save();

    // Update lead status
    await Lead.findByIdAndUpdate(leadId, { status: 'NEGOTIATION' });

    res.status(201).json(newDeal);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getBrokerDeals = async (req: AuthRequest, res: Response) => {
  try {
    const deals = await Deal.find({ brokerId: req.user._id })
      .populate('propertyId')
      .populate('leadId')
      .sort({ createdAt: -1 });
    res.json(deals);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateDealStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const deal = await Deal.findOneAndUpdate(
      { _id: req.params.id, brokerId: req.user._id },
      { status, ...(status === 'COMPLETED' ? { completedAt: new Date() } : {}) },
      { new: true }
    );
    
    if (!deal) return res.status(404).json({ message: 'Deal not found' });

    if (status === 'COMPLETED') {
      await Lead.findByIdAndUpdate(deal.leadId, { status: 'DEAL_COMPLETED' });
      await Property.findByIdAndUpdate(deal.propertyId, { status: 'SOLD' });
    }

    res.json(deal);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
