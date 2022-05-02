import { Request, Response, Router } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send(
    '<a  href"https://messenger-api-bot.herokuapp.com/profile?mode=all&verify_token=pvJ9nCELLdS4QBcPmb2dzWyay2xJQ9CFQUJz6Rw3CjEfT5AcdT!" target="_blank">Click here to verify your bot</a>',
  );
});

export default router;
