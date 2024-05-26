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
    })
  }, [])

  //Search
  async function search() {
    console.log("Searching for "+ searchInput); 
  }
  return (
    <div>ShowSong</div>
  )
}

export default ShowSong