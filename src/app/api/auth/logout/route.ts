import { handleAuth, handleLogout } from '@kinde-oss/kinde-auth-nextjs/server';
import '../../../../lib/kinde-config';

export const GET = handleLogout({
  afterLogout: async (request, response) => {
    // Redirect to login page after logout
    return response.redirect(new URL('/login', request.url));
  }
});
