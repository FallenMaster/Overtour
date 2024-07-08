import type { HttpContext } from '@adonisjs/core/http';
import Dish from '#models/dish';
import Ingredient from '#models/ingredient';
import Menu from '#models/menu';

export default class FoodCalculator {
   async dishList({ auth }: HttpContext): Promise<Dish[]> {
      const userIdArray = await this._getUserArray(auth);
      return Dish
         .query()
         .select('id', 'title', 'type', 'ingredients', 'user_id')
         .whereIn('user_id', userIdArray)
         .orderBy('title', 'asc');
   }

   async addDish(context: HttpContext): Promise<Dish[]> {
      const { auth, request } = context;
      const data = { ...request.all(), ...{ user_id: auth.user!.id } };
      await Dish.create(data);
      return this.dishList(context);
   }

   async editDish({ request, params }: HttpContext) {
      return Dish
         .query()
         .where('id', params.id)
         .update(request.all());
   }

   async deleteDish(context: HttpContext): Promise<{ current?: string, dishList: Dish[] }> {
      const { auth, params, request } = context;
      const currentTimetable = request.all().current;
      const output: { current: any, dishList: Dish[] } = {
         current: null,
         dishList: [],
      };
      let isCurrentChanged = false;
      const updatedCurrentMenu = currentTimetable.map((content: any) => {
         content.dishes = content.meals.map((dish: any) => {
            dish.menu = dish.menu.filter((dishMenu: any) => {
               if (dishMenu.id === +params.id) {
                  isCurrentChanged = true;
                  return;
               }
               return dishMenu;
            });
            return dish;
         });
         return content;
      });

      if (isCurrentChanged) {
         output.current = updatedCurrentMenu;
      }

      await Dish
         .query()
         .where('id', params.id)
         .where('user_id', auth.user!.id)
         .delete();

      output.dishList = await this.dishList(context);

      const menus = await Menu.query().where('user_id', auth.user!.id);
      menus.forEach((menu) => {
         let isMenuChanged = false;
         const updatedMenu = JSON.parse(menu.content).map((content: any) => {
            content.meals.map((dish: any) => {
               dish.menu = dish.menu.filter((dishMenu: any) => {
                  if (dishMenu.id === +params.id) {
                     isMenuChanged = true;
                     return;
                  }
                  return dishMenu;
               });
               return dish;
            });
            return content
         })

         if (isMenuChanged) {
            menu.content = JSON.stringify(updatedMenu);
            menu.save();
         }
      });

      return output;
   }

   async checkIsDishUsed({ auth, params, request }: HttpContext): Promise<string[]> {
      const menus = await Menu.query().where('user_id', auth.user!.id);
      const currentTimetable = JSON.parse(request.all().current);
      let usedInMenus = new Set<string>();

      const checkDishes = (timetables: any, menuTitle: string) => {
         timetables.forEach((content: any) => {
            content.meals.forEach((dish: any) => {
               dish.menu.forEach((dishMenu: any) => {
                  if (dishMenu.id === +params.id) {
                     usedInMenus.add(menuTitle);
                  }
               });
            });
         });
      };
      checkDishes(currentTimetable, 'current');

      menus.forEach((menu) => {
         checkDishes(JSON.parse(menu.content), menu.title);
      });

      return Array.from(usedInMenus);
   }

   async ingredientsList({ auth }: HttpContext): Promise<Ingredient[]> {
      const userIdArray = await this._getUserArray(auth);
      return Ingredient.query()
         .select('id', 'title', 'type', 'count_caption', 'user_id')
         .whereIn('user_id', userIdArray)
         .orderBy('title');
   }

   async addIngredient(context: HttpContext): Promise<Ingredient[]> {
      const { auth, request } = context;
      const data = { ...request.all(), ...{ user_id: auth.user!.id } };
      await Ingredient.create(data);
      return this.ingredientsList(context);
   }

   async editIngredient(context: HttpContext): Promise<Ingredient[]> {
      const { auth, params, request } = context;
      await Ingredient
         .query()
         .where('id', params.id)
         .where('user_id', auth.user!.id)
         .update(request.all());

      return this.ingredientsList(context);
   }

   async deleteIngredient(context: HttpContext): Promise<Ingredient[]> {
      const { auth, params } = context;
      await Ingredient
         .query()
         .where('id', params.id)
         .where('user_id', auth.user!.id)
         .delete();

      return this.ingredientsList(context);
   }

   protected async _getUserArray(auth: HttpContext['auth']): Promise<number[]> {
      await auth.check();
      const userId = auth.user?.id;
      return userId && userId !== 1 ? [1, userId] : [1];
   }

   async menuList({ auth }: HttpContext): Promise<Menu[]> {
      try {
         await auth.check()
         const userId = auth.user!.id;

         return Menu.query()
            .select('id', 'title', 'content', 'settings', 'is_current', 'updated_at', 'user_id')
            .where('user_id', userId)
            .orderBy('id');
      } catch {
         return [];
      }
   }

   async addMenu(context: HttpContext): Promise<Menu[]> {
      const { auth, request } = context;
      const data = { ...request.all(), ...{ user_id: auth.user!.id } };
      await Menu.create(data);
      return this.menuList(context);
   }

   async updateMenu(context: HttpContext): Promise<Menu[]> {
      const { auth, params, request } = context;
      const updatedData = request.all();
      updatedData.updated_at = new Date();
      await Menu
         .query()
         .where('id', params.id)
         .where('user_id', auth.user!.id)
         .update(request.all());

      return this.menuList(context);
   }

   async chooseMenu(context: HttpContext): Promise<Menu[]> {
      const { params, auth } = context;

      await Menu
         .query()
         .where('user_id', auth.user!.id)
         .update({
            'is_current': 0,
         });

      const currentMenu = await Menu.find(params.id);
      currentMenu!.is_current = true;
      await currentMenu!.save();

      return this.menuList(context);
   }

   async deleteMenu(context: HttpContext): Promise<Menu[]> {
      const { params } = context;
      const menu = await Menu.find(params.id)
      if (menu) {
         await menu.delete();
      }

      return this.menuList(context);
   }
}
