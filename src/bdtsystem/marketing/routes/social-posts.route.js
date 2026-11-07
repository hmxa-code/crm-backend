import { Router } from 'express';
import { SocialPostsController } from '../controllers/social-posts.controller.js';
import { publishToPlatform } from '../controllers/socialPublish.controller.js';

const router = Router();

router.get('/', SocialPostsController.getAll);
router.get('/:id', SocialPostsController.getById);
router.post('/publish', publishToPlatform);
router.post('/', SocialPostsController.create);
router.put('/:id', SocialPostsController.update);
router.delete('/:id', SocialPostsController.delete);

export const SocialPostsRouter = router;
