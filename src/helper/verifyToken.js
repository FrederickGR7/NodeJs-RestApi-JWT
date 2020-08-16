'use strict'
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    if(req.header('Authorization') === undefined) return res.status(401).send('Acceso Denegado');
    const token = req.header('Authorization').split(' ')[1];
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).send({error});
    }
}