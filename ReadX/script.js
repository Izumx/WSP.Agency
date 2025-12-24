gsap.registerPlugin(ScrambleTextPlugin);

const gsapCards = document.querySelectorAll('.gsap-card');

gsapCards.forEach((card, idx) => {
  card.addEventListener('mouseenter', () => {
    gsapCards.forEach((c, i) => {
      if (i === idx) {
        gsap.to(c, {
          '--move-x': '0px',
          '--move-y': '-32px',
          '--scale': 1.1,
          zIndex: 10,
          boxShadow: "0 10px 56px #0004",
          duration: 0.32,
        });
      } else if (i === idx - 1) {
        gsap.to(c, {
          '--move-x': '-24px',
          '--move-y': '0px',
          '--scale': 0.96,
          zIndex: 5,
          boxShadow: "0 4px 22px 0 rgba(0,0,0,0.08)",
          duration: 0.32,
        });
      } else if (i === idx + 1) {
        gsap.to(c, {
          '--move-x': '24px',
          '--move-y': '0px',
          '--scale': 0.96,
          zIndex: 5,
          boxShadow: "0 4px 22px 0 rgba(0,0,0,0.08)",
          duration: 0.32,
        });
      } else if (i < idx - 1) {
        gsap.to(c, {
          '--move-x': '-10px',
          '--move-y': '0px',
          '--scale': 0.95,
          zIndex: 1,
          boxShadow: "0 4px 22px 0 rgba(0,0,0,0.08)",
          duration: 0.32,
        });
      } else if (i > idx + 1) {
        gsap.to(c, {
          '--move-x': '10px',
          '--move-y': '0px',
          '--scale': 0.95,
          zIndex: 1,
          boxShadow: "0 4px 22px 0 rgba(0,0,0,0.08)",
          duration: 0.32,
        });
      }
    });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      '--move-x': '0px',
      '--move-y': '0px',
      '--scale': 1,
      zIndex: 2,
      boxShadow: "0 4px 22px 0 rgba(0,0,0,0.08)",
      duration: 0.32,
    });
  });
});

gsap.to("#text", {
  duration: 4,
  delay: 2,
  scrambleText: {
    text: "Smart minds stack books, not excuses.",
    leftToright: true,
    chars: "iloveweb"
  }
});

const heroCards = document.querySelectorAll('.hero-cards .card');
heroCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.zIndex = 10;
    card.style.boxShadow = "0 16px 64px #0003";
    card.style.transform += " scale(1.24) translateY(-18px)";
  });
  card.addEventListener('mouseleave', () => {
    if (card.classList.contains('card1')) {
      card.style.transform = "rotate(-10deg)";
      card.style.zIndex = 2;
    } else if (card.classList.contains('card2')) {
      card.style.transform = "rotate(-3deg)";
      card.style.zIndex = 3;
    } else if (card.classList.contains('card3')) {
      card.style.transform = "rotate(8deg)";
      card.style.zIndex = 4;
    } else if (card.classList.contains('card4')) {
      card.style.transform = "rotate(13deg)";
      card.style.zIndex = 5;
    }
    card.style.boxShadow = "0 8px 32px rgba(0,0,0,0.18)";
  });
});


function makeInfinityCarousel(trackId, direction = 1, speed = 1) {
  const track = document.getElementById(trackId);
  const items = Array.from(track.children);
  const itemHeight = items[0].offsetHeight + 28; 
  let position = direction > 0 ? 0 : itemHeight * items.length;
  let animationId;


  items.forEach(item => {
    track.appendChild(item.cloneNode(true));
  });

  function animate() {
    position += speed * direction;
    if (direction > 0 && position >= itemHeight * items.length) {
      position = 0;
    } else if (direction < 0 && position <= 0) {
      position = itemHeight * items.length;
    }
    track.style.transform = `translateY(-${position}px)`;
    animationId = requestAnimationFrame(animate);
  }
  animate();

  track.parentElement.addEventListener('mouseenter', () => cancelAnimationFrame(animationId));
  track.parentElement.addEventListener('mouseleave', animate);
}


makeInfinityCarousel('carousel-track-1', 0.6, 0.6);   
makeInfinityCarousel('carousel-track-2', -0.6, 0.6);  
const topBar = document.querySelector('.hero-top-bar');
const whiteSections = document.querySelectorAll('.white-bg');

function checkTopBarOnWhite() {
  const topBarBottom = topBar.getBoundingClientRect().bottom;
  let onWhite = false;
  whiteSections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (topBarBottom > rect.top && topBarBottom < rect.bottom) {
      onWhite = true;
    }
  });
  if (onWhite) {
    topBar.classList.add('top-bar-on-white');
  } else {
    topBar.classList.remove('top-bar-on-white');
  }
}

window.addEventListener('scroll', checkTopBarOnWhite);
window.addEventListener('resize', checkTopBarOnWhite);
document.addEventListener('DOMContentLoaded', checkTopBarOnWhite);
