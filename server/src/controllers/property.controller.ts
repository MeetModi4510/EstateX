import { Request, Response } from 'express';
import { Property } from '../models/Property';
import { User } from '../models/User';
import { Notification } from '../models/Notification';
import { Lead } from '../models/Lead';
import { Visit } from '../models/Visit';
import { Deal } from '../models/Deal';
import { PropertyImage } from '../models/PropertyImage';
import { PropertyView } from '../models/PropertyView';
import { AuthRequest } from '../middleware/auth.middleware';
import { v2 as cloudinary } from 'cloudinary';

// Public: Get all published properties
export const getProperties = async (req: Request, res: Response) => {
  try {
    const {
      location, city, locality, minPrice, maxPrice, propertyType, listingType,
      bedrooms, bathrooms, minArea, maxArea, furnishing, parking, possessionStatus,
      amenities, facing, sort, page = '1', limit = '20'
    } = req.query;

    const query: any = { status: 'PUBLISHED' };

    if (city) query.city = new RegExp(city as string, 'i');
    if (locality) query.locality = new RegExp(locality as string, 'i');
    if (location) {
      query.$or = [
        { city: new RegExp(location as string, 'i') },
        { locality: new RegExp(location as string, 'i') }
      ];
    }
    
    if (propertyType) query.propertyType = propertyType;
    if (listingType) query.listingType = listingType;
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
    if (bathrooms) query.bathrooms = { $gte: Number(bathrooms) };
    
    if (minArea || maxArea) {
      query.builtUpArea = {};
      if (minArea) query.builtUpArea.$gte = Number(minArea);
      if (maxArea) query.builtUpArea.$lte = Number(maxArea);
    }
    
    if (furnishing) query.furnishing = furnishing;
    if (possessionStatus) query.possessionStatus = possessionStatus;
    if (facing) query.facing = facing;
    if (parking) query.parking = { $gte: Number(parking) };
    
    // Pagination
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Sorting
    let sortOptions: any = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    else if (sort === 'price_desc') sortOptions = { price: -1 };
    else if (sort === 'area_asc') sortOptions = { builtUpArea: 1 };
    else if (sort === 'area_desc') sortOptions = { builtUpArea: -1 };
    else if (sort === 'newest') sortOptions = { createdAt: -1 };

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber)
      .populate('ownerId', 'name email phone')
      .populate('brokerId', 'name email phone')
      .populate('images');

    res.json({
      properties,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber)
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Public: Get single published property
export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, status: 'PUBLISHED' }).populate('images');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Owner: Get own properties
export const getOwnerProperties = async (req: AuthRequest, res: Response) => {
  try {
    const properties = await Property.find({ ownerId: req.user._id }).populate('images');
    res.json(properties);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Owner: Create property
export const createProperty = async (req: AuthRequest, res: Response) => {
  try {
    const newProperty = new Property({
      ...req.body,
      ownerId: req.user._id,
      status: 'DRAFT',
      propertyCode: 'PRP-' + Math.floor(1000 + Math.random() * 9000)
    });
    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Owner: Update property
export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: false }
    );
    if (!property) return res.status(404).json({ message: 'Property not found or unauthorized' });
    res.json(property);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Owner: Delete property
export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    const propertyId = req.params.id;
    const property = await Property.findOne({ _id: propertyId, ownerId: req.user._id });
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found or unauthorized' });
    }

    // Delete associated images from Cloudinary and Database
    const images = await PropertyImage.find({ propertyId });
    for (const image of images) {
      if (image.publicId && !image.publicId.startsWith('mock_id_')) {
        try {
          await cloudinary.uploader.destroy(image.publicId);
        } catch (err) {
          console.error('Failed to delete image from Cloudinary:', err);
        }
      }
    }
    await PropertyImage.deleteMany({ propertyId });

    // Delete associated Leads, Visits, Deals
    const leads = await Lead.find({ propertyId });
    const leadIds = leads.map(l => l._id);
    
    await Visit.deleteMany({ leadId: { $in: leadIds } });
    await Deal.deleteMany({ leadId: { $in: leadIds } });
    await Lead.deleteMany({ propertyId });

    // Delete the property itself
    await Property.findByIdAndDelete(propertyId);

    res.json({ message: 'Property and all associated data deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Owner: Submit property for approval
export const submitProperty = async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user._id },
      { status: 'PENDING_APPROVAL' },
      { new: true, runValidators: false }
    ).populate('images');
    
    if (!property) return res.status(404).json({ message: 'Property not found' });
    
    const brokers = await User.find({ role: 'BROKER' });
    if (brokers.length > 0) {
      const notifications = brokers.map(broker => ({
        userId: broker._id,
        title: 'New Property Pending Approval',
        message: `${req.user.name || 'An owner'} submitted "${property.title || 'a property'}" for your review.`,
        type: 'PROPERTY'
      }));
      await Notification.insertMany(notifications);
    }

    res.json(property);
  } catch (error: any) {
    console.error('Error submitting property:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Broker: Get pending properties
export const getPendingProperties = async (req: AuthRequest, res: Response) => {
  try {
    const properties = await Property.find({ status: 'PENDING_APPROVAL' })
      .populate('images')
      .populate('ownerId', 'name email phone');
    res.json(properties);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Broker: Approve property
export const approveProperty = async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status: 'PUBLISHED', approvedAt: new Date(), publishedAt: new Date(), brokerId: req.user._id },
      { new: true }
    );
    if (!property) return res.status(404).json({ message: 'Property not found' });

    // Notify Owner
    if (property.ownerId) {
      await new Notification({
        userId: property.ownerId,
        title: 'Property Approved!',
        message: `Your property "${property.title}" has been approved and is now live!`,
        type: 'PROPERTY'
      }).save();
    }

    res.json(property);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Broker: Reject property
export const rejectProperty = async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status: 'REJECTED' },
      { new: true }
    );
    if (!property) return res.status(404).json({ message: 'Property not found' });

    // Notify Owner
    if (property.ownerId) {
      await new Notification({
        userId: property.ownerId,
        title: 'Property Rejected',
        message: `Your property "${property.title}" has been rejected. Please review and update.`,
        type: 'PROPERTY'
      }).save();
    }

    res.json(property);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Broker: Mark property as featured
