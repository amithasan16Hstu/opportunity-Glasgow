// Filters, search, year, and entry animations
document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".card");
    const searchInput = document.getElementById("searchInput");
    const emptyMessage = document.getElementById("emptyMessage");
    const yearSpan = document.getElementById("year");
    const main = document.querySelector("main");

    // Set current year in footer
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    let currentFilter = "all";
    let currentSearch = "";

    function normalize(text) {
        return text.toLowerCase().trim();
    }

    function updateVisibility() {
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

    // Filter button logic
    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            filterButtons.forEach((b) => b.classList.remove("filter-btn-active"));
            btn.classList.add("filter-btn-active");
            currentFilter = btn.dataset.filter || "all";
            updateVisibility();
        });
    });

    // Search box logic
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            currentSearch = e.target.value;
            updateVisibility();
        });
    }

    // Initial render
    updateVisibility();

    // ---- Entry animation ----
    // Fade in the main area and stagger cards
    if (main) {
        setTimeout(() => {
            main.classList.add("main-loaded");

            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add("card-loaded");
                }, 120 * index); // delay between cards
            });
        }, 150); // small delay after load
    }
});
