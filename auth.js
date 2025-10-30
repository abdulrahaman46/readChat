// renderer/js/auth.js
// Frontend login handler — calls http://localhost:3000/login

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btnLogin');
    const emailEl = document.getElementById('email');
    const passEl = document.getElementById('password');
    const msg = document.getElementById('msg');

    btn.addEventListener('click', async () => {
        const email = emailEl.value.trim();
        const pw = passEl.value;

        msg.textContent = '';
        msg.style.color = '';

        if (!email || !pw) {
            msg.textContent = 'Please enter email and password';
            msg.style.color = 'red';
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: pw })
            });

            const data = await res.json();

            if (!data) {
                msg.textContent = 'No response from server';
                msg.style.color = 'orange';
                return;
            }

            if (!data.success) {
                // show friendly message
                msg.textContent = data.message || 'Login failed';
                msg.style.color = 'red';
                return;
            }

            // success
            const adminId = data.adminId || data.id;
            // store admin id and maybe other info
            if (adminId) localStorage.setItem('adminId', adminId);

            if (data.force_password_change) {
                // redirect to change-password page
                window.location = 'change-password.html';
                return;
            }

            // show toast then redirect to dashboard
            if (window.Toastify) {
                Toastify({ text: "Login successful — redirecting...", duration: 2000, gravity: "top", position: "center", backgroundColor: "#28a745" }).showToast();
            }
            setTimeout(() => {
                window.location = 'dashboard.html';
            }, 800);

        } catch (err) {
            console.error('Login fetch error:', err);
            msg.textContent = 'Error connecting to server';
            msg.style.color = 'orange';
            if (window.Toastify) {
                Toastify({ text: "Error connecting to server", duration: 2500, gravity: "top", position: "center", backgroundColor: "#ffc107" }).showToast();
            }
        }
    });
});
