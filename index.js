let linkesPaddel = document.getElementById("links");
let rechtesPaddel = document.getElementById("rechts");
let pressedOben = false;
let pressedUnten = false;
const paddelSpeed = 8;

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
  if (pressedUnten && !pressedOben) {
    const style = getComputedStyle(rechtesPaddel);
    const alteHoehe = getHoeheOhnePx(style.top);
    const neueHoehe = alteHoehe + paddelSpeed;
    const vh = window.innerHeight;
    const paddelHoehe = getHoeheOhnePx(style.height);
    if (paddelHoehe + alteHoehe < vh) {
      const neueHoeheMitPixel = neueHoehe + "px";
      rechtesPaddel.style.top = neueHoeheMitPixel;
    } else {
      rechtesPaddel.style.top = vh - paddelHoehe + "px";
    }
  }
  if (pressedOben && !pressedUnten) {
    const style = getComputedStyle(rechtesPaddel);
    const alteHoehe = getHoeheOhnePx(style.top);
    const neueHoehe = alteHoehe - paddelSpeed;
    if (neueHoehe >= 0) {
      const neueHoeheMitPixel = neueHoehe + "px";
      rechtesPaddel.style.top = neueHoeheMitPixel;
    } else {
      rechtesPaddel.style.top = "0px";
    }
  }
}

function getHoeheOhnePx(hoehe) {
  return parseFloat(hoehe.substring(0, hoehe.length - 2));
}
