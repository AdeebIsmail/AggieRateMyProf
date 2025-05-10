if (window.location.pathname.match(/^\/terms\/.*\/courses\/\d+$/)) {
  // 1. Create container (if not already created)
  let container = document.getElementById("teacher-info-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "teacher-info-container";
    container.style.position = "fixed";
    container.style.top = "100px";
    container.style.right = "20px";
    container.style.zIndex = "9999";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "10px"; 
    container.style.height = document.documentElement.scrollHeight + -200 + "px"; // or any value you prefer
    console.log(document.documentElement.scrollHeight);
    container.style.overflowY = "auto"; 
    document.body.appendChild(container);
  }

  function createTeacherCard(teacher) {
    const card = document.createElement("div");
    card.style.border = "1px solid #ccc";
    card.style.borderRadius = "8px";
    card.style.padding = "10px";
    card.style.backgroundColor = "#fff";
    card.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
    card.innerHTML = `
    <strong>${teacher.firstName} ${teacher.lastName}</strong><br>
    Department: ${teacher.department}<br>
    Avg Rating: ${teacher.avgRating}<br>
    Would Take Again: ${teacher.wouldTakeAgainPercent.toFixed(1)}%<br>
    Difficulty: ${teacher.avgDifficulty}<br>
    Ratings: ${teacher.numRatings}
  `;
    container.appendChild(card);
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "teacherData") {
      let teacherData = message.data;
      for (let i = 0; i < teacherData.length; i++) {
        createTeacherCard(teacherData[i]["node"]);
      }
    }
  });

  if (typeof observer === "undefined") {
    const observer = new MutationObserver(() => {
      const headerName = document.querySelectorAll("h1");
      departmentCode = headerName[0].innerText.substring(0, 4);
      const tableRows = document.querySelectorAll("tbody tr");
      if (tableRows.length > 0) {
        observer.disconnect();
        let array = [];
        let instructorElements = document.querySelectorAll("li");
        instructorElements.forEach((li) => {
          if (li.textContent.includes("Instructor")) {
            let name = li.querySelectorAll("span")[1]?.textContent.trim();
            if (name) {
              array.push(name);
            }
          }
        });

        if (array.length > 0) {
          chrome.runtime.sendMessage({
            type: "teacherList",
            data: array,
            departmentCode,
          });
        } else {
          console.log("No instructors found.");
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
} else {
  const existingBox = document.getElementById("teacher-info-container");
  if (existingBox) existingBox.remove();
}
