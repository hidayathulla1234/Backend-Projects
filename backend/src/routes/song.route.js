const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.middleware');

const { createSong } = require('../controllers/song.controller');
const {getAllSongs}=require('../controllers/song.controller');
const {deletedSong}=require('../controllers/song.controller');
const {updateSong}=require('../controllers/song.controller');
const {uploadSong}=require('../controllers/song.controller');   

router.post('/add',createSong);
router.get('/all',getAllSongs);
router.delete('/:id',deletedSong);
router.put('/:id',updateSong);
router.post('/upload', upload.fields([
    { name: 'audio', maxCount: 1 }, 
    { name: 'image', maxCount: 1 }]), 
    uploadSong);

module.exports = router;