fetch('https://my.spline.design/robotfollowcursorforlandingpage-6onQnqC4nU4Kjlquc7tKpYrg/')
  .then(res => res.text())
  .then(text => {
    const match = text.match(/https:\/\/[^"']*\.splinecode/);
    if (match) console.log(match[0]);
    else console.log("Not found");
  })
  .catch(err => console.error(err));
