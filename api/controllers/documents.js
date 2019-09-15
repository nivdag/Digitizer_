const Document = require('../models/document');
const User = require('../models/user');
const mongoose = require('mongoose');
const tesseract = require('node-tesseract-ocr');
const path = require('path');
require('datejs');
var fs = require('fs');
const HummusRecipe = require('hummus-recipe');
const pdf = require('pdf-poppler');


const config = {
    lang: 'eng',
    oem: 1,
    psm: 3
}

exports.documents_get_my_docs = (req, res, next) => {
    const clientId = parseJwt(req.headers.authorization.split(" ")[1]);
    Document.find({ userId: clientId })
        .select('extension dueTime fileName priority _id price userAccepted empId resultPath')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                documentsArr: docs.map(doc => {
                    return {
                        timeLeft: timeLeftToDue(doc.dueTime),
                        dueTime: doc.dueTime,
                        fileName: doc.fileName,
                        extension: doc.extension,
                        priority: doc.priority,
                        _id: doc._id,
                        price: doc.price,
                        userAccepted: doc.userAccepted,
                        empId: doc.empId,
                        resultPath: doc.resultPath
                    }
                })
            };
            res.status(200).json({ response });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.download_document = (req, res, next) => {
    const id = req.params.documentId;
    Document.findById(id)
        .select('filePath')
        .exec()
        .then(doc => {
            if (doc) {
                var docPath = doc.filePath
                fPath = path.join(__dirname, '../../') + docPath;
                console.log(fPath);
                res.sendFile(fPath);
            }
            else {
                res.status(404).json({ message: 'No valid entry found' });
            }
        })
}

exports.download_docOCR = (req, res, next) => {
    const id = req.params.documentId;
    Document.findById(id)
        .select('ocrFilesPath')
        .exec()
        .then(doc => {
            if (doc) {
                var paths = doc.ocrFilesPath;
                paths.forEach((p) => {
                    let fPath = path.join(__dirname, '../../') + p;
                    res.sendFile(fPath)
                })
                // res.sendFile(paths);
            }
            else {
                res.status(404).json({ message: 'No valid entry found' });
            }
        })
}

exports.documents_get_my_result = (req, res, next) => {
    const id = req.params.documentId;
    Document.findById(id)
        .select('resultPath')
        .exec()
        .then(doc => {
            if (doc) {
                var path = doc.resultPath;
                fPath = path.join(__dirname, '../../') + path;
                console.log(fPath);
                res.sendFile(fPath);
            }
            else {
                res.status(404).json({ message: 'No valid entry found' });
            }
        })
}

exports.document_free_ocr = (req, res, next) => {
    tesseract.recognize(req.file.path, config)
        .then(text => {
            res.status(200).send({ "message": text });
        })
        .catch(err => {
            res.status(500).send({ "error": 'ocr error' });
        })
}

