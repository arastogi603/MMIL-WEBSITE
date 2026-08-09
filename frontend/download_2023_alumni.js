const fs = require('fs');
const https = require('https');
const path = require('path');

const alumni = [
  {
    name: 'samyak-singh',
    url: 'https://media.licdn.com/dms/image/v2/D5603AQFQxnXgKZ0elA/profile-displayphoto-crop_800_800/B56ZselK6qIYAI-/0/1765744621296?e=1787788800&v=beta&t=vB64Ljx6V1hrHCv41LJeXJTB4XalhkdpzBynDfjwU_s'
  },
  {
    name: 'diksha-shukla',
    url: 'https://media.licdn.com/dms/image/v2/D5603AQEAxNKlR1BO8w/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1706013571867?e=1787788800&v=beta&t=cvcXudrFnViCnVI84uUIoxCgquI0w4DkU0g-iyQj4f8'
  },
  {
    name: 'rudrakshi-soni',
    url: 'https://media.licdn.com/dms/image/v2/D5635AQHzaElcP9_Z0g/profile-framedphoto-shrink_800_800/B56Z20NW3oKIAg-/0/1776844893832?e=1786917600&v=beta&t=NA3_kav9teaHaoHm4_77yMAV4D450gFriyB3pdoCWGw'
  },
  {
    name: 'anmol-puri',
    url: 'https://media.licdn.com/dms/image/v2/C4D03AQE6bwXXwlrkSg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1654227668620?e=1787788800&v=beta&t=7-IKtOXbGkBzmwjlVE_G2maRWDMIRBmJbWjpCTDxznQ'
  },
  {
    name: 'neeraj-maurya',
    url: 'https://media.licdn.com/dms/image/v2/D5603AQF-24yuPQfw7g/profile-displayphoto-shrink_800_800/B56ZY0wy2hH0Ac-/0/1744641929294?e=1787788800&v=beta&t=0-PfS0Zy0fGYMrPw23IbI7x9rn-ylB7Ud5umlQfnkIs'
  },
  {
    name: 'gautam-kushal',
    url: 'https://media.licdn.com/dms/image/v2/D4D03AQFPSeiwwByBrA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1702675927368?e=1787788800&v=beta&t=8O-o7sv6NmNXDdoMGHO0OBgGAr6Wn2NU8rjIqn83OWg'
  },
  {
    name: 'parth-sharma',
    url: 'https://media.licdn.com/dms/image/v2/D4D03AQHUO3kiHgk2og/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1674483888361?e=1787788800&v=beta&t=onwI38yheIozD6J1nLiEV0ZYUD0Dm_6qSoH2pdaK_f8'
  }
];

const dir = path.join(__dirname, 'public', 'images', 'alumni');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

alumni.forEach(person => {
  const file = fs.createWriteStream(path.join(dir, `${person.name}.jpg`));
  https.get(person.url, response => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${person.name}.jpg`);
    });
  }).on('error', err => {
    fs.unlink(path.join(dir, `${person.name}.jpg`));
    console.error(`Error downloading ${person.name}: ${err.message}`);
  });
});
