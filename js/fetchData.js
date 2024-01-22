import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDKFZhYibbIxtFlpl68usbtUpk3Dobcvog",
    authDomain: "cslife-9797d.firebaseapp.com",
    databaseURL: "https://cslife-9797d-default-rtdb.firebaseio.com",
    projectId: "cslife-9797d",
    storageBucket: "cslife-9797d.appspot.com",
    messagingSenderId: "734759036591",
    appId: "1:734759036591:web:37b5060bcee292b826965a",
    measurementId: "G-84WMFTCM25"
  };
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);

let initialSignIn = true;

const handleAuthStateChange = async (user) => {
    if (user) {
        try {
            // Get user UID
            const uid = user.uid;

            // Fetch user data using UID
            const userSnapshot = await get(ref(database, 'users/' + uid));
            const userData = userSnapshot.val();
            
            console.log(userData);
           
            
            // Determine the user type
            switch (userData?.userType) {
                case 'user':
            
                    console.log('User is a regular user');
                    if (!initialSignIn) {
                        window.location.href = "user_page.html";
                    }
                    break;
                case 'admin':
                   // document.getElementById('firstname').innerHTML = `<p>${userData.firstname}</p>`;
                    console.log('User is an admin');           
                    if (!initialSignIn) {
                        window.location.href = "admin_page.html";
                    }
                    break;
                default:
                    console.log('Unknown user type');
                    if (!initialSignIn) {
                        window.location.href = "index.html";
                    }
                    break;
         }

            // Set initialSignIn to false after the first sign-in
            initialSignIn = false;

            // Fetch score data using UID
            const scoreSnapshot = await get(ref(database, 'tablesScore/' + uid));
            const scoreData = scoreSnapshot.val();
            
            if (userData) {
                // Display scores in their respective containers
                document.getElementById('scores1').innerHTML = `<p>${scoreData.scores1}</p>`;
                document.getElementById('scores2').innerHTML = `<p>${scoreData.scores2}</p>`;
                document.getElementById('scores3').innerHTML = `<p>${scoreData.scores3}</p>`;
                document.getElementById('scores4').innerHTML = `<p>${scoreData.scores4}</p>`;
                document.getElementById('scores5').innerHTML = `<p>${scoreData.scores5}</p>`;
                document.getElementById('scores6').innerHTML = `<p>${scoreData.scores6}</p>`;
            } else {
                // Handle case when no score data is found
                console.log('No score data found');
            }
            // Make scoreData accessible globally

            window.scoreData = scoreData;
            const event = new Event('dataFetched');
            window.dispatchEvent(event);
        } catch (error) {
            console.error('Error getting user data:', error);
        }
    } else {
        // No user signed in
        console.log('No user signed in');
        // Handle accordingly (e.g., redirect to login page)
        if (!initialSignIn) {
            window.location.href = 'index.html';
        }
    }
};



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
        const programCounts = {};
        Object.values(usersData).forEach(user => {
            // Check if the user has a selectedProgram property
            if (user && user.selectedProgram) {
                // Increment the count for the selected program
                programCounts[user.selectedProgram] = (programCounts[user.selectedProgram] || 0) + 1;
            }
        });
        console.log(programCounts);
        displayBarChart(programCounts);
        // Filter users with userType "user"
        const userCount = Object.values(usersData)
            .filter(user => user.userType === 'user')
            .length;
            
        // Display the total count in the specified div
        document.getElementById('totalUsersCount').innerText = userCount.toString();
        const userCountss = Object.values(usersData)
            .filter(user => user.userType === 'admin')
            .length;
            
        // Display the total count in the specified div
        document.getElementById('totalAdminCount').innerText = userCountss.toString();

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
                label: 'User Counts',
                data: counts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};

// Call the function
getTotalUsersCount();

// Call the function to get and display the total user count
getTotalUsersCount();

// Add the combined event listener
onAuthStateChanged(auth, handleAuthStateChange);
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
