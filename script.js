// ----------------------------------------------------
// لعبة الرجل المشنوق - منطق اللعبة والتحكم الصوتي الشامل
// ----------------------------------------------------

// 1. نظام الصوتيات الكلاسيكي الاحتياطي (Retro Web Audio Synthesizer)
// يضمن هذا النظام تشغيل مؤثرات صوتية حقيقية وجميلة في المتصفح حتى لو لم تتوفر ملفات الـ mp3 الأصلية!
class GameAudioSynthesizer {
  constructor() {
    this.ctx = null;
  }

  // تهيئة قناة الصوت عند التفاعل الأول للمستخدم
  initContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // صوت النقر على الأزرار
  playClick() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      console.warn("Audio Context is not allowed or failed:", e);
    }
  }

  // صوت تخمين حرف صحيح (نغمة إيجابية مرتفعة)
  playCorrectLetter() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // نغمة C5
      osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.06); // نغمة E5

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {
      console.warn(e);
    }
  }

  // صوت تخمين حرف خاطئ (نغمة منخفضة سريعة)
  playWrongLetter() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(70, this.ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);
    } catch (e) {
      console.warn(e);
    }
  }

  // صوت الفوز المضحك (Cartoon Victory Fanfare & Boing!)
  // صوت الفوز المضحك والاحتفالي مع التموجات (Rolling Victory Fanfare - "rr")
  playFunnyWinSound() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. صوت التردد المتدحرج والاحتفالي (The "rr-rr-rr" rolling roll)
      for (let i = 0; i < 12; i++) {
        const rollOsc = this.ctx.createOscillator();
        const rollGain = this.ctx.createGain();
        rollOsc.type = "triangle";
        rollOsc.frequency.setValueAtTime(300 + (i % 2) * 80, now + i * 0.035);
        rollGain.gain.setValueAtTime(0.12, now + i * 0.035);
        rollGain.gain.exponentialRampToValueAtTime(0.005, now + i * 0.035 + 0.03);
        rollOsc.connect(rollGain);
        rollGain.connect(this.ctx.destination);
        rollOsc.start(now + i * 0.035);
        rollOsc.stop(now + i * 0.035 + 0.03);
      }

      // 2. معزوفة البوق البراقة والفوز العالي (Triumphant Victory Fanfare)
      const notes = [
        { freq: 523.25, time: 0.45, duration: 0.12, type: "square" },
        { freq: 659.25, time: 0.58, duration: 0.12, type: "square" },
        { freq: 783.99, time: 0.71, duration: 0.12, type: "square" },
        { freq: 1046.50, time: 0.85, duration: 0.40, type: "triangle" },
        { freq: 880.00, time: 1.30, duration: 0.15, type: "sawtooth" },
        { freq: 1174.66, time: 1.48, duration: 0.50, type: "triangle" }
      ];

      notes.forEach(note => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = note.type;
        osc.frequency.setValueAtTime(note.freq, now + note.time);
        osc.frequency.exponentialRampToValueAtTime(note.freq * 1.05, now + note.time + note.duration);
        gain.gain.setValueAtTime(0.15, now + note.time);
        gain.gain.exponentialRampToValueAtTime(0.005, now + note.time + note.duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + note.time);
        osc.stop(now + note.time + note.duration);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  // صوت ضحكة الأشرار الشريرة المضحكة (Maniacal Evil Laugh - "maniacal")
  playFunnyLossSound() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. نبضات الضحكة الشريرة المتتابعة (Mwa-ha-ha-ha-ha Maniacal Laugh)
      const laughPulses = [
        { pitch: 220, time: 0.0,  dur: 0.18 },
        { pitch: 260, time: 0.22, dur: 0.16 },
        { pitch: 240, time: 0.40, dur: 0.16 },
        { pitch: 210, time: 0.58, dur: 0.18 },
        { pitch: 190, time: 0.78, dur: 0.20 },
        { pitch: 160, time: 1.00, dur: 0.35 }
      ];

      laughPulses.forEach(p => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(p.pitch, now + p.time);
        osc.frequency.exponentialRampToValueAtTime(p.pitch * 0.75, now + p.time + p.dur);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800, now + p.time);

        gain.gain.setValueAtTime(0.2, now + p.time);
        gain.gain.exponentialRampToValueAtTime(0.01, now + p.time + p.dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + p.time);
        osc.stop(now + p.time + p.dur);
      });

      // 2. صوت انخفاض ومسير الخسارة الختامي (Final Melodramatic Drop)
      const sadNotes = [
        { startFreq: 261.63, endFreq: 174.61, time: 1.4, duration: 0.8 }
      ];

      sadNotes.forEach(note => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(note.startFreq, now + note.time);
        osc.frequency.linearRampToValueAtTime(note.endFreq, now + note.time + note.duration);

        gain.gain.setValueAtTime(0.12, now + note.time);
        gain.gain.exponentialRampToValueAtTime(0.005, now + note.time + note.duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + note.time);
        osc.stop(now + note.time + note.duration);
      });

    } catch (e) {
      console.warn(e);
    }
  }
}

