// Initialize Lucide Icons
document.addEventListener("DOMContentLoaded", () => {
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }
    
    initNavbar();
    initNeuralCanvas();
    initTypingEffect();
    initScrollReveal();
    initSkillFilters();
    initContactForm();
    initDashboardVisualizers();
    initCLITerminal();
    initCardTilt();
});

/* Navbar Interaction */
function initNavbar() {
    const navbar = document.getElementById("navbar");
    const mobileToggle = document.getElementById("mobile-toggle");
    const navLinks = document.getElementById("nav-links");
    const links = document.querySelectorAll(".nav-link");

    // Scroll effect
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
        
        // Active link on scroll
        let current = "";
        const sections = document.querySelectorAll("section");
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute("id");
            }
        });

        links.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").slice(1) === current) {
                link.classList.add("active");
            }
        });
    });

    // Mobile menu toggle
    mobileToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        if (navLinks.classList.contains("active")) {
            mobileToggle.innerHTML = `<i data-lucide="x"></i>`;
        } else {
            mobileToggle.innerHTML = `<i data-lucide="menu"></i>`;
        }
        lucide.createIcons();
    });

    // Close menu when link is clicked
    links.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            mobileToggle.innerHTML = `<i data-lucide="menu"></i>`;
            lucide.createIcons();
        });
    });
}

/* Neural Network Background Canvas - High-Tech Constellation & Data Streams */
function initNeuralCanvas() {
    const canvas = document.getElementById("neural-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
        width = (canvas.width = window.innerWidth);
        height = (canvas.height = window.innerHeight);
    });

    const particles = [];
    const maxParticles = Math.min(60, Math.floor((width * height) / 25000));
    const connectionDist = 140;
    const mouse = { x: null, y: null, radius: 200 };

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener("mouseout", () => {
        mouse.x = null;
        mouse.y = null;
    });

    canvas.addEventListener("click", (e) => {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        // Spawn a node at the clicked position
        const n = new Node();
        n.x = clickX;
        n.y = clickY;
        particles.push(n);
        if (particles.length > 80) particles.shift();
    });

    class Node {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.baseRadius = Math.random() * 2 + 1;
            this.radius = this.baseRadius;
            this.color = Math.random() > 0.5 ? "rgba(0, 245, 255, 0.4)" : "rgba(168, 85, 247, 0.4)";
            this.pulse = Math.random() * Math.PI;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off boundaries
            if (this.x < 0 || this.x > width) this.vx = -this.vx;
            if (this.y < 0 || this.y > height) this.vy = -this.vy;

            // Subtle pulsing radius
            this.pulse += 0.02;
            this.radius = this.baseRadius + Math.sin(this.pulse) * 0.5;

            // Mouse interaction: push/pull nodes slightly
            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x += (dx / dist) * force * 1.0;
                    this.y += (dy / dist) * force * 1.0;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    // Data packets that travel along lines between nodes
    class Packet {
        constructor(startNode, endNode) {
            this.start = startNode;
            this.end = endNode;
            this.progress = 0;
            this.speed = Math.random() * 0.01 + 0.005;
            this.color = Math.random() > 0.5 ? "rgba(0, 245, 255, 0.8)" : "rgba(168, 85, 247, 0.8)";
        }

        update() {
            this.progress += this.speed;
            return this.progress < 1;
        }

        draw() {
            const x = this.start.x + (this.end.x - this.start.x) * this.progress;
            const y = this.start.y + (this.end.y - this.start.y) * this.progress;
            ctx.beginPath();
            ctx.arc(x, y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.shadowBlur = 0; // reset shadow
        }
    }

    // Initialize nodes
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Node());
    }

    const packets = [];

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw grid lines
        ctx.strokeStyle = "rgba(255, 255, 255, 0.01)";
        ctx.lineWidth = 0.5;
        const gridGap = 80;
        for (let x = 0; x < width; x += gridGap) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y < height; y += gridGap) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw and update nodes
        particles.forEach((p) => {
            p.update();
            p.draw();
        });

        // Draw connections and spawn packets
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDist) {
                    const alpha = (1 - dist / connectionDist) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();

                    // Periodically spawn a data packet between close nodes
                    if (Math.random() < 0.0001) {
                        packets.push(new Packet(p1, p2));
                    }
                }
            }

            // Draw links to mouse
            if (mouse.x !== null && mouse.y !== null) {
                const p = particles[i];
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const alpha = (1 - dist / mouse.radius) * 0.2;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(0, 245, 255, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        // Update and draw packets
        for (let i = packets.length - 1; i >= 0; i--) {
            const pkt = packets[i];
            if (pkt.update()) {
                pkt.draw();
            } else {
                packets.splice(i, 1);
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* Subtitle Dynamic Typing Effect */
function initTypingEffect() {
    const textTarget = document.getElementById("typed-text");
    const phrases = [
        "Artificial Intelligence Solutions",
        "Machine Learning Pipelines",
        "Computer Vision Models",
        "Vision-Language Architectures",
        "Intelligent Edge Systems"
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIdx];
        
        if (isDeleting) {
            textTarget.textContent = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
            typeSpeed = 40;
        } else {
            textTarget.textContent = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIdx === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end of phrase
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            typeSpeed = 500; // Pause before typing new phrase
        }

        setTimeout(type, typeSpeed);
    }

    if (textTarget) {
        setTimeout(type, 500);
    }
}

/* Scroll Reveal using IntersectionObserver */
function initScrollReveal() {
    const reveals = document.querySelectorAll(".scroll-reveal");
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                // Stop observing once animated
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    reveals.forEach(reveal => revealObserver.observe(reveal));
}

/* Skills Category Filters */
function initSkillFilters() {
    const filterButtons = document.querySelectorAll(".btn-filter");
    const skillCards = document.querySelectorAll(".skill-card");

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Manage active class of buttons
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            skillCards.forEach(card => {
                const category = card.getAttribute("data-category");
                if (filterValue === "all" || category === filterValue) {
                    card.style.display = "block";
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "scale(1)";
                    }, 50);
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "scale(0.8)";
                    setTimeout(() => {
                        card.style.display = "none";
                    }, 300);
                }
            });
        });
    });
}

