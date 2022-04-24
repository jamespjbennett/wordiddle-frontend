import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect,useRef } from 'react';


const App = () => {
  return <Wordiddle />;
};

const WordGrid = () => {
  const [chosenWord, setChosenWord] = useState(
    ["", "", "", "", ""]
  );
  const inputRef = useRef({});

  function updateWord(event) {
    let existingCurrentWord = chosenWord;
    existingCurrentWord[Number(event.target.name)] = event.target.value
    setChosenWord(existingCurrentWord);
    console.log(event)
    if(event.target.parentElement.nextElementSibling){
      event.target.parentElement.nextElementSibling.firstElementChild.focus()
    }
  }

  function submitWord(event){
    if(event.key == "Enter"){
      if(validWord(chosenWord)){
        console.log('ready to submit');
      }else{
        console.log('invalid')
      }
    }
  };

  function chosenWordToString(){
    return chosenWord.join("")
  }

  function validWord(chosenWord){
    let correctWordLength = chosenWordToString().length == 5;
    let onlyAlphaChars = /^[a-zA-Z]+$/.test(chosenWordToString());
    return correctWordLength && onlyAlphaChars
  }

  function InputFields(){
    var fieldsArray = [];

    for (var i = 0; i <= 4; i++) {
      fieldsArray.push(
        <div className="RowBlock">
          <input
            key={i}
            name={i}
            onChange={updateWord}
            onKeyPress={submitWord}
            ref={el => inputRef.current[i] = el}
          />
        </div>
      );
    };
    return fieldsArray;
  }

  return (
    <div className="RowWrapper">
      {chosenWord}
      {InputFields()}
    </div>
  )
}
const Wordiddle = () => {
  const [selectedWord, setSelectedWord] = useState(
    null
  );

  useEffect(() => {
    let url = "https://wordiddle.herokuapp.com/words/sample?testing=true"
      fetch("https://gentle-wave-21974.herokuapp.com/" + url)
      .then(response=>response.json())
      .then(data=>{
        setSelectedWord(data.text)
      })
  }, [])

  return (
    <div className="App">
      {selectedWord}
      <WordGrid/>
      <WordGrid/>
      <WordGrid/>
      <WordGrid/>
      <WordGrid/>
      <WordGrid/>
    </div>
  );
}

export default App;
