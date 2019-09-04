const mongoose = require('mongoose');

//order: a document
// id of "emp"
// user details
// Priority
// dest file.extension


const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true},
    destExtension: { type: String, required: true},
    priority: { type: String, required: true},
    email: { 
        type: String, 
        required: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
     },

});

module.exports = mongoose.model('Order', orderSchema);