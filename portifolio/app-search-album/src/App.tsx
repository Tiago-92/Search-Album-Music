import { useState, useEffect } from 'react'
import { Card } from './components/Card'
import './styles.css'
import { ArrowDown } from 'phosphor-react'

let clientID = '1f76879e76094509837047419b35563d'
let clientSecret = '7459f023beea4f869127d53aa96606d0'

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
      body: 'grant_type=client_credentials&client_id=' + clientID + '&client_secret=' + clientSecret
    }
    
    fetch("https://accounts.spotify.com/api/token", authParams )
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
  }, [])

  async function search() {
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

    let albums = await fetch("https://api.spotify.com/v1/artists/" + artistID + '/albums' + '?include_group=album&market=US&limit=50', artistParams)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setAlbums(data.items)
      })

    }
  
  return (
    <main className="main-container">
      <h1>find your favorite album</h1>
      <input 
        placeholder="search for artists"
        type="input"
        onChange={e => setSearchInput(e.target.value)}
      />
      <button onClick={search}>
        Go!
      </button>

      <div className="card-container">
        {albums.map((album, i) => {
          return (
            <Card
              name={album.name}
              img={album.images[0].url} 
              key={album.id}
            />
          )
        })}
        {albums.length > 0 ?
          <div className="glass-effect">
          <ArrowDown size={52} color="#ffff" />
          </div> : <p className="before-search">Nothing here yet, make your search... :-)</p> 
        } 
      </div>
    </main>
  )
}
