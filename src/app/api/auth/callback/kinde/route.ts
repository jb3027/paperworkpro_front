import { handleAuth, handleCallback } from '@kinde-oss/kinde-auth-nextjs/server';
import '../../../../../lib/kinde-config';

export const GET = handleCallback({
  onSuccess: async (request, response) => {
    // Redirect to dashboard after successful login
    return response.redirect(new URL('/', request.url));
  },
  onError: async (request, response) => {
    // Redirect to login page on error
    return response.redirect(new URL('/login', request.url));
  }
});
