// public/scripts/main.js

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    const authInfoDiv = document.getElementById('authInfo');
    const loginFormDiv = document.getElementById('loginForm');
    // Заменили userDashboardDiv на timesheetSection
    const timesheetSection = document.getElementById('timesheetSection'); 
    const userNameSpan = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginFormElement = document.getElementById('loginFormElement');
    const loginError = document.getElementById('loginError');
    const positionsList = document.getElementById('positionsList');
    const checkInBtn = document.getElementById('checkInBtn');
    const checkOutBtn = document.getElementById('checkOutBtn');
    const timesheetDisplay = document.getElementById('timesheetDisplay');
    const reportMonthInput = document.getElementById('reportMonth');
    const getMonthlyReportBtn = document.getElementById('getMonthlyReportBtn');
    const monthlyReportDisplay = document.getElementById('monthlyReportDisplay');

    let selectedPositionId = null;

    if (token && user) {
        authInfoDiv.style.display = 'block';
        userNameSpan.textContent = user.full_name;
        // Заменили userDashboardDiv на timesheetSection
        timesheetSection.style.display = 'block'; 
        loadUserPositions(user.emp_id);
        loadTimesheetsForToday(user.emp_id);
    } else {
        loginFormDiv.style.display = 'block';
    }

    loginFormElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.reload();
            } else {
                const errorData = await response.json();
                loginError.textContent = errorData.error;
                loginError.style.display = 'block';
            }
        } catch (error) {
            console.error('Login error:', error);
            loginError.textContent = 'Ошибка сети';
            loginError.style.display = 'block';
        }
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
    });

    async function loadUserPositions(empId) {
        if (!token) {
            console.log('No token found');
            return;
        }

        try {
            const response = await fetch(`/api/timesheet/employee/${empId}/positions`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const positions = await response.json();
                positionsList.innerHTML = '<h3>Ваши должности:</h3>';
                if (positions.length === 0) {
                    positionsList.innerHTML += '<p>У вас пока нет назначенных должностей.</p>';
                    return;
                }

                positions.forEach(pos => {
                    const posDiv = document.createElement('div');
                    posDiv.className = 'position-item';
                    posDiv.innerHTML = `<span>${pos.position_title} (Ставка: ${pos.assigned_rate})</span>`;
                    posDiv.addEventListener('click', () => {
                        document.querySelectorAll('.position-item').forEach(el => el.classList.remove('selected'));
                        posDiv.classList.add('selected');
                        selectedPositionId = pos.pos_id;
                    });
                    positionsList.appendChild(posDiv);
                });

                localStorage.setItem('userPositions', JSON.stringify(positions));
            } else {
                const errorData = await response.json();
                positionsList.innerHTML = `<p>Ошибка загрузки должностей: ${errorData.error}</p>`;
            }
        } catch (error) {
            console.error('Load user positions error:', error);
            positionsList.innerHTML = '<p>Ошибка сети при загрузке должностей.</p>';
        }
    }

    checkInBtn.addEventListener('click', async () => {
        const empId = user.emp_id;
        if (!selectedPositionId) {
            alert('Пожалуйста, выберите должность для отметки.');
            return;
        }

        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const time = now.toTimeString().slice(0, 5);

        try {
            const response = await fetch('/api/timesheet/check-in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ emp_id: empId, pos_id: selectedPositionId, date_work: date, check_in_time: time })
            });

            if (response.ok) {
                const data = await response.json();
                alert('Приход отмечен!');
                loadTimesheetsForToday(empId);
            } else {
                const errorData = await response.json();
                alert(`Ошибка: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Check-in error:', error);
            alert('Ошибка сети');
        }
    });

    checkOutBtn.addEventListener('click', async () => {
        const empId = user.emp_id;
        if (!selectedPositionId) {
            alert('Пожалуйста, выберите должность для отметки.');
            return;
        }

        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const time = now.toTimeString().slice(0, 5);

        try {
            const response = await fetch('/api/timesheet/check-out', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ emp_id: empId, pos_id: selectedPositionId, date_work: date, check_out_time: time })
            });

            if (response.ok) {
                const data = await response.json();
                alert('Уход отмечен!');
                loadTimesheetsForToday(empId);
            } else {
                const errorData = await response.json();
                alert(`Ошибка: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Check-out error:', error);
            alert('Ошибка сети');
        }
    });

    async function loadTimesheetsForToday(empId) {
        if (!empId) return;

        const now = new Date();
        const dateWork = now.toISOString().split('T')[0];

        try {
            const response = await fetch(`/api/timesheet/emp/${empId}/date/${dateWork}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const timesheets = await response.json();
                timesheetDisplay.innerHTML = '<h3>Отметки на сегодня:</h3>';
                if (timesheets.length === 0) {
                    timesheetDisplay.innerHTML += '<p>Нет отметок.</p>';
                    return;
                }

                timesheets.forEach(ts => {
                    const tsDiv = document.createElement('div');
                    tsDiv.className = 'employee-card';
                    tsDiv.innerHTML = `<strong>Должность:</strong> ${ts.position_title} <br> <strong>Приход:</strong> ${ts.check_in || 'Не отмечен'} <br> <strong>Уход:</strong> ${ts.check_out || 'Не отмечен'}`;
                    timesheetDisplay.appendChild(tsDiv);
                });
            } else {
                timesheetDisplay.innerHTML = '<p>Ошибка загрузки отметок.</p>';
            }
        } catch (error) {
            console.error('Load timesheets error:', error);
            timesheetDisplay.innerHTML = '<p>Ошибка сети при загрузке отметок.</p>';
        }
    }

    getMonthlyReportBtn.addEventListener('click', async () => {
        const empId = user.emp_id;
        const month = reportMonthInput.value;

        if (!month) {
            alert('Пожалуйста, выберите месяц.');
            return;
        }

        try {
            const response = await fetch(`/api/timesheet/emp/${empId}/month/${month}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const timesheets = await response.json();
                monthlyReportDisplay.innerHTML = `<h3>Отчет за ${month}</h3>`;
                if (timesheets.length === 0) {
                    monthlyReportDisplay.innerHTML += '<p>Нет отметок за этот месяц.</p>';
                    return;
                }

                timesheets.forEach(ts => {
                    const tsDiv = document.createElement('div');
                    tsDiv.className = 'employee-card';
                    tsDiv.innerHTML = `<strong>Дата:</strong> ${ts.date_work} <br> <strong>Должность:</strong> ${ts.position_title} <br> <strong>Приход:</strong> ${ts.check_in || 'Не отмечен'} <br> <strong>Уход:</strong> ${ts.check_out || 'Не отмечен'}`;
                    monthlyReportDisplay.appendChild(tsDiv);
                });
            } else {
                monthlyReportDisplay.innerHTML = '<p>Ошибка загрузки отчета.</p>';
            }
        } catch (error) {
            console.error('Load monthly report error:', error);
            monthlyReportDisplay.innerHTML = '<p>Ошибка сети при загрузке отчета.</p>';
        }
    });
});