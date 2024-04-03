import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBHCCx9eMGUAppRuG4CFGiOVo1j8UbBcnY",
  authDomain: "cslife1.firebaseapp.com",
  databaseURL: "https://cslife1-default-rtdb.firebaseio.com",
  projectId: "cslife1",
  storageBucket: "cslife1.appspot.com",
  messagingSenderId: "509770234718",
  appId: "1:509770234718:web:09ec96e5c36999d296adcf"
          };
             //measurementId: "G-84WMFTCM25"
    const firebaseApp = initializeApp(firebaseConfig);
    const database = getDatabase();
    const auth = getAuth(firebaseApp);

    onAuthStateChanged(auth, async function(user) {
        if (user) {
            // User is signed in.
            let uid = user.uid;
            console.log("User UID:", uid);
            
            // Call getScores function after user is authenticated
            await getSectionDetails(uid);
            // await getAllScores();
        } else {
            // No user is signed in.
            console.log("No user signed in.");
            window.location.href = "index.html"
        }
});

async function getSectionDetails(uid) {
    try {
        const userSnapshot = await get(ref(database, 'users/' + uid));
        const userData = userSnapshot.val();

        console.log(userData);
        console.log(userData.selectedProgram + " " + userData.section);

        // Query the database for users with the same selectedProgram and section
        const usersSnapshot = await get(ref(database, 'users/'));
        const usersData = usersSnapshot.val();

        const selectedProgram = userData.selectedProgram;
        const section = userData.section;

        // Filter users based on selectedProgram and section
        const matchingUsers = Object.values(usersData).filter(user => 
          user.selectedProgram === selectedProgram && user.section === section && user.userType === "user"
        );

        document.getElementById('class').innerHTML = `<p>${userData.selectedProgram + " " + userData.section}</p>`;
        document.getElementById('studentCount').innerHTML = `<p>${matchingUsers.length}</p>`;

        $('#example').DataTable().clear().draw();
          // Create HTML for each row and append to the table
        matchingUsers.forEach(user => {
            $('#example').DataTable().row.add([
                user.firstname,
                user.lastname,
                user.age,
                user.email,
                user.section,
                user.selectedProgram,
                user.userType
            ]);
        });
          $('#example').DataTable().draw();
        }catch (error) {
          console.error('Error getting scores:', error);
    }
  }

let toggle = document.querySelector(".toggle");
let selectors = [
  ".sideNav",
  ".mainBoard",
  ".cardGroup",
  ".headerNav",
  ".displayer",
  ".form-container form"
];

let elements = selectors.map(selector => document.querySelector(selector));

toggle.addEventListener("click", function() {
  console.log("Toggle button clicked"); // Check if the toggle button event is firing
  elements.forEach(element => {
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
