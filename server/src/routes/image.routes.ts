import { Router } from 'express';
import { authenticate, authorizeRole } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload';
import { uploadImages, deleteImage, reorderImages, setCoverImage } from '../controllers/image.controller';

const router = Router();

// Only PROPERTY_OWNER can modify images
router.use(authenticate);
router.use(authorizeRole('PROPERTY_OWNER'));

router.post('/:propertyId/images', upload.array('images', 30), uploadImages);
router.delete('/:propertyId/images/:imageId', deleteImage);
router.put('/:propertyId/images/reorder', reorderImages);
router.put('/:propertyId/images/:imageId/cover', setCoverImage);

export default router;
