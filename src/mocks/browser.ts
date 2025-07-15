import { setupWorker } from 'msw/browser';
import { mockWeatherLocationHandlers } from './mockWeatherLocationHandlers';

export const worker = setupWorker(...mockWeatherLocationHandlers);
