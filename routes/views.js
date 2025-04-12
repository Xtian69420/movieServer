const express = require('express');
const router = express.Router()
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

        const newView = new viewsmodel({
            view: nextView,
            Device: `${deviceOS} ${deviceType} (${browser})`
        });

        const savedView = await newView.save();
        res.status(201).json(savedView);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router