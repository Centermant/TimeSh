function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

async function loadDepartmentsForPosition() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        console.error('Token not found for loading departments');
        return;
    }

    try {
        const response = await fetch('/api/admin/departments', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const departments = await response.json();
            const departmentGuidSelect = document.getElementById('departmentGuid');
            departmentGuidSelect.innerHTML = '<option value="">Выберите подразделение</option>';
            departments.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept.guid;
                option.textContent = `${dept.name} (${dept.guid})`;
                departmentGuidSelect.appendChild(option);
            });
        } else {
            console.error('Failed to load departments for position dropdown');
        }
    } catch (error) {
        console.error('Load departments for position error:', error);
    }
}

async function deleteEmployee(empId) {
    if (!confirm(`Вы уверены, что хотите удалить сотрудника с Т-номером ${empId}?`)) {
        return;
    }
    const token = localStorage.getItem('adminToken');
    if (!token) {
        alert('Ошибка: токен администратора не найден.');
        return;
    }
    try {
        const response = await fetch(`/api/admin/employees/${empId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            alert('Сотрудник удален!');
            loadEmployeesList();
            loadEmployeesForAssignment();
        } else {
            const errorData = await response.json();
            alert(`Ошибка: ${errorData.error}`);
        }
    } catch (error) {
        console.error('Delete employee error:', error);
        alert('Ошибка сети');
    }
}

async function deleteDepartment(guid) {
    if (!confirm(`Вы уверены, что хотите удалить подразделение с GUID ${guid}?`)) {
        return;
    }
    const token = localStorage.getItem('adminToken');
    if (!token) {
        alert('Ошибка: токен администратора не найден.');
        return;
    }
    try {
        const response = await fetch(`/api/admin/departments/${guid}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            alert('Подразделение удалено!');
            loadDepartmentsList();
        } else {
            const errorData = await response.json();
            alert(`Ошибка: ${errorData.error}`);
        }
    } catch (error) {
        console.error('Delete department error:', error);
        alert('Ошибка сети');
    }
}

