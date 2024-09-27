import { useState, useRef } from "react";
import "../home/Home.css";

function Home() {
  //setting the user input
  const [searchedWord, setSearchedWord] = useState("");
  //setting the response data
  const [meanings, setMeanings] = useState([]);
  //setting audio url to play
  const [audioUrl, setAudioUrl] = useState("");
  //setting empty input field error
  const [error, setError] = useState("");
  //setting wrong input field error
  const [wrongError, setWrongError] = useState("");
  //setting placeholder to make it dynamic
  const [placeholder, setPlaceholder] = useState("Enter Word");

  const baseUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";
  const audioRef = useRef(null);

  async function handleSearch(event) {
    event.preventDefault();

    //checking if user input is empty else GET API will be called
    if (searchedWord === "") {
      setError("Input field empty");
      setWrongError("");
      setMeanings([]);
      setAudioUrl("");
    } else {
      try {
        let response = await fetch(`${baseUrl}${searchedWord}`, {
          method: "GET",
        });
        const data = await response.json();
        setMeanings(data[0].meanings);
        setError("");
        setWrongError("");
        if (data[0].phonetics.length > 0) {
          setAudioUrl(data[0].phonetics[0].audio);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.load();
          }
        } else {
          setAudioUrl("");
        }
        setSearchedWord("");
        setPlaceholder("Enter Word");
      } catch (error) {
        setWrongError("No words found");
        setError("");
        setMeanings([]);
        setAudioUrl("");
        setSearchedWord("");
        setPlaceholder("Enter Word");
      }
    }
  }

  return (
    <div className="container">
      <div className="container_form">
        <h1 className="heading">Welcome to online word search !!!</h1>
        <form className="form">
          <label className="label"> Enter word : </label>
          <input
            className="word"
            type="text"
            placeholder={placeholder}
            value={searchedWord}
            onChange={(event) => {
              setSearchedWord(event.target.value);
            }}
          />
          <button
            className="searchButton"
            onClick={(event) => handleSearch(event)}
          >
            Search
          </button>
        </form>
        {error && <p className="error1">{error}</p>}
        {wrongError && <p className="error2">{wrongError}</p>}
      </div>

      <div className="data">
        {meanings.map((meaning, index) => (
          <div key={index}>
            <h4 className="partOfSpeach">{meaning.partOfSpeech}</h4>
            {meaning.definitions.map((definition, index) => (
              <div key={index}>
                <p className="definition">{definition.definition}</p>
              </div>
            ))}
          </div>
        ))}
        {audioUrl && (
          <audio controls ref={audioRef} role="audio" className="audio">
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    </div>
  );
}

export default Home;
