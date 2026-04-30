const Song=require('../models/song.model');
const imagekit=require('../services/storage.service');
//create a song
exports.createSong=async(req,res)=>{
    try{
        console.log(req.body);

        const song=await Song.create(req.body);

        res.status(201).json({
            message:"Song created successfully",
            song
        });


          
    } catch(error){
        res.status(500).json({
            message:error.message
        });
    }
}

//get all songs
exports.getAllSongs=async(req,res)=>{
    try{
        const songs=await Song.find();
        res.status(200).json({
            message:"Songs fetched successfully",
            songs
        });
    } catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

//delete a song by using its id
exports.deletedSong=async(req,res)=>{
    try{
        const {id}=req.params;
        
        const deletedSong=await Song.findByIdAndDelete(id);
        if(!deletedSong){
            return res.status(404).json({
                message:"Song not found"
            });
            }
        
        res.status(200).json({
            message:"Song deleted successfully", 
            deletedSong   
         });
    } catch(error){
        res.status(500).json({
            message:error.message
        });
    }
    };

    //updated a song by an id
    exports.updateSong=async(req,res)=>{
        try{
            const {id}=req.params;
            const updatedSong=await Song.findByIdAndUpdate(
                id,
                req.body,
                {new:true});
            if(!updatedSong){
                return res.status(404).json({
                    message:"Song not found"
                });
            }
            res.status(200).json({
                message:"Song updated successfully",
                updatedSong
            });
        } catch(error){
            res.status(500).json({
                message:error.message
            });
        }
    }

  //upload a song with audio and image
exports.uploadSong = async (req, res) => {
    try {
        const { title, artist } = req.body;

        const audioFile = req.files.audio[0];
        const imageFile = req.files.image[0];

        // upload audio
        const audioUpload = await imagekit.upload({
            file: audioFile.buffer,
            fileName: Date.now() + "-" + audioFile.originalname,
            folder: "/spotify/audio"
        });

        // upload image
        const imageUpload = await imagekit.upload({
            file: imageFile.buffer,
            fileName: Date.now() + "-" + imageFile.originalname,
            folder: "/spotify/images"
        });
//save song details in database
        const song = await Song.create({
            title,
            artist,
            audiourl: audioUpload.url,
            imageurl: imageUpload.url
        });
//send response
        res.status(201).json({
            message: "Song uploaded successfully",
            song
        });
//handle errors
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
};