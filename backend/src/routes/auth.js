// backend/src/routes/auth.js
import authService from '../services/authService.js';

export default async function routes(fastify, options) {
  // POST /api/auth/login
  fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body;

    if (!username || !password) {
      return reply.code(400).send({ error: 'Username and password are required' });
    }

    try {
      const result = await authService.authenticate(fastify.pg, username, password);

      if (!result) {
        return reply.code(401).send({ error: 'Invalid username or password' });
      }

      // Успешная аутентификация
      reply.send({
        message: 'Login successful',
        user: result.user,
        token: result.token
      });
    } catch (err) {
      console.error('Login error:', err); // Логируем ошибку
      reply.code(500).send({ error: 'Internal Server Error during login' });
    }
  });
}