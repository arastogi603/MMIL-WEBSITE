const fs = require('fs');
const https = require('https');
const path = require('path');

const alumni = [
  {
    name: 'sakshi-tiwari',
    url: 'https://media.licdn.com/dms/image/v2/D5603AQFnwV5HVWR8Hg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1723020984005?e=1787788800&v=beta&t=cgoH79wj9IBrMs-n6nZ5PtlBYuo479_jWC4oMNQRUyY'
  },
  {
    name: 'suyash-rastogi',
    url: 'https://media.licdn.com/dms/image/v2/D5603AQG24oJnFSqKBA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1726140753180?e=1787788800&v=beta&t=75TKVnauTAhBdP5jugVSFL3xifCHZUrl_PG7i_55eys'
  },
  {
    name: 'anuj-agarwal',
    url: 'https://media.licdn.com/dms/image/v2/D5603AQEPY1_mEGsxDw/profile-displayphoto-crop_800_800/B56Z5.xJGqIoAI-/0/1780243273399?e=1787788800&v=beta&t=0H4YbNJm6SzS8MRhvuNKaQdaJxL74fCvtMJugS_VqjQ'
  },
  {
    name: 'pushkar-singh',
    url: 'https://media.licdn.com/dms/image/v2/D5635AQG4gBV4USMHpw/profile-framedphoto-shrink_800_800/profile-framedphoto-shrink_800_800/0/1712062633625?e=1786917600&v=beta&t=HXaYtaYYKvK1DmtvPK-2caG_57ZUzCR9WKAEIb_NY_8'
  },
  {
    name: 'arnika-sharma',
    url: 'https://media.licdn.com/dms/image/v2/D5603AQHlvAGyMDXH_g/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1726732700712?e=1787788800&v=beta&t=YoMwdjjdHMYi8wNLeiFCnlhOca4U_cr4Z1yywE8S8s0'
  },
  {
    name: 'ashwin-raj-vats',
    url: 'https://media.licdn.com/dms/image/v2/D5603AQEEhtvlOIuirw/profile-displayphoto-crop_800_800/B56Z4YTasfIkAI-/0/1778524205862?e=1787788800&v=beta&t=sHUlH7ejMUJLGGzsqEtxoIpKRxgUerm7AhQnQ6fcVms'
  },
  {
    name: 'nipun-khatri',
    url: 'https://media.licdn.com/dms/image/v2/D5603AQF7cA0z_UFiIA/profile-displayphoto-crop_800_800/B56Zgmi9X6HQAM-/0/1752993357244?e=1787788800&v=beta&t=XjQQUCXaar9TULqbxxPxazFLSnKyJGoL4cAYl0UNyg8'
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
