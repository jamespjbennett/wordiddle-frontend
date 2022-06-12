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

  const inputRef = useRef({})

  useEffect(() => {
    console.log(props)
    if(props.globalInputDisabled){
      console.log("global input dislabled")
      setInputDisabled(true);
    }
  })

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
        if(chosenCorrectWord()){
          alert("You win");
          props.setGlobalInputDisabled(true);
        }
      }else{
        alert('invalid yo');
      }
    }
  };

  function chosenCorrectWord(){
    return inputClassName.filter(color => color == "green").length == 5
  }


  function generateCorrectLetterCountObject(correctWord, chosenWord){
    const correctLetterCount = {}
    for (const chosenLetter of chosenWord) {
      correctLetterCount[chosenLetter] = correctWord.split("").filter(correctLetter => correctLetter==chosenLetter).length
    };
    return correctLetterCount
  }

  function displayGuessResult(correctWord){
    const nonExactMatches = [];
    const existingInputClassNames = inputClassName;
    const correctLetterCountObject = generateCorrectLetterCountObject(correctWord, chosenWord)
    const letterIndexObject = {}
    for (var i = 0; i <= 4; i++) {
      if(chosenWord[i].toLocaleLowerCase() == correctWord[i].toLocaleLowerCase()){
        existingInputClassNames[i] = "green";
        correctLetterCountObject[chosenWord[i]] = correctLetterCountObject[chosenWord[i]] - 1
      }else{
        if (correctLetterCountObject[chosenWord[i]]){
          existingInputClassNames[i] = "yellow";
          correctLetterCountObject[chosenWord[i]] = correctLetterCountObject[chosenWord[i]] - 1
        };
      }
    };
    setInputClassName([...existingInputClassNames]);
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
            className={inputClassName[i]}
            disabled={inputDisabled}
            maxLength="1"
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

  const [globalInputDisabled, setGlobalInputDisabled] = useState(false)

  const [win, setWin] = useState(
    false
  )

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
    console.log(globalInputDisabled)
    return {correctWord: selectedWord}
  }

  return (
    <div className="App">
      {selectedWord}
      <WordGrid submitGuess={submitGuess} globalInputDisabled={globalInputDisabled} setGlobalInputDisabled={setGlobalInputDisabled}/>
      <WordGrid submitGuess={submitGuess} globalInputDisabled={globalInputDisabled} setGlobalInputDisabled={setGlobalInputDisabled}/>
      <WordGrid submitGuess={submitGuess} globalInputDisabled={globalInputDisabled} setGlobalInputDisabled={setGlobalInputDisabled}/>
      <WordGrid submitGuess={submitGuess} globalInputDisabled={globalInputDisabled} setGlobalInputDisabled={setGlobalInputDisabled}/>
      <WordGrid submitGuess={submitGuess} globalInputDisabled={globalInputDisabled} setGlobalInputDisabled={setGlobalInputDisabled}/>
      <WordGrid submitGuess={submitGuess} globalInputDisabled={globalInputDisabled} setGlobalInputDisabled={setGlobalInputDisabled}/>
    </div>
  );
}

export default App;
