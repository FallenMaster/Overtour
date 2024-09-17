import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';

const AuthController = () => import('#controllers/auth');
const CrawlerController = () => import('#controllers/crawler');
const FoodCalculatorController = () => import('#controllers/food_calculator');
const ToursController = () => import('#controllers/tours');

router
  .group(() => {
    router.get('tours', [ToursController, 'getTours']);
    router.get('tours/:id', [ToursController, 'getTour']);
    router.get('regions', [ToursController, 'getRegions']);

    router.group(() => {
      router.get('crawler/club/:id', [CrawlerController, 'parseClubRoutes']);
      router.get('crawler/club/:id/detailed', [CrawlerController, 'parseTours']);
    });
    // .use([middleware.auth(), middleware.admin()]);

    // TODO сделать основным парсером
    router.get('routes', [ToursController, 'getRoutes']);

    router.get('dish', [FoodCalculatorController, 'dishList']);
    router.get('menu', [FoodCalculatorController, 'menuList']);
    router.get('ingredient', [FoodCalculatorController, 'ingredientsList']);

    router
      .group(() => {
        router.post('register', [AuthController, 'register']);
        router.post('login', [AuthController, 'login']);
        router.get('session', [AuthController, 'getSession']);
        router.post('logout', [AuthController, 'logout']);
        router.get('user', [AuthController, 'getUserInfo']);
      })
      .prefix('/auth');

    router
      .group(() => {
        router.post('dish', [FoodCalculatorController, 'addDish']).use(middleware.auth());
        router.put('dish/:id', [FoodCalculatorController, 'editDish']);
        router.delete('dish/:id', [FoodCalculatorController, 'deleteDish']);
        router.post('dish/is_used/:id', [FoodCalculatorController, 'checkIsDishUsed']);
        router.post('ingredient', [FoodCalculatorController, 'addIngredient']);
        router.put('ingredient/:id', [FoodCalculatorController, 'editIngredient']);
        router.delete('ingredient/:id', [FoodCalculatorController, 'deleteIngredient']);
        router.post('menu', [FoodCalculatorController, 'addMenu']);
        router.put('menu/:id/choose', [FoodCalculatorController, 'chooseMenu']);
        router.put('menu/:id', [FoodCalculatorController, 'updateMenu']);
        router.delete('menu/:id', [FoodCalculatorController, 'deleteMenu']);
      })
      .use([middleware.auth()]);
  })
  .prefix('/api');

router.get('/', () => 'It works!');
