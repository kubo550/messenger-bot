import { Request, Response, Router } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send(
    'https://messenger-api-bot.herokuapp.com/profile?mode=all&verify_token=pvJ9nCELLdS4QBcPmb2dzWyay2xJQ9CFQUJz6Rw3CjEfT5AcdT',
  );
});

export default router;