// إنشاء نسخة من نظام الصوتيات الذكي
const synthAudio = new GameAudioSynthesizer();

// تهيئة القناة الصوتية وتفعيلها فور أول ضغطة للمستخدم في المتصفح
function unlockAudio() {
  if (synthAudio) {
    synthAudio.initContext();
  }
}
document.addEventListener("pointerdown", unlockAudio, { once: true });
document.addEventListener("keydown", unlockAudio, { once: true });

// حالة الصوت العامة
window.isSoundMuted = localStorage.getItem("hangman_muted") === "true";

// وظائف تشغيل الصوت الآمنة (تحاول تشغيل الملف الأصلي وتنتقل تلقائياً للاحتياطي عند الفشل)
function safePlaySound(elementId, synthMethod) {
  if (window.isSoundMuted) return;
  const audioEl = document.getElementById(elementId);
  if (audioEl) {
    audioEl.currentTime = 0;
    const playPromise = audioEl.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // تجربة الصوت الاحتياطي أو المخلّق الصوتي
        let fallbackId = elementId === "rr" ? "success" : (elementId === "maniacal" ? "fail" : null);
        const fallbackEl = fallbackId ? document.getElementById(fallbackId) : null;
        if (fallbackEl) {
          fallbackEl.currentTime = 0;
          fallbackEl.play().catch(() => {
            if (synthAudio && typeof synthAudio[synthMethod] === "function") {
              synthAudio[synthMethod]();
            }
          });
        } else if (synthAudio && typeof synthAudio[synthMethod] === "function") {
          synthAudio[synthMethod]();
        }
      });
    }
  } else if (synthAudio && typeof synthAudio[synthMethod] === "function") {
    synthAudio[synthMethod]();
  }
}

// زر كتم الصوت
const soundToggleBtn = document.getElementById("sound-toggle-btn");
const soundIcon = document.getElementById("sound-icon");

function updateSoundUI() {
  if (soundIcon && soundToggleBtn) {
    if (window.isSoundMuted) {
      soundIcon.textContent = "Sound: OFF";
      soundToggleBtn.classList.add("muted");
    } else {
      soundIcon.textContent = "Sound: ON";
      soundToggleBtn.classList.remove("muted");
    }
  }
}
updateSoundUI();

if (soundToggleBtn) {
  soundToggleBtn.addEventListener("click", () => {
    window.isSoundMuted = !window.isSoundMuted;
    localStorage.setItem("hangman_muted", window.isSoundMuted);
    updateSoundUI();
    if (!window.isSoundMuted) {
      safePlaySound("click", "playClick");
    }
  });
}

// 2. التحكم في شاشة البداية
const btn = document.getElementById("btn");
const start = document.getElementById("start");

if (btn && start) {
  btn.addEventListener("click", () => {
    safePlaySound("click", "playClick");
    start.style.opacity = "0";
    setTimeout(() => {
      start.style.display = "none";
    }, 500);
  });
}

// 3. توليد أحرف لوحة المفاتيح
const CharactersEnglish = "abcdefghijklmnopqrstuvwxyz";
const CharactersArray = Array.from(CharactersEnglish);
const BoxCharacters = document.querySelector(".letters");

if (BoxCharacters) {
  BoxCharacters.innerHTML = "";
  CharactersArray.forEach(character => {
    let Span = document.createElement("span");
    Span.appendChild(document.createTextNode(character));
    Span.className = "box-character";
    BoxCharacters.appendChild(Span);
  });
}

