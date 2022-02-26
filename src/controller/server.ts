// express server
import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';


export const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({
    limit: '2mb',
}));

const router = express.Router({mergeParams: true});


router.get('/health', (req: Request, res: Response) => {
    console.log('health check');
    return res.sendStatus(200);
});



app.use('/', router);


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});