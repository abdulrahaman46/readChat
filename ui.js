
// ui.js - uses bundled Swal and Toastify wrappers
function swalConfirm(title, text) {
  return Swal.fire({ title: title, html: text, showCancelButton: true, confirmButtonText: 'Yes', cancelButtonText: 'Cancel' }).then(r => r.isConfirmed);
}
function toast(msg, success=true) {
  Toastify({ text: msg, backgroundColor: success ? '#0b8a4a' : '#b33', duration: 3000 }).showToast();
}
