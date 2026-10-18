import { http, HttpResponse, delay } from 'msw';
import { getDb, saveDb, type UserWithSecret } from '../db';
import { getScenarioConfig } from '../scenarios';

function extractUserId(request: Request): string | null {
  const auth = request.headers.get('Authorization');
  if (!auth) return null;
  const match = auth.match(/token_(user_[^_\s]+)/);
  return match ? match[1] ?? null : null;
}

function stripSecret(user: UserWithSecret) {
  const { passwordHash: _hash, ...safeUser } = user;
  return safeUser;
}

export const profileHandlers = [
  http.get('/api/profile', async ({ request }) => {
    const scenario = getScenarioConfig();
    await delay(scenario.latencyMs);

    const userId = extractUserId(request);
    if (!userId) {
      return HttpResponse.json({ error: 'Unauthorized', message: 'Não autenticado' }, { status: 401 });
    }

    const db = getDb();
    const user = db.users.find((u) => u.id === userId);
    if (!user) {
      return HttpResponse.json({ error: 'NotFound', message: 'Perfil não encontrado' }, { status: 404 });
    }

    return HttpResponse.json(stripSecret(user));
  }),

  http.put('/api/profile', async ({ request }) => {
    const scenario = getScenarioConfig();
    await delay(scenario.latencyMs);

    const userId = extractUserId(request);
    if (!userId) {
      return HttpResponse.json({ error: 'Unauthorized', message: 'Não autenticado' }, { status: 401 });
    }

    const body = (await request.json()) as { name?: string; username?: string; bio?: string; avatarUrl?: string };
    const { name, username, bio, avatarUrl } = body;

    const db = getDb();
    const user = db.users.find((u) => u.id === userId);
    if (!user) {
      return HttpResponse.json({ error: 'NotFound', message: 'Usuário não encontrado' }, { status: 404 });
    }

    // Verificar unicidade de username se alterado
    if (username && username !== user.username) {
      const conflict = db.users.find((u) => u.username === username && u.id !== userId);
      if (conflict) {
        return HttpResponse.json({ error: 'Conflict', message: 'Nome de usuário já está em uso' }, { status: 409 });
      }
      user.username = username;
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

    saveDb(db);
    return HttpResponse.json(stripSecret(user));
  }),

  http.post('/api/profile/change-password', async ({ request }) => {
    const scenario = getScenarioConfig();
    await delay(scenario.latencyMs);

    const userId = extractUserId(request);
    if (!userId) {
      return HttpResponse.json({ error: 'Unauthorized', message: 'Não autenticado' }, { status: 401 });
    }

    const body = (await request.json()) as { currentPassword?: string; newPassword?: string };
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return HttpResponse.json({ error: 'ValidationError', message: 'Senhas incompletas' }, { status: 400 });
    }

    const db = getDb();
    const user = db.users.find((u) => u.id === userId);
    if (!user) {
      return HttpResponse.json({ error: 'NotFound', message: 'Usuário não encontrado' }, { status: 404 });
    }

    if (currentPassword !== 'kurio123' && user.passwordHash !== 'e10adc3949ba59abbe56e057f20f883e') {
      return HttpResponse.json({ error: 'BadRequest', message: 'Senha atual incorreta' }, { status: 400 });
    }

    // Atualiza com hash simulado
    user.passwordHash = 'e10adc3949ba59abbe56e057f20f883e';
    saveDb(db);

    return HttpResponse.json({ success: true, message: 'Senha atualizada com sucesso' });
  }),
];
