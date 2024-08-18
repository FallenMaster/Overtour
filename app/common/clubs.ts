import { parseGoraRoutes } from '#common/clubs/gora';
import { parseWolfinRoutes } from '#common/clubs/wolfin';
import { parseYetiRoutes } from '#common/clubs/yeti';
import Route from '#models/route';
import Tour from '#models/tour';

export enum Club {
  Strannik = 1,
  Vpohod = 2,
  Perehod = 3,
  Pik = 4,
  Myway = 5,
  Perezagruzka = 6,
  Voshod = 7,
  BezGranits = 8,
  Gora = 9,
  Wolfin = 10,
  Yeti = 11,
}

export interface ClubInfo {
  id: Club;
  url: string;
  links: string[];
  selectors: {
    listItem: string;
    title: string;
    link: string | null;
  };
  parseDetails: (
    route: Route,
    document: Document,
  ) => { route: Pick<Route, 'id' | 'title' | 'link' | 'club'>; tours: Pick<Tour, 'dateFrom' | 'dateTo' | 'price'>[] };
}

interface Clubs {
  [key: number]: ClubInfo;
}

export const clubs: Clubs = {
  [Club.Strannik]: {
    id: Club.Strannik,
    url: 'https://clubstrannik.ru',
    links: [
      'https://clubstrannik.ru/altay',
      'https://clubstrannik.ru/tury-v-adygeyu',
      'https://clubstrannik.ru/baykal',
      'https://clubstrannik.ru/kavkaz',
      'https://clubstrannik.ru/kareliya',
      'https://clubstrannik.ru/kamchatka',
      'https://clubstrannik.ru/komandory',
      'https://clubstrannik.ru/krym',
      'https://clubstrannik.ru/voshozhdenie-na-elbrus',
    ],
    selectors: {
      listItem: '.row .center_block .regions .card_item',
      title: '.block_image .text',
      link: 'a',
    },
    parseDetails: (): any => {},
  },
  [Club.Vpohod]: {
    id: Club.Vpohod,
    url: 'https://www.vpoxod.ru',
    links: [
      'https://www.vpoxod.ru/route/altai?per-page=48&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/baikal?per-page=48&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/beloe-more?_pjax=%23routes-container&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/elbrus?sort=name&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/dagestan?per-page=24&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/dalniy_vostok?per-page=48&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/ingushetia?sort=name&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/caucasus?per-page=48&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/caucasus?per-page=48&_pjax=%23routes-container&page=2&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/caucasus?per-page=48&_pjax=%23routes-container&page=3&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/caucasus?per-page=48&_pjax=%23routes-container&page=4&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/kaliningrad?sort=name&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/kamchatka?per-page=24&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/karelia?per-page=48&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/karelia?per-page=48&_pjax=%23routes-container&page=2&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/karelia?per-page=48&_pjax=%23routes-container&page=3&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/kolskiy?per-page=48&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/krim_routes?per-page=48&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/ladoga?per-page=24&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/putorana?sort=name&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/podmoskovje?per-page=48&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/podmoskovje?per-page=48&_pjax=%23routes-container&page=2&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/podmoskovje?per-page=48&_pjax=%23routes-container&page=3&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/podmoskovje?per-page=48&_pjax=%23routes-container&page=4&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/podmoskovje?per-page=48&_pjax=%23routes-container&page=5&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/podmoskovje?per-page=48&_pjax=%23routes-container&page=6&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/podmoskovje?per-page=48&_pjax=%23routes-container&page=7&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/prielbrusye?per-page=24&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/sahalin?sort=name&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/severnaya-osetiya?sort=name&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/nw?per-page=48&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/nw?per-page=48&_pjax=%23routes-container&page=2&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/nw?per-page=48&_pjax=%23routes-container&page=3&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/nw?per-page=48&_pjax=%23routes-container&page=4&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/nw?per-page=48&_pjax=%23routes-container&page=5&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/nw?per-page=48&_pjax=%23routes-container&page=6&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/seliger?sort=name&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/siberia?per-page=48&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/siberia?per-page=48&_pjax=%23routes-container&page=2&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/ural?per-page=48&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/hibiny?sort=name&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/chukotka?sort=name&_pjax=%23routes-container',
      'https://www.vpoxod.ru/route/ug_rossii?sort=name&_pjax=%23routes-container',
    ],
    selectors: {
      listItem: 'article .main_page_hike_title',
      title: 'a',
      link: 'a',
    },
    parseDetails: (): any => {},
  },
  [Club.Perehod]: {
    id: Club.Perehod,
    url: 'https://club-perexod.ru',
    links: [
      'https://club-perexod.ru/marshruty/rossiya/sibir/altay/',
      'https://club-perexod.ru/marshruty/rossiya/sibir/baykal/',
      'https://club-perexod.ru/marshruty/rossiya/kavkaz/',
      'https://club-perexod.ru/marshruty/rossiya/kamchatka/',
      'https://club-perexod.ru/marshruty/rossiya/kareliya/',
      'https://club-perexod.ru/marshruty/rossiya/kolskiy-poluostrov/',
      'https://club-perexod.ru/marshruty/rossiya/krym/',
      'https://club-perexod.ru/marshruty/rossiya/leningradskaya-oblast/',
      'https://club-perexod.ru/marshruty/rossiya/podmoskove/',
      'https://club-perexod.ru/marshruty/rossiya/pskovskaya-oblast/',
      'https://club-perexod.ru/marshruty/rossiya/sakhalin/',
      'https://club-perexod.ru/marshruty/rossiya/seliger/',
      'https://club-perexod.ru/marshruty/rossiya/sibir/',
      'https://club-perexod.ru/marshruty/rossiya/elbrus/',
    ],
    selectors: {
      listItem: 'tr.b-schedule-table__border-line',
      title: '.b-schedule-table__name',
      link: '.b-schedule-table__name a',
    },
    parseDetails: (): any => {},
  },
  [Club.Pik]: {
    id: Club.Pik,
    url: 'https://turclub-pik.ru',
    links: [
      'https://turclub-pik.ru/search/region/altaj/?page=32&limit=20&routes_limit=20&regions=3,6,7,2,36,24,41,44,66,68,76,65,69,75,81,70,88,67,60,4',
    ],
    selectors: {
      listItem: '.trip-card',
      title: '.trip-card-title',
      link: '.head a',
    },
    parseDetails: (): any => {},
  },
  [Club.Myway]: {
    id: Club.Myway,
    url: 'https://mwtravel.ru',
    links: ['https://mwtravel.ru/travel-all/'],
    selectors: {
      listItem: '.alltravels .d-block.d-lg-none .row .tour-line',
      title: '.title',
      link: 'a',
    },
    parseDetails: (): any => {},
  },
  [Club.Perezagruzka]: {
    id: Club.Perezagruzka,
    url: 'https://nepohod.ru',
    links: [
      'https://nepohod.ru/raspisanie?region=%D0%9F%D0%BE%D0%B4%D0%BC%D0%BE%D1%81%D0%BA%D0%BE%D0%B2%D1%8C%D0%B5+%F0%9F%8F%A1%2C+%D0%9A%D1%80%D1%8B%D0%BC+%F0%9F%8C%85%2C+%D0%9F%D1%80%D0%B8%D1%8D%D0%BB%D1%8C%D0%B1%D1%80%D1%83%D1%81%D1%8C%D0%B5%F0%9F%8F%94%2C+%D0%9A%D0%B0%D1%80%D0%B5%D0%BB%D0%B8%D1%8F+%F0%9F%8D%84%2C+%D0%9A%D0%BE%D0%BB%D1%8C%D1%81%D0%BA%D0%B8%D0%B9+%D0%BF%D0%BE%D0%BB%D1%83%D0%BE%D1%81%D1%82%D1%80%D0%BE%D0%B2+%F0%9F%8C%8C%2C+%D0%A2%D0%B2%D0%B5%D1%80%D1%81%D0%BA%D0%B0%D1%8F+%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C%2C+%D0%9A%D0%B0%D0%BC%D1%87%D0%B0%D1%82%D0%BA%D0%B0%2C+%D0%90%D0%BB%D1%82%D0%B0%D0%B9%2C+%D0%A5%D0%B8%D0%B1%D0%B8%D0%BD%D1%8B%2C+%D0%A2%D1%83%D0%BB%D1%8C%D1%81%D0%BA%D0%B0%D1%8F+%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C%2C+%D0%9A%D0%B0%D0%BB%D1%83%D0%B6%D1%81%D0%BA%D0%B0%D1%8F+%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C%2C+%D0%92%D0%BE%D1%80%D0%BE%D0%BD%D0%B5%D0%B6%D1%81%D0%BA%D0%B0%D1%8F+%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C%2C+%D0%A0%D1%8F%D0%B7%D0%B0%D0%BD%D1%81%D0%BA%D0%B0%D1%8F+%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C%2C+%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D0%BE%D0%B4%D0%B0%D1%80%D1%81%D0%BA%D0%B8%D0%B9+%D0%BA%D1%80%D0%B0%D0%B9%2C+%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BC%D0%B8%D1%80%D1%81%D0%BA%D0%B0%D1%8F+%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C%2C+%D0%A1%D0%B8%D0%B1%D0%B8%D1%80%D1%8C%2C+%D0%9A%D0%B0%D0%BB%D0%B8%D0%BD%D0%B8%D0%BD%D0%B3%D1%80%D0%B0%D0%B4%2C+%D0%94%D0%B0%D0%B3%D0%B5%D1%81%D1%82%D0%B0%D0%BD%2C+%D0%90%D1%80%D1%85%D1%8B%D0%B7%2C+%D0%94%D0%BE%D0%BC%D0%B1%D0%B0%D0%B9%2C+%D0%A1%D0%B5%D0%B2%D0%B5%D1%80%D0%BD%D0%B0%D1%8F+%D0%9E%D1%81%D0%B5%D1%82%D0%B8%D1%8F',
    ],
    selectors: {
      listItem: '.w-elements-cell',
      title: '.button-container .text',
      link: 'a',
    },
    parseDetails: (): any => {},
  },
  [Club.Voshod]: {
    id: Club.Voshod,
    url: 'https://club-voshod.com',
    links: [
      'https://club-voshod.com/marshruti/kavkaz/prielbruse/',
      'https://club-voshod.com/marshruti/kavkaz/dombay/',
      'https://club-voshod.com/marshruti/kavkaz/arhyz/',
      'https://club-voshod.com/marshruti/kavkaz/prielbruse/',
      'https://club-voshod.com/marshruti/kavkaz/severnaya_osetiya/',
      'https://club-voshod.com/marshruti/kavkaz/ingushetiya/',
      'https://club-voshod.com/marshruti/kavkaz/bezengi/',
      'https://club-voshod.com/marshruti/kavkaz/verhnyaya_balkariya/',
      'https://club-voshod.com/marshruti/kavkaz/dagestan/',
      'https://club-voshod.com/marshruti/kavminvody/',
      'https://club-voshod.com/marshruti/krasnodarskiy_kray/',
      'https://club-voshod.com/marshruti/baikal/',
      'https://club-voshod.com/marshruti/ergaki/',
      'https://club-voshod.com/marshruti/altai/',
      'https://club-voshod.com/marshruti/kolskiy/',
      'https://club-voshod.com/marshruti/podmoskovie/',
      'https://club-voshod.com/marshruti/sheregesh/',
      'https://club-voshod.com/marshruti/kazan/',
    ],
    selectors: {
      listItem: '.catalog li',
      title: 'a',
      link: 'a',
    },
    parseDetails: (): any => {},
  },
  [Club.BezGranits]: {
    id: Club.BezGranits,
    url: 'https://no-borders.ru',
    links: [
      'https://no-borders.ru/yakutiya/',
      'https://no-borders.ru/kareliya-i-lenoblast/',
      'https://no-borders.ru/plato-putorana/',
      'https://no-borders.ru/chukotka/',
      'https://no-borders.ru/kolskij/',
      'https://no-borders.ru/ural/',
    ],
    selectors: {
      listItem: '.uk-card',
      title: '.el-title',
      link: null,
    },
    parseDetails: (): any => {},
  },
  [Club.Gora]: {
    id: Club.Gora,
    url: 'https://gora-club.ru',
    links: [
      'https://gora-club.ru/travel/altaj/',
      'https://gora-club.ru/travel/bajkal1/',
      'https://gora-club.ru/travel/dalnij-vostok/',
      'https://gora-club.ru/travel/kavkaz/',
      'https://gora-club.ru/travel/kolskij-poluostrov/',
      'https://gora-club.ru/travel/sibir/',
      'https://gora-club.ru/travel/ural/',
    ],
    selectors: {
      listItem: '.tour',
      title: '.name a',
      link: 'a',
    },
    parseDetails: parseGoraRoutes,
  },
  [Club.Wolfin]: {
    id: Club.Wolfin,
    url: 'https://www.wolfin.ru',
    links: ['https://www.wolfin.ru/trips/'],
    selectors: {
      listItem: '.event-card',
      title: '.event-card__title a',
      link: 'a',
    },
    parseDetails: parseWolfinRoutes,
  },
  [Club.Yeti]: {
    id: Club.Yeti,
    url: 'https://pohod.me',
    links: [
      'https://pohod.me/destinations/altaj/',
      'https://pohod.me/tour-destination/baikal/',
      'https://pohod.me/tour-destination/zapadnye-sayany/',
      'https://pohod.me/destinations/poxody-po-zabajkalyu/',
      'https://pohod.me/destinations/poxody-po-magadanskoj-oblasti/',
      'https://pohod.me/destinations/poxody-po-kavkazu/',
      'https://pohod.me/destinations/kamchatka/',
      'https://pohod.me/destinations/poxody-po-kolyme/',
      'https://pohod.me/tour-destination/kolskij-poluostrov/',
      'https://pohod.me/destinations/putorana_plato/',
      'https://pohod.me/destinations/kurilskie-ostrova/',
      'https://pohod.me/destinations/ural/',
    ],
    selectors: {
      listItem: '.tourmaster-tour-grid-inner',
      title: '.tourmaster-tour-title a',
      link: '.tourmaster-tour-title a',
    },
    parseDetails: parseYetiRoutes,
  },
};