// 4. قاموس الكلمات مع تلميح مخصص لكل كلمة (تمت زيادة الفئات والكلمات بالكامل)
const Category = {
  people: [
    { word: "Einstein", hint: "E=mc² physicist" },
    { word: "Shakespeare", hint: "Romeo & Juliet playwright" },
    { word: "Newton", hint: "Gravity scientist" },
    { word: "Tesla", hint: "AC electricity inventor" },
    { word: "Da Vinci", hint: "Painted Mona Lisa" },
    { word: "Marie Curie", hint: "Radioactivity pioneer" },
    { word: "Steve Jobs", hint: "Apple co-founder" },
    { word: "Cleopatra", hint: "Queen of ancient Egypt" },
    { word: "Gandhi", hint: "Nonviolent peace leader" },
    { word: "Columbus", hint: "Explored America in 1492" },
    { word: "Lincoln", hint: "US President during Civil War" },
    { word: "Aristotle", hint: "Ancient Greek philosopher" },
    { word: "Beethoven", hint: "Deaf classical composer" },
    { word: "Mozart", hint: "Prodigy classical composer" },
    { word: "Edison", hint: "Inventor of the light bulb" },
    { word: "Darwin", hint: "Theory of evolution scientist" },
    { word: "Picasso", hint: "Famous Spanish cubist painter" },
    { word: "Hawking", hint: "Theoretical black hole physicist" },
    { word: "Mandela", hint: "Anti-apartheid South African leader" },
    { word: "Marco Polo", hint: "Famous silk road explorer" },
    { word: "Galileo", hint: "Father of modern observational astronomy" },
    { word: "Bill Gates", hint: "Microsoft co-founder & philanthropist" },
    { word: "Napoleon", hint: "French emperor & military commander" },
    { word: "Socrates", hint: "Foundational classical Greek philosopher" },
    { word: "Neil Armstrong", hint: "First human to walk on the Moon" },
    { word: "Oprah", hint: "Famous talk show host and media mogul" },
    { word: "Alexander", hint: "Ancient Macedonian conqueror" },
    { word: "Walt Disney", hint: "Creator of Mickey Mouse & animation pioneer" },
    { word: "Wright Brothers", hint: "Inventors of the first motor airplane" },
    { word: "Churchill", hint: "British Prime Minister during WWII" }
  ],
  country: [
    { word: "Egypt", hint: "Land of the Pyramids" },
    { word: "Brazil", hint: "Famous for Samba & Amazon" },
    { word: "Japan", hint: "Land of the Rising Sun" },
    { word: "Canada", hint: "Famous for maple leaf" },
    { word: "Australia", hint: "Home of Kangaroos" },
    { word: "France", hint: "Eiffel Tower nation" },
    { word: "Germany", hint: "Famous for fast cars" },
    { word: "Italy", hint: "Home of pizza & pasta" },
    { word: "India", hint: "Home of the Taj Mahal" },
    { word: "Switzerland", hint: "Famous for Alps & chocolate" },
    { word: "Mexico", hint: "Famous for tacos and Aztecs" },
    { word: "Russia", hint: "Largest country in the world" },
    { word: "China", hint: "Great Wall nation" },
    { word: "Spain", hint: "Bullfighting & flamenco country" },
    { word: "Greece", hint: "Birthplace of democracy & Olympics" },
    { word: "Turkey", hint: "Connects Europe and Asia" },
    { word: "Argentina", hint: "Tango dance & Messi birthplace" },
    { word: "Morocco", hint: "North African gateway to Europe" },
    { word: "Norway", hint: "Fjords and northern lights country" },
    { word: "Thailand", hint: "Land of beautiful tropical beaches" },
    { word: "Portugal", hint: "Cristiano Ronaldo's home country" },
    { word: "Netherlands", hint: "Famous for windmills and tulips" },
    { word: "South Korea", hint: "Home of K-pop and Samsung" },
    { word: "Sweden", hint: "Home of IKEA and ABBA" },
    { word: "Saudi Arabia", hint: "Home of Mecca and vast deserts" },
    { word: "United Kingdom", hint: "Home of Big Ben and London Bridge" },
    { word: "South Africa", hint: "Nation of Table Mountain & safari" },
    { word: "Iceland", hint: "Land of fire and ice glaciers" },
    { word: "Singapore", hint: "Modern island nation of Asia" },
    { word: "New Zealand", hint: "Kiwi bird & Lord of the Rings scenery" }
  ],
  animal: [
    { word: "Lion", hint: "King of the jungle" },
    { word: "Elephant", hint: "Largest land mammal" },
    { word: "Giraffe", hint: "Tallest animal with a long neck" },
    { word: "Dolphin", hint: "Smart friendly sea mammal" },
    { word: "Cheetah", hint: "Fastest land animal" },
    { word: "Kangaroo", hint: "Hops and has a pouch" },
    { word: "Penguin", hint: "Black & white flightless bird" },
    { word: "Panda", hint: "Bamboo eating bear" },
    { word: "Eagle", hint: "High-flying bird of prey" },
    { word: "Octopus", hint: "Eight-armed sea creature" },
    { word: "Shark", hint: "Sharp-toothed ocean predator" },
    { word: "Monkey", hint: "Tree-climbing playful primate" },
    { word: "Frog", hint: "Jumping green amphibian" },
    { word: "Wolf", hint: "Wild pack-hunting canine" },
    { word: "Tiger", hint: "Large striped wild cat" },
    { word: "Camel", hint: "Desert animal with humps" },
    { word: "Bear", hint: "Large furry heavy mammal" },
    { word: "Whale", hint: "Largest animal in the ocean" },
    { word: "Owl", hint: "Nocturnal wise bird" },
    { word: "Koala", hint: "Eucalyptus-loving fuzzy marsupial" },
    { word: "Flamingo", hint: "Tall pink wading bird" },
    { word: "Hippo", hint: "Heavy river-dwelling mammal" },
    { word: "Crocodile", hint: "Large aquatic reptile with sharp jaws" },
    { word: "Chameleon", hint: "Lizard that changes color" },
    { word: "Peacock", hint: "Bird with colorful fan feathers" },
    { word: "Jellyfish", hint: "Gelatinous stinging ocean creature" },
    { word: "Sloth", hint: "Slowest tree-moving mammal" },
    { word: "Zebra", hint: "Black and white striped horse" },
    { word: "Falcon", hint: "Speedy hunting raptor bird" },
    { word: "Walrus", hint: "Large arctic mammal with tusks" }
  ],
  programming: [
    { word: "JavaScript", hint: "The language of the web" },
    { word: "Python", hint: "Language named after a snake" },
    { word: "TypeScript", hint: "Strict typed superset of JS" },
    { word: "HTML", hint: "Web page structure language" },
    { word: "CSS", hint: "Web page styling language" },
    { word: "database", hint: "System to store user records" },
    { word: "compiler", hint: "Translates code to machine language" },
    { word: "variable", hint: "Container for storing data values" },
    { word: "algorithm", hint: "Step-by-step problem solver" },
    { word: "framework", hint: "React, Angular or Vue" },
    { word: "function", hint: "Reusable block of programming code" },
    { word: "boolean", hint: "True or false data type" },
    { word: "recursion", hint: "Function that calls itself" },
    { word: "array", hint: "Ordered list of items in code" },
    { word: "server", hint: "Computers that host web services" },
    { word: "git", hint: "Popular code version control system" },
    { word: "debug", hint: "Process of finding and fixing bugs" },
    { word: "API", hint: "Application programming interface" },
    { word: "loop", hint: "Repeats a block of code" },
    { word: "object", hint: "Key-value pair collection in JS" },
    { word: "React", hint: "Popular UI library built by Meta" },
    { word: "Docker", hint: "Containerization platform for apps" },
    { word: "NodeJS", hint: "JavaScript runtime on the server" },
    { word: "SQL", hint: "Query language for relational databases" },
    { word: "Cybersecurity", hint: "Protection of digital systems" },
    { word: "Encryption", hint: "Converting data into secure secret code" },
    { word: "JSON", hint: "Lightweight data-interchange format" },
    { word: "Linux", hint: "Open source operating system kernel" },
    { word: "Backend", hint: "Server-side logic of an app" },
    { word: "Frontend", hint: "User interface side of a web application" }
  ],
  movies: [
    { word: "Titanic", hint: "Sinking cruise ship movie" },
    { word: "Avatar", hint: "Blue alien planet movie" },
    { word: "Inception", hint: "Dream-within-a-dream movie" },
    { word: "Gladiator", hint: "Roman arena warrior movie" },
    { word: "Matrix", hint: "Red pill, blue pill movie" },
    { word: "Jaws", hint: "Giant killer shark movie" },
    { word: "Psycho", hint: "Creepy shower scene thriller" },
    { word: "Interstellar", hint: "Space & black hole movie" },
    { word: "Star Wars", hint: "Lightsabers & Force movie" },
    { word: "Jurassic Park", hint: "Cloned dinosaur island movie" },
    { word: "Frozen", hint: "Let It Go Disney animation" },
    { word: "Toy Story", hint: "Animated talking toys adventure" },
    { word: "Shrek", hint: "Green ogre fairy tale parody" },
    { word: "Casablanca", hint: "Classic wartime romance movie" },
    { word: "Godzilla", hint: "Giant radioactive lizard monster" },
    { word: "Skyfall", hint: "James Bond spy action movie" },
    { word: "Alien", hint: "Spaceship survival horror film" },
    { word: "Batman", hint: "Gotham vigilante hero movie" },
    { word: "Up", hint: "Floating balloon house animation" },
    { word: "Whiplash", hint: "Intense jazz drumming movie" },
    { word: "Oppenheimer", hint: "Atomic bomb physicist drama" },
    { word: "Aladdin", hint: "Genie in a magic lamp Disney film" },
    { word: "Spider Man", hint: "Peter Parker web-slinging hero" },
    { word: "Harry Potter", hint: "Wizard boy at Hogwarts school" },
    { word: "Avengers", hint: "Marvel superhero team-up blockbuster" },
    { word: "Finding Nemo", hint: "Lost clownfish ocean adventure" },
    { word: "The Godfather", hint: "Classic Italian mafia crime saga" },
    { word: "Moana", hint: "Polynesian ocean journey animation" },
    { word: "Terminator", hint: "Cyborg assassin from the future" },
    { word: "La La Land", hint: "Modern musical romance in Los Angeles" }
  ],
  sports: [
    { word: "Football", hint: "Kick ball into net" },
    { word: "Basketball", hint: "Shoot ball through hoop" },
    { word: "Tennis", hint: "Racket & yellow ball sport" },
    { word: "Cricket", hint: "Bat & ball with wickets" },
    { word: "Swimming", hint: "Racing through water" },
    { word: "Athletics", hint: "Running & jumping events" },
    { word: "Golf", hint: "Small ball into distant holes" },
    { word: "Boxing", hint: "Combat sport with padded gloves" },
    { word: "Baseball", hint: "Batting and running four bases" },
    { word: "Volleyball", hint: "Spiking a ball over a high net" },
    { word: "Rugby", hint: "Egg-shaped ball contact sport" },
    { word: "Karate", hint: "Japanese martial art of self defense" },
    { word: "Cycling", hint: "Racing on two wheels" },
    { word: "Hockey", hint: "Puck & stick ice or field game" },
    { word: "Skiing", hint: "Gliding over snow with poles" },
    { word: "Badminton", hint: "Hit a shuttlecock over net" },
    { word: "Marathon", hint: "Long-distance road run of 42km" },
    { word: "Gymnastics", hint: "Acrobatic balance and strength sport" },
    { word: "Surf", hint: "Riding ocean waves on a board" },
    { word: "Chess", hint: "The board game of minds" },
    { word: "Archery", hint: "Shooting arrows at a target bullseye" },
    { word: "Taekwondo", hint: "Korean kicking martial art" },
    { word: "Skateboarding", hint: "Riding and flipping a wooden deck" },
    { word: "Table Tennis", hint: "Ping pong with small paddles" },
    { word: "Fencing", hint: "Sword dueling sport with masks" },
    { word: "Wrestling", hint: "Grappling combat sport on a mat" },
    { word: "Snooker", hint: "Cue stick and colored balls table game" },
    { word: "Handball", hint: "Throwing ball into goal with hands" },
    { word: "Rowing", hint: "Boat racing using oars on water" },
    { word: "Bowling", hint: "Rolling heavy ball to knock down ten pins" }
  ],
  food: [
    { word: "Pizza", hint: "Flat dough with cheese & tomato" },
    { word: "Burger", hint: "Patty inside a sliced bun" },
    { word: "Sushi", hint: "Japanese raw fish & rice roll" },
    { word: "Chocolate", hint: "Sweet brown cacao treat" },
    { word: "Spaghetti", hint: "Long thin Italian pasta" },
    { word: "Ice Cream", hint: "Cold sweet frozen dairy dessert" },
    { word: "Sandwich", hint: "Fillings between two bread slices" },
    { word: "Salad", hint: "Bowl of mixed raw vegetables" },
    { word: "Pancake", hint: "Flat round cake with maple syrup" },
    { word: "Croissant", hint: "Flaky buttery crescent pastry" },
    { word: "Waffle", hint: "Grid-patterned crispy breakfast cake" },
    { word: "Steak", hint: "Premium thick slice of beef" },
    { word: "Soup", hint: "Warm liquid meal in a bowl" },
    { word: "Taco", hint: "Folded tortilla with Mexican filling" },
    { word: "Cheese", hint: "Dairy product made from milk" },
    { word: "Honey", hint: "Sweet gold liquid made by bees" },
    { word: "Donut", hint: "Fried dough ring with sweet glaze" },
    { word: "Lasagna", hint: "Layered pasta with meat and cheese" },
    { word: "Apple", hint: "Crisp sweet red or green fruit" },
    { word: "Popcorn", hint: "Puffed corn kernels eaten at movies" },
    { word: "Avocado", hint: "Green creamy superfood fruit" },
    { word: "Omelette", hint: "Beaten eggs fried in a pan" },
    { word: "Shawarma", hint: "Middle Eastern spiced meat wrap" },
    { word: "Mango", hint: "Juicy tropical sweet fruit" },
    { word: "Kebab", hint: "Grilled skewer meat dish" },
    { word: "Cheesecake", hint: "Creamy rich dessert on graham crust" },
    { word: "Biryani", hint: "Spiced rice dish with chicken or lamb" },
    { word: "French Fries", hint: "Deep fried golden potato strips" },
    { word: "Hummus", hint: "Middle Eastern chickpea and tahini dip" },
    { word: "Strawberry", hint: "Red heart-shaped berry with seeds" }
  ],
  space: [
    { word: "Galaxy", hint: "System of billions of stars" },
    { word: "Astronaut", hint: "Space traveler" },
    { word: "Telescope", hint: "Tool to view distant stars" },
    { word: "Gravity", hint: "Force pulling objects to Earth" },
    { word: "Asteroid", hint: "Space rock orbiting the sun" },
    { word: "Nebula", hint: "Cloud of cosmic dust and gas" },
    { word: "Satellite", hint: "Orbiting signal transmitter" },
    { word: "Universe", hint: "All existing space and matter" },
    { word: "Supernova", hint: "Explosion of a dying star" },
    { word: "Meteorite", hint: "Space rock hitting Earth" },
    { word: "Eclipse", hint: "Moon blocking the sun's light" },
    { word: "Planet", hint: "Large body orbiting a star" },
    { word: "Comet", hint: "Icy rock with a glowing tail" },
    { word: "Orbit", hint: "Circular path of a satellite" },
    { word: "Jupiter", hint: "Largest gas giant planet" },
    { word: "Saturn", hint: "Planet famous for beautiful rings" },
    { word: "NASA", hint: "American government space agency" },
    { word: "Rocket", hint: "Vehicle launched into space" },
    { word: "Mercury", hint: "Closest planet to the Sun" },
    { word: "Crater", hint: "Bowl-shaped depression on Moon" },
    { word: "Milky Way", hint: "Our home spiral galaxy" },
    { word: "Black Hole", hint: "Region with gravity so strong light cannot escape" },
    { word: "Constellation", hint: "Pattern of stars forming a shape in the night sky" },
    { word: "Solar Flare", hint: "Sudden flash of increased sun brightness" },
    { word: "Light Year", hint: "Distance light travels in one year" },
    { word: "Mars", hint: "The red dusty planet" },
    { word: "Neptune", hint: "Distant blue gas giant planet" },
    { word: "Space Station", hint: "Habitable orbital laboratory for scientists" },
    { word: "Cosmos", hint: "The universe seen as a well-ordered whole" },
    { word: "Pluto", hint: "Famous icy dwarf planet" }
  ],
  technology: [
    { word: "Smartphone", hint: "Pocket computer with touch screen" },
    { word: "Robot", hint: "Programmable automated machine" },
    { word: "Internet", hint: "Global connected computer network" },
    { word: "Microchip", hint: "Tiny silicon circuit processing unit" },
    { word: "Bluetooth", hint: "Short-range wireless connectivity" },
    { word: "Drone", hint: "Unmanned flying aircraft with cameras" },
    { word: "Artificial Intelligence", hint: "Smart machine learning system" },
    { word: "Quantum", hint: "Advanced subatomic physics computing" },
    { word: "Virtual Reality", hint: "3D immersive headset experience" },
    { word: "Satellite", hint: "Orbiting communication hardware" },
    { word: "Hologram", hint: "3D light projection image" },
    { word: "Microphone", hint: "Audio input recording device" },
    { word: "Smartwatch", hint: "Wrist wearable fitness computer" },
    { word: "Supercomputer", hint: "Extremely fast high-performance machine" },
    { word: "Laser", hint: "Focused intense light beam" },
    { word: "Processor", hint: "CPU brain of electronic devices" },
    { word: "Augmented Reality", hint: "Digital overlay on the real world" },
    { word: "Automaton", hint: "Self-operating mechanical device" },
    { word: "Biometrics", hint: "Fingerprint or facial recognition security" },
    { word: "Fiber Optics", hint: "High-speed light transmission cables" }
  ],
  gaming: [
    { word: "Minecraft", hint: "Block-building survival sandbox game" },
    { word: "Super Mario", hint: "Nintendo plumber jumping adventure" },
    { word: "Playstation", hint: "Popular Sony gaming console" },
    { word: "Pokemon", hint: "Catching creature battle game" },
    { word: "Fortnite", hint: "Battle Royale game with building & dancing" },
    { word: "Zelda", hint: "Link's epic fantasy hero adventure" },
    { word: "Pacman", hint: "Yellow dot-eating arcade classic" },
    { word: "Tetris", hint: "Falling geometric puzzle blocks game" },
    { word: "Joystick", hint: "Handheld arcade controller stick" },
    { word: "Xbox", hint: "Microsoft gaming home console" },
    { word: "Resident Evil", hint: "Zombie survival horror series" },
    { word: "Grand Theft Auto", hint: "Open-world crime action game series" },
    { word: "Overwatch", hint: "Hero team-based multiplayer shooter" },
    { word: "Roblox", hint: "User-created multiplayer game platform" },
    { word: "Sonic", hint: "Fast blue hedgehog platformer" },
    { word: "God of War", hint: "Kratos mythic action adventure" },
    { word: "Call of Duty", hint: "First-person military shooter franchise" },
    { word: "Street Fighter", hint: "Classic 1v1 arcade fighting game" },
    { word: "Cyberpunk", hint: "Futuristic sci-fi RPG in Night City" },
    { word: "Elden Ring", hint: "Challenging fantasy open-world RPG" }
  ]
};

