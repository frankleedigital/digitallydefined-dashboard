/**
 * Products service — product-related API operations.
 * Communicates only through ApiService.
 */
import api from './api';

export const ProductsService = {
  /** Fetch product catalog / product data */
  list: () => api.post('products.list'),

  /** Generate product concept from keyword */
  generate: (keyword) => api.post('fastapi.product', { inputData: { keyword } }),

  /** Fetch lead magnet definitions */
  leadMagnets: () => api.post('leadmagnets.list'),

  /** Fetch affiliate product data */
  affiliate: (url) => api.post('fastapi.affiliate', { inputData: { url } }),

  /** Rank-and-rent analysis */
  rankAndRent: (keyword, location) =>
    api.post('fastapi.rankrent', { inputData: { keyword, location } }),
};

export default ProductsService;