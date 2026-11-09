document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // 2. Hero Image Carousel
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const counterEl = document.getElementById('carouselCounter');
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    if (!slides.length) return;
    const total = slides.length;
    const normalized = (index + total) % total;
    slides.forEach((s, i) => s.classList.toggle('active', i === normalized));
    dots.forEach((d, i) => d.classList.toggle('active', i === normalized));
    currentSlide = normalized;
    if (counterEl) {
      const curStr = String(normalized + 1).padStart(2, '0');
      const totStr = String(total).padStart(2, '0');
      counterEl.textContent = `${curStr} / ${totStr}`;
    }
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 4800);
  }

  if (slides.length > 0) {
    resetInterval();
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showSlide(idx);
        resetInterval();
      });
    });
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
      });
    }
  }

  // 3. Gallery Category Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // 4. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (btn) {
      btn.addEventListener('click', () => {
        item.classList.toggle('open');
      });
    }
  });

  // 5. Lightbox Image Zoom
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('[data-lightbox]').forEach(img => {
    img.addEventListener('click', () => {
      if (lightbox && lightboxImg) {
        lightboxImg.src = img.getAttribute('src');
        lightboxImg.alt = img.getAttribute('alt') || 'Green Protech';
        lightbox.classList.add('open');
      }
    });
  });

  if (lightbox && lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('open');
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('open');
      }
    });
  }

  // 6. Active Navigation Highlight on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 140;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  });

  // 7. Online Free Survey Booking Form -> Direct Email Notification (greenprotechnature@gmail.com)
  // สามารถนำ URL ของ Google Apps Script Web App มาใส่ใน EMAIL_WEBHOOK_URL เพื่อส่งเมลอัตโนมัติได้ทั้งจาก file:// และบนเว็บจริง
  const EMAIL_WEBHOOK_URL = '';

  const lineForm = document.getElementById('lineBookingForm');
  const feedbackEl = document.getElementById('lineFormFeedback');
  const submitBtn = document.getElementById('lineSubmitBtn');

  if (lineForm) {
    lineForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('custName')?.value.trim() || '';
      const phone = document.getElementById('custPhone')?.value.trim() || '';
      const service = document.getElementById('custService')?.value || '';
      const date = document.getElementById('custDate')?.value.trim() || 'ตามที่เจ้าหน้าที่สะดวก';
      const area = document.getElementById('custArea')?.value.trim() || '';
      const note = document.getElementById('custNote')?.value.trim() || '-';

      const payload = {
        name,
        phone,
        service,
        area,
        date,
        note,
        timestamp: new Date().toLocaleString('th-TH')
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ กำลังส่งข้อมูลเข้าอีเมล...';
      }

      try {
        if (EMAIL_WEBHOOK_URL) {
          // ส่งตรงผ่าน Google Apps Script -> MailApp.sendEmail เข้า greenprotechnature@gmail.com ทันที
          await fetch(EMAIL_WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
          });

          if (feedbackEl) {
            feedbackEl.innerHTML = '✅ <strong>ส่งข้อมูลนัดสำรวจพื้นที่เข้าอีเมลเรียบร้อยแล้ว!</strong> เจ้าหน้าที่ได้รับข้อมูลแล้วและจะติดต่อกลับโดยเร็วที่สุดค่ะ';
            feedbackEl.classList.add('show');
          }
          lineForm.reset();
        } else {
          // หากเปิดทดสอบแบบไฟล์ในเครื่อง (file://) FormSubmit จะบล็อก ให้เปิดหน้าส่งอีเมลพร้อมข้อความอัตโนมัติแทน
          if (window.location.protocol === 'file:') {
            const subject = encodeURIComponent(`🌿 แจ้งนัดสำรวจพื้นที่ฟรี: ${name} (${phone})`);
            const body = encodeURIComponent(
              `แจ้งนัดสำรวจพื้นที่ฟรี (Green Protech Nature)\n` +
              `----------------------------------\n` +
              `👤 ชื่อผู้ติดต่อ: ${name}\n` +
              `📞 เบอร์โทรศัพท์: ${phone}\n` +
              `🛡️ บริการที่สนใจ: ${service}\n` +
              `📍 สถานที่/หมู่บ้าน: ${area}\n` +
              `📅 วัน/เวลาที่สะดวก: ${date}\n` +
              `📝 รายละเอียดเพิ่มเติม: ${note}\n` +
              `⏰ เวลาที่ส่ง: ${payload.timestamp}`
            );
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=greenprotechnature@gmail.com&su=${subject}&body=${body}`;
            const mailtoUrl = `mailto:greenprotechnature@gmail.com?subject=${subject}&body=${body}`;

            if (feedbackEl) {
              feedbackEl.innerHTML =
                `ℹ️ <strong>ขณะนี้เปิดเว็บจากไฟล์ในเครื่อง (<code>file://</code>):</strong> เมื่อนำขึ้นเว็บจริง (GitHub Pages) ฟอร์มจะส่งอีเมลอัตโนมัติ สำหรับการทดสอบจากในเครื่องสามารถคลิกปุ่มด้านล่างเพื่อส่งอีเมลได้ทันที:<br/>` +
                `<div style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap;">` +
                `<a href="${gmailUrl}" target="_blank" rel="noopener" style="background:#16a34a; color:#fff; padding:6px 12px; border-radius:8px; font-weight:600; text-decoration:none;">📧 คลิกส่งผ่าน Gmail ทันที</a>` +
                `<a href="${mailtoUrl}" style="background:#0f172a; color:#fff; padding:6px 12px; border-radius:8px; font-weight:600; text-decoration:none;">✉️ เปิดแอปอีเมลในเครื่อง</a>` +
                `</div>`;
              feedbackEl.classList.add('show');
            }
            return;
          }

          // ส่งข้อมูลเข้าอีเมล greenprotechnature@gmail.com อัตโนมัติผ่าน FormSubmit (เมื่อรันบน http:// หรือ https://)
          const res = await fetch('https://formsubmit.co/ajax/greenprotechnature@gmail.com', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              _subject: `🌿 แจ้งนัดสำรวจพื้นที่ฟรี: ${name} (${phone})`,
              ชื่อผู้ติดต่อ: name,
              เบอร์โทรศัพท์: phone,
              บริการที่สนใจ: service,
              สถานที่_หมู่บ้าน: area,
              วันเวลาที่สะดวก: date,
              รายละเอียดเพิ่มเติม: note
            })
          });

          const result = await res.json().catch(() => ({}));

          if (result.success === 'false' || result.success === false) {
            if (feedbackEl) {
              feedbackEl.innerHTML =
                `⚠️ <strong>กรุณากดยืนยันเปิดใช้งานอีเมลครั้งแรก:</strong> ระบบได้ส่งอีเมลหัวข้อ <em>"FormSubmit - Activate Form"</em> ไปที่ <strong>greenprotechnature@gmail.com</strong> แล้ว (เช็คใน Inbox หรือ Spam แล้วกดปุ่ม <strong>Activate Form</strong> เพียงครั้งเดียว หลังจากนั้นฟอร์มจะส่งเข้าเมลอัตโนมัติทันทีครับ)`;
              feedbackEl.classList.add('show');
            }
          } else {
            if (feedbackEl) {
              feedbackEl.innerHTML = '✅ <strong>ส่งข้อมูลนัดสำรวจพื้นที่เข้าอีเมลเรียบร้อยแล้ว!</strong> เจ้าหน้าที่ได้รับข้อมูลแล้วและจะติดต่อกลับหาท่านโดยเร็วที่สุดค่ะ';
              feedbackEl.classList.add('show');
            }
            lineForm.reset();
          }
        }
      } catch (err) {
        if (feedbackEl) {
          feedbackEl.innerHTML = '⚠️ <strong>ไม่สามารถเชื่อมต่อระบบส่งเมลอัตโนมัติได้ในขณะนี้</strong> กรุณาโทรนัดหมายด่วนที่ <a href="tel:0813440968" style="text-decoration:underline; font-weight:700;">081-344-0968</a> หรือคลิก <a href="https://line.me/ti/p/~greenprotect" target="_blank" rel="noopener" style="text-decoration:underline; font-weight:700;">Line: 0951211422</a> ค่ะ';
          feedbackEl.classList.add('show');
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = '🚀 ส่งข้อมูลนัดสำรวจพื้นที่ฟรีทันที';
        }
      }
    });
  }
});
