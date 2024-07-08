import BaseTour from '#common/clubs/base';

export function parseClubVpohod(nodes: Element[]): BaseTour[] {
   return nodes.map((node) => new Vpohod(node));
}

export default class Vpohod extends BaseTour {
   constructor(document: Element, isDetailed: boolean = false) {
      super();
      this.getTitle(document);
      this.getDate(document);
      this.getLink(document);
      this.club = 2;

      if (isDetailed) {
         // this.getPrice(document: Element);
         // this.getImage(document: Element);
         // this.getDescription(document: Element);
         // this.getRegion(region);
      }
   }

   public getTitle(document: Element): void {
      try {
         this.title = document.querySelector('.main_page_hike_title')?.textContent as string;
      } catch (e) {
         this.post.title = e.message;
         this.type = 'error';
      }
   }

   public getDate(document: Element): void {
      try {
         let dates: RegExpMatchArray | string = document.querySelector('.main_page_hikes_info')?.childNodes[1]
           .childNodes[1].textContent?.trim() as string;
         // @ts-ignore
         dates = dates.match(/c (.*) по (.*)/i);
         const date_to = dates[2].split('.');
         const date_from = dates[1].split('.');
         const date_from_year = date_from.length === 2 ? date_to[2] : date_from[2];

         this.date_from = `${date_from_year}-${date_from[1]}-${date_from[0]}T00:00:00Z`;
         this.date_to = `${date_to[2]}-${date_to[1]}-${date_to[0]}T00:00:00Z`;
      } catch (e) {
         this.post.date_from = e.message;
         this.post.date_to = e.message;
         this.type = 'error';
      }
   }

   public getPrice(document: Element): void {
      try {
         const price = document.querySelector('.price .number')?.textContent as string;
         this.price = +price.replace(/[\s, \W]/g, '');
      } catch (e) {
         this.post.price = e.message;
         this.type = 'error';
      }
   }

   public getImage(document: Element): void {
      try {
         this.image = document.querySelector('.block_image img')?.getAttribute('src') as string;
      } catch (e) {
         this.post.image = e.message;
         this.type = 'error';
      }
   }

   public getLink(document: Element): void {
      try {
         const host = 'https://www.vpoxod.ru';
         this.link = host + document.querySelector('a')?.getAttribute('href');
      } catch (e) {
         this.post.link = e.message;
         this.type = 'error';
      }
   }

   public getDescription(document: Element): void {
      try {
         let description = document.querySelector('.description')?.textContent?.trim() as string;
         description = description.replace('/\n/g',' ');
         this.description = description;
      } catch (e) {
         this.post.description = e.message;
         this.type = 'error';
      }
   }

   // getRegion(document: Element): void {
   //    try {
   //       this.region = region;
   //    } catch (e) {
   //       this.post.region = e.message;
   //    }
   // }
}
