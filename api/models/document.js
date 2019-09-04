const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    filePath: { type: String, required: true },
    fileName: { type: String, required: true },
    extension: { type: String, required: true },
    priority: { type: String, required: true },
    creationTime: { type: String, required: true },
    dueTime: { type: String, required: true },
    price: { type: Number },
    numOfPages: { type: Number },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    empId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ocrFilesPath: [{ type: String }],
    fileSize: { type: Number, required: true },
    userAccepted: { type: Boolean, default: false },
    empFee: { type: Number },
    resultPath: { type: String }
});

module.exports = mongoose.model('Document', documentSchema);