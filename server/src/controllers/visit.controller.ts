import { Request, Response } from 'express';
import { Visit } from '../models/Visit';
import { Lead } from '../models/Lead';
import { AuthRequest } from '../middleware/auth.middleware';
import { Notification } from '../models/Notification';

export const createVisitRequest = async (req: Request, res: Response) => {
  try {
    const { leadId, propertyId, scheduledDate, scheduledTime, notes } = req.body;
    
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    const brokerId = lead.brokerId;
    
    const newVisit = new Visit({
      leadId,
      propertyId,
      brokerId,
      scheduledDate,
      scheduledTime,
      notes,
      status: 'REQUESTED'
    });
    
    await newVisit.save();

    // Update lead status
    await Lead.findByIdAndUpdate(leadId, { status: 'VISIT_SCHEDULED' });

    // Notify broker
    await new Notification({
      userId: brokerId,
      title: 'New Visit Request',
      message: `A new visit has been requested.`,
      type: 'VISIT'
    }).save();

    res.status(201).json(newVisit);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getBrokerVisits = async (req: AuthRequest, res: Response) => {
  try {
    const visits = await Visit.find({ brokerId: req.user._id })
      .populate('propertyId')
      .populate('leadId')
      .sort({ scheduledDate: 1 });
    res.json(visits);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateVisitStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const visit = await Visit.findOneAndUpdate(
      { _id: req.params.id, brokerId: req.user._id },
      { status },
      { new: true }
    );
    if (!visit) return res.status(404).json({ message: 'Visit not found' });
    res.json(visit);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