// 5. إدارة الإحصائيات (النقاط، الفوز، السلسلة المتتالية) وتخزينها
let userWins = parseInt(localStorage.getItem("hangman_wins") || "0");
let userStreak = parseInt(localStorage.getItem("hangman_streak") || "0");
let userScore = parseInt(localStorage.getItem("hangman_score") || "0");

const winsCountEl = document.getElementById("wins-count");
const streakCountEl = document.getElementById("streak-count");
const scoreCountEl = document.getElementById("score-count");

function updateStatsUI() {
  if (winsCountEl) winsCountEl.textContent = userWins;
  if (streakCountEl) streakCountEl.textContent = userStreak;
  if (scoreCountEl) scoreCountEl.textContent = userScore;
}
updateStatsUI();

// 6. إدارة مستويات الصعوبة (Easy / Hard)
let currentDifficulty = localStorage.getItem("hangman_difficulty") || "easy";
let maxLives = currentDifficulty === "hard" ? 6 : 9;

const diffEasyBtn = document.getElementById("diff-easy-btn");
const diffHardBtn = document.getElementById("diff-hard-btn");
const startLivesCount = document.getElementById("start-lives-count");
const startLivesInfo = document.getElementById("start-lives-info");
const difficultySelectEl = document.getElementById("difficulty-select");

