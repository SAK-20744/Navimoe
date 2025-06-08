
// data.js - Parts with boxing field added

const weapons = [
  {
    name: "Laser Blaster",
    type: "weapon",
    level: 18,
    atk: 350000,
    image: "laser.png",
    boxing: []
  },
  {
    name: "Missile Pod",
    type: "weapon",
    level: 16,
    atk: 300000,
    image: "missile.png",
    boxing: []
  }
];

const bodies = [
  {
    name: "Titan",
    type: "body",
    level: 18,
    hp: 1500000,
    image: "titan.png",
    boxing: []
  }
];

const wheels = [
  {
    name: "Roller",
    type: "wheel",
    level: 18,
    hp: 500000,
    image: "roller.png",
    boxing: []
  }
];

const gadgets = [
  {
    name: "Booster",
    type: "gadget",
    level: 18,
    hp: 250000,
    image: "booster.png",
    boxing: []
  }
];

const allParts = [...weapons, ...bodies, ...wheels, ...gadgets];
