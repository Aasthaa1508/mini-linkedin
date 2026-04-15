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
  .then(res => res.json()) // Backend now sends JSON
  .then(data => {
    showOutput(data.message || data.error);
    document.getElementById("name").value = ""; // Clear input after adding
  })
  .catch(err => showOutput("❌ Error communicating with server."));
}

// 2. Add Friend
function addFriend() {
  const user1 = document.getElementById("user1").value.trim();
  const user2 = document.getElementById("user2").value.trim();
  
  if (!user1 || !user2) return showOutput("⚠️ Please enter both user names.");

  fetch("/add-friend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user1, user2 })
  })
  .then(res => res.json()) // Backend now sends JSON
  .then(data => {
    showOutput(data.message || data.error);
    document.getElementById("user1").value = "";
    document.getElementById("user2").value = "";
  })
  .catch(err => showOutput("❌ Error communicating with server."));
}

// 3. Get Mutual Friends
function getMutual() {
  const u1 = document.getElementById("u1").value.trim();
  const u2 = document.getElementById("u2").value.trim();

  if (!u1 || !u2) return showOutput("⚠️ Please enter both user names.");

  fetch(`/mutual/${u1}/${u2}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) return showOutput(data.error);
      
      // Check if the mutuals array has any people in it
      if (data.mutuals && data.mutuals.length > 0) {
        showOutput(`🔄 Mutual Friends between ${u1} & ${u2}: ` + data.mutuals.join(", "));
      } else {
        showOutput(`No mutual friends found between ${u1} and ${u2}.`);
      }
    })
    .catch(err => showOutput("❌ Error fetching mutual friends."));
}

// 4. Get Recommendations (Friends of Friends)
function getRecommendations() {
  const user = document.getElementById("recUser").value.trim();
  if (!user) return showOutput("⚠️ Please enter a user name.");

  fetch(`/recommend/${user}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) return showOutput(data.error);
      
      // Check if there are recommendations
      if (data.recommendations && data.recommendations.length > 0) {
        // Format the new object structure: { name: "Bob", mutualConnections: 2 }
        const formattedRecs = data.recommendations.map(
          rec => `${rec.name} (${rec.mutualConnections} mutuals)`
        );
        showOutput(`💡 Recommendations for ${user}:\n` + formattedRecs.join("  |  "));
      } else {
        showOutput(`No recommendations available for ${user} right now.`);
      }
    })
    .catch(err => showOutput("❌ Error fetching recommendations."));
}