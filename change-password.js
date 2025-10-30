// renderer/js/change-password.js
document.addEventListener('DOMContentLoaded', () => {
    const btnSave = document.getElementById('btnSave');
    const newPassEl = document.getElementById('newPassword');
    const confirmEl = document.getElementById('confirmPassword');
    const msg = document.getElementById('msg');

    btnSave.addEventListener('click', async () => {
        msg.textContent = '';
        const p1 = newPassEl.value;
        const p2 = confirmEl.value;
        if (!p1 || !p2) { msg.textContent = 'Enter and confirm new password'; msg.style.color = 'red'; return; }
        if (p1 !== p2) { msg.textContent = 'Passwords do not match'; msg.style.color = 'red'; return; }

        const adminId = localStorage.getItem('adminId');
        if (!adminId) { msg.textContent = 'Missing admin session'; msg.style.color = 'red'; return; }

        try {
            const res = await fetch('http://127.0.0.1:3000/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminId: Number(adminId), newPassword: p1 })
            });
            const j = await res.json();
            if (j && j.success) {
                msg.textContent = 'Password changed. Redirecting to dashboard...';
                msg.style.color = 'green';
                setTimeout(() => {
                    window.location = 'dashboard.html';
                }, 900);
            } else {
                msg.textContent = j.message || 'Failed to change password';
                msg.style.color = 'red';
            }
        } catch (err) {
            console.error('change-password error', err);
            msg.textContent = 'Error connecting to server';
            msg.style.color = 'orange';
        }
    });
});

