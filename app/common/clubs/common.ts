import { Club } from '#common/clubs';
import { Region } from '#common/regions';
import { Tag } from '#common/tags';

export default class CommonRoute {
  declare id: number;
  declare title: string;
  declare link: string;
  declare club: Club | null;
  declare difficulty: number | null;
  declare description: string | null;
  declare image: string | null;
  declare region: Region | null;
  declare tag: Tag | null;
}
