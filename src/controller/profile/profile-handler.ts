import { NextFunction, Request, Response, Router } from 'express';
import { Profile } from '../../utils/profile';
import { isSet, isValidToken } from '../webhook/verificationUtils';
import { Logger } from '../../utils/logger';

const router = Router({ mergeParams: true });

router.get('/', authorization, async (req: Request, res: Response) => {
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
    Logger.error(err.message);
    return res.status(500).json({ message: err.message });
  }
});

export default router;

function authorization(req: Request, res: Response, next: NextFunction) {
  const token = req.query['verify_token'];
  const mode = req.query['mode'];

  if (!isSet(mode) || !isSet(token)) {
    return res.sendStatus(400);
  }
  if (!isValidToken(token)) {
    return res.sendStatus(401);
  }
  next();
}
