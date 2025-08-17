class SnapFeed {
  constructor(containerId) {
      this.container = document.getElementById(containerId);
  }

  async init() {
      console.log("📡 Fetching snaps...");
      try {
          const snaps = await this.loadSnaps();
          console.log("✅ Snaps loaded:", snaps);
          this.render(snaps);
      } catch (err) {
          console.error("❌ Error loading snaps:", err);
          this.container.innerHTML = `<p style="color:red;">Failed to load snaps.</p>`;
      }
  }

  async loadSnaps() {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No token found — please log in.");

      const res = await fetch('/api/snaps', {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
  }

  render(snaps) {
      if (!snaps || snaps.length === 0) {
          this.container.innerHTML = `<p>No snaps yet.</p>`;
          return;
      }

      this.container.innerHTML = snaps.map(snap => `
          <div class="snap-card">
              <div class="snap-header">
                  <span>${snap.username || "Unknown"}</span>
                  <span>${new Date(snap.created_at).toLocaleString()}</span>
              </div>
              <div class="snap-body">
                  ${snap.text ? `<p>${snap.text}</p>` : ""}
                  ${snap.image_url ? `<img src="${snap.image_url}" alt="Snap Image">` : ""}
              </div>
          </div>
      `).join("");
  }
}

window.SnapFeed = SnapFeed;



