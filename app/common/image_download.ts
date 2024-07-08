import { mkdirSync, existsSync } from 'fs';
import Jimp from 'jimp';

type ImageType = 'cover' | 'attachment';

const resolutions: any = {
   cover: {
      width: 320,
      height: 160,
   },
};

export async function downloadImage(url: string, id: number) {
   const folder = `./public/images/${id}/`;
   let imageUrl: string | Buffer = url;

   if (!existsSync(folder)) {
      mkdirSync(folder, { recursive: true });
   }

   if (Array.isArray(url.match('data:image'))) {
      const base64Data = url.replace(/^data:image\/jpg;base64,/, '')
      imageUrl = Buffer.from(base64Data, 'base64');
   }

   return saveImage(imageUrl, folder, 'cover', 'cover');
}

async function saveImage(url: any, folder: string, type: ImageType, name: string) {
   try {
      const image = await Jimp.read(url);
      return image
        .cover(resolutions[type].width, resolutions[type].height)
        .quality(80)
        .write(`${folder}${name}.jpg`);
   } catch (err) {
      console.error(err);
   }
}
