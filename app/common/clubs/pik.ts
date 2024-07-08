import BaseTour from '#common/clubs/base';

export function parseClubPik(nodes: Element[]): BaseTour[] {
   return nodes.map((node) => new Pik(node));
}

export default class Pik extends BaseTour {
   constructor(document: Element, isDetailed: boolean = false) {
      super();
      this.getTitle(document);
      this.getDate(document);
      this.getLink(document);
      this.club = 4;

      if (isDetailed) {
         // this.getPrice(document: Element);
         // this.getImage(document: Element);
         // this.getDescription(document: Element);
         // this.(document: Element): void {(region);
      }
   }

   public getTitle(document: Element): void {
      try {
         this.title = document.querySelector('.trip-card-title')?.textContent as string;
      } catch (e) {
         this.post.title = e.message;
         this.type = 'error';
      }
   }

   public getDate(document: Element): void {
      try {
         const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
         let dates: RegExpMatchArray | string = document.querySelector('.trip-card-description')?.textContent as string;
         // @ts-ignore
         dates = dates.match(/с (\d+)\s*(\W*)\s*(\d*) по (\d+) (\W*) (\d+)/i);

         // @ts-ignore
         let date_to = dates[4] < 10 ? `0${dates[4]}` : dates[4];
         let month_to: string | number = months.indexOf(dates[5]) + 1;
         month_to = month_to < 10 ? `0${month_to}` : month_to;

         // @ts-ignore
         let date_from = dates[1] < 10 ? `0${dates[1]}` : dates[1];
         let month_from: string | number = dates[2] || dates[5];
         month_from = months.indexOf(month_from) + 1;
         month_from = month_from < 10 ? `0${month_from}` : month_from;
         const year_from = dates[3] || dates[6];
         this.date_from = `${year_from}-${month_from}-${date_from}T00:00:00Z`;
         this.date_to = `${dates[6]}-${month_to}-${date_to}T00:00:00Z`;
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
         const host = 'https://turclub-pik.ru';
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

   // (document: Element): void {(document: Element): void {
   //    try {
   //       this.region = region;
   //    } catch (e) {
   //       this.post.region = e.message;
   //    }
   // }
}
