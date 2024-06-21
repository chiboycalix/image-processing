const sharp = require('sharp');
const Jimp = require('jimp');

// Define the input and output paths
const inputImagePath = './Logo.png'; // Replace with your image path
const outputImagePath = './output/Logo.png'; // Replace with your output path

// Define the hex colors to change from and to
const fromColorHex = '#5989fd';
const toColorHex = '#44c382';
// const toColorHex = '#723911';

// Function to convert hex to RGB
function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

// Convert the hex colors to RGB
const fromColorRgb = hexToRgb(fromColorHex);
const toColorRgb = hexToRgb(toColorHex);

// Define a threshold for color matching
const threshold = 50; // Adjust this threshold as needed

// Function to check if the color is within the threshold
function isColorMatch(r1, g1, b1, r2, g2, b2, threshold) {
  return (
    Math.abs(r1 - r2) <= threshold &&
    Math.abs(g1 - g2) <= threshold &&
    Math.abs(b1 - b2) <= threshold
  );
}

// Load the image using Jimp
Jimp.read(inputImagePath)
  .then(image => {
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      // Get the RGB values of the current pixel
      const red = this.bitmap.data[idx];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];

      // Check if the current pixel matches the 'fromColor' within the threshold
      if (isColorMatch(red, green, blue, fromColorRgb[0], fromColorRgb[1], fromColorRgb[2], threshold)) {
        // Replace with 'toColor'
        this.bitmap.data[idx] = toColorRgb[0]; // Red channel
        this.bitmap.data[idx + 1] = toColorRgb[1]; // Green channel
        this.bitmap.data[idx + 2] = toColorRgb[2]; // Blue channel
      }
    });

    // Save the modified image
    return image.writeAsync(outputImagePath);
  })
  .then(() => {
    console.log('Image processing complete!');
  })
  .catch(err => {
    console.error('Error processing image:', err);
  });