function setDifficulty(diff, shouldReload = false) {
  currentDifficulty = diff;
  maxLives = currentDifficulty === "hard" ? 6 : 9;
  localStorage.setItem("hangman_difficulty", diff);

  if (difficultySelectEl) difficultySelectEl.value = diff;

  if (diffEasyBtn && diffHardBtn) {
    if (diff === "easy") {
      diffEasyBtn.classList.add("active");
      diffHardBtn.classList.remove("active");
      if (startLivesCount) startLivesCount.textContent = "9 فرص";
      if (startLivesInfo) startLivesInfo.innerHTML = "لديك <span>9 فرص</span> خاطئة للتخمين مع وجود التلميح.";
    } else {
      diffHardBtn.classList.add("active");
      diffEasyBtn.classList.remove("active");
      if (startLivesCount) startLivesCount.textContent = "6 فرص";
      if (startLivesInfo) startLivesInfo.innerHTML = "لديك <span>6 فرص</span> خاطئة للتخمين وبدون تلميح.";
    }
  }

  if (shouldReload) {
    location.reload();
  }
}

setDifficulty(currentDifficulty);

if (diffEasyBtn) {
  diffEasyBtn.addEventListener("click", () => setDifficulty("easy"));
}
if (diffHardBtn) {
  diffHardBtn.addEventListener("click", () => setDifficulty("hard"));
}
if (difficultySelectEl) {
  difficultySelectEl.value = currentDifficulty;
  difficultySelectEl.addEventListener("change", (e) => {
    setDifficulty(e.target.value, true);
  });
}

