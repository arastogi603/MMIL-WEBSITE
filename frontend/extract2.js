const fs = require('fs');

fetch('https://my.spline.design/robotfollowcursorforlandingpage-6onQnqC4nU4Kjlquc7tKpYrg/')
  .then(res => res.text())
  .then(text => {
    // Write text to a file so we can grep it properly
    fs.writeFileSync('spline.html', text);
    const match = text.match(/https:\/\/[^"'\s]*\.splinecode/i);
    if (match) {
        console.log("FOUND URL: " + match[0]);
    } else {
        console.log("NO URL FOUND IN HTML");
    }
  })
  .catch(err => console.error(err));
