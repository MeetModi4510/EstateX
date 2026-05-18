import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Property } from '../models/Property';
import { PropertyImage } from '../models/PropertyImage';
import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

export const uploadImages = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No images provided' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to add images to this property' });
    }

    const uploadedImages = [];
    let currentOrder = await PropertyImage.countDocuments({ propertyId });

    for (const file of files) {
      let cloudinaryResult;
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
        cloudinaryResult = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'estatex_properties', fetch_format: 'auto', quality: 'auto' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          Readable.from(file.buffer).pipe(uploadStream);
        });
      } else {
        cloudinaryResult = {
          secure_url: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
          public_id: `mock_id_${Date.now()}_${Math.random()}`
        };
      }

      // Check if it's the first image to make it cover
      const isCover = currentOrder === 0;

      const newImage = new PropertyImage({
        propertyId,
        imageUrl: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
        isCover,
        displayOrder: currentOrder
      });

      await newImage.save();
      uploadedImages.push(newImage);
      currentOrder++;
    }

    res.status(201).json({ message: 'Images uploaded successfully', images: uploadedImages });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
};

export const deleteImage = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId, imageId } = req.params;

    const property = await Property.findById(propertyId);
    if (!property || property.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const image = await PropertyImage.findOne({ _id: imageId, propertyId });
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Delete from Cloudinary if configured
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && !image.publicId.startsWith('mock_id_')) {
      await cloudinary.uploader.destroy(image.publicId);
    }

    // Delete from MongoDB
    await image.deleteOne();

    // If it was cover, set a new cover
    if (image.isCover) {
      const newCover = await PropertyImage.findOne({ propertyId }).sort({ displayOrder: 1 });
      if (newCover) {
        newCover.isCover = true;
        await newCover.save();
      }
    }

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const reorderImages = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId } = req.params;
    const { orderedIds } = req.body; // Array of image IDs in new order

    const property = await Property.findById(propertyId);
    if (!property || property.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update order in bulk
    const updatePromises = orderedIds.map((id: string, index: number) => {
      return PropertyImage.updateOne({ _id: id, propertyId }, { displayOrder: index });
    });

    await Promise.all(updatePromises);

    res.json({ message: 'Images reordered successfully' });
  } catch (error) {
    console.error('Error reordering images:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const setCoverImage = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId, imageId } = req.params;

    const property = await Property.findById(propertyId);
    if (!property || property.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Unset all covers for this property
    await PropertyImage.updateMany({ propertyId }, { isCover: false });

    // Set new cover
    await PropertyImage.updateOne({ _id: imageId, propertyId }, { isCover: true });

    res.json({ message: 'Cover image updated' });
  } catch (error) {
    console.error('Error setting cover image:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
