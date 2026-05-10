/**
 * script.js — Lumidh Landing Page
 * -------------------------------------------------------
 * Modul:
 *  1. Navbar — efek scrolled & active link
 *  2. Back-to-Top button
 *  3. Validasi & submit formulir Newsletter
 *  4. Copyright year otomatis
 * -------------------------------------------------------
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initBackToTop();
  initNewsletter();
  initCopyrightYear();
});


/* ================================================================
   1. NAVBAR — class "nav-scrolled" saat scroll + active link
================================================================ */
function initNavbar() {
  const navbar   = document.getElementById('mainNavbar');
  const navLinks = document.querySelectorAll('.lmh-link[href^="#"]');
  const sections = document.querySelectorAll('section[id], div[id="beranda"]');

  if (!navbar) return;

  /* 1a. Tambah/hapus class scrolled */
  const handleScroll = () => {
    navbar.classList.toggle('nav-scrolled', window.scrollY > 30);
    markActiveLink();
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // inisialisasi

  /* 1b. Tandai link aktif berdasarkan section yang terlihat */
  function markActiveLink() {
    let current = '';
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', isActive);
      isActive
        ? link.setAttribute('aria-current', 'page')
        : link.removeAttribute('aria-current');
    });
  }

  /* 1c. Tutup collapse mobile setelah link diklik */
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const collapseEl = document.getElementById('navMenu');
      const bsCollapse = bootstrap.Collapse.getInstance(collapseEl);
      if (bsCollapse) bsCollapse.hide();
    });
  });
}


/* ================================================================
   2. BACK-TO-TOP
================================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  /* Tampilkan setelah scroll 400px */
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    /* Kembalikan fokus ke brand link untuk aksesibilitas keyboard */
    document.querySelector('.lumidh-brand')?.focus();
  });
}


/* ================================================================
   3. NEWSLETTER FORM — validasi sisi klien
================================================================ */
function initNewsletter() {
  const form     = document.getElementById('newsletterForm');
  const input    = document.getElementById('nlEmail');
  const errorEl  = document.getElementById('nlEmailError');
  const successEl= document.getElementById('nlSuccess');
  const submitBtn= document.getElementById('nlSubmitBtn');

  if (!form) return;

  /* ---------- helpers ---------- */

  /**
   * Validasi email: tidak kosong & format RFC sederhana.
   * @param {string} val
   * @returns {{ valid: boolean, message: string }}
   */
  function validateEmail(val) {
    if (!val.trim()) {
      return { valid: false, message: 'Alamat email tidak boleh kosong.' };
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!regex.test(val)) {
      return { valid: false, message: 'Format email tidak valid. Contoh: nama@domain.com' };
    }
    return { valid: true, message: '' };
  }

  /** Tampilkan pesan error pada elemen & beri class error ke input */
  function showError(message) {
    errorEl.textContent = message;
    input.classList.add('nl-input-error');
    input.setAttribute('aria-invalid', 'true');
    submitBtn.disabled = true;
  }

  /** Hapus state error */
  function clearError() {
    errorEl.textContent = '';
    input.classList.remove('nl-input-error');
    input.removeAttribute('aria-invalid');
    submitBtn.disabled = false;
  }

  /* ---------- real-time feedback saat blur ---------- */
  input.addEventListener('blur', () => {
    const result = validateEmail(input.value);
    result.valid ? clearError() : showError(result.message);
  });

  /* Hapus error saat user mengetik ulang */
  input.addEventListener('input', () => {
    if (input.classList.contains('nl-input-error')) {
      clearError();
    }
    // Sembunyikan sukses jika user ubah input lagi
    successEl.classList.add('d-none');
    successEl.textContent = '';
  });

  /* ---------- submit handler ---------- */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Pastikan validasi final sebelum kirim
    const result = validateEmail(input.value);
    if (!result.valid) {
      showError(result.message);
      input.focus();
      return;
    }

    clearError();

    // Simulasi pengiriman async (ganti dengan fetch() di produksi)
    simulateSend();
  });

  /* ---------- simulasi async send ---------- */
  function simulateSend() {
    // Disable & tunjukkan loading
    submitBtn.disabled = true;
    submitBtn.textContent = '...';

    setTimeout(() => {
      // Reset form
      form.reset();
      clearError();

      // Kembalikan tombol
      submitBtn.disabled = false;
      submitBtn.textContent = 'Subscribe';

      // Tampilkan pesan sukses
      successEl.textContent =
        '✓ Terima kasih. Anda akan menjadi yang pertama tahu.';
      successEl.classList.remove('d-none');

      // Sembunyikan otomatis setelah 6 detik
      setTimeout(() => {
        successEl.classList.add('d-none');
        successEl.textContent = '';
      }, 6000);

      // Scroll ringan ke pesan sukses
      successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1800);
  }
}


/* ================================================================
   4. COPYRIGHT YEAR — isi otomatis tahun berjalan
================================================================ */
function initCopyrightYear() {
  const el = document.getElementById('copyrightYear');
  if (el) el.textContent = new Date().getFullYear();
}
