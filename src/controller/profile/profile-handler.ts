import { Request, Response, Router } from 'express';
import { Profile } from '../../utils/profile';

const router = Router({ mergeParams: true });

router.get('/', async (req: Request, res: Response) => {
  const token = req.query['verify_token'];
  const mode = req.query['mode'];

  if (mode && token) {
    if (token === process.env.verifyToken) {
      const messengerBotProfile = new Profile(
        process.env.appUrl,
        process.env.shopUrl,
      );

      try {
        await messengerBotProfile.init();

        res.status(200).json({
          success: true,
          message: 'Successfully verified',
        });

        return;
      } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: err.message });
      }
    } else {
      return res.sendStatus(401);
    }
  } else {
    return res.sendStatus(400);
  }
});

export default router;