// 7. اختيار الكلمة بشكل عشوائي تماماً من كافة الفئات
const allCategoryKeys = Object.keys(Category);
let selectedCategoryKey = allCategoryKeys[Math.floor(Math.random() * allCategoryKeys.length)];
let RandomCategory = Category[selectedCategoryKey];
let RandomNumberTow = Math.floor(Math.random() * RandomCategory.length);
let selectedItem = RandomCategory[RandomNumberTow];
let RandomCategoryValue = selectedItem.word.toUpperCase();
let WordHint = selectedItem.hint;

// عرض اسم الفئة المختارة عشوائياً في الـ UI
const categoryNamesMap = {
  people: "Famous People",
  country: "Countries",
  animal: "Animals",
  programming: "Programming",
  movies: "Movies",
  sports: "Sports",
  food: "Food",
  space: "Space",
  technology: "Technology",
  gaming: "Gaming"
};
const categoryDisplayName = categoryNamesMap[selectedCategoryKey] || (selectedCategoryKey.charAt(0).toUpperCase() + selectedCategoryKey.slice(1));
const categoryDisplayEl = document.getElementById("current-category-name");
if (categoryDisplayEl) {
  categoryDisplayEl.textContent = categoryDisplayName;
}

// إخفاء أو إظهار التلميح بناءً على مستوى الصعوبة
const hintBoxContainer = document.getElementById("hint-box-container");
const hintBoxDisplay = document.getElementById("word-hint");

