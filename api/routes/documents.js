const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const DocumentsController = require('../controllers/documents');
const IncomingForm = require('formidable').IncomingForm
const Role = require('../models/role');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    console.log("filefilter");
    if (file.mimetype === 'application/pdf' || 'image/jpeg' || 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

//test

router.post('/free', upload.single('file'), DocumentsController.document_free_ocr);

////
router.get('/myorders', checkAuth, DocumentsController.documents_get_my_docs);

// update emp
router.patch('/update/:documentId', checkAuth, DocumentsController.documents_update_emp);

router.post('/download/:documentId', DocumentsController.download_document);
router.post('/ocr/download/:documentId', DocumentsController.download_docOCR);
router.post('/result/download/"documentId', DocumentsController.documents_get_my_result);


router.get('/', checkAuth, HasRole([Role.Admin, Role.Seller]), DocumentsController.documents_get_all);
router.post('/', checkAuth, upload.single('file'), DocumentsController.documents_create_document);

//router.get('/:documentId', DocumentsController.documents_get_document);

router.patch('/:documentId', checkAuth, DocumentsController.documents_update_document);

router.delete('/:documentId', checkAuth, DocumentsController.documents_delete);

function HasRole(roles) {
    return function (req, res, next) {
        var canPass = false;
        roles.forEach((role) => {
            if (role === req.userData.userRole) {
                canPass = true;
            }
        })
        if (!canPass) {
            return res.status(401).json({
                message: 'Not allowed'
            });
        } else {
            next();
        }
    }
}


module.exports = router;

