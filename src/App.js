import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect,useRef } from 'react';


const App = () => {
  return <Wordiddle />;
};

const WordGrid = (props) => {
  const [chosenWord, setChosenWord] = useState(
    ["", "", "", "", ""]
  );

  const [inputClassName, setInputClassName] = useState(
    ["", "", "", "", ""]
  );

  const [inputDisabled, setInputDisabled] = useState(false)

  const inputRef = useRef({});

  function updateWord(event) {
    let existingCurrentWord = chosenWord;
    existingCurrentWord[Number(event.target.name)] = event.target.value
    setChosenWord(existingCurrentWord);
    if(event.target.parentElement.nextElementSibling){
      event.target.parentElement.nextElementSibling.firstElementChild.focus();
    }
  }

  function submitWord(event){
    if(event.key == "Enter"){
      if(validWord(chosenWord)){
        let result = props.submitGuess(chosenWordToString());
        displayGuessResult(result.correctWord);
        setInputDisabled(true);
      }else{
        alert('invalid yo');
      }
    }
  };

  function displayGuessResult(correctWord){
    for (var i = 0; i <= 4; i++) {
      let IndexOfGuessLetterInCorrectWord = correctWord.indexOf(chosenWord[i]);
      if(IndexOfGuessLetterInCorrectWord != -1){
        let letterInCorrectPlace = IndexOfGuessLetterInCorrectWord === i;
        let existingInputClassNames = inputClassName;
        existingInputClassNames[i] = letterInCorrectPlace ? "green" : "yellow"
        setInputClassName([...existingInputClassNames]);
      }
    };
    console.log(inputClassName)
  }

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
            className={inputClassName[i]}
            disabled={inputDisabled}
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

  function submitGuess(guessWord) {
    console.log("guess is " + guessWord)
    console.log("word is " + selectedWord)
    return {correctWord: selectedWord}
  }

  return (
    <div className="App">
      {selectedWord}
      <WordGrid submitGuess={submitGuess}/>
      <WordGrid submitGuess={submitGuess}/>
      <WordGrid submitGuess={submitGuess}/>
      <WordGrid submitGuess={submitGuess}/>
      <WordGrid submitGuess={submitGuess}/>
      <WordGrid submitGuess={submitGuess}/>
    </div>
  );
}

export default App;
