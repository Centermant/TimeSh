-- backend/src/db/schema.sql
-- 1. Таблица подразделений
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    guid VARCHAR(255) UNIQUE NOT NULL, -- GUID подразделения
    name TEXT NOT NULL
);

-- 2. Таблица штатных должностей
CREATE TABLE IF NOT EXISTS positions (
    id SERIAL PRIMARY KEY,
    pos_id VARCHAR(255) UNIQUE NOT NULL, -- Внешний идентификатор должности
    title TEXT NOT NULL,
    total_rate DECIMAL(3, 2) NOT NULL DEFAULT 1.00 -- Общее количество ставок на должность
);

-- 3. Таблица сотрудников
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    emp_id VARCHAR(255) UNIQUE NOT NULL, -- Условный Т-номер
    full_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL -- Всегда хранить хеш, а не plain text!
);

-- 4. Таблица исполнения должностей (связывает сотрудников и должности)
CREATE TABLE IF NOT EXISTS employee_positions (
    id SERIAL PRIMARY KEY,
    emp_id VARCHAR(255) REFERENCES employees(emp_id) ON DELETE CASCADE,
    pos_id VARCHAR(255) REFERENCES positions(pos_id) ON DELETE CASCADE,
    assigned_rate DECIMAL(3, 2) NOT NULL DEFAULT 1.00, -- Количество ставок у конкретного сотрудника на эту должность
    UNIQUE(emp_id, pos_id) -- Один сотрудник не может дважды занимать одну и ту же должность
);

-- 5. Таблица отметок о времени
CREATE TABLE IF NOT EXISTS timesheets (
    id SERIAL PRIMARY KEY,
    emp_id VARCHAR(255) REFERENCES employees(emp_id) ON DELETE CASCADE,
    pos_id VARCHAR(255) REFERENCES positions(pos_id) ON DELETE CASCADE, -- Для отметки на конкретной должности
    date_work DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Вспомогательный триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_timesheets_updated_at BEFORE UPDATE ON timesheets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Индексы для ускорения поиска
CREATE INDEX IF NOT EXISTS idx_timesheets_emp_date ON timesheets(emp_id, date_work);
CREATE INDEX IF NOT EXISTS idx_employee_positions_emp ON employee_positions(emp_id);
CREATE INDEX IF NOT EXISTS idx_timesheets_pos ON timesheets(pos_id);