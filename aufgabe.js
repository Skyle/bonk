function checkGleich(text, buchstabe) {
  let counterDesBuchstaben = 0;
  for (let stelleImText = 0; stelleImText < text.length; stelleImText++) {
    if (buchstabe === text[stelleImText]) {
      counterDesBuchstaben++;
    }
  }
  let neuerCounter = 0;

  for (const jeweiligerBuchstabeImText of text) {
    if (jeweiligerBuchstabeImText === buchstabe) {
      neuerCounter++;
    }
  }

  console.log(neuerCounter);
  return counter;
}
console.log(checkGleich("asdfjaslkdfasdfasdfsadf", "a"));
