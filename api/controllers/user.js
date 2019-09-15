const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Role = require('../models/role');
const User = require('../models/user');

exports.user_singup = (req, res, next) => {
    // First check if mail exists
    // hash the password, create new user object
    // save {objectId, name, email, password(Hashed and salted)} to DB
    User
        .find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Mail exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        var userRole
                        if (req.body.role === '0') {
                            userRole = Role.User                  
                        } else {
                            userRole = Role.Seller
                        }
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            name: req.body.name,
                            email: req.body.email,
                            password: hash,
                            role: userRole
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                // add user token
                                const token = jwt.sign(
                                    {
                                        email: user.email,
                                        userId: user._id,
                                        role: userRole
                                    },
                                    process.env.JWT_KEY,
                                    {
                                        expiresIn: "1h"
                                    }
                                );
                                res.status(201).json({
                                    message: 'User created',
                                    token: token,
                                    role: userRole,
                                    id: user._id
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                })
            }
        })
}

exports.user_login = (req, res, next) => {
    // check if mail exists
    // compare the password to the DB hashed one
    // return a token (expired in 1H)
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id,
                            userRole: user[0].role //role based

                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token,
                        id: user[0]._id,
                        role: user[0].role
                    });
                }
                res.status(401).json({
                    message: 'Auth failed'
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.user_delete = (req, res, next) => {
    User.deleteOne({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}