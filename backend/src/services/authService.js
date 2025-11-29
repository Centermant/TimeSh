// backend/src/services/authService.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

class AuthService {
  async authenticate(db, username, password) {
    // 1. Найдем пользователя по логину, включая роль
    const query = 'SELECT id, emp_id, full_name, username, password_hash, role FROM employees WHERE username = $1';
    const { rows } = await db.query(query, [username]);
    const user = rows[0];

    if (!user) {
      console.log(`User ${username} not found.`);
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      console.log(`Password mismatch for user ${username}.`);
      return null;
    }

    // 2. Генерируем JWT токен, включая роль
    const token = jwt.sign(
      { id: user.id, emp_id: user.emp_id, username: user.username, role: user.role }, // Добавляем role в payload
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return {
      user: {
        id: user.id,
        emp_id: user.emp_id,
        full_name: user.full_name,
        username: user.username,
        role: user.role // Возвращаем роль в данных пользователя
      },
      token
    };
  }
}

export default new AuthService();