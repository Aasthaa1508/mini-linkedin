// Function to display messages in the output box
function showOutput(msg) {
  document.getElementById("output").innerText = msg;
}

// 1. Add User
function addUser() {
  const name = document.getElementById("name").value.trim();
  if (!name) return showOutput("⚠️ Please enter a name first.");

  fetch("/add-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  })
  .then(res => res.json())
  .then(data => {
    showOutput(data.message || data.error);
    document.getElementById("name").value = "";
  })
  .catch(() => showOutput("❌ Error communicating with server."));
}

// 2. Add Friend
function addFriend() {
  const user1 = document.getElementById("user1").value.trim();
  const user2 = document.getElementById("user2").value.trim();

  if (!user1 || !user2) {
    return showOutput("⚠️ Please enter both user names.");
  }

  fetch("/add-friend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user1, user2 })
  })
  .then(res => res.json())
  .then(data => {
    showOutput(data.message || data.error);
    document.getElementById("user1").value = "";
    document.getElementById("user2").value = "";
  })
  .catch(() => showOutput("❌ Error communicating with server."));
}

// 3. Get Mutual Friends
function getMutual() {
  const u1 = document.getElementById("u1").value.trim();
  const u2 = document.getElementById("u2").value.trim();

  if (!u1 || !u2) {
    return showOutput("⚠️ Please enter both user names.");
  }

  fetch(`/mutual/${u1}/${u2}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) return showOutput(data.error);

      if (data.mutuals && data.mutuals.length > 0) {
        showOutput(`🔄 Mutual Friends: ${data.mutuals.join(", ")}`);
      } else {
        showOutput("No mutual friends found.");
      }
    })
    .catch(() => showOutput("❌ Error fetching mutual friends."));
}

// 4. Get Recommendations
function getRecommendations() {
  const user = document.getElementById("recUser").value.trim();

  if (!user) {
    return showOutput("⚠️ Please enter a user name.");
  }

  fetch(`/recommend/${user}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) return showOutput(data.error);

      if (data.recommendations && data.recommendations.length > 0) {
        const formatted = data.recommendations.map(
          r => `${r.name} (${r.mutualConnections} mutuals)`
        );
        showOutput(`💡 Recommendations:\n${formatted.join(" | ")}`);
      } else {
        showOutput("No recommendations available.");
      }
    })
    .catch(() => showOutput("❌ Error fetching recommendations."));
}