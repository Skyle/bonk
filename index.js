let linkesPaddel = document.getElementById("links");
let rechtesPaddel = document.getElementById("rechts");
let pressedOben = false;
let pressedUnten = false;

document.addEventListener("keydown", untendruecker);
document.addEventListener("keyup", obenlasser);

function untendruecker(e) {
  if (e.key === "ArrowUp") {
    pressedOben = true;
  }
  if (e.key === "ArrowDown") {
    pressedUnten = true;
  }
}

function obenlasser(e) {
  if (e.key === "ArrowUp") {
    pressedOben = false;
  }
  if (e.key === "ArrowDown") {
    pressedUnten = false;
  }
}

setInterval(update, 16.66666666);

function update() {
  const style = getComputedStyle(rechtesPaddel);
  console.log(pressedOben, pressedUnten);

  if (pressedUnten) {
    const alteHoehe = parseFloat(style.top.substring(0, style.top.length - 2));
    const neueHoehe = alteHoehe + 10 + "px";
    rechtesPaddel.style.top = neueHoehe;
  } else if (pressedOben) {
    const alteHoehe = parseFloat(style.top.substring(0, style.top.length - 2));
    const neueHoehe = alteHoehe - 10 + "px";
    rechtesPaddel.style.top = neueHoehe;
  }
}
