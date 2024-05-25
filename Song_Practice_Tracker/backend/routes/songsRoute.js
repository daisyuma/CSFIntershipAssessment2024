import express from 'express';
import { Song } from '../models/songModel.js'


const router = express.Router();

// Create a new practice song
router.post('/', async (request, response) => {
    try {
        if (
            !request.body.title ||
            !request.body.composer
        ){
            return response.status(400).send({
                message: 'Send all required fields: title, composer'
            })
        }
        const newSong = {
            title: request.body.title,
            composer: request.body.composer,
            year: request.body.year,
        }
        const song = await Song.create(newSong)
        return response.status(201).send(song)

    } catch (err) {
        cconsole.log(err.message);
        response.status(500).send({ message: err.message });
    }
});

// Get all songs from the database
router.get('/', async (request, response) => {
    try {
        const songs = await Song.find({});
        return response.status(200).json({
            count: songs.length,
            data: songs 
        });
    } catch (err) {
        console.log(err.message);
        response.status(500).send({ message: err.message})
    }
});

// Get all songs from the database by id
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const song = await Song.findById(id);
        return response.status(200).json(song);
    } catch (err) {
        console.log(err.message);
        response.status(500).send({ message: err.message});
    }
});

// Update a song
router.put('/:id', async (request, response) => {
    try {
        
        if (
            !request.body.title ||
            !request.body.composer
        ){
            return response.status(400).send({
                message: 'Send all required fields: title, composer'
            })
        }
        const { id } = request.params;
        const song = await Song.findByIdAndUpdate(id, request.body);
        if (!song) {
            return response.status(404).json({ message: `Song ${id} not found`});
        }
        return response.status(200).send({ message: `Song ${id} updated!`});
    } catch(err) {
        console.log(err.message);
        response.status(500).send({ message: err.message});
    }
});

// Delete a song
router.delete('/:id', async(request, response) => {
    try{
        const { id } = request.params;
        const song = await Song.findByIdAndDelete(id);
        if (!song) {
            return response.status(404).json({ message: `Song ${id} not found`});
        }
        return response.status(200).send({ message: `Song ${id} deleted sucessfully`})

    }catch(err){
        console.log(err.message);
        response.status(500).send( { message: err.message });
    }
});

export default router;
