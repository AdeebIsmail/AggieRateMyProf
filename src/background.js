const GRAPHQL_ENDPOINT =
  "https://v0-proxy-server-git-main-adeebismails-projects.vercel.app/api/graphql";

async function fetchTeacherList(teacherList, departmentCode) {
  const query = `
    query NewSearch($text: String!) {
      newSearch {
        teachers(query: { text: $text, schoolID: "U2Nob29sLTEwMDM=" }) {
          edges {
            cursor
            node {
              id
              firstName
              lastName
              avgDifficulty
              avgRating
              department
              numRatings
              wouldTakeAgainPercent
              courseCodes {
                        courseName
                }
            }
          }
        }
      }
    }
  `;

  let data = [];
  for (let i = 0; i < teacherList.length; i++) {
    let teacher = teacherList[i];

    const variables = {
      text: teacher,
    };

    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      const result = await response.json();

      let proxyResponse = result["data"]["newSearch"]["teachers"]["edges"];

      for (let i = 0; i < proxyResponse.length; i++) {
        courses = proxyResponse[i]["node"]["courseCodes"];
        for (let j = 0; j < courses.length; j++) {
          if (courses[j]["courseName"].startsWith(departmentCode)) {
            data.push(proxyResponse[i]);
            break;
          }
        }
      }
    } catch (error) {
      console.error("GraphQL Error:", error);
    }
  }
  return data;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "teacherList") {
    fetchTeacherList(message.data, message.departmentCode).then((data) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: "teacherData", data });
      });
    });
  }
});

chrome.webNavigation.onHistoryStateUpdated.addListener(
  (details) => {
    if (details.url.includes("courses")) {
      chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        files: ["src/content.js"],
      });
    }
  },
  {
    url: [{ hostContains: "tamu.collegescheduler.com" }],
  }
);
