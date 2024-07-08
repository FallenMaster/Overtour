import BaseTour from '#common/clubs/base';

export function parseClubPerehod(nodes: Element[]): BaseTour[] {
   return nodes.map((node) => new Perehod(node));
}

export default class Perehod extends BaseTour {
   constructor(document: Element, isDetailed?: boolean) {
      super();
      this.getTitle(document);
      this.getDate(document);
      this.getLink(document);
      this.club = 3;

      if (isDetailed) {
         // this.getPrice(document: Element);
         // this.getImage(document: Element);
         // this.getDescription(document: Element);
         // this.getRegion(region);
      }
   }

   public getTitle(document: Element): void {
      try {
         this.title = document.querySelector('.b-schedule-table__name a')?.textContent as string;
      } catch (e) {
         this.post.title = e.message;
         this.type = 'error';
      }
   }

   public getDate(document: Element): void {
      try {
         const months = ['янв', 'фев', 'март', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'нояб', 'дек'];
         let dates: RegExpMatchArray | string = document.querySelector('.b-schedule-table__date')?.textContent?.trim() as string;
         // @ts-ignore
         dates = dates.match(/(\d+)\s(\W+)\s(\d+)\s+-\s+(\d+)\s(\W+)\s(\d+)/i);
         let month_from: string | number = months.indexOf(dates[2]) + 1;
         month_from = month_from < 10 ? `0${month_from}` : month_from;
         let month_to: string | number = months.indexOf(dates[5]) + 1;
         month_to = month_to < 10 ? `0${month_to}` : month_to;
         this.date_from = `${dates[3]}-${month_from}-${dates[1]}T00:00:00Z`;
         this.date_to = `${dates[6]}-${month_to}-${dates[4]}T00:00:00Z`;
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
         const host = 'https://club-perexod.ru';
         this.link = host + document.querySelector('.b-schedule-table__name a')?.getAttribute('href');
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