if (currentDifficulty === "hard") {
  if (hintBoxContainer) {
    hintBoxContainer.style.display = "none";
  }
} else {
  if (hintBoxContainer) {
    hintBoxContainer.style.display = "inline-block";
  }
  if (hintBoxDisplay) {
    hintBoxDisplay.textContent = WordHint;
  }
}

// 8. توليد مربعات تخمين الكلمة
let ContianerCharactersGuess = document.querySelector(".word-guess");
let ArrayCharactersGuess = Array.from(RandomCategoryValue);

if (ContianerCharactersGuess) {
  ContianerCharactersGuess.innerHTML = "";
  ArrayCharactersGuess.forEach(character => {
    let GuessSpan = document.createElement("span");
    if (character === ' ') {
      GuessSpan.classList.add("with-space");
    }
    ContianerCharactersGuess.appendChild(GuessSpan);
  });
}

// جلب العناصر بعد توليدها
let SpanGuess = document.querySelectorAll(".word-guess span");
let HangMan = document.querySelector(".hangman");

// 9. حساب وعرض عدد حروف الكلمة والفرص
const lettersCountValue = RandomCategoryValue.replace(/\s/g, '').length;
const lettersCountDisplay = document.getElementById("word-letters-count");
if (lettersCountDisplay) {
  lettersCountDisplay.textContent = lettersCountValue;
}

let Wrong = 0;
const remainingLivesDisplay = document.getElementById("remaining-lives");
if (remainingLivesDisplay) {
  remainingLivesDisplay.textContent = maxLives - Wrong;
}

// 10. المؤقت الزمني للجولة (60 ثانية)
let timeLeft = 60;
const timerValueEl = document.getElementById("timer-value");
const timerBoxEl = document.getElementById("timer-box");
let isGameOver = false;

let gameTimer = setInterval(() => {
  if (isGameOver) {
    clearInterval(gameTimer);
    return;
  }
  timeLeft--;
  if (timerValueEl) {
    timerValueEl.textContent = `${timeLeft}s`;
  }
  if (timeLeft <= 10 && timerBoxEl) {
    timerBoxEl.style.color = "#ef4444";
    timerBoxEl.style.borderColor = "#ef4444";
  }
  if (timeLeft <= 0) {
    clearInterval(gameTimer);
    EndGame(false, "انتهى الوقت المحدد للمحاولة!");
  }
}, 1000);

