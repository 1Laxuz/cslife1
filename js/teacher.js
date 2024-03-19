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
            //await getAllScores(uid);
            // await getAllScores();
        } else {
            // No user is signed in.
            console.log("No user signed in.");
            window.location.href = "index.html"
        }
});

    // async function getAllScores() {
    //     try {
    //         const scoresSnapshot = await get(ref(database, 'tablesScore'));
    //         const scoresData = scoresSnapshot.val();
    //         console.log(scoresData);
    
    //         if (scoresData) {
    //             let totalScores = 0;
    //             let count = 0;
    
    //             // Iterate over each user's scores
    //             for (const uid in scoresData) {
    //                 const userScores = scoresData[uid];
    //                 // Calculate total scores
    //                 totalScores += (userScores.scores1 + userScores.scores2 + userScores.scores3 + userScores.scores4 + userScores.scores5 + userScores.scores6);
    //                 count++;
    //             }
    
    //             // Calculate average score
    //             const averageScore = totalScores / (count * 6); // Total scores divided by the total number of scores
                
    //             // Display the average score
    //             document.getElementById('averageScore').innerHTML = `<p>Average Score: ${averageScore.toFixed(2)}</p>`;
                
    //             // Dispatch event after data is fetched
    //             const event = new Event('scoresFetched');
    //             window.averageScore = averageScore; // Store average score in window object
    //             window.dispatchEvent(event);
    //         }
    //     } catch (error) {
    //         console.error('Error getting scores:', error);
    //     }
    // }
    
    // // Listen for 'scoresFetched' event
    // window.addEventListener('scoresFetched', () => {
    //     // Display chart with average score
    //     const canvas = document.getElementById('scoreChart');
    //     const ctx = canvas.getContext('2d');
    
    //     new Chart(ctx, {
    //         type: 'bar',
    //         data: {
    //             labels: ['Average Score'],
    //             datasets: [{
    //                 label: 'Average Score',
    //                 data: [window.averageScore || 0],
    //                 backgroundColor: 'rgba(75, 192, 192, 0.2)',
    //                 borderColor: 'rgba(75, 192, 192, 1)',
    //                 borderWidth: 2
    //             }]
    //         },
    //         options: {
    //             scales: {
    //                 y: {
    //                     beginAtZero: true,
    //                     max: 10
    //                 }
    //             }
    //         }
    //     });
    // });
    
    // // Call function to fetch all scores
    


// async function getScores(uid) {
//     try {
//         const scoreSnapshot = await get(ref(database, 'tablesScore/' + uid));
//         const scoreData = scoreSnapshot.val();
//         console.log(scoreData);

//         if (scoreData) {
//             // Display scores in their respective containers
//             document.getElementById('scores1').innerHTML = `<p>${scoreData.scores1}</p>`;
//             document.getElementById('scores2').innerHTML = `<p>${scoreData.scores2}</p>`;
//             document.getElementById('scores3').innerHTML = `<p>${scoreData.scores3}</p>`;
//             document.getElementById('scores4').innerHTML = `<p>${scoreData.scores4}</p>`;
//             document.getElementById('scores5').innerHTML = `<p>${scoreData.scores5}</p>`;
//             document.getElementById('scores6').innerHTML = `<p>${scoreData.scores6}</p>`;
//         }

//         document.getElementById('customParagraph1').innerHTML = generateCustomParagraph(scoreData.scores1, "Topic 1 Foundation of Programming");
//         document.getElementById('customParagraph2').innerHTML = generateCustomParagraph(scoreData.scores2, "Topic 2 Tip and Tricks");
//         document.getElementById('customParagraph3').innerHTML = generateCustomParagraph(scoreData.scores3, "Topic 3 Intro to pseudocode");
//         document.getElementById('customParagraph4').innerHTML = generateCustomParagraph(scoreData.scores4, "Topic 4 Basic Programming Concepts");
//         document.getElementById('customParagraph5').innerHTML = generateCustomParagraph(scoreData.scores5, "Topic 5 Structured Programming");
//         document.getElementById('customParagraph6').innerHTML = generateCustomParagraph(scoreData.scores6, "Topic 6 Data Structures and Algorithms");

//         const totalScore = (scoreData.scores1 + scoreData.scores2 + scoreData.scores3 + scoreData.scores4 + scoreData.scores5 + scoreData.scores6) / 6;
            
//         document.getElementById('totalScore').innerHTML = `<p> Your Total Score Average is: ${totalScore.toFixed(2)}</p>`;
//             // Display custom paragraph based on score
//             if (totalScore >= 8) {
//                 document.getElementById('customParagraph').innerHTML = "<p>Knowledge Category: You're doing great!</p>";
//             } else if (totalScore >= 4) {
//                 document.getElementById('customParagraph').innerHTML = "<p>Knowledge Category: You're doing okay.</p>";
//             } else {
//                 document.getElementById('customParagraph').innerHTML = "<p>Knowledge Category: You need improvement.</p>";
//             }


//         const event = new Event('dataFetched');
//         window.scoreData = scoreData; // Store scoreData in window object
//         window.dispatchEvent(event);
//     } catch (error) {
//         console.error('Error getting scores:', error);
//     }
// }

// function generateCustomParagraph(score, topic) {
//     if (score >= 8) {
//         return `<p>In ${topic}: Excellent, You may explore more to gain more knowledge.</p>`;
//     } else if (score >= 4) {
//         return `<p>In ${topic}: You can try again or advance study about this topic.</p>`;
//     } else {
//         return `<p>In ${topic}: You might need to try to study more about this topic.</p>`;
//     }
// }

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
