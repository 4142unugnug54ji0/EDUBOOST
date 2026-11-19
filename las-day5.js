(() => {
  const pageMatch = location.pathname.match(/quarter([1-4])week([1-8])_las\.html$/i);
  if (!pageMatch) return;

  const quarter = Number(pageMatch[1]);
  const week = Number(pageMatch[2]);
  if (quarter === 1 && week === 1) return;

  const activities = {
    "1-2": {
      title: "Vowel Valley",
      topic: "Short vowel sounds",
      mode: "build",
      rounds: [
        ["cat", "Build the short-a word for a pet that says meow."],
        ["bed", "Build the short-e word where you sleep."],
        ["pig", "Build the short-i word for a farm animal."],
        ["hot", "Build the short-o word that means very warm."]
      ]
    },
    "1-3": {
      title: "Rhyme Time",
      topic: "Rhyming words",
      mode: "rhyme",
      rounds: [
        ["Which word rhymes with cat?", "hat", "sun", "top", "bed"],
        ["Which word rhymes with cake?", "lake", "cup", "fish", "bed"],
        ["Which word rhymes with pen?", "hen", "map", "dog", "sit"],
        ["Which word rhymes with ball?", "wall", "tree", "book", "kite"]
      ]
    },
    "1-4": {
      title: "Sentence Builder",
      topic: "Complete a sentence with the right word",
      mode: "sentence",
      rounds: [
        ["The baby ___ milk.", "drinks", "blue", "under", "happy"],
        ["The bird can ___.", "fly", "soft", "table", "green"],
        ["I read a ___.", "book", "jump", "quickly", "yellow"],
        ["The sun is ___.", "bright", "run", "chair", "inside"]
      ]
    },
    "1-5": {
      title: "Short-i Word Garden",
      topic: "CVC words with short i",
      mode: "build",
      rounds: [
        ["sit", "Build a short-i word that means to rest on a chair."],
        ["fin", "Build the body part a fish uses to swim."],
        ["lip", "Build the word for the edge of your mouth."],
        ["win", "Build the word that means to be first in a game."]
      ]
    },
    "1-6": {
      title: "Sound Starter",
      topic: "Beginning sounds and word reading",
      mode: "build",
      rounds: [
        ["sun", "Build the word that starts with /s/ and shines in the sky."],
        ["map", "Build the word that starts with /m/ and shows places."],
        ["fox", "Build the word that starts with /f/ and names a wild animal."],
        ["hen", "Build the word that starts with /h/ and is a farm bird."]
      ]
    },
    "1-7": {
      title: "First, Next, Last",
      topic: "Sequence words and problem solving",
      mode: "sequence",
      rounds: [
        ["To make juice, what should you do first?", "Wash the fruit.", "Pour juice into a cup.", "Drink the juice.", "Put the cup away."],
        ["After washing the fruit, what comes next?", "Cut the fruit safely.", "Drink the juice.", "Put the cup away.", "Wash the cup."],
        ["After cutting the fruit, what should you do?", "Squeeze the fruit.", "Pick more fruit.", "Wash your shoes.", "Set the table for dinner."],
        ["What is the last step before enjoying juice?", "Pour it into a cup.", "Wash the fruit.", "Choose the fruit.", "Cut the fruit."]
      ]
    },
    "1-8": {
      title: "Juice-Making Mission",
      topic: "Finding the key idea and ordering steps",
      mode: "sequence",
      rounds: [
        ["Which step starts the juice-making directions?", "Wash the fruit.", "Pour the juice.", "Serve the drink.", "Clean the table."],
        ["After washing, what should you do?", "Cut the fruit.", "Drink the juice.", "Put away the cup.", "Pick up a book."],
        ["What do you do after preparing the fruit?", "Squeeze it for juice.", "Wash it again tomorrow.", "Serve an empty cup.", "Plant it in a pot."],
        ["Which step finishes the directions?", "Pour and serve the juice.", "Wash the fruit.", "Cut the fruit.", "Find a clean knife."]
      ]
    },
    "2-1": {
      title: "Polite Words Quest",
      topic: "Polite expressions at school",
      mode: "choice",
      rounds: [
        ["Your teacher gives you a book. What do you say?", "Thank you.", "Go away.", "Give me another.", "I do not care."],
        ["You need to borrow a pencil. What do you say?", "May I borrow a pencil, please?", "Give it now.", "That is mine.", "Move away."],
        ["You bump into a classmate by mistake. What do you say?", "I am sorry.", "You are in my way.", "Be quiet.", "Give me that."],
        ["You want to join a game. What is a polite question?", "May I play with you, please?", "I am taking over.", "Stop playing now.", "You cannot play."]
      ]
    },
    "2-2": {
      title: "School Poem Rhymes",
      topic: "The School I Love and rhyming words",
      mode: "rhyme",
      rounds: [
        ["Which word rhymes with school?", "rule", "desk", "bag", "class"],
        ["Which word rhymes with play?", "day", "book", "pencil", "chair"],
        ["Which word rhymes with friend?", "end", "read", "learn", "school"],
        ["Which word rhymes with class?", "pass", "bell", "book", "write"]
      ]
    },
    "2-3": {
      title: "Sports Day Story Sleuth",
      topic: "Sports Day story words and rhymes",
      mode: "story",
      rounds: [
        ["What event were Carlo and Mara excited about?", "Sports Day", "A field trip", "A birthday party", "A cooking class"],
        ["What did they do during the race?", "They ran.", "They painted.", "They planted seeds.", "They read a map."],
        ["Which pair rhymes?", "race / face", "yard / game", "cone / line", "play / book"],
        ["Where did they eat ice cream?", "Under a tree.", "Inside a bus.", "Beside the ocean.", "In the library."]
      ]
    },
    "2-4": {
      title: "Long-A Word Rocket",
      topic: "Long-A words",
      mode: "build",
      rounds: [
        ["cake", "Build a long-a word that is a sweet treat."],
        ["game", "Build a long-a word you can play."],
        ["lake", "Build a long-a word for a large body of water."],
        ["name", "Build a long-a word that tells who someone is."]
      ]
    },
    "2-5": {
      title: "Action Word Safari",
      topic: "Action words",
      mode: "sort",
      categories: ["Action word", "Not an action word"],
      rounds: [
        ["The children run.", "Action word"],
        ["A quiet blue book.", "Not an action word"],
        ["Mina sings a song.", "Action word"],
        ["The round table.", "Not an action word"]
      ]
    },
    "2-6": {
      title: "Sentence or Not?",
      topic: "Sentences and non-sentences",
      mode: "sort",
      categories: ["Complete sentence", "Not a sentence"],
      rounds: [
        ["The children read books.", "Complete sentence"],
        ["under the big table", "Not a sentence"],
        ["My friend likes stories.", "Complete sentence"],
        ["running very quickly", "Not a sentence"]
      ]
    },
    "2-7": {
      title: "Toothbrushing Steps",
      topic: "Action words and sequencing steps",
      mode: "sequence",
      rounds: [
        ["What do you do first when brushing your teeth?", "Put toothpaste on the brush.", "Rinse your mouth.", "Put the toothbrush away.", "Go to sleep."],
        ["After adding toothpaste, what comes next?", "Brush your teeth.", "Put the brush away.", "Eat a snack.", "Wash your hands tomorrow."],
        ["After brushing, what should you do?", "Rinse your mouth.", "Add more toothpaste to the tube.", "Put on your shoes.", "Eat the toothbrush."],
        ["What is the last step?", "Rinse and put the toothbrush away.", "Find a toothbrush.", "Add toothpaste.", "Start brushing."]
      ]
    },
    "2-8": {
      title: "Telling Sentence Fix-It",
      topic: "Telling sentences and procedural text",
      mode: "sentence",
      rounds: [
        ["Put the words in order: learn in / we / school", "We learn in school.", "School we in learn.", "In school learn we?", "We school learn in."],
        ["Put the words in order: in class / write / I", "I write in class.", "Write class I in.", "In I class write.", "I class in write?"],
        ["Choose the telling sentence.", "Teachers help us learn.", "Help us teachers?", "Learn help teachers us!", "Us teachers learn help."],
        ["Which sentence tells something?", "The bell rings at school.", "Does the bell ring?", "Ring the bell!", "At school the."]
      ]
    },
    "3-1": {
      title: "Classroom Object Finder",
      topic: "Reading for details and school objects",
      mode: "choice",
      rounds: [
        ["Which object do you write with?", "Pencil", "Pillow", "Spoon", "Ball"],
        ["Which object can hold your books?", "Bag", "Plate", "Shoe", "Soap"],
        ["Which object can you read?", "Book", "Cup", "Broom", "Hat"],
        ["Which object helps you see the time?", "Clock", "Crayon", "Lunchbox", "Ruler"]
      ]
    },
    "3-2": {
      title: "Name Sorter",
      topic: "Common and proper nouns",
      mode: "sort",
      categories: ["Common noun", "Proper noun"],
      rounds: [
        ["hospital", "Common noun"],
        ["January", "Proper noun"],
        ["river", "Common noun"],
        ["Maria", "Proper noun"]
      ]
    },
    "3-3": {
      title: "Whose Is It?",
      topic: "Possessive pronouns",
      mode: "choice",
      rounds: [
        ["The bag belongs to me. It is ___ bag.", "my", "his", "their", "our"],
        ["The kite belongs to Ben. It is ___ kite.", "his", "her", "my", "our"],
        ["The doll belongs to Ana. It is ___ doll.", "her", "his", "their", "my"],
        ["The books belong to us. They are ___ books.", "our", "my", "his", "her"]
      ]
    },
    "3-4": {
      title: "Action and Feeling Detective",
      topic: "Action words, ending sounds, and feelings",
      mode: "choice",
      rounds: [
        ["Find the action word: He eats his meal.", "eats", "his", "meal", "the"],
        ["Find the action word: She jumps high.", "jumps", "she", "high", "the"],
        ["Which word names a feeling?", "happy", "run", "pencil", "under"],
        ["Which word tells an action?", "laugh", "yellow", "soft", "garden"]
      ]
    },
    "3-5": {
      title: "Describing Word Workshop",
      topic: "Describing words and CVCC words",
      mode: "choice",
      rounds: [
        ["Choose the describing word: a ___ drum", "loud", "jump", "from", "desk"],
        ["Choose the describing word: a ___ lamp", "bright", "clap", "tent", "milk"],
        ["Which word describes the cake?", "sweet", "help", "crust", "hand"],
        ["Which word has the CVCC pattern?", "lamp", "cake", "go", "she"]
      ]
    },
    "3-6": {
      title: "Sentence Signal Sort",
      topic: "CCVC words, sentences, commands, and requests",
      mode: "sort",
      categories: ["Complete sentence", "Not a sentence"],
      rounds: [
        ["Please close the door.", "Complete sentence"],
        ["the blue flag", "Not a sentence"],
        ["We clap for the band.", "Complete sentence"],
        ["under the desk", "Not a sentence"]
      ]
    },
    "3-7": {
      title: "Sequence Story Path",
      topic: "Sequence words and problem and solution",
      mode: "sequence",
      rounds: [
        ["Which word tells what happens at the beginning?", "First", "Finally", "Yesterday", "Never"],
        ["Which word can show the next event?", "Next", "Before", "Last", "Never"],
        ["Which word signals the ending?", "Finally", "First", "Soon", "Before"],
        ["A plant is dry. What is a helpful solution?", "Water the plant.", "Hide the watering can.", "Pull off its leaves.", "Put it in a dark box."]
      ]
    },
    "3-8": {
      title: "Word Link Challenge",
      topic: "Describing and connecting words",
      mode: "choice",
      rounds: [
        ["Sarah buys ___ milk.", "fresh", "and", "while", "because"],
        ["The cleaner walks ___ the driver sits.", "while", "brown", "fresh", "blue"],
        ["The gardener sees a ___ bird.", "brown", "then", "and", "because"],
        ["The bird flies, ___ the butterfly lands.", "and", "soft", "tiny", "green"]
      ]
    },
    "4-1": {
      title: "Living Things Sort",
      topic: "Humans, animals, and plants",
      mode: "sort",
      categories: ["Human", "Animal", "Plant"],
      rounds: [
        ["child", "Human"],
        ["puppy", "Animal"],
        ["sunflower", "Plant"],
        ["butterfly", "Animal"]
      ]
    },
    "4-2": {
      title: "Story Clue Collector",
      topic: "Reading a short story for details",
      mode: "story",
      rounds: [
        ["Who wanted to help the people in the story?", "Bathala", "A farmer", "A sailor", "A teacher"],
        ["What did Bathala send?", "Rain", "A kite", "A boat", "A drum"],
        ["What should you look for to find where a story happens?", "Place clues", "The last letter", "The title color", "The page number"],
        ["What helps you understand why a character acts?", "Story details", "A random guess", "The book cover only", "The alphabet"]
      ]
    },
    "4-3": {
      title: "CCVC Word Builder",
      topic: "CCVC words and spelling",
      mode: "build",
      rounds: [
        ["clap", "Build the CCVC word for hands making a sound."],
        ["frog", "Build the CCVC word for a jumping green animal."],
        ["flag", "Build the CCVC word that can wave on a pole."],
        ["drum", "Build the CCVC word you can beat to make music."]
      ]
    },
    "4-4": {
      title: "Earth Helper Mission",
      topic: "Protecting the environment and problem solving",
      mode: "choice",
      rounds: [
        ["There is litter in the park. What is a helpful solution?", "Pick it up safely and use a bin.", "Throw more litter.", "Step on the flowers.", "Leave it beside the river."],
        ["Which action protects trees?", "Reuse paper.", "Break branches.", "Waste notebooks.", "Burn leaves."],
        ["Which is a VCV word?", "camel", "plant", "frog", "crust"],
        ["A friend feels sad after cleaning. What can you say?", "Thank you for helping Earth.", "You should stop caring.", "Make more litter.", "Do not help."]
      ]
    },
    "4-5": {
      title: "Lost Kitten Timeline",
      topic: "The Lost Kitten and sequence of events",
      mode: "sequence",
      rounds: [
        ["What should you identify first in a story timeline?", "What happened first.", "The final event.", "A detail from another story.", "The page color."],
        ["After the kitten is noticed missing, what should the family do?", "Look for the kitten.", "Forget about it.", "Close every window and leave.", "Start a new story."],
        ["What belongs after the search begins?", "Follow clues to find the kitten.", "Begin the story again.", "Hide the food.", "Stop looking immediately."],
        ["What tells how the story ends?", "The final event.", "The first setting only.", "A character's name.", "The book's cover."]
      ]
    },
    "4-6": {
      title: "Sentence or Command?",
      topic: "Sentences, questions, commands, and polite expressions",
      mode: "sort",
      categories: ["Complete sentence", "Not a sentence"],
      rounds: [
        ["The children clean the yard.", "Complete sentence"],
        ["Because it was dirty", "Not a sentence"],
        ["Please water the plants.", "Complete sentence"],
        ["under the green tree", "Not a sentence"]
      ]
    },
    "4-7": {
      title: "Bee-Smart Challenge",
      topic: "The World Needs Bees",
      mode: "story",
      rounds: [
        ["What do bees help plants do?", "Make seeds and fruit.", "Turn into rocks.", "Grow without sunlight.", "Move to another planet."],
        ["Where do many bees live together?", "In a hive.", "In a shoe.", "Under a desk.", "Inside a book."],
        ["Why are bees important to people?", "They help pollinate many plants.", "They paint flowers.", "They make rain clouds.", "They clean classrooms."],
        ["Which is a safe way to help bees?", "Grow flowers for them.", "Knock down a hive.", "Cover every flower.", "Chase them with a stick."]
      ]
    },
    "4-8": {
      title: "Plant Growth Journey",
      topic: "How plants grow and explanation words",
      mode: "sequence",
      rounds: [
        ["What should you plant in the soil?", "A seed.", "A stone.", "A paper clip.", "A toy car."],
        ["Which plant part grows down into the soil?", "Root.", "Flower.", "Fruit.", "Leaf."],
        ["Which plant part grows upward toward light?", "Stem.", "Root.", "Seed coat.", "Pebble."],
        ["What helps a young plant grow?", "Water and sunlight.", "Plastic and darkness.", "Candy and paint.", "A closed box."]
      ]
    }
  };

  const key = `${quarter}-${week}`;
  const activity = activities[key];
  if (!activity) {
    console.error(`Day 5 activity is not configured for Quarter ${quarter}, Week ${week}.`);
    return;
  }

  const tabs = document.querySelector(".tabs");
  const container = document.querySelector(".container");
  const existingParts = document.querySelectorAll(".part");
  if (!tabs || !container || !existingParts.length || document.getElementById("part5")) {
    console.error(`Unable to add Day 5 to Quarter ${quarter}, Week ${week}: LAS layout is incomplete.`);
    return;
  }
  if (typeof window.showPart !== "function") {
    console.error(`Unable to add Day 5 to Quarter ${quarter}, Week ${week}: showPart() is unavailable.`);
    return;
  }

  const existingTabCount = tabs.querySelectorAll("button").length;
  const lastTabLabel = tabs.querySelector("button:last-of-type")?.textContent || "";
  const partLabel = lastTabLabel.match(/\bPart\s+([A-Z])\b/i);
  const gameTabLabel = partLabel
    ? `Part ${String.fromCharCode(partLabel[1].toUpperCase().charCodeAt(0) + 1)}`
    : `Day ${existingTabCount + 1}`;

  const style = document.createElement("style");
  style.textContent = `
    body.edu-sidebar-page .edu-day5-part:not(.hidden) {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      min-height: 0;
    }

    body.edu-sidebar-page .edu-day5-part > .lesson.active {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      min-height: 0;
    }

    body.edu-sidebar-page .edu-day5-card {
      display: grid;
      grid-template-rows: auto minmax(0, 1fr) auto;
      gap: 10px;
      width: min(74%, 960px);
      min-width: 0;
      min-height: 0;
      margin: 8px auto 14px;
      padding: clamp(34px, 5vh, 44px) clamp(30px, 4vw, 44px) clamp(30px, 5vh, 42px);
      overflow: auto;
    }

    body.edu-sidebar-page .edu-day5-card [hidden] {
      display: none !important;
    }

    body.edu-sidebar-page .edu-day5-heading {
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
    }

    body.edu-sidebar-page .edu-day5-art {
      flex: 0 0 auto;
      width: clamp(54px, 10vh, 88px);
      height: clamp(54px, 10vh, 88px);
      border-radius: 18px;
      object-fit: cover;
      box-shadow: 0 4px 10px rgba(0,0,0,.18);
    }

    body.edu-sidebar-page .edu-day5-heading h2 {
      margin: 0;
      color: #2c4b65;
      font-size: clamp(20px, 3.5vh, 30px);
      font-weight: 800;
      line-height: 1.15;
    }

    body.edu-sidebar-page .edu-day5-heading p {
      margin: 4px 0 0;
      color: #5c4b2f;
      font-size: clamp(14px, 2.4vh, 18px);
      font-weight: 700;
      line-height: 1.25;
    }

    body.edu-sidebar-page .edu-day5-play {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 8px 16px;
      min-height: 0;
    }

    body.edu-sidebar-page .edu-day5-progress {
      grid-column: 1 / -1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      color: #34495e;
      font-size: clamp(13px, 2.2vh, 17px);
      font-weight: 800;
    }

    body.edu-sidebar-page .edu-day5-progress-track {
      flex: 1 1 auto;
      height: 10px;
      overflow: hidden;
      border-radius: 999px;
      background: #e1e6eb;
    }

    body.edu-sidebar-page .edu-day5-progress-fill {
      width: 0;
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, #42a5f5, #66bb6a);
      transition: width .25s ease;
    }

    body.edu-sidebar-page .edu-day5-prompt {
      grid-column: 1 / -1;
      margin: 0;
      color: #5c4b2f;
      font-size: clamp(18px, 3.2vh, 28px);
      font-weight: 800;
      line-height: 1.2;
      text-align: center;
    }

    body.edu-sidebar-page .edu-day5-choices {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
      min-width: 0;
    }

    body.edu-sidebar-page .edu-day5-dropzone {
      grid-column: 1 / -1;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 0;
      min-height: clamp(44px, 8vh, 64px);
      padding: 8px 14px;
      border: 3px dashed #69a9cf;
      border-radius: 14px;
      background: rgba(233, 247, 255, .82);
      color: #547186;
      font-size: clamp(15px, 2.5vh, 20px);
      font-weight: 800;
      text-align: center;
      transition: background .15s ease, border-color .15s ease, transform .15s ease;
    }

    body.edu-sidebar-page .edu-day5-dropzone.is-hover {
      border-color: #2e9b59;
      background: #e8f8ed;
      transform: scale(1.02);
    }

    body.edu-sidebar-page .edu-day5-choice {
      min-width: 0;
      min-height: clamp(38px, 7vh, 60px);
      padding: 8px 12px;
      border: 0;
      border-radius: 14px;
      background: linear-gradient(to bottom, #fff, #f5e4bc);
      color: #4f432e;
      font-family: inherit;
      font-size: clamp(15px, 2.6vh, 22px);
      font-weight: 800;
      line-height: 1.15;
      box-shadow: 0 4px 0 #d8c49a, 0 6px 12px rgba(0,0,0,.14);
      cursor: pointer;
      touch-action: none;
    }

    body.edu-sidebar-page .edu-day5-choice:hover {
      transform: translateY(-2px);
    }

    body.edu-sidebar-page .edu-day5-choice.is-dragging,
    body.edu-sidebar-page .edu-day5-letter.is-dragging {
      opacity: .4;
    }

    body.edu-sidebar-page .edu-day5-drag-ghost {
      position: fixed;
      z-index: 20000;
      pointer-events: none;
      opacity: .95;
      transform: scale(1.04);
    }

    body.edu-sidebar-page .edu-day5-feedback {
      grid-column: 1 / -1;
      min-height: 1.25em;
      margin: 0;
      color: #42623d;
      font-size: clamp(14px, 2.5vh, 19px);
      font-weight: 800;
      text-align: center;
    }

    body.edu-sidebar-page .edu-day5-feedback:empty {
      display: none;
    }

    body.edu-sidebar-page .edu-day5-letter-bank {
      grid-column: 1 / -1;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 7px;
    }

    body.edu-sidebar-page .edu-day5-letter {
      min-width: 38px;
      min-height: 38px;
      padding: 5px 9px;
      border: 0;
      border-radius: 10px;
      background: linear-gradient(#49b9ff, #1d79d9);
      color: white;
      font-size: 20px;
      font-weight: 900;
      box-shadow: 0 4px 0 #165ea9;
      cursor: pointer;
      touch-action: none;
    }

    body.edu-sidebar-page .edu-day5-built-word {
      grid-column: 1 / -1;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 6px;
      min-height: 1.4em;
      color: #284b63;
      font-size: clamp(20px, 3.4vh, 29px);
      font-weight: 900;
      text-align: center;
    }

    body.edu-sidebar-page .edu-day5-word-slot {
      display: flex;
      align-items: center;
      justify-content: center;
      width: clamp(36px, 6vh, 48px);
      height: clamp(36px, 6vh, 48px);
      border: 2px dashed #69a9cf;
      border-radius: 9px;
      background: #fff;
      color: #284b63;
      font-size: inherit;
      line-height: 1;
      cursor: pointer;
    }

    body.edu-sidebar-page .edu-day5-word-slot.is-hover {
      border-color: #2e9b59;
      background: #e8f8ed;
    }

    body.edu-sidebar-page .edu-day5-word-slot.is-filled {
      border-style: solid;
      border-color: #49a9e6;
    }

    body.edu-sidebar-page .edu-day5-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }

    body.edu-sidebar-page .edu-day5-points {
      color: #386641;
      font-size: clamp(16px, 2.7vh, 22px);
      font-weight: 900;
    }

    body.edu-sidebar-page .edu-day5-reset,
    body.edu-sidebar-page .edu-day5-award {
      min-height: 38px;
      padding: 7px 12px;
      border: 0;
      border-radius: 12px;
      background: linear-gradient(#4b6cb7, #34495e);
      color: #fff;
      font-size: 14px;
      font-weight: 800;
      cursor: pointer;
    }

    body.edu-sidebar-page .edu-day5-award {
      background: linear-gradient(#30b659, #1b8a45);
    }

    @media (orientation: landscape) and (max-height: 700px) {
      body.edu-sidebar-page .edu-day5-card {
        gap: 6px;
        padding: 36px clamp(40px, 4vw, 56px) 52px;
      }

      body.edu-sidebar-page .edu-day5-heading {
        gap: 10px;
      }

      body.edu-sidebar-page .edu-day5-play {
        gap: 5px 12px;
      }

      body.edu-sidebar-page .edu-day5-choice {
        min-height: 36px;
        padding: 6px 10px;
      }

      body.edu-sidebar-page .edu-day5-dropzone {
        min-height: 38px;
        padding: 5px 10px;
      }
    }

    @media (orientation: landscape) and (max-height: 450px) {
      body.edu-sidebar-page .edu-day5-card {
        gap: 4px;
        padding: 16px clamp(40px, 3.5vw, 48px) 24px;
      }

      body.edu-sidebar-page .edu-day5-art {
        width: 46px;
        height: 46px;
      }

      body.edu-sidebar-page .edu-day5-heading h2 {
        font-size: 18px;
      }

      body.edu-sidebar-page .edu-day5-heading p {
        margin-top: 2px;
        font-size: 12px;
      }

      body.edu-sidebar-page .edu-day5-progress {
        font-size: 12px;
      }

      body.edu-sidebar-page .edu-day5-play {
        gap: 3px 8px;
      }

      body.edu-sidebar-page .edu-day5-prompt {
        font-size: 16px;
      }

      body.edu-sidebar-page .edu-day5-choice {
        min-height: 28px;
        padding: 3px 8px;
        font-size: 14px;
      }

      body.edu-sidebar-page .edu-day5-choices {
        gap: 4px;
      }

      body.edu-sidebar-page .edu-day5-dropzone {
        min-height: 28px;
        padding: 2px 8px;
        font-size: 12px;
      }

      body.edu-sidebar-page .edu-day5-feedback {
        font-size: 12px;
      }

      body.edu-sidebar-page .edu-day5-letter {
        min-width: 30px;
        min-height: 30px;
        padding: 3px 7px;
        font-size: 16px;
      }

      body.edu-sidebar-page .edu-day5-word-slot {
        width: 30px;
        height: 30px;
      }

      body.edu-sidebar-page .edu-day5-points {
        font-size: 14px;
      }
    }
  `;
  document.head.appendChild(style);

  const tab = document.createElement("button");
  tab.type = "button";
  tab.textContent = `🎮 ${gameTabLabel}`;
  tab.setAttribute("aria-label", `Open ${gameTabLabel} mini-game`);
  tab.addEventListener("click", () => window.showPart(5, tab));
  tabs.appendChild(tab);

  const part = document.createElement("div");
  part.id = "part5";
  part.className = "part hidden edu-day5-part";
  part.setAttribute("data-day5-game", "");
  part.innerHTML = `
    <div class="lesson active">
      <div class="card edu-day5-card">
        <header class="edu-day5-heading">
          <img class="edu-day5-art" src="las-day5-assets/quarter-${quarter}-week-${week}.gif" alt="" aria-hidden="true">
          <div>
            <h2></h2>
            <p></p>
          </div>
        </header>
        <section class="edu-day5-play" aria-live="polite">
          <div class="edu-day5-progress">
            <span class="edu-day5-round"></span>
            <span class="edu-day5-progress-track"><span class="edu-day5-progress-fill"></span></span>
          </div>
          <p class="edu-day5-prompt"></p>
          <div class="edu-day5-dropzone" role="status"></div>
          <div class="edu-day5-choices"></div>
          <div class="edu-day5-built-word" hidden></div>
          <div class="edu-day5-letter-bank" hidden></div>
          <p class="edu-day5-feedback"></p>
        </section>
        <footer class="edu-day5-bottom">
          <strong class="edu-day5-points">Points: 0</strong>
          <button class="edu-day5-reset" type="button">Restart game</button>
          <button class="edu-day5-award" type="button" hidden>Award 10 points</button>
        </footer>
      </div>
    </div>
  `;
  const navButtons = container.querySelector(".nav-buttons");
  if (navButtons) container.insertBefore(part, navButtons);
  else container.appendChild(part);

  const game = part.querySelector(".edu-day5-card");
  const title = game.querySelector(".edu-day5-heading h2");
  const subtitle = game.querySelector(".edu-day5-heading p");
  const roundLabel = game.querySelector(".edu-day5-round");
  const progress = game.querySelector(".edu-day5-progress-fill");
  const prompt = game.querySelector(".edu-day5-prompt");
  const dropZone = game.querySelector(".edu-day5-dropzone");
  const choices = game.querySelector(".edu-day5-choices");
  const builtWord = game.querySelector(".edu-day5-built-word");
  const letterBank = game.querySelector(".edu-day5-letter-bank");
  const feedback = game.querySelector(".edu-day5-feedback");
  const points = game.querySelector(".edu-day5-points");
  const resetButton = game.querySelector(".edu-day5-reset");
  const awardButton = game.querySelector(".edu-day5-award");
  const rounds = activity.rounds;
  const rewardPrefix = `lasDay5Awarded_q${quarter}w${week}_`;
  const correctSound = new Audio("audio/correct.mp3");
  const wrongSound = new Audio("audio/wrong.mp3");
  correctSound.preload = "auto";
  wrongSound.preload = "auto";
  let roundIndex = 0;
  let builtLetters = [];
  let buildWord = "";
  let completed = false;
  let busy = false;
  let activeDrag = null;
  let suppressClick = false;

  title.textContent = activity.title;
  subtitle.textContent = activity.topic;

  const playAnswerSound = audio => {
    audio.pause();
    audio.currentTime = 0;
    audio.play().catch(error => {
      console.error("Unable to play the Day 5 answer sound:", error);
    });
  };

  const randomize = values => {
    const shuffled = [...values];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const displayPoints = () => {
    points.textContent = `Points: ${completed ? 10 : 0}`;
    awardButton.hidden = true;
    if (!completed || localStorage.getItem("studentLoggedIn") === "true") return;
    if (typeof window.eduIsTeacherLoggedIn !== "function") {
      console.error("Unable to verify the teacher session for Day 5 points.");
      feedback.textContent = "The teacher session could not be verified.";
      return;
    }
    window.eduIsTeacherLoggedIn().then(isTeacher => {
      awardButton.hidden = !completed || !isTeacher;
    }).catch(error => {
      console.error("Unable to verify the teacher session for Day 5 points:", error);
      feedback.textContent = "The teacher session could not be verified.";
    });
  };

  const showCompletion = () => {
    completed = true;
    roundLabel.textContent = `Complete! ${rounds.length}/${rounds.length}`;
    progress.style.width = "100%";
    prompt.textContent = "Excellent work! You completed every challenge.";
    dropZone.hidden = true;
    choices.replaceChildren();
    letterBank.hidden = true;
    builtWord.hidden = true;
    feedback.textContent = "You earned 10 points!";
    displayPoints();
    if (localStorage.getItem("studentLoggedIn") === "true") {
      awardStudentLogin();
    }
  };

  const advance = () => {
    roundIndex++;
    builtLetters = [];
    busy = false;
    feedback.textContent = "";
    if (roundIndex >= rounds.length) {
      showCompletion();
    } else {
      renderRound();
    }
  };

  const acceptCorrect = () => {
    playAnswerSound(correctSound);
    feedback.textContent = "Correct! Great job!";
    feedback.style.color = "#2e7d32";
    window.setTimeout(advance, 450);
  };

  const handleWrong = () => {
    playAnswerSound(wrongSound);
    feedback.textContent = "Not quite. Try again!";
    feedback.style.color = "#c0392b";
  };

  const renderWordSlots = () => {
    builtWord.replaceChildren();
    builtLetters.forEach((letter, index) => {
      const slot = document.createElement("span");
      slot.className = "edu-day5-word-slot";
      slot.dataset.slotIndex = String(index);
      slot.textContent = letter?.value.toUpperCase() || "?";
      slot.setAttribute("role", "button");
      slot.setAttribute("tabindex", "0");
      slot.setAttribute("aria-label", letter ? `Letter ${letter.value}, slot ${index + 1}. Click to remove.` : `Empty letter slot ${index + 1}.`);
      if (letter) slot.classList.add("is-filled");
      builtWord.appendChild(slot);
    });
  };

  const clearBuildAttempt = () => {
    builtLetters = Array.from({ length: buildWord.length }, () => null);
    letterBank.querySelectorAll("button").forEach(tile => {
      tile.disabled = false;
      tile.hidden = false;
    });
    renderWordSlots();
  };

  const placeLetter = (tile, slotIndex) => {
    if (busy || completed || tile.disabled || builtLetters[slotIndex]) return;
    builtLetters[slotIndex] = { value: tile.textContent.toLowerCase(), tile };
    tile.disabled = true;
    tile.hidden = true;
    renderWordSlots();

    if (builtLetters.every(Boolean)) {
      busy = true;
      const answer = builtLetters.map(letter => letter.value).join("");
      if (answer === buildWord.toLowerCase()) {
        acceptCorrect();
      } else {
        handleWrong();
        window.setTimeout(() => {
          clearBuildAttempt();
          busy = false;
        }, 700);
      }
    }
  };

  const submitChoice = option => {
    if (busy || completed) return;
    dropZone.textContent = option;
    dropZone.setAttribute("aria-label", `Answer selected: ${option}`);
    busy = true;
    if (option === dropZone.dataset.answer) {
      acceptCorrect();
    } else {
      handleWrong();
      window.setTimeout(() => {
        dropZone.textContent = "Drag the best answer here, or tap an answer.";
        dropZone.setAttribute("aria-label", "Drop the best answer here.");
        busy = false;
      }, 700);
    }
  };

  const renderBuildRound = item => {
    const [word, clue] = item;
    buildWord = word;
    builtLetters = Array.from({ length: word.length }, () => null);
    prompt.textContent = clue;
    feedback.textContent = "Drag letters into the slots, or tap them in order.";
    choices.hidden = true;
    dropZone.hidden = true;
    builtWord.hidden = false;
    letterBank.hidden = false;
    renderWordSlots();
    letterBank.replaceChildren();

    const letters = randomize([
      ...word.toUpperCase().split("").map((value, id) => ({ value, id })),
      ...randomize("RSTLNEAIOU".replace(new RegExp(`[${word.toUpperCase()}]`, "g"), "").split("")).slice(0, 2)
        .map((value, id) => ({ value, id: word.length + id }))
    ]);

    letters.forEach(letter => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "edu-day5-letter";
      button.textContent = letter.value;
      button.addEventListener("click", () => {
        if (suppressClick || busy || completed) return;
        const nextSlot = builtLetters.findIndex(value => value === null);
        if (nextSlot !== -1) placeLetter(button, nextSlot);
      });
      letterBank.appendChild(button);
    });

  };

  builtWord.addEventListener("click", event => {
    const slot = event.target.closest(".edu-day5-word-slot");
    if (!slot || busy || completed) return;
    const slotIndex = Number(slot.dataset.slotIndex);
    const letter = builtLetters[slotIndex];
    if (!letter) return;
    letter.tile.disabled = false;
    letter.tile.hidden = false;
    builtLetters[slotIndex] = null;
    feedback.textContent = "";
    renderWordSlots();
  });

  builtWord.addEventListener("keydown", event => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const slot = event.target.closest(".edu-day5-word-slot");
    if (!slot) return;
    event.preventDefault();
    slot.click();
  });

  const renderChoiceRound = item => {
    let question;
    let answer;
    let options;
    if (activity.mode === "sort") {
      const [word, correct] = item;
      question = `Sort it: ${word}`;
      answer = correct;
      options = activity.categories;
    } else {
      [question, answer, ...options] = item;
      options = [answer, ...options];
    }
    choices.hidden = false;
    dropZone.hidden = false;
    builtWord.hidden = true;
    letterBank.hidden = true;
    prompt.textContent = question;
    dropZone.textContent = "Drag the best answer here, or tap an answer.";
    dropZone.dataset.answer = answer;
    dropZone.setAttribute("aria-label", "Drop the best answer here.");
    choices.replaceChildren();

    randomize(options).forEach(option => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "edu-day5-choice";
      button.textContent = option;
      button.addEventListener("click", () => {
        if (suppressClick) return;
        submitChoice(option);
      });
      choices.appendChild(button);
    });
  };

  const getDropTarget = (x, y, source) => {
    const target = document.elementFromPoint(x, y);
    if (source.classList.contains("edu-day5-choice")) {
      return target?.closest(".edu-day5-dropzone");
    }
    return target?.closest(".edu-day5-word-slot");
  };

  const clearDropHighlights = () => {
    game.querySelectorAll(".is-hover").forEach(target => target.classList.remove("is-hover"));
  };

  document.addEventListener("pointerdown", event => {
    const tile = event.target.closest(".edu-day5-choice, .edu-day5-letter");
    if (!tile || !game.contains(tile) || tile.disabled || busy || completed || event.button !== 0) return;
    activeDrag = {
      tile,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      ghost: null
    };
  });

  document.addEventListener("pointermove", event => {
    if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;
    const deltaX = event.clientX - activeDrag.startX;
    const deltaY = event.clientY - activeDrag.startY;
    if (!activeDrag.ghost && Math.hypot(deltaX, deltaY) > 6) {
      const bounds = activeDrag.tile.getBoundingClientRect();
      activeDrag.ghost = activeDrag.tile.cloneNode(true);
      activeDrag.ghost.classList.add("edu-day5-drag-ghost");
      activeDrag.ghost.style.left = `${bounds.left}px`;
      activeDrag.ghost.style.top = `${bounds.top}px`;
      activeDrag.ghost.style.width = `${bounds.width}px`;
      activeDrag.ghost.style.height = `${bounds.height}px`;
      document.body.appendChild(activeDrag.ghost);
      activeDrag.tile.classList.add("is-dragging");
    }
    if (!activeDrag.ghost) return;

    activeDrag.ghost.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.04)`;
    clearDropHighlights();
    const target = getDropTarget(event.clientX, event.clientY, activeDrag.tile);
    target?.classList.add("is-hover");
    event.preventDefault();
  });

  const finishDrag = event => {
    if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;
    const drag = activeDrag;
    activeDrag = null;
    drag.tile.classList.remove("is-dragging");
    drag.ghost?.remove();
    clearDropHighlights();
    if (!drag.ghost) return;

    suppressClick = true;
    window.setTimeout(() => {
      suppressClick = false;
    }, 0);
    const target = getDropTarget(event.clientX, event.clientY, drag.tile);
    if (target?.classList.contains("edu-day5-dropzone")) {
      submitChoice(drag.tile.textContent.trim());
    } else if (target?.classList.contains("edu-day5-word-slot")) {
      placeLetter(drag.tile, Number(target.dataset.slotIndex));
    }
  };

  document.addEventListener("pointerup", finishDrag);
  document.addEventListener("pointercancel", finishDrag);

  function renderRound() {
    if (completed) return;
    const item = rounds[roundIndex];
    busy = false;
    roundLabel.textContent = `Challenge ${roundIndex + 1} of ${rounds.length}`;
    progress.style.width = `${(roundIndex / rounds.length) * 100}%`;
    if (activity.mode === "build") {
      renderBuildRound(item);
    } else {
      renderChoiceRound(item);
    }
    displayPoints();
  }

  const getDatabase = () => {
    if (!window.firebase?.apps?.length) {
      throw new Error("The student database is not available.");
    }
    return window.firebase.database();
  };

  const rewardKeyFor = studentId => `${rewardPrefix}${encodeURIComponent(studentId)}`;

  const awardOnce = async (studentId, studentName) => {
    if (!completed) throw new Error("Finish all challenges before awarding points.");
    const rewardKey = rewardKeyFor(studentId);
    if (localStorage.getItem(rewardKey) === "true") {
      feedback.textContent = `Points for ${studentName} were already awarded for this game.`;
      return;
    }
    const scoreRef = getDatabase().ref(`students/${studentId}/score`);
    const result = await scoreRef.transaction(score => (Number(score) || 0) + 10);
    if (!result.committed) throw new Error("The points could not be saved.");
    localStorage.setItem(rewardKey, "true");
    feedback.textContent = `10 points awarded to ${studentName}.`;
    feedback.style.color = "#2e7d32";
  };

  async function awardStudentLogin() {
    if (busy) return;
    const studentName = localStorage.getItem("studentName");
    if (!studentName) {
      feedback.textContent = "Game complete. Sign in as a student to receive your 10 points.";
      return;
    }
    busy = true;
    try {
      const snapshot = await getDatabase().ref("students").once("value");
      let match = null;
      snapshot.forEach(child => {
        if (child.val()?.name === studentName) match = { id: child.key, name: studentName };
      });
      if (!match) throw new Error(`No student record was found for ${studentName}.`);
      await awardOnce(match.id, match.name);
    } catch (error) {
      console.error("Unable to award Day 5 points:", error);
      feedback.textContent = "Game complete, but points could not be saved. Please ask your teacher.";
      feedback.style.color = "#c0392b";
    } finally {
      busy = false;
    }
  }

  const showStudentChoices = async () => {
    if (!completed || busy) return;
    try {
      if (typeof window.eduOpenStudentPicker !== "function") {
        throw new Error("The student selection dialog is unavailable.");
      }
      await window.eduOpenStudentPicker(rewardPrefix);
    } catch (error) {
      console.error("Unable to open the Day 5 student picker:", error);
      feedback.textContent = error.message || "Unable to load students. Please try again.";
      feedback.style.color = "#c0392b";
    }
  };

  resetButton.addEventListener("click", () => {
    roundIndex = 0;
    builtLetters = [];
    completed = false;
    busy = false;
    feedback.textContent = "";
    feedback.style.color = "";
    renderRound();
  });
  awardButton.addEventListener("click", showStudentChoices);

  renderRound();
})();
