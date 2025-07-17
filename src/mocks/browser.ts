import { setupWorker } from 'msw/browser';
import { mockWeatherLocationHandlers } from './mockWeatherLocationHandlers';
import { mockCategoriesHandlers } from './mockCategoriesHandler';

export const worker = setupWorker(
  ...mockWeatherLocationHandlers,
  ...mockCategoriesHandlers
);
