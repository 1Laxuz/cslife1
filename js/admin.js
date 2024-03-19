import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD_5NegiAoWx-xdiS18vGFf3ws0TIBSBcE",
    authDomain: "cslife2-a7b38.firebaseapp.com",
    databaseURL: "https://cslife2-a7b38-default-rtdb.firebaseio.com",
    projectId: "cslife2-a7b38",
    storageBucket: "cslife2-a7b38.appspot.com",
    messagingSenderId: "145436502639",
    appId: "1:145436502639:web:f5dcd44f6d9463779e7b9a"
};
    const firebaseApp = initializeApp(firebaseConfig);
    const database = getDatabase();
    const auth = getAuth(firebaseApp);

onAuthStateChanged(auth, async function(user) {
        if (user) {
            // User is signed in.
            var uid = user.uid;
            console.log("User UID:", uid);
            checkUserRole(user.uid);
            // Call getScores function after user is authenticated
            
            await getTotalUsersCount();
            await displayCharts();
        } else {
            // No user is signed in.
            console.log("No user signed in.");
            window.location.href = "index.html"
        }
});

// Function to check user role
function checkUserRole(uid) {
    // Retrieve user role from Firebase Realtime Database
    firebase.database().ref('users/' + uid + '/userType').once('value')
      .then(function(snapshot) {
        var role = snapshot.val();
        // Check if user has admin role
        if (role === 'admin') {
          // Allow access to admin page
          console.log("User is admin");
        } else {
          // Redirect to unauthorized page
          console.log("User is not authorized to access this page");
          window.location.href = "index.html";
        }
      })
      .catch(function(error) {
        console.error("Error getting user role:", error);
      });
  }

window.addEventListener('dataFetched', () => {
    const canvas = document.getElementById('scoreChart');
    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(window.scoreData || {}),
            datasets: [{
                label: 'Scores',
                data: Object.values(window.scoreData || {}),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10
                }
            }
        }
    });
});




async function getTotalUsersCount() {
    const usersSnapshot = await get(ref(database, 'users/'));
    const usersData = usersSnapshot.val();
    
    if (usersData) {
        
        // Filter users with userType "user"
        const userCount = Object.values(usersData)
            .filter(user => user.userType === 'user')
            .length;
        const userCountss = Object.values(usersData)
            .filter(user => user.userType === 'admin')
            .length; 
        const userCountsss = Object.values(usersData)
            .filter(user => user.userType === 'teacher')
            .length;   
            
        // Display the total count in the specified div
        document.getElementById('totalUsersCount').innerText = userCount.toString();
        // Display the total count in the specified div
        document.getElementById('totalAdminCount').innerText = userCountss.toString();
        // Display the total count in the specified div
        document.getElementById('totalTeacherCount').innerText = userCountsss.toString();

        const userCounts = {
            IT: Object.values(usersData).filter(user => user.selectedProgram === 'IT' && user.userType === 'user').length,
            CS: Object.values(usersData).filter(user => user.selectedProgram === 'CS' && user.userType === 'user').length,
            IS: Object.values(usersData).filter(user => user.selectedProgram === 'IS' && user.userType === 'user').length,
          };
            document.getElementById('countIT').innerText = userCounts.IT.toString();
            document.getElementById('countCS').innerText = userCounts.CS.toString();
            document.getElementById('countIS').innerText = userCounts.IS.toString();
  
    } else {
        // Handle case when no user data is found
        console.log('No user data found');
    }
}
// Call the function


async function displayCharts() {
    const usersSnapshot = await get(ref(database, 'users/'));
    const userData = usersSnapshot.val();

    const programCounts = {}; // Initialize programCounts here

    Object.values(userData).forEach(user => {
        // Check if the user has a selectedProgram property
        if (user && user.userType === 'user' && user.selectedProgram) {
            // Increment the count for the selected program
            programCounts[user.selectedProgram] = (programCounts[user.selectedProgram] || 0) + 1;
        }
    });

    displayBarChart(programCounts);
}

const displayBarChart = (data) => {
    // Extract labels and data from the programCounts object
    const labels = Object.keys(data);
    const counts = Object.values(data);

    // Access the canvas and context
    const canvas = document.getElementById('adminChart');
    const ctx = canvas.getContext('2d');

    // Create the bar chart
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Students by Program User Counts',
                data: counts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    stepSize: 1
                }
            }
        }
    });
};



var toggle = document.querySelector(".toggle");
var selectors = [
  ".sideNav",
  ".mainBoard",
  ".cardGroup",
  ".headerNav",
  ".displayer",
  ".form-container form"
];

var elements = selectors.map(selector => document.querySelector(selector));

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

// Add the combined event listener
//onAuthStateChanged(auth, handleAuthStateChange);
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
