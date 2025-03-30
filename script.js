document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("main section");
  const navButtons = document.querySelector("nav");
  const searchBtn = document.getElementById("search-btn");
  const checkInteractionBtn = document.getElementById("check-interaction");
  const savedList = document.getElementById("saved-list");

  // Handle navigation
  navButtons.addEventListener("click", (event) => {
    if (event.target.dataset.section) {
      sections.forEach((sec) => sec.classList.remove("active"));
      document
        .getElementById(event.target.dataset.section)
        .classList.add("active");
    }
  });

  // Search Drug (Fetching from JSON Server)
  searchBtn.addEventListener("click", () => {
    const drugName = document.getElementById("drug-search").value.trim();
    if (!drugName) return;

    fetch(`http://localhost:3000/drugs?name=${drugName}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const drug = data[0];
          document.getElementById("drug-info").innerHTML = `
                        <p><strong>${drug.name}</strong>: ${drug.description}</p> 
                        <button onclick="saveDrug('${drug.name}')">Save Drug</button>
                    `;
        } else {
          document.getElementById("drug-info").innerHTML =
            "<p>Drug not found.</p>";
        }
      })
      .catch(() => {
        document.getElementById("drug-info").innerHTML =
          "<p>Error fetching data.</p>";
      });
  });

  // Check Drug Interactions (Fetching from JSON Server)
  checkInteractionBtn.addEventListener("click", () => {
    const drug1 = document.getElementById("drug1").value.trim();
    const drug2 = document.getElementById("drug2").value.trim();
    if (!drug1 || !drug2) return;

    fetch(`http://localhost:3000/interactions?drug1=${drug1}&drug2=${drug2}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          document.getElementById(
            "interaction-result"
          ).innerHTML = `<p>Interaction: ${data[0].description}</p>`;
        } else {
          document.getElementById("interaction-result").innerHTML =
            "<p>No interactions found.</p>";
        }
      })
      .catch(() => {
        document.getElementById("interaction-result").innerHTML =
          "<p>Error fetching data.</p>";
      });
  });

  // Save Drug Function (Saving Locally)
  window.saveDrug = (drugName) => {
    const li = document.createElement("li");
    li.textContent = drugName;
    savedList.appendChild(li);
  };
});
