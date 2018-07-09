const colors = [
  [72, 61, 139], // DarkSlateBlue
  [218, 165, 32], // GoldenRod
  [173, 216, 230], // LightBlue
  [32, 178, 170], // LightSeaGreen
  [176, 196, 222], // LightSteelBlue
  [128, 0, 128], // Purple
  [250, 128, 114] // Salmon
];

export default function getRandomColor() {
  return colors[Math.floor(Math.random() * ((colors.length - 1) - 0 + 1))];
}
