import BaseTour from '#common/clubs/base';

export function parseDetailsStrannik(document: Element, initData: IInitData): Strannik {
   return new Strannik({ document, initData }, true);
}

export default class Strannik extends BaseTour {
   constructor({ document }) {
      super();
      this.getPrice(document);
      this.getDescription(document);
      this.getRegion(document);
      this.getDifficulty(document);
   }

   public getTitle(document: Element): void {
      try {
         this.title = document.querySelector('.block_image .text')?.textContent?.trim() as string;
      } catch (e) {
         // this.post.title = e.message;
         // this.type = 'error';
      }
   }

   public getDate([date_from, date_to]: [string, string]) {
      // this.date_from = date_from;
      // this.date_to = date_to;
   }

   public getPrice(document: Element): void {
      try {
         const price = document.querySelector('.price_desktop_spec')?.textContent as string;
         // this.price = +price.replace(/[\s, \W]/g, '');
      } catch (e) {
         // this.post.price = e.message;
         // this.type = 'error';
      }
   }

   public downloadCover(document: Element, id: number) {
      // const imageUrl = document.querySelector('.block_slider img')?.getAttribute('src') as string;
      // return downloadImage(imageUrl, id);
   }

   public getLink(document: Element): void {
      try {
         const host = 'https://clubstrannik.ru';
         this.link = host + document.querySelector('a')?.getAttribute('href');
      } catch (e) {
         // this.post.link = e.message;
         // this.type = 'error';
      }
   }

   public getDescription(document: Element): void {
      try {
         let description = document.querySelector('.comment-text')?.textContent?.trim() as string;
         description = description.replace('/\n/g',' ');
         // this.description = description;
      } catch (e) {
         // this.post.description = e.message;
         // this.type = 'error';
      }
   }

   public getRegion(document: Element): void {
      try {
         // this.region = document.querySelector('.white_text.block_link')?.children[1].querySelector('a')?.textContent as string;
      } catch (e) {
         // this.post.region = e.message;
      }
   }

   public getDifficulty(document: Element): void {
      try {
         // @ts-ignore
         this.difficulty = +document.querySelector('.tour_params .value')?.textContent?.split('/')[0];
      } catch (e) {
         // this.post.difficulty = e.message;
      }
   }

   public getTags(document: Element): void {
      const tagClasses = {
         'icon-Plav-sredstva': 'water',
         'icon-Peshkom': 'hiking',
         'icon-S-ryukzakom': 'mountain',
      }
      try {
         let tags = '';
         const icons = document.querySelectorAll('.region-info .line_parameters .icon_way');
         Array.from(icons).forEach(item => {
            Object.keys(tagClasses).forEach(iconClass => {
               if (item.classList.contains(iconClass)) {
                  // @ts-ignore
                  tags += `${tagClasses[iconClass]} `;
               }
            })
         })
         // this.tags = tags.trim();
      } catch (e) {
         // this.post.difficulty = e.message;
      }
   }
}
