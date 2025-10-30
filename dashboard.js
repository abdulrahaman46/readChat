// Ensure all buttons navigate properly
document.addEventListener('DOMContentLoaded', () => {

    const addMemberBtn = document.getElementById('addMemberBtn');
    const viewMembersBtn = document.getElementById('viewMembersBtn');
    const paymentsBtn = document.getElementById('paymentsBtn');
    const reportsBtn = document.getElementById('reportsBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    addMemberBtn.addEventListener('click', () => {
        window.location.href = 'add_member.html';
    });

    viewMembersBtn.addEventListener('click', () => {
        window.location.href = 'members.html';
    });

    paymentsBtn.addEventListener('click', () => {
        window.location.href = 'payments.html';
    });

    reportsBtn.addEventListener('click', () => {
        window.location.href = 'reports.html';
    });

    logoutBtn.addEventListener('click', () => {
        // Optional: clear any session/local storage here
        window.location.href = 'index.html';
    });

});