/* Contact Form Simulation */
function initContactForm() {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");

    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Visual feedback during "send"
        const submitBtn = form.querySelector(".btn-submit");
        const originalBtnHTML = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = `Sending... <span class="badge-dot animate-ping-custom"></span>`;
        status.textContent = "";
        status.className = "form-status";

        // Simulate network latency
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
            
            // Validation check (basic)
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();

            if (name && email) {
                status.textContent = `Thank you, ${name}! Your message has been sent successfully.`;
                status.classList.add("success");
                form.reset();
            } else {
                status.textContent = "Something went wrong. Please check your inputs.";
                status.classList.add("error");
            }
        }, 1500);
    });
}

/* Interactive AI Dashboards & Project Visualizers */
function initDashboardVisualizers() {
    // 1. Telemetry details
    const latencyEl = document.getElementById("tel-latency");
    const fpsEl = document.getElementById("tel-fps");
    if (latencyEl && fpsEl) {
        setInterval(() => {
            const currentLatency = (Math.random() * 15 + 85).toFixed(0);
            const currentFps = (Math.random() * 2 + 59).toFixed(1);
            latencyEl.textContent = `${currentLatency}ms`;
            fpsEl.textContent = currentFps;
        }, 1400);
    }

    // 2. Run animations
    runScannerMesh();
    runTerminalLogs();
    runTrafficSimulation();
    runDroneRadarUpdate();
    runEEGWaves();
    runGANGenerator();
}

/* Face landmarks wireframe mesh animation inside scanner window */
function runScannerMesh() {
    const canvas = document.getElementById("scanner-mesh-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = canvas.parentElement.clientWidth);
    let h = (canvas.height = canvas.parentElement.clientHeight);

    window.addEventListener("resize", () => {
        if (!canvas.parentElement) return;
        w = (canvas.width = canvas.parentElement.clientWidth);
        h = (canvas.height = canvas.parentElement.clientHeight);
    });

    let time = 0;
    const baseLandmarks = [
        {x: 0, y: -0.65}, // top head
        {x: -0.35, y: -0.35}, {x: 0.35, y: -0.35}, // brow edges
        {x: -0.2, y: -0.1}, {x: 0.2, y: -0.1}, // eyes
        {x: 0, y: 0.15}, // nose tip
        {x: -0.22, y: 0.4}, {x: 0.22, y: 0.4}, // mouth corners
        {x: 0, y: 0.48}, // bottom lip
        {x: -0.45, y: 0.1}, {x: 0.45, y: 0.1}, // jaw sides
        {x: 0, y: 0.72} // chin
    ];
    const connections = [
        [0, 1], [0, 2], [1, 9], [2, 10], [9, 11], [10, 11], // outline
        [1, 3], [2, 4], [3, 5], [4, 5], // eyes to nose
        [5, 6], [5, 7], [6, 8], [7, 8], [8, 11], // nose to lip to chin
        [3, 4], [6, 7] // horizontal lines
    ];

    function draw() {
        ctx.clearRect(0, 0, w, h);
        time += 0.02;

        const centerX = w / 2;
        const centerY = h / 2;
        const scaleX = w * 0.38;
        const scaleY = h * 0.38;

        const dynCenterX = centerX + Math.sin(time) * 12;
        const dynCenterY = centerY + Math.cos(time * 0.7) * 8;

        const points = baseLandmarks.map(p => {
            const offsetX = Math.sin(time * 2.5 + p.y * 6) * 0.02;
            const offsetY = Math.cos(time * 2 + p.x * 6) * 0.02;
            return {
                x: dynCenterX + (p.x + offsetX) * scaleX,
                y: dynCenterY + (p.y + offsetY) * scaleY
            };
        });

        // Draw connections
        ctx.strokeStyle = "rgba(0, 245, 255, 0.22)";
        ctx.lineWidth = 0.8;
        connections.forEach(conn => {
            ctx.beginPath();
            ctx.moveTo(points[conn[0]].x, points[conn[0]].y);
            ctx.lineTo(points[conn[1]].x, points[conn[1]].y);
            ctx.stroke();
        });

        // Draw node points
        points.forEach((p, idx) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = idx === 3 || idx === 4 ? "var(--accent-purple)" : "var(--accent-cyan)";
            ctx.fill();
        });

        // Circular sweep HUD
        ctx.strokeStyle = "rgba(0, 245, 255, 0.08)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, scaleX * 1.15, 0, Math.PI * 2);
        ctx.stroke();

        requestAnimationFrame(draw);
    }
    draw();
}

