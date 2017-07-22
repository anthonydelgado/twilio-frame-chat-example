const express = require('express');
const router = express.Router();

const tokenGenerator = require('./token_generator');

const config = require('../config');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/token', function(req, res, next) {
    res.send(tokenGenerator());
});

router.get('/config', (req, res) => {
    res.json(config);
});



module.exports = router;
