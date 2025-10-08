import { handleAuth } from '@kinde-oss/kinde-auth-nextjs/server';
import '../../../../lib/kinde-config';

export const GET = handleAuth();