/* Logging feed in inference widget */
function runTerminalLogs() {
    const feed = document.getElementById("terminal-logs-feed");
    if (!feed) return;

    const logMessages = [
        "[SYS] Inference engine initialized successfully.",
        "[INFO] Quantization set to INT4 via Edge-VLM runtime.",
        "[SYS] Ingestion snapshot BUFFER_042 loaded.",
        "[MODEL] Processing screenshot UI layout metrics...",
        "[MODEL] Running inference: mini-LLaVA-v3...",
        "[SYS] Checking similarity index on brand database...",
        "[INFO] Latency: 92ms | VRAM: 3.2 GB | System: OK",
        "[WARN] DOM anomaly flagged inside security scope.",
        "[MODEL] Bounding box threat pattern match: Phishing UI [99.4%]",
        "[EDGE] Onboard drone edge parameters synced.",
        "[EDGE] Track coordinates: Lat: 12.9731, Lon: 80.2452",
        "[SYS] Engine stream stable at 60.2 FPS. Awaiting frames..."
    ];
    let logIdx = 2;

    setInterval(() => {
        const line = document.createElement("div");
        line.className = "log-line";
        const msg = logMessages[logIdx];

        if (msg.includes("[WARN]")) {
            line.style.color = "#ff5f56";
        } else if (msg.includes("[SYS]")) {
            line.style.color = "var(--accent-purple)";
        } else {
            line.style.color = "var(--accent-cyan)";
        }

        line.textContent = msg;
        feed.appendChild(line);

        if (feed.children.length > 15) {
            feed.removeChild(feed.firstChild);
        }

        feed.scrollTop = feed.scrollHeight;
        logIdx = (logIdx + 1) % logMessages.length;
    }, 3000);
}

