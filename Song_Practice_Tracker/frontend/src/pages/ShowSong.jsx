import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import * as qs from 'qs';
const CLIENT_ID = "648218c2532545d08a03317db36a93bd";
const CLIENT_SECRET = "51b450fb42694ce2958687758a68d64b";

const ShowSong = () => {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([])

  useEffect(() => {
    // var auth = {
    //   method: 'POST',
    //   headers: {
    //           'Content-Type': 'application/x-www-form-urlencoded'
    //         },
    //   body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret='+ CLIENT_SECRET
    // }
    const headers = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: CLIENT_ID,
        password: CLIENT_SECRET,
      },
    };
    const data = {
      grant_type: 'client_credentials',
    };
    //API Access Token
    axios
    .post('https://accounts.spotify.com/api/token',
    qs.stringify(data),
    headers
    )
    // fetch('https://accounts.spotify.com/api/token', auth)
    .then((response) => {
      console.log(response.data.access_token)
      setAccessToken(response.data.access_token)
    })
    .then(() =>{
      setSearchInput("Hillsong United")
    })
    .then(search())
  }, [])

  //Search
  async function search() {
    console.log("line 53 " + searchInput)
    console.log("Searching for "+ searchInput); 
    //Get Artist ID
    var artistParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }
    // var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', artistParameters)
    // .then(response => response.json())
    // .then(data => console.log(data))
    var artistId = await axios
    .get('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist',
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }
    )
    .then((response) => {
        return response.data.artists.items[0].id
    }
    )
    console.log('artistId: ' + artistId);
    var returnedAlbums  = 
    // await fetch('https://api.spotify.com/v1/artists/' + artistId + '/albums' + '?include_groups=album&market=US&limit=50', artistParameters)
    // .then(response => response.json())
    await axios
    .get('https://api.spotify.com/v1/artists/' + artistId + '/albums' + '?include_groups=album&market=US&limit=50',
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }
    )
    .then((response) => {
      setAlbums(response.data.items)
      console.log(response.data)
      return response.data
    }
    );
    //Get all albums with Artist ID

    // Display all albums
     
  }
  return (
    <div>ShowSong</div>
  )
}

export default ShowSong