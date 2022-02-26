// express server
import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import axios from "axios";


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



router.get('/random-person', async (req: Request, res: Response) => {
    try {
        const {data} = await axios.get('https://randomuser.me/api/');
        return res.status(200).json({result: data.results[0]});
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({error: err.message});
    }
});


app.use('/', router);


// const port = process.env.PORT || 3000;
//
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}...`);
// });