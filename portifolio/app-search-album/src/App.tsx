import { useState, useEffect } from 'react'
import { Card } from './components/Card'
import './styles.css'
import { ArrowDown } from 'phosphor-react'

import { i18n } from './translate/i18n'

let clientID = import.meta.env.VITE_CLIENT_ID
let clientSecret = import.meta.env.VITE_CLIENT_SECRET
let I18N_STORAGE_KEY = 'i18nextLng'

export function App() {
  const [searchInput, setSearchInput] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [albums, setAlbums] = useState([])

  const [language] = useState(localStorage.getItem(I18N_STORAGE_KEY))

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

    function handleSelectChange(e) {
      localStorage.setItem(
        I18N_STORAGE_KEY,
        e.target.value
      )
      window.location = window.location
    }
      
  return (
    <main className="main-container">
      <div className="header">
        <h1>{i18n.t('titles.app')}</h1>

        <select onChange={handleSelectChange} value={language}>
          <option>{language}</option>
          <option value="pt-br">pt-BR</option>
          <option value="en-us">en-US</option>
        </select>
      </div>
      <input 
        placeholder={i18n.t('messages.app')}
        type="input"
        onChange={e => setSearchInput(e.target.value)}
      />
      <button onClick={search}>
      {i18n.t('buttons.search')}
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
          </div> : <p className="before-search">{i18n.t('messages.paragraph')}</p> 
        } 
      </div>
    </main>
  )
}
