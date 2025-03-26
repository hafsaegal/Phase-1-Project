document
  .getElementById("drug-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page reload

    const drugInput = document.getElementById("drug-input").value.trim();
    if (!drugInput) {
      alert("Please enter drug names.");
      return;
    }

    const drugNames = drugInput.split(",").map((drug) => drug.trim()); // Split and trim input
    fetchDrugInteractions(drugNames);
  });

function fetchDrugInteractions(drugNames) {
  const baseURL = "https://rxnav.nlm.nih.gov/REST/";

  // Convert drug names to RxCUI (drug IDs)
  Promise.all(
    drugNames.map((drug) =>
      fetch(`${baseURL}rxcui.json?name=${drug}`)
        .then((response) => response.json())
        .then((data) =>
          data.idGroup.rxnormId ? data.idGroup.rxnormId[0] : null
        )
    )
  ).then((rxCuis) => {
    rxCuis = rxCuis.filter((id) => id !== null); // Remove null values

    if (rxCuis.length < 2) {
      document.getElementById("results").innerHTML =
        "<p>Not enough valid drugs found to check interactions.</p>";
      return;
    }

    // Check interactions
    fetch(`${baseURL}interaction/list.json?rxcuis=${rxCuis.join("+")}`)
      .then((response) => response.json())
      .then((data) => displayInteractions(data))
      .catch((error) => console.error("Error fetching interactions:", error));
  });
}

function displayInteractions(data) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  if (!data.fullInteractionTypeGroup) {
    resultsDiv.innerHTML = "<p>No known interactions found.</p>";
    return;
  }

  const interactions = data.fullInteractionTypeGroup
    .flatMap((group) => group.fullInteractionType)
    .flatMap((type) => type.interactionPair);

  resultsDiv.innerHTML = "<h3>Potential Interactions:</h3>";
  interactions.forEach((interaction) => {
    resultsDiv.innerHTML += `<p><strong>${interaction.description}</strong></p>`;
  });
}
