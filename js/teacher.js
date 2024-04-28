import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBHCCx9eMGUAppRuG4CFGiOVo1j8UbBcnY",
  authDomain: "cslife1.firebaseapp.com",
  databaseURL: "https://cslife1-default-rtdb.firebaseio.com",
  projectId: "cslife1",
  storageBucket: "cslife1.appspot.com",
  messagingSenderId: "509770234718",
  appId: "1:509770234718:web:09ec96e5c36999d296adcf",
};
//measurementId: "G-84WMFTCM25"
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase();
const auth = getAuth(firebaseApp);

onAuthStateChanged(auth, async function (user) {
  if (user) {
    // User is signed in.
    let uid = user.uid;
    console.log("User UID:", uid);
    // Call getScores function after user is authenticated
    // await getSectionDetails(uid);
    await getName(uid)
  } else {
    // No user is signed in.
    console.log("No user signed in.");
    window.location.href = "index.html";
  }
});
async function getName(uid){
  const userSnapshot = await get(ref(database, 'users/' + uid));
  const userData = userSnapshot.val();
      if (userData) {
          // User data found, update HTML content with first name and last name
          let firstName = userData.firstname;
          let lastName = userData.lastname;
          document.getElementById('userinfo').innerHTML = 'Welcome, ' + firstName + ' ' + lastName;
      } else {
          console.log('User data not found.');
      } 
}


function handleButtonClick(event) {
  // Get selected values when the button is clicked
  const dropdowns = Array.from(document.querySelectorAll(".dropdown"));
  const selectedValues = dropdowns.map((dropdown) => dropdown.value);

  console.log(selectedValues);

  // Get a reference to the "users" node
  const usersRef = ref(database, "users/");

  // Initialize index counters
  let userIndex = 1;
  let scoresIndex = 1;

  // Get the data once
  get(usersRef)
      .then((snapshot) => {
          if (snapshot.exists()) {
              // Access the data from the snapshot directly
              const userData = snapshot.val();

              let matchingUsersWithUID = [];

              // Filter users based on selected values and retrieve UID
              Object.entries(userData).forEach(([uid, user]) => {
                  if (
                      selectedValues.includes(user.selectedProgram) &&
                      selectedValues.includes(user.section) &&
                      selectedValues.includes(user.year) &&
                      user.userType === "student"
                  ) {
                      matchingUsersWithUID.push({ uid, ...user });
                  }
              });

              console.log("Matching users:", matchingUsersWithUID);

              // Update UI elements
              document.getElementById("class").innerHTML = `<p>${selectedValues.join(" ")}</p>`;
              document.getElementById("studentCount").innerHTML = `<p>${matchingUsersWithUID.length}</p>`;

              // Clear DataTables before adding new data
              $("#example").DataTable().clear().draw();
              $("#example1").DataTable().clear().draw();

              // Define an array to store promises for fetching scores
              const promises = [];

              // Fetch scores for each matching user
              matchingUsersWithUID.forEach((user) => {
                  const scoresRef = ref(database, `tablesScore/${user.uid}`);
                  const scoresPromise = get(scoresRef)
                      .then((scoresSnapshot) => {
                          if (scoresSnapshot.exists()) {
                              const scoresData = scoresSnapshot.val();
                              console.log("Scores for user with UID", user.uid, scoresData);
                              
                              // Compute average score
                              const scoresValues = Object.values(scoresData);
                              const sum = scoresValues.reduce((acc, curr) => acc + curr, 0);
                              const average = sum / scoresValues.length;

                              // Determine if the user passed or failed
                              const passed = average >= 7 ? "Passed" : "Failed";

                              return { user, scoresData, average, passed };
                          } else {
                              console.log("No scores data available for user with UID", user.uid);
                              return { user, scoresData: null, average: null, passed: null };
                          }
                      })
                      .catch((error) => {
                          console.error("Error fetching scores for user with UID", user.uid, error);
                          return { user, scoresData: null, average: null, passed: null };
                      });
                  promises.push(scoresPromise);
              });

              // Process all promises
              Promise.all(promises)
                  .then((results) => {
                      // Add user details, scores, and passed status to DataTables
                      results.forEach(({ user, scoresData, average, passed }) => {
                          if (user && scoresData) {
                              $("#example").DataTable().row.add([
                                  userIndex++, // Add auto-incremented index for users
                                  user.firstname,
                                  user.lastname,
                                  user.email,
                                  user.studentNumber,
                                  user.contactNumber,
                                  user.year
                              ]);
                              $("#example1").DataTable().row.add([
                                  scoresIndex++, // Add auto-incremented index for scores
                                  user.firstname,
                                  user.lastname,
                                  scoresData.scores1,
                                  scoresData.scores2,
                                  scoresData.scores3,
                                  scoresData.scores4,
                                  scoresData.scores5,
                                  scoresData.scores6,
                                  average.toFixed(2), // Display average score with 2 decimal places
                                  passed // Display whether the user passed or failed
                              ]);
                          }
                      });

                      // Redraw DataTables
                      $("#example").DataTable().draw();
                      $("#example1").DataTable().draw();
                  })
                  .catch((error) => {
                      console.error("Error processing promises:", error);
                  });

          } else {
              console.log("No data available");
          }
      })
      .catch((error) => {
          console.error("Error getting data:", error);
      });
}


