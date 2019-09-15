const User = require('../models/user');
const Document = require('../models/document');
const mongoose = require('mongoose');
const myJwtParser = require('../utils/myJwtParser');
const timeUtils = require('../utils/timeUtils');

exports.upload_result = (req, res, next) => {
    const userId = myJwtParser.getUserIdFromToken(req.headers.authorization.split(" ")[1]);
    User.findById(userId)
        .select('workingOn')
        .exec()
        .then(usr => {
            Document.updateOne({ _id: usr.workingOn }, { $set: { resultPath: req.file.path } })
                .exec()

            usr.workingOn = undefined;
            usr.save(() => {
                err => console.log(err),
                    product => console.log(product)
            })
            res.status(200).json({
                message: 'Success, uploaded result'
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });

}

exports.orders_get_workspace = (req, res, next) => {
    const userId = myJwtParser.getUserIdFromToken(req.headers.authorization.split(" ")[1]);
    timeUtils.timeLeftToDue()
    User.findById(userId)
        .select('name workingOn')
        .exec()
        .then(usr => {
            Document.findById(usr.workingOn)
                .exec()
                .then(doc => {
                    res.status(200).json({
                        userName: usr.name,

                        docInfo: {
                            id: usr.workingOn,
                            price: doc.empFee,
                            fileSize: doc.fileSize,
                            timeLeft: timeUtils.timeLeftToDue(doc.dueTime),
                            priority: doc.priority,
                            extension: doc.extension,
                            fileName: doc.fileName
                        }
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.orders_get_all = (req, res, next) => {
    Order
        .find()
        .select('document quantity _id')
        .populate('document', 'name')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        document: doc.document,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })

            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.orders_create_order = (req, res, next) => {
    Document.findById(req.body.documentId)
        .then(document => {
            if (!document) {
                return res.status(404).json({
                    message: 'Document not found'
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                document: req.body.documentId
            });
            return order
                .save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order stored',
                createdOrder: {
                    _id: result._id,
                    document: result.document,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}

exports.orders_get_order = (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate('document')
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'Order not found'
                });
            }
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
}

exports.orders_delete_order = (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders',
                    body: { documentId: 'ID', quantity: 'Number' }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}