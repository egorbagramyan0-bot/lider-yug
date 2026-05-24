import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        booking: resolve(__dirname, 'booking.html'),
        faq: resolve(__dirname, 'faq.html'),
        'how-to-buy': resolve(__dirname, 'how-to-buy.html'),
        policy: resolve(__dirname, 'policy.html'),
        reviews: resolve(__dirname, 'reviews.html'),
        'rostov-volgograd': resolve(__dirname, 'rostov-volgograd.html'),
        terms: resolve(__dirname, 'terms.html'),
        'volgograd-rostov': resolve(__dirname, 'volgograd-rostov.html')
      }
    }
  }
});
