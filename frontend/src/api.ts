import { createClient } from '@metagptx/web-sdk';

// Create the API client instance
export const client = createClient();

// Export commonly used methods for convenience
export const api = {
  auth: client.auth,
  entities: client.entities,
  apiCall: client.apiCall,
};
