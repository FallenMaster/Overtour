import BaseTour from '#common/clubs/base';

export function parseClubMyway(nodes: Element[]): BaseTour[] {
   return nodes.map((node) => new My_way(node));
}

export default class My_way extends BaseTour {
   constructor(document: Element, isDetailed: boolean = false) {
      super();
      this.club = 5;

      if (!document) {
         return
      }

      if (isDetailed) {
         this.getPrice(document);
         this.getImage(document);
         this.getDescription(document);
         this.getRegion(document);
      } else {
         this.getTitle(document);
         this.getDate(document);
         this.getLink(document);

         // FIXME: оно все равно не пишетася в базу, нужно подумать
         this.getDifficulty(document);
      }
   }

   public getTitle(document: Element): void {
      try {
         this.title = document.querySelector('.dscr-wrapper .title')?.textContent?.trim() as string;
      } catch (e) {
         this.post.title = e.message;
         this.type = 'error';
      }
   }

   public getDate(document: Element): void {
      try {
         const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября',
            'Октября', 'Ноября', 'Декабря'];
         let dates: RegExpMatchArray | string = document.querySelector('.dscr-wrapper .info-wrapper .col')?.textContent?.trim() as string;
         // @ts-ignore
         dates = dates.match(/(\d+)\s*(\W*)\s*(\d*) — (\d+) (\W*) (\d+)/i);

         let month_to: string | number = months.indexOf(dates[5].trim()) + 1;
         month_to = month_to < 10 ? `0${month_to}` : month_to;
         // @ts-ignore
         let day_to = dates[4] < 10 ? `0${dates[4]}` : dates[4];

         let year_from = dates[3] || dates[6];
         let month_from: string | number = dates[2] || dates[5];
         // @ts-ignore
         let day_from = dates[1] < 10 ? `0${dates[1]}` : dates[1];
         month_from = months.indexOf(month_from.trim()) + 1;
         month_from = month_from < 10 ? `0${month_from}` : month_from;
         this.date_from = `${year_from}-${month_from}-${day_from}T00:00:00Z`;
         this.date_to = `${dates[6]}-${month_to}-${day_to}T00:00:00Z`;
      } catch (e) {
         this.post.date_from = e.message;
         this.post.date_to = e.message;
         this.type = 'error';
      }
   }

   public getLink(document: Element): void {
      try {
         const host = 'https://mwtravel.ru/';
         this.link = host + document.querySelector('.title')?.getAttribute('href');
      } catch (e) {
         this.post.link = e.message;
         this.type = 'error';
      }
   }

   public getDifficulty(document: Element): void {
      try {
         switch (document.querySelector('.difficulty-link')?.id) {
            case 'easy':
               this.difficulty = 1;
               break;
            case 'complicated':
               this.difficulty = 2;
               break;
            case 'normal':
               this.difficulty = 3;
               break;
            case 'hard':
               this.difficulty = 4;
               break;
            case 'very_hard':
               this.difficulty = 4;
               break;
         }
      } catch (e) {
         this.post.link = e.message;
         this.type = 'error';
      }
   }

   //  Далее методы для получения более подробной информации

   public getRegion(document: Element): void {
      try {
         const crumbs = document.querySelectorAll('.breadcrumbs a')
         this.region = crumbs[crumbs.length - 1]?.textContent as string;
      } catch (e) {
         this.post.region = e.message;
      }
   }

   public getPrice(document: Element): void {
      try {
         const price = document.querySelector('#tour_payment strong')?.textContent;
         // @ts-ignore
         this.price = +price.replace(/[\s, \W]/g, '');
      } catch (e) {
         this.post.price = e.message;
         this.type = 'error';
      }
   }

   public getImage(document: Element): void {
      try {
         let image = document.querySelector<HTMLElement>('.header-image')?.style.backgroundImage as string;
         image = image.replace(/url\(/g, '').replace(/\)/g, '')
         this.image = image;
      } catch (e) {
         this.post.image = e.message;
         this.type = 'error';
      }
   }

   public getDescription(document: Element): void {
      try {
         let description = document.querySelector('#tour_about')?.textContent?.trim() as string;
         description = description.replace('/\n/g',' ');
         this.description = description;
      } catch (e) {
         this.post.description = e.message;
         this.type = 'error';
      }
   }
}