export const markFeatured = async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { isFeatured: req.body.isFeatured },
      { new: true }
    );
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Broker: Mark property as verified
export const markVerified = async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { isVerified: req.body.isVerified },
      { new: true }
    );
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Public: Record a property view
export const recordPropertyView = async (req: Request, res: Response) => {
  try {
    const propertyId = req.params.id;
    const viewerIp = req.ip || req.socket.remoteAddress || 'unknown';
    
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    // Simple spam prevention: don't record if same IP viewed in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const existingView = await PropertyView.findOne({
      propertyId,
      viewerIp,
      createdAt: { $gte: oneHourAgo }
    });

    if (!existingView) {
      await new PropertyView({
        propertyId,
        ownerId: property.ownerId,
        viewerIp
      }).save();
    }

    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Owner: Get Analytics
export const getOwnerAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user._id;

    // Get last 30 days of views
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const views = await PropertyView.find({
      ownerId,
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Group views by date
    const viewsByDate: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      viewsByDate[dateString] = 0;
    }

    // Also track views by property to find top performing
    const viewsByProperty: Record<string, number> = {};

    views.forEach(v => {
      const dateString = v.createdAt.toISOString().split('T')[0];
      if (viewsByDate[dateString] !== undefined) {
        viewsByDate[dateString]++;
      }
      const propId = v.propertyId.toString();
      viewsByProperty[propId] = (viewsByProperty[propId] || 0) + 1;
    });

    const chartData = Object.keys(viewsByDate).map(date => ({
      date,
      views: viewsByDate[date]
    }));

    // Find top property
    let topPropertyId = null;
    let maxViews = -1;
    for (const [id, count] of Object.entries(viewsByProperty)) {
      if (count > maxViews) {
        maxViews = count;
        topPropertyId = id;
      }
    }

    let topProperty = null;
    if (topPropertyId) {
      topProperty = await Property.findById(topPropertyId).populate('images');
    }

    res.json({
      chartData,
      totalViews: views.length,
      topProperty: topProperty ? { property: topProperty, views: maxViews } : null
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
