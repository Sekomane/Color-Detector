const video = document.getElementById('video');
const colorNameDiv = document.getElementById('color-name');

navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
  video.srcObject = stream;
  video.play();
});

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, v = max;

  const d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max === min) h = 0;
  else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [Math.round(h * 179), Math.round(s * 255), Math.round(v * 255)];
}

function getColorName(h, s, v) {
  if (v < 30) return "BLACK";
  else if (s < 25) return v > 200 ? "WHITE" : "GRAY";
  else if (h < 5 || h >= 170) return "RED";
  else if (h < 22) return "ORANGE";
  else if (h < 33) return "YELLOW";
  else if (h < 45) return "LIGHT GREEN";
  else if (h < 78) return "GREEN";
  else if (h < 95) return "CYAN";
  else if (h < 110) return "LIGHT BLUE";
  else if (h < 131) return "BLUE";
  else if (h < 145) return "PURPLE";
  else if (h < 170) return "PINK";
  return "UNKNOWN";
}

function detectColor() {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const x = canvas.width / 2;
  const y = canvas.height / 2;
  const pixel = ctx.getImageData(x, y, 1, 1).data;
  const [r, g, b] = pixel;

  const [h, s, v] = rgbToHsv(r, g, b);
  const colorName = getColorName(h, s, v);
  colorNameDiv.textContent = colorName;
}

setInterval(detectColor, 500);
