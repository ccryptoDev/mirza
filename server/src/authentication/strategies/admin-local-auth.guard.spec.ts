import { AdminAuthGuard } from './admin-local-auth.guard';

describe('AdminLocalAuthGuard', () => {
  it('should be defined', () => {
    expect(new AdminAuthGuard()).toBeDefined();
  });
});
