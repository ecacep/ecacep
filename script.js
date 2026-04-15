const relationshipStart = new Date('2025-08-12T00:00:00');

const daysCount = document.getElementById('daysCount');
const monthsCount = document.getElementById('monthsCount');
const hoursCount = document.getElementById('hoursCount');
const minutesCount = document.getElementById('minutesCount');
const relationshipSince = document.getElementById('relationshipSince');

function formatDate(date) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

if (relationshipSince) {
  relationshipSince.textContent = `Sejak ${formatDate(relationshipStart)}`;
}

function updateRelationshipCounter() {
  const now = new Date();
  const diff = now - relationshipStart;

  const totalMinutes = Math.floor(diff / (1000 * 60));
  const totalHours = Math.floor(diff / (1000 * 60 * 60));
  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const totalMonths = Math.floor(totalDays / 30.44);

  if (daysCount) daysCount.textContent = totalDays.toLocaleString('id-ID');
  if (monthsCount) monthsCount.textContent = totalMonths.toLocaleString('id-ID');
  if (hoursCount) hoursCount.textContent = totalHours.toLocaleString('id-ID');
  if (minutesCount) minutesCount.textContent = totalMinutes.toLocaleString('id-ID');
}

updateRelationshipCounter();
setInterval(updateRelationshipCounter, 60000);

function updateLiveDateTime() {
  const liveDateTime = document.getElementById('liveDateTime');
  if (!liveDateTime) return;

  const now = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };

  const formatted = new Intl.DateTimeFormat('id-ID', options).format(now);
  liveDateTime.textContent = formatted;
}

updateLiveDateTime();
setInterval(updateLiveDateTime, 1000);

const storyModal = document.getElementById('storyModal');
const openStory = document.getElementById('openStory');
const playJourney = document.getElementById('playJourney');
const closeModal = document.getElementById('closeModal');
const slides = [...document.querySelectorAll('.slide-item')];
const prevSlide = document.getElementById('prevSlide');
const nextSlide = document.getElementById('nextSlide');
const bgMusic = document.getElementById('bgMusic');
const musicStatus = document.getElementById('musicStatus');
const journeyVideo = document.getElementById('journeyVideo');

let currentSlide = 0;

function updateSlideButtons() {
  if (!prevSlide || !nextSlide || !slides.length) return;

  if (currentSlide <= 1) {
    prevSlide.style.display = 'none';
    nextSlide.style.display = 'block';
  } else if (currentSlide === slides.length - 1) {
    prevSlide.style.display = 'block';
    nextSlide.style.display = 'none';
  } else {
    prevSlide.style.display = 'block';
    nextSlide.style.display = 'block';
  }
}

function stopJourneyVideo() {
  if (!journeyVideo) return;
  journeyVideo.pause();
  journeyVideo.currentTime = 0;
}

function showSlide(index) {
  if (!slides.length) return;

  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });

  updateSlideButtons();
  stopJourneyVideo();

  if (index === 1 && journeyVideo) {
    journeyVideo.muted = true;
    journeyVideo.volume = 0;
    journeyVideo.play().catch(() => {});
  }
}

function openModalHandler() {
  if (!storyModal) return;

  storyModal.classList.add('show');
  document.body.style.overflow = 'hidden';

  currentSlide = 0;
  showSlide(currentSlide);

  if (bgMusic) {
    const source = bgMusic.querySelector('source');

    if (source && source.src) {
      bgMusic.currentTime = 0;
      bgMusic.play()
        .then(() => {
          if (musicStatus) {
            musicStatus.textContent = '🎵 Soundtrack sedang diputar';
          }
        })
        .catch(() => {
          if (musicStatus) {
            musicStatus.textContent = '🎵 Klik sekali lagi kalau browser blokir autoplay';
          }
        });
    } else if (musicStatus) {
      musicStatus.textContent = '🎵 File soundtrack belum ada';
    }
  }
}

function closeModalHandler() {
  if (!storyModal) return;

  storyModal.classList.remove('show');
  document.body.style.overflow = '';

  if (bgMusic) {
    bgMusic.pause();
    bgMusic.currentTime = 0;
  }

  stopJourneyVideo();

  if (musicStatus) {
    musicStatus.textContent = '🎵 Soundtrack diputar otomatis';
  }
}

if (openStory) {
  openStory.addEventListener('click', openModalHandler);
}

if (playJourney) {
  playJourney.addEventListener('click', openModalHandler);
}

if (closeModal) {
  closeModal.addEventListener('click', closeModalHandler);
}

if (storyModal) {
  storyModal.addEventListener('click', (e) => {
    if (e.target === storyModal) {
      closeModalHandler();
    }
  });
}

if (prevSlide) {
  prevSlide.addEventListener('click', () => {
    if (currentSlide > 0) {
      currentSlide -= 1;
      showSlide(currentSlide);
    }
  });
}

if (nextSlide) {
  nextSlide.addEventListener('click', () => {
    if (currentSlide < slides.length - 1) {
      currentSlide += 1;
      showSlide(currentSlide);
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (!storyModal || !storyModal.classList.contains('show')) return;

  if (e.key === 'Escape') {
    closeModalHandler();
  }

  if (e.key === 'ArrowLeft' && currentSlide > 0) {
    currentSlide -= 1;
    showSlide(currentSlide);
  }

  if (e.key === 'ArrowRight' && currentSlide < slides.length - 1) {
    currentSlide += 1;
    showSlide(currentSlide);
  }
});

const navAnchors = [...document.querySelectorAll('.nav-links a, .bottom-nav a')];
const sections = [...document.querySelectorAll('main section')];

if (sections.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;

        navAnchors.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach((section) => observer.observe(section));
}

/* hanya 1 audio di section music yang boleh muter */
const pageAudios = [...document.querySelectorAll('#music audio')];

pageAudios.forEach((audio) => {
  audio.addEventListener('play', () => {
    pageAudios.forEach((otherAudio) => {
      if (otherAudio !== audio) {
        otherAudio.pause();
        otherAudio.currentTime = 0;
      }
    });

    if (bgMusic && !bgMusic.paused) {
      bgMusic.pause();
      bgMusic.currentTime = 0;

      if (musicStatus) {
        musicStatus.textContent = '🎵 Soundtrack dihentikan karena lagu lain diputar';
      }
    }
  });
});

if (bgMusic) {
  bgMusic.addEventListener('play', () => {
    pageAudios.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  });
}

updateSlideButtons();