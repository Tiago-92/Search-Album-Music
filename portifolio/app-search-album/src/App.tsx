import { useState, useEffect } from 'react'
import { Card } from './components/Card'
import './styles.css'

const CLIENT_ID = "1f76879e76094509837047419b35563d"
const CLIENT_SECRET = "7459f023beea4f869127d53aa96606d0"

export function App() {
  const [searchInput, setSearchInput] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [albums, setAlbums] = useState([])

  useEffect(() => {
    let authParams = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    
    fetch("https://accounts.spotify.com/api/token", authParams )
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
  }, [])

  async function search() {
    console.log("Search for " + searchInput)

    let artistParams = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }

    let artistID = await fetch("https://api.spotify.com/v1/search?q=" + searchInput + '&type=artist', artistParams)
      .then(response => response.json())
      .then(data => { return data.artists.items[0].id})

      console.log(artistID)

    let albums = await fetch("https://api.spotify.com/v1/artists/" + artistID + '/albums' + '?include_group=album&market=US&limit=50', artistParams)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setAlbums(data.items)
      })
  }
  
  return (
    <>
      <input 
        placeholder="search for artists"
        type="input"
        
        onChange={e => setSearchInput(e.target.value)}
      />
      <button onClick={search}>
        Search
      </button>

      {albums.map((album, i) => {
        return (
          <Card
            name={album.name}
            img={album.images[0].url} 
          />
        )
      })}
    </>
  )
}
