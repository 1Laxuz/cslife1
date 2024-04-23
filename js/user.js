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
            var uid = user.uid;
            console.log("User UID:", uid);
            
            // Call getScores function after user is authenticated
            await getScores(uid);
        } else {
            // No user is signed in.
            console.log("No user signed in.");
            window.location.href = "index.html"
        }
});

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

function getColor(score) {
    if (score >= 8) {
        return 'green'; // Green for scores >= 90
    } else if (score >= 5) {
        return 'blue'; // Orange for scores >= 70
    } else {
        return 'red'; // Red for scores < 70
    }
}

async function getScores(uid) {
    try {
        const scoreSnapshot = await get(ref(database, 'tablesScore/' + uid));
        const scoreData = scoreSnapshot.val();
        console.log(uid);

        if (scoreData) {
            // Display scores in their respective containers
            document.getElementById('scores1').innerHTML = `<p style="color: ${getColor(scoreData.scores1)}">${scoreData.scores1}</p>`;
document.getElementById('scores2').innerHTML = `<p style="color: ${getColor(scoreData.scores2)}">${scoreData.scores2}</p>`;
document.getElementById('scores3').innerHTML = `<p style="color: ${getColor(scoreData.scores3)}">${scoreData.scores3}</p>`;
document.getElementById('scores4').innerHTML = `<p style="color: ${getColor(scoreData.scores4)}">${scoreData.scores4}</p>`;
document.getElementById('scores5').innerHTML = `<p style="color: ${getColor(scoreData.scores5)}">${scoreData.scores5}</p>`;
document.getElementById('scores6').innerHTML = `<p style="color: ${getColor(scoreData.scores6)}">${scoreData.scores6}</p>`;
        }

        document.getElementById('customParagraph1').innerHTML = generateCustomParagraph(scoreData.scores1, "Topic 1 Foundation of Programming");
        document.getElementById('customParagraph2').innerHTML = generateCustomParagraph(scoreData.scores2, "Topic 2 Tip and Tricks");
        document.getElementById('customParagraph3').innerHTML = generateCustomParagraph(scoreData.scores3, "Topic 3 Intro to pseudocode");
        document.getElementById('customParagraph4').innerHTML = generateCustomParagraph(scoreData.scores4, "Topic 4 Basic Programming Concepts");
        document.getElementById('customParagraph5').innerHTML = generateCustomParagraph(scoreData.scores5, "Topic 5 Structured Programming");
        document.getElementById('customParagraph6').innerHTML = generateCustomParagraph(scoreData.scores6, "Topic 6 Data Structures and Algorithms");

        
        const totalScore = (scoreData.scores1 + scoreData.scores2 + scoreData.scores3 + scoreData.scores4 + scoreData.scores5 + scoreData.scores6) / 6;

        document.getElementById('totalScore').innerHTML = `<p> Your Total Score Average is: ${totalScore.toFixed(2)}</p>`;
            // Display custom paragraph based on score
            if (totalScore >= 7) {
                document.getElementById('customParagraph').innerHTML = "<p>Result: Congratulations! you passed.</p>";
            }
            else {
                document.getElementById('customParagraph').innerHTML = "<p>Result:  Sorry, but you failed.</p>";
            }


        const event = new Event('dataFetched');
        window.scoreData = scoreData; // Store scoreData in window object
        window.dispatchEvent(event);
    } catch (error) {
        console.error('Error getting scores:', error);
    }
}

function generateCustomParagraph(score, topic) {
    if (score >= 8) {
        return `<p>In ${topic}: Excellent, You may explore more to gain more knowledge.</p>`;
    } else if (score >= 4) {
        return `<p>In ${topic}: Advance study about this topic.</p>`;
    } else {
        return `<p>In ${topic}: You might need to try to study more about this topic.</p>`;
    }
}


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
// Path: js/user.js