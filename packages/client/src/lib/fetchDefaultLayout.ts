import { URI } from './api.config';

export async function fetchDefaultLayout() {
  const response = await fetch(`${URI}/default`);
  const data = await response.json();
  return data;
}