exports.documents_get_all = (req, res, next) => {
    Document.find({
        empId: { $exists: false }
    })
        .select('extension dueTime fileName priority _id empFee userAccepted')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                documentsArr: docs.map(doc => {
                    return {
                        timeLeft: timeLeftToDue(doc.dueTime),
                        dueTime: doc.dueTime,
                        fileName: doc.fileName,
                        extension: doc.extension,
                        priority: doc.priority,
                        _id: doc._id,
                        empFee: doc.empFee,
                        userAccepted: doc.userAccepted
                    }
                })
            };
            res.status(200).json({ response });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.documents_create_document = (req, res, next) => {
    // check if .pdf, get number of pages, create an array to hold each page path
    // if multi-page pdf then save to folder
    // run OCR and price the order

    var fileCreationTime = path.basename(req.file.path).split('_')[0];
    const outputFolder = 'outputFiles\\';
    var uploadedFile = req.file;
    var newFolderPath = outputFolder + fileCreationTime + '\\';

    // create a new folder for the current order in "outputFiles" folder
    fs.mkdir(newFolderPath, (err) => {
        if (err) console.log(err);
    });

    const document = new Document({
        _id: new mongoose.Types.ObjectId(),
        filePath: req.file.path,
        fileName: path.basename(req.file.path).split('_').pop(),
        extension: req.body.extension,
        priority: req.body.priority,
        creationTime: fileCreationTime,
        dueTime: parseInt(fileCreationTime) + addDays(req.body.priority),
        userId: parseJwt(req.headers.authorization.split(" ")[1]),
        fileSize: req.file.size
    });

    let uploadedFileExtension = path.basename(req.file.path).split('.').pop().toLocaleLowerCase();
    // save "filename_OCR.txt" file/s in folder
    if (uploadedFileExtension === 'pdf') {
        pdfConvertAndProcess(uploadedFile.path, newFolderPath, document.id);
    } else {
        singleFileProcess(uploadedFile.path, newFolderPath, function () { calcPrice(newFolderPath, document._id) });
    }

    document
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Created document successfully',
                price: 5,
                srcExtension: path.extname(req.file.path),
                srcFilename: path.basename(req.file.path).split('_').pop(),
                createdDocument: {
                    extension: result.extension,
                    priority: result.priority,
                    _id: result._id
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

exports.documents_get_document = (req, res, next) => {
    const id = req.params.documentId;
    Document.findById(id)
        .select('name price _id documentImage')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    document: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/documents'
                    }
                });
            }
            else {
                res.status(404).json({ message: 'No valid entry found' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}

exports.documents_update_emp = (req, res, next) => {
    const id = req.params.documentId;
    const clientId = parseJwt(req.headers.authorization.split(" ")[1]);

    User.findById(clientId)
        .select('workingOn')
        .exec()
        .then(data => {
            if (data.workingOn != null) {
                res.status(500).json({
                    error: "already working on one"
                });
            } else {
                User.updateOne({ _id: clientId }, { $set: {workingOn: id}})
                .exec()
                Document.updateOne({ _id: id }, { $set: { empId: clientId } })
                    .exec()
                    .then(result => {
                        res.status(200).json({
                            message: "document updated",
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/documents/' + id
                            }
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

exports.documents_update_document = (req, res, next) => {
    console.log(req.body)

    const id = req.params.documentId;
    // const updateOps = {};
    // for (const ops of req.body) {
    //     console.log('here')
    //     updateOps[ops.propName] = ops.value;
    // }
    // Document.update({ _id: id }, { $set: updateOps })
    const props = req.body;
    Document.updateOne({ _id: id }, props)
        .exec()
        .then(result => {
            res.status(200).json({
                message: "document updated",
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/documents/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.documents_delete = (req, res, next) => {
    const id = req.params.documentId
    Document.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/documents',
                    body: {
                        name: 'String',
                        price: 'Number'
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

function addDays(priority) {
    var result;

    // 'none', 'fast', 'premium'
    switch (priority) {

        // 7 days
        case "none":
            result = 604800000;
            break;

        // 5 days
        case "fast":
            result = 432000000;
            break;

        // 3 days
        case "premium":
            result = 259200000;
            break;
    }

    return result;
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const buff = new Buffer.from(base64, 'base64');
    const payloadinit = buff.toString('ascii');
    const payload = JSON.parse(payloadinit);
    //console.log(payload.userId)

    return payload.userId;
}

function timeLeftToDue(dueTime) {
    return dueTime - (new Date()).getTime();
}

function pdfConvertAndProcess(uploadedFilePath, newFolderPath, id) {
    // initializing pdf-poppler's convert options, pdf--->img
    let opts = {
        format: 'jpeg',
        out_dir: newFolderPath,
        out_prefix: path.basename(uploadedFilePath, '.pdf'),
        page: null
    }
    // convert the pdf to single page jpeg's
    pdf.convert(uploadedFilePath, opts)
        .then(res => {
            console.log('Successfully converted', res);
            // fs.readdir read current folder. for each file, convert with ocr
            // generate price, save paths in schema as array
            // delete jpeg's (still got the pdf)
            fs.readdir(newFolderPath, (err, files) => {

                //try promises
                var promises = [];

                files.forEach(file => {

                    let jpgConvertedPage = path.join(newFolderPath + file);
                    //console.log('working on:', jpgConvertedPage);

                    let fileToCreate = jpgConvertedPage.split('.jpg')[0] + '_OCR.txt';
                    //console.log(fileToCreate);

                    // pass the converted image to tesseract
                    // save a "filename_OCR.txt" file and delete the converted image
                    //promises array
                    promises.push(
                        tesseract.recognize(jpgConvertedPage, config)
                            .then(text => {
                                // delete the jpeg
                                fs.unlink(jpgConvertedPage, (err) => {
                                    if (err) throw err;
                                    //console.log('successfully deleted ', jpgConvertedPage);
                                });
                                // write and save the "filename_OCR.txt" file
                                fs.writeFile(fileToCreate, text, (err) => {
                                    if (err) throw err;
                                    //console.log('file created!');
                                });
                            })
                            .catch(error => {
                                console.error(error);
                            })
                    )
                })
                Promise.all(promises).then((result) => {
                    calcPrice(newFolderPath, id);
                })
            })
        })
        .catch(error => {
            console.error(error);
        })
}

function singleFileProcess(uploadedFilePath, newFolderPath, callback) {
    let fileToCreate = newFolderPath + path.basename(uploadedFilePath).split('.')[0] + '_OCR.txt';
    tesseract.recognize(uploadedFilePath, config)
        .then(text => {
            // write and save the "filename_OCR.txt" file
            fs.writeFile(fileToCreate, text, (err) => {
                if (err) throw err;
                callback();
            });
        })
        .catch(error => {
            console.error(error);
        })
}

function calcPrice(folderPath, id) {
    var pathArray = [];
    var validCharsRegex = /^[A-Za-z,.\s]*$/;
    var numOfChars = [];
    var allDocScore = [];
    var weightsSum = 0;
    var scoreSum = 0

    fs.readdir(folderPath, (err, files) => {
        files.forEach(file => {
            //save file path to path array
            pathArray.push(folderPath + file)
            fs.readFile(folderPath + file, 'utf8', (error, data) => {
                //console.log('calcprice:', file);
                var validChars = 0;

                for (var i = 0; i < data.length; i++) {
                    if (data.charAt(i).match(validCharsRegex)) {
                        validChars++;
                    }
                }

                nonValidChars = i - validChars;
                validPercent = (validChars * 100) / i;
                docScore = i * validPercent;

                // str = folderPath + file;
                // str = str.concat(' valid : ' + validChars);
                // str = str.concat(' non-valid : ' + nonValidChars);
                // str = str.concat(' percent: ' + validPercent);
                // str = str.concat(' score: ' + docScore);
                // console.log(str);

                numOfChars.push(i);
                allDocScore.push(docScore);

                if (numOfChars.length === files.length) {
                    for (var j = 0; j < numOfChars.length; j++) {
                        weightsSum += numOfChars.pop();
                    }
                    //console.log(weightsSum);
                    for (var k = 0; k < allDocScore.length; k++) {
                        scoreSum += allDocScore.pop();
                    }
                    //console.log(scoreSum);
                    result = scoreSum / weightsSum;
                    //console.log(result);
                    Finalprice = Math.ceil(((0.25 * files.length) + ((100 - result) * 3)));
                    empFee = Finalprice / 2;
                    //console.log(Finalprice);
                    //console.log(pathArray);
                    Document.updateOne({ _id: id }, { $set: { price: Finalprice, ocrFilesPath: pathArray, empFee: empFee } })
                        .exec()
                        .then(result => {
                            console.log('updated doc')
                        })
                        .catch(err => {
                            console.log(err);
                        });

                }
            })
        });
    });
}


