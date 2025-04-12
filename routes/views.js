require('dotenv').config()
const express = require('express');
const router = express.Router()
const axios = require('axios');
const viewsmodel = require('../model/view-model')

router.get('/', (req,res)=>{
    res.send('Hello world');
});

router.get('/getAllViews', async (req,res)=>{
    try{
        const view = await viewsmodel.find()
        res.json(view);
        
    } catch(err){
        res.status(500).json({ message: err.message })
    }
});
const UAParser = require('ua-parser-js');

router.post('/addViews', async (req, res) => {
    try {

        const lastView = await viewsmodel.findOne().sort({ view: -1 });
        const nextView = lastView ? lastView.view + 1 : 1;

        const parser = new UAParser();
        parser.setUA(req.headers['user-agent']);
        const result = parser.getResult();

        const deviceType = result.device.type || 'Desktop';
        const deviceOS = result.os.name || 'Unknown OS';
        const browser = result.browser.name || 'Unknown Browser';

        const ipAddress = req.ip;
        var api_key = process.env.IP_STACK;

        const locationResponse = await axios.get(`http://api.ipstack.com/${ipAddress}?access_key=${api_key}`);
        const location = locationResponse.data.city || 'Unknown Location';

        const newView = new viewsmodel({
            view: nextView,
            device: `${deviceOS} ${deviceType} (${browser})`,
            location: location
        });

        const savedView = await newView.save();
        res.status(201).json(savedView);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router