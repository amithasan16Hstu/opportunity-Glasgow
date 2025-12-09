// DUCO site interactions: theme, filters, animations, tabs, counters
document.addEventListener("DOMContentLoaded", () => {
    const main = document.querySelector("main");
    const yearSpan = document.getElementById("year");

    // ---------- Year in footer ----------
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ---------- Theme (light / dark) ----------
    const themeToggle = document.querySelector(".theme-toggle");

    function applyTheme(theme) {
        document.body.dataset.theme = theme;
        localStorage.setItem("duco-theme", theme);
    }

    // initial theme: from localStorage or system
    (function initTheme() {
        const stored = localStorage.getItem("duco-theme");
        const prefersDark =
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches;

        const initial = stored || (prefersDark ? "dark" : "light");
        applyTheme(initial);
    })();

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const current = document.body.dataset.theme === "dark" ? "dark" : "light";
            applyTheme(current === "dark" ? "light" : "dark");
        });
    }

    // ---------- Opportunities filters + search (only on that page) ----------
    const filterButtons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".card");
    const searchInput = document.getElementById("searchInput");
    const emptyMessage = document.getElementById("emptyMessage");

    let currentFilter = "all";
    let currentSearch = "";

    function normalize(text) {
        return (text || "").toLowerCase().trim();
    }

    function updateVisibility() {
        if (!cards.length) return;

        let anyVisible = false;
        const search = normalize(currentSearch);

        cards.forEach((card) => {
            const type = card.dataset.type || "other";
            const keywords = normalize(card.dataset.keywords || "");
            const matchesFilter = currentFilter === "all" || type === currentFilter;
            const matchesSearch =
                !search ||
                keywords.includes(search) ||
                card.innerText.toLowerCase().includes(search);

            const visible = matchesFilter && matchesSearch;
            card.style.display = visible ? "flex" : "none";
            if (visible) anyVisible = true;
        });

        if (emptyMessage) {
            emptyMessage.hidden = anyVisible;
        }
    }

    if (filterButtons.length) {
        filterButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                filterButtons.forEach((b) =>
                    b.classList.remove("filter-btn-active")
                );
                btn.classList.add("filter-btn-active");
                currentFilter = btn.dataset.filter || "all";
                updateVisibility();
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            currentSearch = e.target.value;
            updateVisibility();
        });
    }

    if (cards.length) {
        updateVisibility();
    }

    // ---------- Main entry & card stagger ----------
    if (main) {
        setTimeout(() => {
            main.classList.add("main-loaded");

            if (cards.length) {
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add("card-loaded");
                    }, 120 * index);
                });
            }
        }, 150);
    }

    // ---------- Scroll reveal for sections ----------
    const revealEls = document.querySelectorAll(
        ".reveal, .hero-home, .section, .page-hero"
    );

    if (revealEls.length && "IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        revealEls.forEach((el) => revealObserver.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add("is-visible"));
    }

    // ---------- Hero stats counters (Home page) ----------
    const statNumbers = document.querySelectorAll(".stat-number");

    if (statNumbers.length && "IntersectionObserver" in window) {
        const counterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const target = Number(el.dataset.count || "0");
                        let current = 0;
                        const step = Math.max(1, Math.round(target / 40));

                        const tick = () => {
                            current += step;
                            if (current >= target) {
                                el.textContent = target;
                            } else {
                                el.textContent = current;
                                requestAnimationFrame(tick);
                            }
                        };

                        requestAnimationFrame(tick);
                        counterObserver.unobserve(el);
                    }
                });
            },
            { threshold: 0.6 }
        );

        statNumbers.forEach((el) => counterObserver.observe(el));
    }

    // ---------- Tabs in research section (if you add them) ----------
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabPanels = document.querySelectorAll(".tab-panel");

    if (tabButtons.length && tabPanels.length) {
        tabButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const tab = btn.dataset.tab;

                tabButtons.forEach((b) => b.classList.remove("tab-btn-active"));
                btn.classList.add("tab-btn-active");

                tabPanels.forEach((panel) => {
                    panel.classList.toggle(
                        "tab-panel-active",
                        panel.id === `tab-${tab}`
                    );
                });
            });
        });
    }
});