// دالة رسم المشنقة بناء على الصعوبة
function updateHangmanDraw(wrongCount) {
  if (!HangMan) return;
  if (currentDifficulty === "hard") {
    // رسم المشنقة بـ 6 خطوات للوصول للمكتمل (wrong-9)
    const hardMapping = {
      1: [1, 2, 3], // القواعد
      2: [4],       // الحبل
      3: [5, 6],    // الرأس والأنشوطة
      4: [7],       // الجسم
      5: [8],       // اليدان
      6: [9]        // القدمان
    };
    const steps = hardMapping[wrongCount] || [];
    steps.forEach(s => HangMan.classList.add(`wrong-${s}`));
  } else {
    HangMan.classList.add(`wrong-${wrongCount}`);
  }
}

// 11. الاستماع لنقرات الأحرف وحساب الفوز والخسارة
document.addEventListener('click', (e) => {
  if (isGameOver) return;
  let Status = false;

  if (e.target.className === "box-character" && !e.target.classList.contains("clicked")) {
    e.target.classList.add("clicked");

    let ClickedCharacters = e.target.innerHTML.toUpperCase();
    let WordCharacters = Array.from(RandomCategoryValue.toUpperCase());

    WordCharacters.forEach((character, Wordindex) => {
      if (character == ClickedCharacters) {
        Status = true;
        SpanGuess.forEach((guess, guessindex) => {
          if (Wordindex === guessindex) {
            guess.innerHTML = ClickedCharacters;
            guess.classList.add("revealed");
          }
        });
      }
    });

    if (Status !== true) {
      Wrong++;
      updateHangmanDraw(Wrong);

      if (remainingLivesDisplay) {
        remainingLivesDisplay.textContent = maxLives - Wrong;
      }

      safePlaySound("fail", "playWrongLetter");

      if (Wrong === maxLives) {
        EndGame(false);
      }
    } else {
      safePlaySound("rr", "playCorrectLetter");
      checkWinState();
    }
  }
});

// التحقق من حالة الفوز
function checkWinState() {
  const lettersToGuess = document.querySelectorAll(".word-guess span:not(.with-space)");
  const isWon = Array.from(lettersToGuess).every(span => span.innerHTML !== "");

  if (isWon) {
    EndGame(true);
  }
}

// دالة إطلاق الاحتفال بالقصاصات الورقية (Confetti)
function triggerConfetti() {
  const colors = ['#10b981', '#fbbf24', '#3b82f6', '#ec4899', '#8b5cf6'];
  for (let i = 0; i < 60; i++) {
    const particle = document.createElement("div");
    particle.className = "confetti-particle";
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `-20px`;
    particle.style.width = `${Math.random() * 8 + 6}px`;
    particle.style.height = `${Math.random() * 14 + 8}px`;
    particle.style.animationDuration = `${Math.random() * 2 + 1.5}s`;
    particle.style.animationDelay = `${Math.random() * 0.3}s`;
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 3500);
  }
}

// 12. دالة إنهاء اللعبة (بدون أيقونات)
function EndGame(isVictory, customDesc = null) {
  if (isGameOver) return;
  isGameOver = true;
  clearInterval(gameTimer);

  if (BoxCharacters) {
    BoxCharacters.classList.add("finished");
  }

  // تحديث الإحصائيات والتخزين المحلي
  if (isVictory) {
    userWins++;
    userStreak++;
    userScore += 100 + (maxLives - Wrong) * 15 + timeLeft * 2;
    triggerConfetti();
  } else {
    userStreak = 0;
  }
  localStorage.setItem("hangman_wins", userWins);
  localStorage.setItem("hangman_streak", userStreak);
  localStorage.setItem("hangman_score", userScore);
  updateStatsUI();

  // إنشاء معتم الخلفية
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  document.body.appendChild(overlay);

  // إنشاء البوب اب المنبثق
  const popup = document.createElement("div");
  popup.className = `WordCorrect ${isVictory ? "win" : "lose"}`;

  const title = isVictory ? "رائع! لقد فزت" : "للأسف! لقد خسرت";
  const description = customDesc ? customDesc : (isVictory 
    ? "أحسنت التخمين ونجحت في إنقاذ الرجل المشنوق بذكائك!" 
    : "نفدت محاولاتك واكتمل رسم المشنقة. حاول مرة أخرى!");

  popup.innerHTML = `
    <div class="modal-title">${title}</div>
    <div class="modal-desc" dir="rtl">${description}</div>
    <div class="modal-word-display">
      <div class="modal-word-title">الكلمة الصحيحة كانت:</div>
      <div class="modal-word-value">${RandomCategoryValue}</div>
    </div>
  `;

  const button = document.createElement("button");
  button.className = "restart";
  button.appendChild(document.createTextNode("جولة جديدة • Play Again"));
  popup.appendChild(button);

  document.body.appendChild(popup);

  if (isVictory) {
    safePlaySound("rr", "playFunnyWinSound");
  } else {
    safePlaySound("maniacal", "playFunnyLossSound");
  }

  button.addEventListener("click", () => {
    safePlaySound("click", "playClick");
    location.reload();
  });
}