/* Project 1: Traffic Intersection Queue Sim */
function runTrafficSimulation() {
    const canvas = document.querySelector(".traffic-chart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = canvas.parentElement.clientWidth);
    let h = (canvas.height = canvas.parentElement.clientHeight);

    window.addEventListener("resize", () => {
        if (!canvas.parentElement) return;
        w = (canvas.width = canvas.parentElement.clientWidth);
        h = (canvas.height = canvas.parentElement.clientHeight);
    });

    const horizontalCars = [];
    const verticalCars = [];
    let lightState = "green";
    let timer = 0;

    class Vehicle {
        constructor(dir) {
            this.dir = dir;
            this.size = 3;
            this.speed = Math.random() * 1.2 + 0.8;
            if (dir === "h") {
                this.x = -10;
                this.y = h / 2 - 3 + (Math.random() - 0.5) * 3;
            } else {
                this.x = w / 2 - 3 + (Math.random() - 0.5) * 3;
                this.y = -10;
            }
        }

        update() {
            if (this.dir === "h") {
                const stopLine = w / 2 - 20;
                if (lightState === "green" || this.x > stopLine || this.x < stopLine - 10) {
                    this.x += this.speed;
                } else {
                    this.x += Math.max(0, (stopLine - this.x) * 0.08);
                }
            } else {
                const stopLine = h / 2 - 20;
                if (lightState === "red" || this.y > stopLine || this.y < stopLine - 10) {
                    this.y += this.speed;
                } else {
                    this.y += Math.max(0, (stopLine - this.y) * 0.08);
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.dir === "h" ? "var(--accent-cyan)" : "var(--accent-purple)";
            ctx.fill();
        }
    }

    setInterval(() => {
        if (Math.random() < 0.3) horizontalCars.push(new Vehicle("h"));
        if (Math.random() < 0.3) verticalCars.push(new Vehicle("v"));
    }, 2000);

    function animate() {
        ctx.clearRect(0, 0, w, h);
        timer++;

        if (timer % 200 === 0) {
            lightState = lightState === "green" ? "red" : "green";
        }

        // Draw Roads
        ctx.fillStyle = "rgba(255, 255, 255, 0.015)";
        ctx.fillRect(0, h / 2 - 12, w, 24);
        ctx.fillRect(w / 2 - 12, 0, 24, h);

        ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
        ctx.lineWidth = 0.8;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
        ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h);
        ctx.stroke();
        ctx.setLineDash([]);

        // Traffic Light Lenses
        ctx.beginPath();
        ctx.arc(w / 2 - 16, h / 2 - 16, 3, 0, Math.PI * 2);
        ctx.fillStyle = lightState === "green" ? "var(--accent-lime)" : "#ff5f56";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(w / 2 + 16, h / 2 + 16, 3, 0, Math.PI * 2);
        ctx.fillStyle = lightState === "red" ? "var(--accent-lime)" : "#ff5f56";
        ctx.fill();

        // Render cars
        for (let i = horizontalCars.length - 1; i >= 0; i--) {
            const car = horizontalCars[i];
            car.update();
            car.draw();
            if (car.x > w + 10) horizontalCars.splice(i, 1);
        }
        for (let i = verticalCars.length - 1; i >= 0; i--) {
            const car = verticalCars[i];
            car.update();
            car.draw();
            if (car.y > h + 10) verticalCars.splice(i, 1);
        }

        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.font = "8px 'Fira Code'";
        ctx.fillText("Traffic Q-Agent", 8, 14);

        requestAnimationFrame(animate);
    }
    animate();
}

/* Project 2: Drone Surveillance Telemetry readouts with Click Target Lock */
function runDroneRadarUpdate() {
    const radar = document.getElementById("radar-container");
    if (!radar) return;
    const targetDot = document.getElementById("radar-target-dot");
    const caption = document.querySelector(".radar-viz .viz-caption");
    
    let customCoords = null;

    radar.addEventListener("click", (e) => {
        if (!targetDot) return;
        const rect = radar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        targetDot.style.left = `${clickX}px`;
        targetDot.style.top = `${clickY}px`;
        targetDot.style.display = "block";
        
        // Calculate artificial lat/lon relative to center of radar (90px diameter)
        const latBias = (12.9731 + (clickY - 45) * -0.00002).toFixed(5);
        const lonBias = (80.2452 + (clickX - 45) * 0.00002).toFixed(5);
        customCoords = { lat: latBias, lon: lonBias };
        
        if (caption) {
            caption.innerHTML = `Radar Target Lat: <strong style="color:var(--accent-cyan);">${latBias}</strong> Lon: <strong style="color:var(--accent-purple);">${lonBias}</strong> [LOCK ACTIVE]`;
        }
    });

    if (caption) {
        setInterval(() => {
            if (customCoords) return; // Keep clicked coordinates locked
            const lat = (12.9731 + (Math.random() - 0.5) * 0.0006).toFixed(5);
            const lon = (80.2452 + (Math.random() - 0.5) * 0.0006).toFixed(5);
            caption.innerHTML = `Radar Target Lat: <strong class="text-gradient">${lat}</strong> Lon: <strong class="text-gradient">${lon}</strong> (Click radar to aim)`;
        }, 1500);
    }
}

/* Project 3: EEG clinical wave animator with interactive stress bias */
function runEEGWaves() {
    const canvas = document.querySelector(".eeg-waves-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = canvas.parentElement.clientWidth);
    let h = (canvas.height = canvas.parentElement.clientHeight);

    const ampSlider = document.getElementById("eeg-amp-slider");
    let stressBias = 1.5;
    if (ampSlider) {
        ampSlider.addEventListener("input", () => {
            stressBias = parseFloat(ampSlider.value);
        });
    }

    window.addEventListener("resize", () => {
        if (!canvas.parentElement) return;
        w = (canvas.width = canvas.parentElement.clientWidth);
        h = (canvas.height = canvas.parentElement.clientHeight);
    });

    let offset = 0;
    let anomalyActive = false;
    let anomalyTime = 0;

    function draw() {
        ctx.clearRect(0, 0, w, h);
        offset += 0.1;

        // Anomaly chance scales with stress bias
        const anomalyThreshold = 0.002 * stressBias;
        if (!anomalyActive && Math.random() < anomalyThreshold) {
            anomalyActive = true;
            anomalyTime = 100;
        }

        ctx.lineWidth = 1;

        // Wave 1: Alpha
        ctx.strokeStyle = "var(--accent-cyan)";
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
            let amp = 4 * stressBias; // Scale amplitude with stress slider
            if (anomalyActive && x > w * 0.35 && x < w * 0.6) {
                amp = (12 + Math.sin(x * 0.6) * 6) * stressBias;
            }
            const y = Math.sin(x * 0.05 + offset) * amp + h * 0.35;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Wave 2: Beta
        ctx.strokeStyle = "var(--accent-purple)";
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
            let amp = 2.5 * stressBias;
            if (anomalyActive && x > w * 0.4 && x < w * 0.55) {
                amp = 8 * stressBias;
            }
            const y = Math.sin(x * 0.1 + offset * 1.6) * amp + h * 0.65;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        if (anomalyActive) {
            anomalyTime--;
            if (anomalyTime <= 0) anomalyActive = false;

            ctx.fillStyle = "rgba(255, 95, 86, 0.04)";
            ctx.fillRect(0, 0, w, h);

            if (Math.floor(anomalyTime / 8) % 2 === 0) {
                ctx.fillStyle = "#ff5f56";
                ctx.font = "bold 8px 'Fira Code'";
                ctx.fillText(`ANOMALY DETECTED [CONF: ${(50 * stressBias).toFixed(0)}%]`, w / 2 - 82, h - 8);
            }
        } else {
            ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
            ctx.font = "8px 'Fira Code'";
            ctx.fillText(`EEG normal | Stress factor: ${stressBias.toFixed(1)}x`, 8, h - 8);
        }

        requestAnimationFrame(draw);
    }
    draw();
}

/* Project 4: Canvas Noise Diffusion (GAN) Grid with Select Target Digit */
function runGANGenerator() {
    const container = document.getElementById("gan-pixel-grid");
    if (!container) return;

    container.innerHTML = `<canvas id="gan-canvas" style="width:100%; height:100%;"></canvas>`;
    const canvas = document.getElementById("gan-canvas");
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = container.clientWidth);
    let h = (canvas.height = container.clientHeight);

    const digitSelect = document.getElementById("gan-digit-select");
    
    const digitPaths = {
        "8": [
            {x: 0.35, y: 0.25}, {x: 0.5, y: 0.25}, {x: 0.65, y: 0.25},
            {x: 0.6, y: 0.45}, {x: 0.5, y: 0.5}, {x: 0.4, y: 0.55},
            {x: 0.35, y: 0.75}, {x: 0.5, y: 0.78}, {x: 0.65, y: 0.75}
        ],
        "1": [
            {x: 0.42, y: 0.3}, {x: 0.5, y: 0.22}, {x: 0.5, y: 0.45},
            {x: 0.5, y: 0.7}, {x: 0.5, y: 0.8}, {x: 0.38, y: 0.8}, {x: 0.62, y: 0.8}
        ],
        "0": [
            {x: 0.38, y: 0.3}, {x: 0.5, y: 0.22}, {x: 0.62, y: 0.3},
            {x: 0.62, y: 0.5}, {x: 0.62, y: 0.7}, {x: 0.5, y: 0.8},
            {x: 0.38, y: 0.7}, {x: 0.38, y: 0.5}
        ],
        "3": [
            {x: 0.38, y: 0.25}, {x: 0.5, y: 0.22}, {x: 0.62, y: 0.25},
            {x: 0.6, y: 0.42}, {x: 0.5, y: 0.5}, {x: 0.6, y: 0.58},
            {x: 0.62, y: 0.75}, {x: 0.5, y: 0.8}, {x: 0.38, y: 0.75}
        ]
    };

    let targetPaths = digitPaths["8"];

    if (digitSelect) {
        digitSelect.addEventListener("change", () => {
            targetPaths = digitPaths[digitSelect.value] || digitPaths["8"];
            progress = 0; // reset diffusion loop
            direction = 1;
        });
    }

    window.addEventListener("resize", () => {
        if (!container) return;
        w = (canvas.width = container.clientWidth);
        h = (canvas.height = container.clientHeight);
    });

    let progress = 0;
    let direction = 1;
    let epoch = 1;

    function draw() {
        ctx.clearRect(0, 0, w, h);
        progress += 0.006 * direction;

        if (progress >= 1) {
            progress = 1;
            direction = -1;
        } else if (progress <= 0) {
            progress = 0;
            direction = 1;
            epoch = (epoch % 99) + 1;
        }

        const cols = 22;
        const rows = 11;
        const cellW = w / cols;
        const cellH = h / rows;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const nx = c / cols;
                const ny = r / rows;

                let dMin = 1.0;
                targetPaths.forEach(pt => {
                    const dist = Math.sqrt((nx - pt.x) ** 2 + (ny - pt.y) ** 2);
                    if (dist < dMin) dMin = dist;
                });

                const influence = 1 - Math.min(1, dMin * 3.3);
                let val = Math.random();
                val = (val * (1 - progress)) + (influence * progress);

                if (val > 0.45) {
                    ctx.fillStyle = `rgba(168, 85, 247, ${val * 0.6})`;
                    ctx.fillRect(c * cellW + 1, r * cellH + 1, cellW - 2, cellH - 2);
                } else if (val > 0.28) {
                    ctx.fillStyle = `rgba(0, 245, 255, ${val * 0.25})`;
                    ctx.fillRect(c * cellW + 1, r * cellH + 1, cellW - 2, cellH - 2);
                }
            }
        }

        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.font = "8px 'Fira Code'";
        const lossVal = (0.92 - progress * 0.83).toFixed(4);
        ctx.fillText(`Epoch: ${epoch} | Loss: ${lossVal}`, 8, h - 8);

        setTimeout(() => requestAnimationFrame(draw), 75);
    }
    draw();
}

