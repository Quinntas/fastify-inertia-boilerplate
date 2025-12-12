import { createRoot } from 'react-dom/client';
import { createInertiaApp, router } from '@inertiajs/react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import './css/app.css';

router.on('start', () => NProgress.start());
router.on('finish', () => NProgress.done());

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });
    return pages[`./pages/${name}.tsx`];
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});
