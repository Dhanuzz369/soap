/**
 * Pictures found in open collections (via taste-skill assets.mjs) and used on the site.
 * They show the world around GoodBiz Hygiene (an Indian container port, botanical plates of the
 * plants behind common fragrances); none is presented as GoodBiz's own port, product or premises.
 * The footer prints a credit for each. Files: public/images/found/ (cropped and converted to WebP).
 */
export type FoundPicture = {
  file: string;
  title: string;
  creator: string;
  license: string;
  licenseUrl: string;
  page: string;
  via: string;
  usedFor: string;
};

export const foundPictures: FoundPicture[] = [
  {
    file: '/images/found/kochi-port-night.webp',
    title: 'International Container Transshipment Terminal, Kochi',
    creator: 'BgbwikiV4',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
    page: 'https://commons.wikimedia.org/wiki/File:International_Container_Transshipment_Terminal,_Kochi.jpg',
    via: 'Wikimedia Commons',
    usedFor: 'Home, export process section (cropped)',
  },
  {
    file: '/images/found/neem-plate.webp',
    title: 'Melia azadirachta (neem), 1873',
    creator: 'Govindoo',
    license: 'public domain',
    licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
    page: 'https://commons.wikimedia.org/wiki/File:Melia_azadirachta_Govindoo.jpg',
    via: 'Wikimedia Commons',
    usedFor: 'Home, statement band (cropped, greyscale)',
  },
  {
    file: '/images/found/lemon-plate.webp',
    title: 'Citrus limonum, Köhler’s Medizinal-Pflanzen, 1887',
    creator: 'Hermann Adolf Köhler',
    license: 'public domain',
    licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
    page: 'https://commons.wikimedia.org/wiki/File:Citrus_limonum_(K%C3%B6hler).jpg',
    via: 'Wikimedia Commons',
    usedFor: 'Home, quote card background (cropped, under a forest scrim)',
  },
];
