import { HomePage, ProfilePage, MerchantsPage, TransactionsPage } from './pages';
import { withNavigationWatcher } from './contexts/navigation';

const routes = [
    {
        path: '/merchants',
        element: MerchantsPage
    },
    {
        path: '/transactions',
        element: TransactionsPage
    },
    {
        path: '/profile',
        element: ProfilePage
    },
    {
        path: '/home',
        element: HomePage
    }
];

export default routes.map(route => {
    return {
        ...route,
        element: withNavigationWatcher(route.element, route.path)
    };
});
