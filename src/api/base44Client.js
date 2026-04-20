import { createClient } from '@base44/sdk';
import { appParams, isBase44Configured } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

const mockUser = {
  id: 'local-dev-user',
  full_name: 'Local Developer',
  email: 'local@vidvoice.dev',
  created_date: '2026-04-20T00:00:00.000Z',
  role: 'admin',
};

const createMockClient = () => ({
  auth: {
    async me() {
      return mockUser;
    },
    async updateMe(payload = {}) {
      return { ...mockUser, ...payload };
    },
    logout() {},
    redirectToLogin() {},
  },
});

export const base44 = isBase44Configured
  ? createClient({
      appId,
      token,
      functionsVersion,
      serverUrl: '',
      requiresAuth: false,
      appBaseUrl,
    })
  : createMockClient();
