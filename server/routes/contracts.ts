import express, {Request, Response} from 'express';
import {promises as fs} from "fs";

const config = require('../../config/project.config');

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const contractsLocation = config.paths.resources('contracts.json');
        const contracts = await fs.readFile(contractsLocation);
        res.json(JSON.parse(contracts.toString())).end()
    } catch (error) {
        console.error(error);
        res.status(500).end()
    }
});

export default router
