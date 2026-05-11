const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// gràfiques
const gE = document.getElementById("gEnergia").getContext("2d");
const gG = document.getElementById("gGlucosa").getContext("2d");
const gO = document.getElementById("gO2").getContext("2d");

// estat
let vista = "macro";

// variables físiques
let intensitatLlum = 0.8;
let nivellCO2 = 40;
let temperatura = 25;

// molècules energètiques
let atp = 0;
let nadph = 0;
let glucosa = 0;
let dipositO2 = 0;
let energia = 0;

// historials
let hEnergia = [];
let hGlucosa = [];
let hO2 = [];

// planta
const planta = { x: 300, y: 200, r: 90 };

// CO2
let molecules = [];

// electrons
let electrons = [];

function reiniciar() {
  energia = 0;
  atp = 0;
  nadph = 0;
  glucosa = 0;
  dipositO2 = 0;

  hEnergia = [];
  hGlucosa = [];
  hO2 = [];

  molecules = [];
  electrons = [];

  for (let i = 0; i < 40; i++) {
    molecules.push({
      x: Math.random() * 600,
      y: Math.random() * 400,
      vx: (Math.random() - 0.5),
      vy: (Math.random() - 0.5)
    });
  }

  for (let i = 0; i < 6; i++) {
    electrons.push({
      x: 150,
      y: 140 + i * 20,
      angle: Math.random() * Math.PI * 2,
      speed: 0.03,
      energia: 1
    });
  }
}

reiniciar();

// Sliders
document.getElementById("luzSlider").addEventListener("input", e => {
  intensitatLlum = e.target.value / 100;
});

document.getElementById("co2Slider").addEventListener("input", e => {
  nivellCO2 = e.target.value;
});

document.getElementById("tempSlider").addEventListener("input", e => {
  temperatura = e.target.value;
});

document.getElementById("btnReset").addEventListener("click", reiniciar);

// Canvi vista
window.canviarVista = function(v) {
  vista = v;
};

// Eficiència
function eficiencia() {
  let factorTemp = 1 - Math.abs(25 - temperatura) / 25;
  return Math.max(0, intensitatLlum * factorTemp);
}

function macro() {
  ctx.clearRect(0, 0, 600, 400);
  ctx.beginPath();
  ctx.arc(planta.x, planta.y, planta.r, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,255,0,0.2)";
  ctx.fill();

  molecules.forEach(m => {
    m.x += m.vx;
    m.y += m.vy;
    if (m.x < 0) m.x = 600;
    if (m.x > 600) m.x = 0;
    if (m.y < 0) m.y = 400;
    if (m.y > 400) m.y = 0;

    let dx = m.x - planta.x;
    let dy = m.y - planta.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < planta.r) {
      if (Math.random() < 0.03 * eficiencia()) {
        atp += 1;
        nadph += 1;
        energia += 1;
        dipositO2 += 1;
        if (atp > 5 && nadph > 5) {
          glucosa += 1;
          atp -= 3;
          nadph -= 3;
        }
      }
    }
    ctx.beginPath();
    ctx.arc(m.x, m.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "deepskyblue";
    ctx.fill();
  });
}

function micro() {
  ctx.clearRect(0, 0, 600, 400);
  ctx.beginPath();
  ctx.arc(300, 200, 80, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(0,255,0,${intensitatLlum})`;
  ctx.fill();

  electrons.forEach(e => {
    e.speed = intensitatLlum > 0 ? 0.05 : 0.01;
    e.angle += e.speed;
    let x = 300 + Math.cos(e.angle) * 50;
    let y = 200 + Math.sin(e.angle) * 50;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  });
}

function fotosistemes() {
  ctx.clearRect(0, 0, 600, 400);
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(180, 200, 60, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,200,255,0.3)";
  ctx.fill();
  ctx.fillStyle = "white";
  ctx.fillText("PSII", 165, 205);

  ctx.beginPath();
  ctx.arc(420, 200, 60, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,255,100,0.3)";
  ctx.fill();
  ctx.fillStyle = "white";
  ctx.fillText("PSI", 405, 205);

  electrons.forEach(e => {
    e.x += 2 * intensitatLlum;
    if (e.x > 250 && e.x < 260) dipositO2 += 0.05;
    if (e.x > 420) {
      glucosa += 0.03;
      e.x = 150;
    }
    ctx.beginPath();
    ctx.arc(e.x, e.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = e.x < 320 ? "cyan" : "yellow";
    ctx.fill();
  });
}

function flux() {
  ctx.clearRect(0, 0, 600, 400);
  ctx.fillStyle = "white";
  ctx.fillText("Flux d'electrons", 240, 40);
  electrons.forEach(e => {
    e.x += 2 * intensitatLlum;
    e.energia -= 0.002;
    if (e.x > 450) {
      e.x = 150;
      e.energia = 1;
    }
    ctx.beginPath();
    ctx.arc(e.x, e.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = e.energia > 0.5 ? "cyan" : "orange";
    ctx.fill();
  });
}


function draw(ctxGraf, data, color, titol) {
  ctxGraf.clearRect(0, 0, 600, 100);
  
  ctxGraf.fillStyle = "white";
  ctxGraf.font = "bold 12px Arial";
  ctxGraf.fillText(titol, 10, 20);

  if (data.length === 0) return;

  ctxGraf.beginPath();
  ctxGraf.moveTo(0, 100 - data[0]);
  data.forEach((v, i) => {
    ctxGraf.lineTo(i * 6, 100 - v * 0.5);
  });
  ctxGraf.strokeStyle = color;
  ctxGraf.lineWidth = 2;
  ctxGraf.stroke();
}


function loop() {
  if (vista === "macro") macro();
  else if (vista === "micro") micro();
  else if (vista === "fotosistemes") fotosistemes();
  else if (vista === "flux") flux();

  hEnergia.push(energia);
  hGlucosa.push(glucosa);
  hO2.push(dipositO2);

  if (hEnergia.length > 100) {
    hEnergia.shift();
    hGlucosa.shift();
    hO2.shift();
  }

  document.getElementById("info").innerText =
    `Llum: ${intensitatLlum.toFixed(2)} | CO₂: ${nivellCO2} | Temp: ${temperatura}°C
ATP: ${atp} | NADPH: ${nadph} | Glucosa: ${glucosa.toFixed(1)} | O₂: ${dipositO2.toFixed(1)}`;

 
  draw(gE, hEnergia, "lime", "Energia acumulada");
  draw(gG, hGlucosa, "orange", "Glucosa acumulada");
  draw(gO, hO2, "deepskyblue", "Oxigen acumulat");

  requestAnimationFrame(loop);
}

loop();
