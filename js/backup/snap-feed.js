document.addEventListener('DOMContentLoaded', () => {
    // Sample data for the demo
    const demoSnaps = [
        {
            id: 1,
            username: 'travel_enthusiast',
            userInitial: 'T',
            timestamp: '2h ago',
            imageUrl: 'https://source.unsplash.com/random/800x1000?nature',
            caption: 'Beautiful day for a hike! 🏞️ #nature #adventure',
            location: 'Yosemite National Park'
        },
        {
            id: 2,
            username: 'foodie_adventures',
            userInitial: 'F',
            timestamp: '5h ago',
            imageUrl: 'https://source.unsplash.com/random/800x1000?food',
            caption: 'Homemade pasta for dinner tonight! 🍝 #foodie #homecooking',
            location: 'My Kitchen'
        },
        {
            id: 3,
            username: 'urban_explorer',
            userInitial: 'U',
            timestamp: '1d ago',
            imageUrl: 'https://source.unsplash.com/random/800x1000?city',
            caption: 'Lost in the city lights 🌃 #urban #nightphotography',
            location: 'Downtown'
        },
        {
            id: 4,
            username: 'beach_bum',
            userInitial: 'B',
            timestamp: '2d ago',
            imageUrl: 'https://source.unsplash.com/random/800x1000?beach',
            caption: 'Beach days are the best days! 🏖️ #summervibes #ocean',
            location: 'Malibu Beach'
        },
        {
            id: 5,
            username: 'mountain_lover',
            userInitial: 'M',
            timestamp: '3d ago',
            imageUrl: 'https://source.unsplash.com/random/800x1000?mountain',
            caption: 'The mountains are calling and I must go ⛰️ #nature #hiking',
            location: 'Rocky Mountains'
        }
    ];

    // DOM Elements
    const snapFeed = document.getElementById('snapFeed');
    
    // Initialize the feed
    function initFeed() {
        // Add loading state
        snapFeed.innerHTML = '<div class="loading-card"></div>'.repeat(3);
        
        // Simulate API call delay
        setTimeout(() => {
            renderSnaps(demoSnaps);
            initScrollAnimations();
            initParallaxEffect();
        }, 1000);
    }

    // Render snap cards
    function renderSnaps(snaps) {
        snapFeed.innerHTML = snaps.map(snap => `
            <div class="snap-card" data-id="${snap.id}">
                <div class="snap-header">
                    <div class="user-avatar">${snap.userInitial}</div>
                    <div class="user-info">
                        <span class="username">${snap.username}</span>
                        <span class="timestamp">${snap.timestamp}</span>
                    </div>
                </div>
                <div class="snap-image-container">
                    <img 
                        src="${snap.imageUrl}" 
                        alt="Snap by ${snap.username}" 
                        class="snap-image"
                        loading="lazy"
                    >
                </div>
                <div class="snap-content">
                    <p class="caption">${snap.caption}</p>
                    ${snap.hashtags ? `<div class="hashtags">${snap.hashtags}</div>` : ''}
                    ${snap.location ? `
                        <div class="location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${snap.location}
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    // Initialize scroll animations
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Unobserve after animation
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all snap cards
        document.querySelectorAll('.snap-card').forEach(card => {
            observer.observe(card);
        });
    }

    // Initialize parallax effect on images
    function initParallaxEffect() {
        const snapImages = document.querySelectorAll('.snap-image');
        
        const handleMouseMove = (e) => {
            const { left, top, width, height } = e.target.parentElement.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;
            
            const moveX = (x - 0.5) * 10;
            const moveY = (y - 0.5) * 10;
            
            e.target.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
        };
        
        const handleMouseLeave = (e) => {
            e.target.style.transform = 'translate(0, 0) scale(1)';
        };
        
        snapImages.forEach(img => {
            img.parentElement.addEventListener('mousemove', handleMouseMove);
            img.parentElement.addEventListener('mouseleave', handleMouseLeave);
            
            // Touch events for mobile
            img.parentElement.addEventListener('touchmove', (e) => {
                const touch = e.touches[0];
                const event = {
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                    target: img
                };
                handleMouseMove(event);
            }, { passive: true });
            
            img.parentElement.addEventListener('touchend', handleMouseLeave, { passive: true });
        });
    }

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initParallaxEffect();
        }, 250);
    });

    // Initialize the feed
    initFeed();
});
