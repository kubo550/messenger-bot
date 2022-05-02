import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import expressBasicAuth from 'express-basic-auth';
import WebhookController from './controller/webhook/webhook-handler';
import HealthController from './controller/health-check/health-controller';
import ProfileController from './controller/profile/profile-handler';
import { verifyRequestSignature } from './utils/verifyRequestSignature';
import { Logger } from './utils/logger';

const envFile = process.env.NODE_ENV === 'test' ? `.env.test` : '.env';
dotenv.config({ path: path.join(path.resolve(), envFile) });

checkEnvVariables();

export const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  bodyParser.json({
    limit: '2mb',
    verify: verifyRequestSignature,
  }),
);

app.use(express.static(path.join(path.resolve(), 'public')));

app.set('view engine', 'ejs');

const router = express.Router({ mergeParams: true });

router.use('/health', HealthController);
router.use('/profile', ProfileController);
router.use('/webhook', WebhookController);


router.use(
  expressBasicAuth({
    challenge: true,
    users: {
      [process.env.username]: process.env.password,
    },
  }),
);

app.use('/', router);

if (process.env.stage !== 'test') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    Logger.info(`Server is listening on port ${port}`);
    firstRunInfo();
  });
}

function firstRunInfo() {
  const { appUrl, verifyToken, pageId } = process.env;

  if (appUrl && verifyToken && pageId) {
    Logger.info(`
            To set up your app, go to: ${appUrl}/profile?mode=all&verify_token=${verifyToken} \n
            To test bot in messenger send any message at: https://m.me/${pageId}`);
  }
}

function checkEnvVariables() {
  const requiredVariables = [
    'pageId',
    'appId',
    'pageAccessToken',
    'appSecret',
    'verifyToken',
    'appUrl',
    'shopUrl',
    'apiUrl',
  ];

  requiredVariables.forEach((variable) => {
    if (!process.env[variable]) {
      Logger.error(
        `Required variable ${variable} is not defined! Check .env file`,
      );
      process.exit(1);
    }
  });
}
