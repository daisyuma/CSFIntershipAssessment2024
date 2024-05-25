import express from 'express';
import { Song } from '../models/songModel.js'


const router = express.Router();

const spotifyAPI = new SpotifyAPI({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUrl: process.env.REDIRECT_URL
});

router.get('/login', async (request, response) => {
    try{
        const scopes= ['user-read-private', 'user-read-email', 'user-read-playback-state', 'user-modify-playback-state'];
        response.redirect(spotifyAPI.createAuthorizeURL(scopes));
    }catch (err){
        console.log(err.message);
        response.status(500).send({ message: err.message });
    }
})

router.get('/callback', async (request, response) => {
    try{
        const code = request.query.code;
        const state = request.query.state;
        spotifyAPI.authorizationCodeGrant(code).then(data =>{
            const accessToken = data.body['access_token'];
            const refreshToken = data.body['refresh_token'];
            const expiresIn = data.body['expires_in'];

            spotifyAPI.setAccessToken(accessToken)
            spotifyAPI.setRefreshToken(refreshToken)

            console.log(accessToken, refreshToken)
            response.send("Success!")

            setInterval(async() => {
                const data = await spotifyAPI.refreshAccessToken();
                const accessTokenRefreshed = data.body['access_token'];
                spotifyAPI.setAccessToken(accessTokenRefreshed)
            }, expiresIn/2*1000);
        });
    }catch (err) {
        console.log(err.message);
        response.status(500).send({ message: err.message });
    }
})

router.get('/search', async (request, response)=>{
    const {q} = request.query;
    spotifyAPI.searchTracks(q)
})


// Create a new practice song
router.post('/', async (request, response) => {
    try {
        if (
            !request.body.title ||
            !request.body.artist ||
            !request.body.startDate
        ){
            return response.status(400).send({
                message: 'Send all required fields: title, artist, start date'
            })
        }
        const newSong = {
            title: request.body.title,
            artist: request.body.artist,
            startDate: request.body.startDate,
        }
        const song = await Song.create(newSong)
        return response.status(201).send(song)

    } catch (err) {
        console.log(err.message);
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

// Get song from the database by id
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
            !request.body.artist ||
            !request.body.startDate
        ){
            return response.status(400).send({
                message: 'Send all required fields: title, artist, startDate'
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
