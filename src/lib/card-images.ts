const CARD_IMAGE_HOST = 'https://img.dailytarot.org';

export function resolveCardImageUrl(imagePath: string) {
  if (/^https?:\/\//.test(imagePath)) {
    return imagePath;
  }

  if (imagePath.startsWith('/cards/')) {
    return `${CARD_IMAGE_HOST}${imagePath}`;
  }

  return imagePath;
}