async function deletePosition(posId) {
    if (!confirm(`Вы уверены, что хотите удалить должность с ID ${posId}?`)) {
        return;
    }
    const token = localStorage.getItem('adminToken');
    if (!token) {
        alert('Ошибка: токен администратора не найден.');
        return;
    }
    try {
        const response = await fetch(`/api/admin/positions/${posId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            alert('Должность удалена!');
            loadPositionsList();
            loadPositionsForAssignment();
        } else {
            const errorData = await response.json();
            alert(`Ошибка: ${errorData.error}`);
        }
    } catch (error) {
        console.error('Delete position error:', error);
        alert('Ошибка сети');
    }
}

async function deleteAssignment(assignmentId) {
    if (!confirm(`Вы уверены, что хотите удалить привязку с ID ${assignmentId}?`)) {
        return;
    }
    const token = localStorage.getItem('adminToken');
    if (!token) {
        alert('Ошибка: токен администратора не найден.');
        return;
    }
    try {
        const response = await fetch(`/api/admin/assignments/${assignmentId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            alert('Привязка удалена!');
            loadAssignmentsList();
            loadEmployeesList();
        } else {
            const errorData = await response.json();
            alert(`Ошибка: ${errorData.error}`);
        }
    } catch (error) {
        console.error('Delete assignment error:', error);
        alert('Ошибка сети');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('adminToken');
    const adminUser = JSON.parse(localStorage.getItem('adminUser'));
    const adminAuthInfoDiv = document.getElementById('adminAuthInfo');
    const adminLoginFormDiv = document.getElementById('adminLoginForm');
    const adminPanelDiv = document.getElementById('adminPanel');
    const adminUserNameSpan = document.getElementById('adminUserName');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    const adminLoginFormElement = document.getElementById('adminLoginFormElement');
    const adminLoginError = document.getElementById('adminLoginError');
    const addEmployeeForm = document.getElementById('addEmployeeForm');
    const addDepartmentForm = document.getElementById('addDepartmentForm');
    const addPositionForm = document.getElementById('addPositionForm');
    const assignPositionForm = document.getElementById('assignPositionForm');
    const reportForm = document.getElementById('reportForm');
    const reportDisplay = document.getElementById('reportDisplay');
    const employeesList = document.getElementById('employeesList');
    const departmentsList = document.getElementById('departmentsList');
    const positionsList = document.getElementById('positionsList');
    const assignmentsList = document.getElementById('assignmentsList');
    const assignEmpIdSelect = document.getElementById('assignEmpId');
    const assignPosIdSelect = document.getElementById('assignPosId');
    const assignPositionError = document.getElementById('assignPositionError');

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    if (token && adminUser) {
        adminAuthInfoDiv.style.display = 'block';
        adminUserNameSpan.textContent = adminUser.username;
        adminPanelDiv.style.display = 'block';
        loadEmployeesList();
        loadDepartmentsList();
        loadPositionsList();
        loadAssignmentsList();
        loadEmployeesForAssignment();
        loadPositionsForAssignment();
        loadDepartmentsForPosition();
    } else {
        adminLoginFormDiv.style.display = 'block';
    }

    adminLoginFormElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.user.role !== 'admin') {
                    alert('Доступ запрещен. Только администратор может использовать эту панель.');
                    return;
                }
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', JSON.stringify(data.user));
                window.location.reload();
            } else {
                const errorData = await response.json();
                adminLoginError.textContent = errorData.error;
                adminLoginError.style.display = 'block';
            }
        } catch (error) {
            console.error('Admin login error:', error);
            adminLoginError.textContent = 'Ошибка сети';
            adminLoginError.style.display = 'block';
        }
    });

    adminLogoutBtn.addEventListener('click', () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.reload();
    });

    async function loadEmployeesList() {
        try {
            const response = await fetch('/api/admin/employees', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const employees = await response.json();
                employeesList.innerHTML = '';
                employees.forEach(emp => {
                    const empDiv = document.createElement('div');
                    empDiv.className = 'employee-card';
                    empDiv.innerHTML = `
                        <div>
                            <strong>${emp.full_name}</strong> (Т-номер: ${emp.emp_id})<br>
                            ДР: ${formatDate(emp.date_of_birth)}, Логин: ${emp.username}<br>
                            <strong>Должности:</strong><br>
                            ${emp.positions.length > 0 ? emp.positions.map(p => `${p.title} (Ставка: ${p.assigned_rate})`).join('<br>') : 'Нет назначенных должностей'}
                        </div>
                        <button class="delete-btn" onclick="deleteEmployee('${emp.emp_id}')">Удалить</button>
                    `;
                    employeesList.appendChild(empDiv);
                });
            } else {
                const errorData = await response.json();
                employeesList.innerHTML = `<p>Ошибка загрузки списка сотрудников: ${errorData.error}</p>`;
            }
        } catch (error) {
            console.error('Load employees list error:', error);
            employeesList.innerHTML = '<p>Ошибка сети при загрузке списка сотрудников.</p>';
        }
    }

    async function loadDepartmentsList() {
        try {
            const response = await fetch('/api/admin/departments', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const departments = await response.json();
                departmentsList.innerHTML = '';
                departments.forEach(dept => {
                    const deptDiv = document.createElement('div');
                    deptDiv.className = 'employee-card';
                    deptDiv.innerHTML = `
                        <div>
                            <strong>${dept.name}</strong> (GUID: ${dept.guid})
                        </div>
                        <button class="delete-btn" onclick="deleteDepartment('${dept.guid}')">Удалить</button>
                    `;
                    departmentsList.appendChild(deptDiv);
                });
            } else {
                const errorData = await response.json();
                departmentsList.innerHTML = `<p>Ошибка загрузки списка подразделений: ${errorData.error}</p>`;
            }
        } catch (error) {
            console.error('Load departments list error:', error);
            departmentsList.innerHTML = '<p>Ошибка сети при загрузке списка подразделений.</p>';
        }
    }

    async function loadPositionsList() {
        try {
            const response = await fetch('/api/admin/positions', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const positions = await response.json();
                positionsList.innerHTML = '';
                positions.forEach(pos => {
                    const posDiv = document.createElement('div');
                    posDiv.className = 'employee-card';
                    // Исправлено: используем pos.department_guid
                    posDiv.innerHTML = `
                        <div>
                            <strong>${pos.title}</strong> (ID: ${pos.pos_id}, Ставок: ${pos.total_rate}, Подразделение: ${pos.department_guid || 'Не указано'})
                        </div>
                        <button class="delete-btn" onclick="deletePosition('${pos.pos_id}')">Удалить</button>
                    `;
                    positionsList.appendChild(posDiv);
                });
            } else {
                const errorData = await response.json();
                positionsList.innerHTML = `<p>Ошибка загрузки списка должностей: ${errorData.error}</p>`;
            }
        } catch (error) {
            console.error('Load positions list error:', error);
            positionsList.innerHTML = '<p>Ошибка сети при загрузке списка должностей.</p>';
        }
    }

    async function loadAssignmentsList() {
        try {
            const response = await fetch('/api/admin/assignments', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const assignments = await response.json();
                assignmentsList.innerHTML = '';
                assignments.forEach(ass => {
                    const assDiv = document.createElement('div');
                    assDiv.className = 'employee-card';
                    // Исправлено: используем ass.department_guid
                    assDiv.innerHTML = `
                        <div>
                            <strong>${ass.full_name}</strong> (${ass.emp_id}) -> <strong>${ass.title}</strong> (Ставка: ${ass.assigned_rate}, Подразделение: ${ass.department_guid || 'Не указано'})
                        </div>
                        <button class="delete-btn" onclick="deleteAssignment(${ass.id})">Удалить</button>
                    `;
                    assignmentsList.appendChild(assDiv);
                });
            } else {
                const errorData = await response.json();
                assignmentsList.innerHTML = `<p>Ошибка загрузки списка привязок: ${errorData.error}</p>`;
            }
        } catch (error) {
            console.error('Load assignments list error:', error);
            assignmentsList.innerHTML = '<p>Ошибка сети при загрузке списка привязок.</p>';
        }
    }

    async function loadEmployeesForAssignment() {
        try {
            const response = await fetch('/api/admin/employees', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const employees = await response.json();
                assignEmpIdSelect.innerHTML = '<option value="">Выберите сотрудника</option>';
                employees.forEach(emp => {
                    const option = document.createElement('option');
                    option.value = emp.emp_id;
                    option.textContent = `${emp.full_name} (${emp.emp_id})`;
                    assignEmpIdSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Load employees for assignment error:', error);
        }
    }

    async function loadPositionsForAssignment() {
        try {
            const response = await fetch('/api/admin/positions', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const positions = await response.json();
                assignPosIdSelect.innerHTML = '<option value="">Выберите должность</option>';
                positions.forEach(pos => {
                    const option = document.createElement('option');
                    option.value = pos.pos_id;
                    // Исправлено: используем pos.department_guid
                    option.textContent = `${pos.title} (${pos.pos_id}) - ${pos.department_guid || 'Не указано'}`;
                    assignPosIdSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Load positions for assignment error:', error);
        }
    }

    addEmployeeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const empData = {
            emp_id: document.getElementById('empId').value,
            full_name: document.getElementById('fullName').value,
            date_of_birth: document.getElementById('dateOfBirth').value,
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            role: document.getElementById('role').value
        };

        try {
            const response = await fetch('/api/admin/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(empData)
            });

            if (response.ok) {
                alert('Сотрудник добавлен!');
                addEmployeeForm.reset();
                loadEmployeesList();
                loadEmployeesForAssignment();
            } else {
                const errorData = await response.json();
                alert(`Ошибка: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Add employee error:', error);
            alert('Ошибка сети');
        }
    });

    addDepartmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const deptData = {
            guid: document.getElementById('departmentGuid').value,
            name: document.getElementById('departmentName').value
        };

        try {
            const response = await fetch('/api/admin/departments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(deptData)
            });

            if (response.ok) {
                alert('Подразделение добавлено!');
                addDepartmentForm.reset();
                loadDepartmentsList();
            } else {
                const errorData = await response.json();
                alert(`Ошибка: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Add department error:', error);
            alert('Ошибка сети');
        }
    });

    addPositionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const posData = {
            pos_id: document.getElementById('positionId').value,
            title: document.getElementById('positionTitle').value,
            total_rate: parseFloat(document.getElementById('totalRate').value),
            department_guid: document.getElementById('departmentGuid').value
        };

        try {
            const response = await fetch('/api/admin/positions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(posData)
            });

            if (response.ok) {
                alert('Должность добавлена!');
                addPositionForm.reset();
                loadPositionsList();
                loadPositionsForAssignment();
            } else {
                const errorData = await response.json();
                alert(`Ошибка: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Add position error:', error);
            alert('Ошибка сети');
        }
    });

    assignPositionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const assignData = {
            emp_id: assignEmpIdSelect.value,
            pos_id: assignPosIdSelect.value,
            assigned_rate: parseFloat(document.getElementById('assignedRate').value)
        };

        assignPositionError.style.display = 'none';

        try {
            const response = await fetch('/api/admin/assign-position', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(assignData)
            });

            if (response.ok) {
                const data = await response.json();
                alert('Должность привязана!');
                assignPositionForm.reset();
                loadEmployeesList();
                loadAssignmentsList();
            } else {
                const errorData = await response.json();
                assignPositionError.textContent = errorData.error;
                assignPositionError.style.display = 'block';
            }
        } catch (error) {
            console.error('Assign position error:', error);
            assignPositionError.textContent = 'Ошибка сети';
            assignPositionError.style.display = 'block';
        }
    });

    reportForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const month = document.getElementById('reportMonth').value;

        try {
            const response = await fetch(`/api/admin/reports/monthly?month=${month}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const report = await response.json();
                reportDisplay.innerHTML = `
                    <h4>Отчет за ${month}</h4>
                    <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.5rem; font-weight: bold; background: #eee; padding: 0.5rem;">
                        <div>Подразделение</div>
                        <div>ФИО</div>
                        <div>Т-номер</div>
                        <div>Дата</div>
                        <div>Должность</div>
                        <div>Приход / Уход</div>
                    </div>
                `;
                report.forEach(row => {
                    const rowDiv = document.createElement('div');
                    rowDiv.className = 'report-row';
                    rowDiv.innerHTML = `
                        <div>${row.department_name}</div>
                        <div>${row.full_name}</div>
                        <div>${row.emp_id}</div>
                        <div>${row.date_work}</div>
                        <div>${row.position_title}</div>
                        <div>${row.check_in || '---'} / ${row.check_out || '---'}</div>
                    `;
                    reportDisplay.appendChild(rowDiv);
                });
            } else {
                const errorData = await response.json();
                reportDisplay.innerHTML = `<p>Ошибка: ${errorData.error}</p>`;
            }
        } catch (error) {
            console.error('Get report error:', error);
            reportDisplay.innerHTML = '<p>Ошибка сети при получении отчета.</p>';
        }
    });

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            tabContents.forEach(content => content.style.display = 'none');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}Tab`).style.display = 'block';

            if (tabId === 'employees') {
                loadEmployeesList();
            } else if (tabId === 'departments') {
                loadDepartmentsList();
            } else if (tabId === 'positions') {
                loadPositionsList();
            } else if (tabId === 'assignments') {
                loadAssignmentsList();
            } else if (tabId === 'reports') {
            }
        });
    });
});