const filterButton = document.getElementById("filterButton");
filterButton.addEventListener("click", handleButtonClick);

// async function getSectionDetails(uid) {
//     try {
//         let userSnapshot = await get(ref(database, 'users/' + uid));
//         let userData = userSnapshot.val();

//         console.log(userData);
//         console.log(userData.selectedProgram + " " + userData.section);

//         // Query the database for users with the same selectedProgram and section
//         let usersSnapshot = await get(ref(database, 'users/'));
//         let usersData = usersSnapshot.val();

//         let selectedProgram = userData.selectedProgram;
//         let section = userData.section;

//         // Filter users based on selectedProgram and section
//         let matchingUsers = Object.values(usersData).filter(user =>
//           user.selectedProgram === selectedProgram && user.section === section && user.userType === "student"
//         );

//         document.getElementById('class').innerHTML = `<p>${userData.selectedProgram + " " + userData.section}</p>`;
//         document.getElementById('studentCount').innerHTML = `<p>${matchingUsers.length}</p>`;

//         $('#example').DataTable().clear().draw();
//           // Create HTML for each row and append to the table
//         matchingUsers.forEach(user => {
//             $('#example').DataTable().row.add([
//                 user.firstname,
//                 user.lastname,
//                 user.email,
//                 user.studentNumber,
//                 user.contactNumber,
//                 user.year
//             ]);
//         });
//           $('#example').DataTable().draw();

//         }catch (error) {
//           console.error('Error getting scores:', error);
//     }
//   }

// async function getAllScores(uid){
//     try{
//         let scoreSnapshot = await get(ref(database, 'tablesScore/' + uid));
//         let scoreData = scoreSnapshot.val();

//         let scoresuid = scoreData.uid;
//         console.log(scoresuid);

//         let usersSnapshot = await get(ref(database, 'users/'));
//         let usersData = usersSnapshot.val();

//         let matchingUsers = Object.values(usersData).filter(user =>
//           user.selectedProgram === selectedProgram && user.section === section && user.userType === "student"
//         );

//           $('#example1').DataTable().clear().draw();
//           // Create HTML for each row and append to the table
//         matchingUsers.forEach(user => {
//             $('#example1').DataTable().row.add([
//                 user.firstname,
//                 user.lastname,
//                 user.email,
//                 user.studentNumber,
//                 user.contactNumber,
//                 user.year
//             ]);
//         });
//           $('#example1').DataTable().draw();
//     }catch (error) {
//         console.error('Error getting scores:', error);
//     }

// }

let toggle = document.querySelector(".toggle");
let selectors = [
  ".sideNav",
  ".mainBoard",
  ".cardGroup",
  ".headerNav",
  ".displayer",
  ".form-container form",
];

let elements = selectors.map((selector) => document.querySelector(selector));

toggle.addEventListener("click", function () {
  console.log("Toggle button clicked"); // Check if the toggle button event is firing
  elements.forEach((element) => {
    if (element) {
      element.classList.toggle("active");
    } else {
      console.log("Element not found for selector");
    }
  });
});

document.getElementById('logoutButton').addEventListener('click', function (event) {
  event.preventDefault();
  signOut(auth)
      .then(() => {
          window.location.href = 'index.html';
          alert("Signed out Successfully");
      })
      .catch((error) => {
          console.error('Sign-out error:', error);
      });
});
