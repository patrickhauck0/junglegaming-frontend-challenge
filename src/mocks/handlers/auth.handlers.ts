import { http, HttpResponse, delay } from 'msw';
import { getDb, saveDb, type UserWithSecret } from '../db';
import { getScenarioConfig } from '../scenarios';

function stripSecret(user: UserWithSecret) {
  const { passwordHash: _hash, ...safeUser } = user;
  return safeUser;
}

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const scenario = getScenarioConfig();
    await delay(scenario.latencyMs);

    if (scenario.errorMode === '500') {
      return HttpResponse.json({ error: 'InternalServerError', message: 'Erro interno simulado' }, { status: 500 });
    }

    const body = (await request.json()) as { emailOrUsername?: string; password?: string };
    const { emailOrUsername, password } = body;

    if (!emailOrUsername || !password) {
      return HttpResponse.json(
        { error: 'ValidationError', message: 'Credenciais incompletas' },
        { status: 400 }
      );
    }

    const db = getDb();
    const user = db.users.find(
      (u) => u.email === emailOrUsername || u.username === emailOrUsername
    );

    // Senha fixa simulada 'kurio123'
    if (!user || (password !== 'kurio123' && user.passwordHash !== 'e10adc3949ba59abbe56e057f20f883e')) {
      return HttpResponse.json(
        { error: 'Unauthorized', message: 'E-mail, usuário ou senha incorretos' },
        { status: 401 }
      );
    }

    const token = `token_${user.id}_${Date.now()}`;
    return HttpResponse.json({
      user: stripSecret(user),
      token,
    });
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const scenario = getScenarioConfig();
    await delay(scenario.latencyMs);

    const body = (await request.json()) as { name?: string; username?: string; email?: string; password?: string };
    const { name, username, email, password } = body;

    if (!name || !username || !email || !password) {
      return HttpResponse.json(
        { error: 'ValidationError', message: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    const db = getDb();
    const existing = db.users.find((u) => u.email === email || u.username === username);
    if (existing) {
      return HttpResponse.json(
        { error: 'Conflict', message: 'E-mail ou nome de usuário já cadastrado' },
        { status: 409 }
      );
    }

    const newUser: UserWithSecret = {
      id: `user_${Date.now()}`,
      name,
      username,
      email,
      passwordHash: 'e10adc3949ba59abbe56e057f20f883e', // Armazena hash
      avatarUrl: '/assets/nfts/emerald-ape.webp',
      bio: '',
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    saveDb(db);

    const token = `token_${newUser.id}_${Date.now()}`;
    return HttpResponse.json(
      {
        user: stripSecret(newUser),
        token,
      },
      { status: 201 }
    );
  }),

  http.get('/api/auth/session', async ({ request }) => {
    const scenario = getScenarioConfig();
    await delay(scenario.latencyMs);

    if (scenario.errorMode === '401') {
      return HttpResponse.json({ error: 'Unauthorized', message: 'Sessão expirada' }, { status: 401 });
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized', message: 'Não autenticado' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const userIdMatch = token.match(/token_(user_[^_\s]+)/);
    const userId = userIdMatch ? userIdMatch[1] : null;

    const db = getDb();
    const user = db.users.find((u) => u.id === userId);
    if (!user) {
      return HttpResponse.json({ error: 'Unauthorized', message: 'Usuário não encontrado' }, { status: 401 });
    }

    return HttpResponse.json({ user: stripSecret(user) });
  }),

  http.post('/api/auth/logout', async () => {
    const scenario = getScenarioConfig();
    await delay(scenario.latencyMs);
    return HttpResponse.json({ success: true, message: 'Sessão finalizada com sucesso' });
  }),
];
