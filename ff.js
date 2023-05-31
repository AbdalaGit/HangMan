// Create Var Inside Characters Language English
let CharactersEnglish = "abcdefghijklmnopqrstuvwxyz";

// Transform The CharactersEnglish To Array
let CharactersArray = Array.from(CharactersEnglish);

// Select Element From Html
let BoxCharacters = document.querySelector(".letters");

let btn = document.getElementById("btn");
let start = document.getElementById("start");

btn.addEventListener("click", () => {
  document.getElementById("click").play()
  start.style.display = "none";
})

// Loop On All Characters
CharactersArray.forEach(character =>{
  // Create Span
  let Span = document.createElement("span");
  Span.appendChild(document.createTextNode(character));

  Span.className = "box-character";

  BoxCharacters.appendChild(Span);
});

// Create Object
const Category = {
  people: ["Ahmed Zewail", "Jaber Bin Hayyan", "Mustafa Mahmoud", "Magdi Yacoub", "Naguib Mahfouz", "Christopher Columbus", "William Shakespeare", "Albert Einstein", "Bill Gates",],
  country: ["Egypt", "Libya", "Palestine", "Morocco", "Lebanon", "Saudi Arabia", "Syria", "Kuwait", "Qatar", "Iraq", "Tunisia", "Sudan", "Jordan", "Bahrain", "Yemen", "Oman", "Mauritania", "Djibouti", "Algeria", "Somalia", "Uae",],
  animal: ["cat", "lion", "Dog", "crocodile", "eagle", "camel", "bear", "elephant", "giraffe", "falcon", "pig", "Monkey", "donkey", "rat", "tiger", "Turtle", "deer", "fox", "frog", "snake",],
  programming: ["php", "c", "python", "ruby", "java", "javaScript", "dart", "sql", "go",],
  movies: ["Avengers", "Black Panther", "Avatar", "Alien", "Die Hard", "Titanic", "John Wick", "Toy Story", "Matrix", "Joker", "Wonder Woman", "Arrival", "it",],
};

let ArrayObj = Object.keys(Category);

let RandomNumber = Math.floor(Math.random() * ArrayObj.length);

let RandomName = ArrayObj[RandomNumber];

let RandomCategory = Category[RandomName];

let RandomNumberTow =  Math.floor(Math.random() * RandomCategory.length);

let RandomCategoryValue = RandomCategory[RandomNumberTow].toUpperCase();

document.querySelector(".category-name").innerHTML += RandomName;

let ContianerCharactersGuess = document.querySelector(".word-guess");

let ArrayCharactersGuess = Array.from(RandomCategoryValue);




ArrayCharactersGuess.forEach(character =>{
  let GuessSpan = document.createElement("span");
  
  if(character === ' '){
    GuessSpan.classList.add("with-space");
  }

  ContianerCharactersGuess.appendChild(GuessSpan);
});
// Select Guess
let SpanGuess = document.querySelectorAll(".word-guess span");

let HangMan = document.querySelector(".hangman");

// Wrong
let Wrong = 0;

let span = document.createElement("sapn");
span.appendChild(document.createTextNode(RandomCategoryValue.length));
span.className = "countWord";
HangMan.appendChild(span);

// Handle Clicked Characters
document.addEventListener('click', (e) => {
  // Set Chose Status
  let Status = false;

  // Check If Clicked On Characters 
  if(e.target.className === "box-character"){

    // Add Class Clicked To Span 
    e.target.classList.add("clicked");

    // Target Characters clicked Me
    let ClickedCharacters = e.target.innerHTML.toUpperCase();

    // Var Transform Characters To Array
    let WordCharacters = Array.from(RandomCategoryValue.toUpperCase())

    // Loop On All Characters And Compare Between Index
    WordCharacters.forEach((character, Wordindex) => {
      // If Characters Equels Clicked Me
      if(character == ClickedCharacters){
        // Status To Correct
        Status = true;

        SpanGuess.forEach((guess, guessindex) => {
          // If CharactersIndex Equels GuessIndex
          if(Wordindex === guessindex){
            guess.innerHTML = ClickedCharacters;
          };
        });
      };
    });
    if(Status !== true){
      Wrong++;

      HangMan.classList.add(`wrong-${Wrong}`);

      document.getElementById("fail").play();

      if(Wrong === 9){
        EndGame();

        BoxCharacters.classList.add("finished");
      };
    }else{
      document.getElementById("rr").play();
    };

    function EndGame(){
      let div = document.createElement("div");
      div.appendChild(document.createTextNode(" لقد خسرت الكلمة هي"));
      div.className = "WordCorrect";
      let divTwo = document.createElement("div");
      div.appendChild(divTwo);
      divTwo.appendChild(document.createTextNode(`${RandomName} من ${RandomCategoryValue}`));
      divTwo.className = "Lost";
      let button = document.createElement("button");
      button.appendChild(document.createTextNode("لعبة جديدة"));
      let divThree = document.createElement("div");
      button.className ="restart";
      divThree.append(button)
      div.appendChild(divThree)
      document.body.appendChild(div);
      document.getElementById("marr").play();
      button.addEventListener("click", () =>{
        location.reload()
      });
    };
  };
});





