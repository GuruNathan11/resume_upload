const router = require('express').Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const users = require('../Model/Models');
const Controller = require('../Controller/Controller.js');

router.get('/', function(req, res) {
  res.json({
    status: 'API Works',
    message: 'Welcome to Apply for JOB'
  });
});

router.post('/add', upload.single('resume'), function(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'Resume file is required' });
  }
  const upload = multer({
    dest: 'uploads/',
    fileFilter: function (req, file, cb) {
      if (file.mimetype !== 'application/pdf') {
        return cb(new Error('Only PDF files are allowed'));
      }
      cb(null, true);
    }
  });
  

  const user = new users();
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.mobile = req.body.mobile;
  user.experience = req.body.experience;
  user.resume = req.file.path;

  user.save(function(err, savedUser) {
    if (err) {
      return res.status(400).json({ message: err });
    }
    return res.status(201).json({
      message: 'Job application added successfully',
      data: savedUser
    });
  });
});


router.route('/get-all').get(Controller.index);
router.route('/:user_id').get(Controller.view).patch(Controller.update).put(Controller.update).delete(Controller.Delete);
router.route('/del-all').post(Controller.delall);

const fs = require('fs');
const path = require('path');

router.get('/resume/:user_id', function(req, res) {
  users.findById(req.params.user_id, function(err, user) {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving user' });
    }

    if (!user || !user.resume) {
      return res.status(404).json({ message: 'User or resume not found' });
    }

    const resumePath = path.join(__dirname, '..', user.resume);

    fs.readFile(resumePath, function(err, data) {
      if (err) {
        return res.status(500).json({ message: 'Error retrieving resume' });
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.send(data);
    });
  });
});

  
module.exports = router;
