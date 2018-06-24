// "The Water" vocabulary
var water_vocabulary = [
  // 1
  'ocean',
  'water',
  'seagulls',
  'boat',
  'waves',
  'beach',
  'sand',
  'surf',
  'sea',
  'fish',
  'swimming',
  'blue',
  'clear',
  'Sun',

  // 14
  'sailing',
  'lifeguard',
  'vacation',
  'surfing',
  'sunset',
  'sky',
  'birds',
  'fishing',
  'pier',
  'cruise',
  'bouy',
  'dock',
  'storm',
  
  // Extra
  'ship'
];

// "Motoring" vocabulary
var motoring_vocabulary = [
  // 1
  'car',
  'truck',
  'highway',
  'street',
  'road',
  'downtown',
  'riding',
  'motorcycle',
  'key',
  'speed',
  'fast',
  'police',
  'drift',

  // 14
  'helmet',
  'trailer',
  'SUV',
  'pedals',
  'crash',
  'turn',
  'chase',
  'camera',
  'spin',
  'race',
  'steer',
  'tire',
  'engine',

  // Extra
  'transmission',
  'clutch'
];

// "The Park" vocabulary
var park_vocabulary = [
  // 1
  'field',
  'sports',
  'trees',
  'grass',
  'picnic',
  'birds',
  'pond',
  'lake',
  'bridge',
  'field',
  'barbeque',
  'stream',
  'playground',

  // 14
  'swing',
  'park',
  'jogging',
  'pets',
  'bicycle',
  'track',
  'exercise',
  'bench',
  'fountain',
  'water',
  'trail',
  'pathway',
  'walking',

  // Extra
  'music',
  'children'
];

// "The Airport" vocabulary
var airport_vocabulary = [
  // 1
  'terminal',
  'airplane',
  'passenger',
  'security',
  'runway',
  'taxiway',
  'jet',
  'hanger',
  'propeller',
  'fuel',
  'pilot',
  'window',
  'wings',

  // 14
  'baggage',
  'ticket',
  'airport',
  'travel',
  'customs',
  'crew',
  'takeoff',
  'landing',
  'copilot',
  'exit',
  'lights',
  'tower',
  'radio',

  // Extra
  'cockpit',
  'clouds'
];

// Dictionary of all predefined vocabularies.
var vocabularies = {
  "water":    water_vocabulary,
  "motoring": motoring_vocabulary,
  "park":     park_vocabulary,
  "airport":  airport_vocabulary
};

$(document).ready(function() {
  // Reset the page.
  $("#vocabulary_type_custom").prop("checked", true);
  $("#vocabulary_list").attr("disabled", true);
  $("#generate-vocabulary").attr("disabled", true);
  $("#vocabulary_list").val("");

  $("#vocabulary_entry[name^=vocabulary]").each(function(i) {
    $(this).val(null);
  });

  $("#vocabulary_type_premade").click(function(e) {
    $("#vocabulary_list").attr("disabled", false);
    $("#generate-vocabulary").attr("disabled", false);

    $("#vocabulary_entry[name^=vocabulary]").each(function(i) {
      $(this).attr("disabled", true);
    });
  });

  $("#vocabulary_type_custom").click(function(e) {
    $("#vocabulary_list").attr("disabled", true);
    $("#generate-vocabulary").attr("disabled", true);

    $("#vocabulary_entry[name^=vocabulary]").each(function(i) {
      $(this).attr("disabled", false);
    });
  });

  $("#generate-vocabulary").click(function(e) {
    e.preventDefault();

    var selector = randomNoRepeats(vocabularies[$("#vocabulary_list").val()]);

    $("#vocabulary_entry[name^=vocabulary]").each(function(i) {
      $(this).val(selector());
    });
  });

  $("#clear-vocabulary").click(function(e) {
    e.preventDefault();

    $("#vocabulary_entry[name^=vocabulary]").each(function(i) {
      $(this).val(null);
    });
  });

  $("#create-poem").click(function(e) {
    e.preventDefault();

    var resizeFactor = 4;

    $("#poem-title").empty();
    $("#poem-body").empty();

    var wordSizes = {};

    $("#vocabulary_entry[name^=vocabulary]").each(function(i) {
      wordSizes[$(this).val()] = 16;
    });

    var seed = Array.from($("#initial_seed").val());

    // Make sure that the seed is 3 letters long.
    if (seed.length != 3) {
      alert("The initial seed must be 3 letters.");
    }

    var title = [];
    var lines = [];

    // 1. create the title using the seed.
    for (var i = 0; i < seed.length; i++) {
      var word = selectWord(seed[i]);
      var size = wordSizes[word];
      wordSizes[word] = size + resizeFactor;
      title.push(word);

      var wordElement = document.createElement("span");
      wordElement.innerText = word;
      wordElement.style = "font-size: " + size + "px";

      $("#poem-title").append(wordElement);
      $("#poem-title").append(" ");
    }

    // 2. use the title to create the first stanza.
    for (var i = 0; i < title.length; i++) {
      var letters = Array.from(title[i]);

      var currentLine = [];

      for (var j = 0; j < letters.length; j++) {
        var word = selectWord(letters[j]);
        var size = wordSizes[word];
        wordSizes[word] = size + resizeFactor;
        currentLine.push(word);

        var wordElement = document.createElement("span");
        wordElement.innerText = word;
        wordElement.style = "font-size: " + size + "px";

        $("#poem-body").append(wordElement);
        $("#poem-body").append(" ");
      }

      $("#poem-body").append(document.createElement("br"));

      lines.push(currentLine);
    }

    $("#poem-body").append(document.createElement("br"));

    // 3. use the previous stanza to create the next.
    for (var i = 0; i < title.length; i++) {
      var line = lines[i];

      for (var j = 0; j < line.length; j++) {
        var letters = Array.from(line[j]);

        var currentLine = [];

        for (var k = 0; k < letters.length; k++) {
          var word = selectWord(letters[k]);
          var size = wordSizes[word];
          wordSizes[word] = size + resizeFactor;
          currentLine.push(word);

          var wordElement = document.createElement("span");
          wordElement.innerText = word;
          wordElement.style = "font-size: " + size + "px";

          $("#poem-body").append(wordElement);
          $("#poem-body").append(" ");
        }

        $("#poem-body").append(document.createElement("br"));
      }
      
      $("#poem-body").append(document.createElement("br"));
    }
  });
});

function selectWord(letter) {  
  return $('#vocabulary_entry[name*="vocabulary[' + letter.toLowerCase() + ']"]').val();
}

function randomNoRepeats(array) {
  var copy = array.slice(0);
  return function() {
    if (copy.length < 1) { copy = array.slice(0); }
    var index = Math.floor(Math.random() * copy.length);
    var item = copy[index];
    copy.splice(index, 1);
    return item;
  };
}