/* Simulated CLI terminal system console processor with interactive game/AI features */
function initCLITerminal() {
    const input = document.getElementById("cli-input");
    const body = document.getElementById("cli-body");
    const prompt = document.querySelector(".cli-prompt");
    if (!input || !body || !prompt) return;

    let currentMode = "normal"; // normal, chat, hack
    let hackStep = 0; // tracking puzzle step

    // Focus input on console click
    const cliWindow = document.querySelector(".cli-window");
    if (cliWindow) {
        cliWindow.addEventListener("click", () => {
            input.focus();
        });
    }

    input.addEventListener("keydown", (e) => {
        // Play simulated mechanical click sound for typing
        if (e.key !== "Shift" && e.key !== "Control" && e.key !== "Alt") {
            playClickSound();
        }

        if (e.key === "Enter") {
            const rawVal = input.value.trim();
            const cmd = rawVal.toLowerCase();
            input.value = "";
            
            // Render input prompt line with current custom prompt
            const userLine = document.createElement("div");
            userLine.className = "cli-input-row";
            userLine.innerHTML = `<span class="cli-prompt">${prompt.textContent}</span><span>${escapeHTML(rawVal)}</span>`;
            
            // Insert before input row
            body.insertBefore(userLine, input.parentElement);

            // Process command depending on active mode
            if (currentMode === "chat") {
                handleChatMode(cmd, rawVal);
            } else if (currentMode === "hack") {
                handleHackMode(cmd);
            } else {
                handleCLICommand(cmd);
            }

            // Auto scroll
            body.scrollTop = body.scrollHeight;
        }
    });

    function playClickSound() {
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return;
            const audioCtx = new AudioContextClass();
            
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = "sine";
            // Randomize pitch slightly to sound natural
            osc.frequency.setValueAtTime(1400 + Math.random() * 600, audioCtx.currentTime);
            
            gain.gain.setValueAtTime(0.012, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03);
            
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 0.03);
        } catch (err) {
            // Silence if audio context is blocked
        }
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    function print(text, type = "output") {
        const line = document.createElement("div");
        line.className = `cli-output-line ${type}`;
        line.innerHTML = text;
        body.insertBefore(line, input.parentElement);
    }

    function handleCLICommand(cmd) {
        if (cmd === "") return;

        switch(cmd) {
            case "help":
                print(`Available Interactive Commands:<br>
  <span class="cli-highlight">chat</span>       - Converse with Giri's digital AI clone agent<br>
  <span class="cli-highlight">train</span>      - Train a quantized visual neural network model<br>
  <span class="cli-highlight">hack</span>       - Breach cybersecurity firewall puzzle game<br>
  <span class="cli-highlight">theme</span>      - Change UI colors (e.g. cyber, amber, matrix, outrun)<br>
  <span class="cli-highlight">arch</span>       - Display ASCII neural network structure diagram<br>
  <span class="cli-highlight">neofetch</span>   - Render system specs & configuration<br>
  <span class="cli-highlight">matrix</span>     - Run glowing green code rain cascade<br>
  <span class="cli-highlight">clear</span>      - Clear screen console logs`);
                break;
            case "chat":
                currentMode = "chat";
                prompt.textContent = "chat@giri-ai:~$ ";
                input.placeholder = "Ask me anything... (type 'exit' to quit)";
                print("Initiating conversation link with Giri's quantized clone...", "info");
                print("Clone online. Ask me about machine learning, model compression, or my research!", "success");
                break;
            case "train":
                runTrainingSimulation();
                break;
            case "hack":
                currentMode = "hack";
                hackStep = 1;
                prompt.textContent = "hack@firewall:~$ ";
                input.placeholder = "Enter response... (type 'exit' to quit)";
                print("[ALERT] Target firewall active. Breach sequence initiated.", "error");
                print("Decipher the 4-bit binary sequence to bypass access control.", "info");
                print("Passcode hint: Decimal equivalent is <span class=\"cli-highlight\">6</span>.<br>Input 4-bit binary equivalent (e.g. 0101):");
                break;
            case "theme":
                print(`Select a terminal UI theme:<br>
  <span class="cli-highlight">theme cyber</span>  - Default neon cyberpunk<br>
  <span class="cli-highlight">theme amber</span>  - Retro amber terminal<br>
  <span class="cli-highlight">theme matrix</span> - Phosphor matrix green<br>
  <span class="cli-highlight">theme outrun</span> - Neon pink/orange synthwave`);
                break;
            case "theme cyber":
                setTheme("cyber");
                break;
            case "theme amber":
                setTheme("amber");
                break;
            case "theme matrix":
                setTheme("matrix");
                break;
            case "theme outrun":
                setTheme("outrun");
                break;
            case "arch":
                print(`<pre style="font-family:inherit; margin:0; line-height:1.4; color:var(--accent-purple);">
    [Input screenshot] ──> [4-bit Quantized VLM] ──> [Threat Vectors Check]
           │                       │                         │
      ( 1920x1080 )         ( Conv Projection )       ( Cosine Metrics )
           │                       │                         │
           ▼                       ▼                         ▼
      [Normalized]  ──> [Attention Landmarks] ──> [Class: Phishing (99.4%)]
</pre>`);
                break;
            case "neofetch":
                print(`<pre style="font-family:inherit; margin:0; line-height:1.3; color:var(--accent-cyan);">
          .---.            giri@rec-workstation
         /     \\           --------------------
        | () () |          OS: Giri-OS v4.1 (REC Edition)
         \\  ^  /           Kernel: Antigravity-Engine-x64
          |||||            Shell: bash-system-v5.2
          |||||            DE: Glassmorphism Terminal
                           CPU: Neural-Cortex.v4 (12 Cores)
                           GPU: REC-RTX Edge VRAM 16GB
                           Memory: 16 GB RAM / 512 GB SSD
</pre>`);
                break;
            case "matrix":
                runMatrixRainEffect();
                break;
            case "clear":
                const lines = body.querySelectorAll(".cli-output-line, .cli-input-row");
                lines.forEach(l => {
                    if (l !== input.parentElement) {
                        body.removeChild(l);
                    }
                });
                break;
            default:
                print(`Command not found: <span class="cli-highlight">${cmd}</span>. Type <span class="cli-highlight">help</span> for a list of commands.`, "error");
        }
    }

    function setTheme(theme) {
        const root = document.documentElement;
        if (theme === "amber") {
            root.style.setProperty("--accent-cyan", "hsl(35, 100%, 50%)");
            root.style.setProperty("--accent-purple", "hsl(15, 100%, 50%)");
            root.style.setProperty("--accent-lime", "hsl(45, 100%, 48%)");
            print("Theme shifted to Amber Terminal.", "success");
        } else if (theme === "matrix") {
            root.style.setProperty("--accent-cyan", "hsl(120, 100%, 45%)");
            root.style.setProperty("--accent-purple", "hsl(120, 100%, 30%)");
            root.style.setProperty("--accent-lime", "hsl(120, 100%, 50%)");
            print("Theme shifted to Matrix Green Terminal.", "success");
        } else if (theme === "outrun") {
            root.style.setProperty("--accent-cyan", "hsl(320, 100%, 60%)");
            root.style.setProperty("--accent-purple", "hsl(20, 100%, 50%)");
            root.style.setProperty("--accent-lime", "hsl(180, 100%, 50%)");
            print("Theme shifted to Outrun Synthwave.", "success");
        } else {
            root.style.setProperty("--accent-cyan", "hsl(185, 100%, 50%)");
            root.style.setProperty("--accent-purple", "hsl(270, 95%, 68%)");
            root.style.setProperty("--accent-lime", "hsl(158, 100%, 45%)");
            print("Theme restored to default Cyberpunk.", "success");
        }
    }

    function handleChatMode(cmd, raw) {
        if (cmd === "exit" || cmd === "quit") {
            currentMode = "normal";
            prompt.textContent = "giri@rec:~$ ";
            input.placeholder = "Type a command...";
            print("Conversation link disconnected.", "info");
            return;
        }

        if (cmd.includes("hello") || cmd.includes("hi")) {
            print("Giri AI: Hello! What ML concept, edge optimization, or project details would you like to discuss?");
        } else if (cmd.includes("who are you") || cmd.includes("what are you")) {
            print("Giri AI: I am a quantized neural clone of Girivasanth, running entirely in your browser sandbox.");
        } else if (cmd.includes("joke") || cmd.includes("funny")) {
            const jokes = [
                "Why did the deep learning model break up with the training set? Because it was overfitting and needed some space!",
                "How many machine learning engineers does it take to change a lightbulb? Only one, but it needs 10,000 iterations to optimize the brightness.",
                "Why did the neural network go to therapy? It had too many hidden layers and bias issues!"
            ];
            const randJoke = jokes[Math.floor(Math.random() * jokes.length)];
            print(`Giri AI: ${randJoke}`);
        } else if (cmd.includes("research") || cmd.includes("vlm") || cmd.includes("threat")) {
            print("Giri AI: My research at NIT Silchar is focused on screenshot-only cyber attack detection. We deploy quantized VLMs to recognize brand elements and phishing UI patterns directly from pixels, avoiding network signature detection spoofing.");
        } else if (cmd.includes("project") || cmd.includes("skills")) {
            print("Giri AI: I built IntelliTraffic (RL traffic control), Drone Surveillance on Edge AI hardware, and a Migraine Brain EEG alert system. Try scrolling the main page to see the live simulators running!");
        } else {
            print("Giri AI: Intriguing query. My training weights indicate I should suggest learning more about my screenshot threat intelligence research or custom edge deployments! What else can I share?");
        }
    }

    function handleHackMode(cmd) {
        if (cmd === "exit" || cmd === "quit") {
            currentMode = "normal";
            prompt.textContent = "giri@rec:~$ ";
            input.placeholder = "Type a command...";
            print("Hack sequence aborted.", "info");
            return;
        }

        if (hackStep === 1) {
            if (cmd === "0110") {
                hackStep = 2;
                print("[SUCCESS] Primary firewall gate bypassed.", "success");
                print("Decoding Hex hash pattern...<br>Enter decimal value for Hex <span class=\"cli-highlight\">0x0A</span>:");
            } else {
                print("[ERROR] Access denied. Incorrect passcode pattern. Try again:", "error");
            }
        } else if (hackStep === 2) {
            if (cmd === "10") {
                currentMode = "normal";
                prompt.textContent = "giri@rec:~$ ";
                input.placeholder = "Type a command...";
                print("[BREACH COMPLETE] Mainframe root access granted.", "success");
                print("Access credentials loaded: Giri is highly qualified for AI engineering roles! 🎉", "success");
            } else {
                print("[ERROR] Access denied. Verification failed. Try again:", "error");
            }
        }
    }

    function runTrainingSimulation() {
        print("Fetching ResNet-50 backbone weights...", "info");
        print("Configuring 4-bit INT4 weight tensor scaling...", "info");
        
        let epoch = 1;
        const totalEpochs = 5;
        input.disabled = true;

        const interval = setInterval(() => {
            const barLength = 10;
            const filled = Math.min(barLength, Math.floor((epoch / totalEpochs) * barLength));
            const empty = barLength - filled;
            const bar = "█".repeat(filled) + "░".repeat(empty);
            
            const loss = (0.852 - (epoch - 1) * 0.19).toFixed(3);
            const acc = (74.2 + (epoch - 1) * 6.0).toFixed(1);
            
            print(`Epoch ${epoch}/${totalEpochs}: [${bar}] Loss: ${loss} - Accuracy: ${acc}%`);
            body.scrollTop = body.scrollHeight;

            epoch++;
            if (epoch > totalEpochs) {
                clearInterval(interval);
                print("[SUCCESS] Model trained and compressed successfully! Weights saved.", "success");
                input.disabled = false;
                input.focus();
                body.scrollTop = body.scrollHeight;
            }
        }, 800);
    }

    function runMatrixRainEffect() {
        print("Initializing code rain protocol...", "info");
        let count = 0;
        const interval = setInterval(() => {
            let rainLine = "";
            for (let i = 0; i < 40; i++) {
                rainLine += String.fromCharCode(33 + Math.floor(Math.random() * 93)) + " ";
            }
            print(`<span style="color:#27c93f; text-shadow:0 0 5px #27c93f;">${rainLine}</span>`);
            body.scrollTop = body.scrollHeight;
            count++;
            if (count > 12) {
                clearInterval(interval);
                print("Code rain feed complete.", "success");
                body.scrollTop = body.scrollHeight;
            }
        }, 150);
    }
}

/* 3D Card Hover Tilt Parallax Effect */
function initCardTilt() {
    const cards = document.querySelectorAll(".project-card, .achievement-card");
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const dx = (x - rect.width / 2) / (rect.width / 2);
            const dy = (y - rect.height / 2) / (rect.height / 2);
            
            card.style.transform = `perspective(1000px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) translateY(-4px)`;
        });
        
        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });
}
