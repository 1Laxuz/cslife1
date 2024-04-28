import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase,remove, set, ref, get } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
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
    const firebaseApp = initializeApp(firebaseConfig);
    const database = getDatabase();
    const auth = getAuth(firebaseApp);

onAuthStateChanged(auth, async function(user) {
        if (user) {
            // User is signed in.
            var uid = user.uid;
            console.log("User UID:", uid);
            
            await getName(uid)
            
            await getTotalUsersCount();
            await displayCharts(uid);
            await GetAllDataOnce();
        } else {
            // No user is signed in.
            console.log("No user signed in.");
            window.location.href = "index.html"
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

        const userCount = Object.values(usersData)
            .filter(user => user.userType === 'student')
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
            IT: Object.values(usersData).filter(user => user.selectedProgram === 'IT' && user.userType === 'student').length,
            CS: Object.values(usersData).filter(user => user.selectedProgram === 'CS' && user.userType === 'student').length,
            IS: Object.values(usersData).filter(user => user.selectedProgram === 'IS' && user.userType === 'student').length,
          };
            document.getElementById('countIT').innerText = userCounts.IT.toString();
            document.getElementById('countCS').innerText = userCounts.CS.toString();
            document.getElementById('countIS').innerText = userCounts.IS.toString();
  
    } else {
        // Handle case when no user data is found
        console.log('No user data found');
    }
}

function handleButtonClick(event) {
    // Get selected values when the button is clicked
    const dropdowns = Array.from(document.querySelectorAll(".dropdown"));
    const selectedValues = [];
  
      dropdowns.forEach((dropdown) => {
          selectedValues.push(dropdown.value);
      });
  
      console.log(selectedValues);
  
    // Get a reference to the "users" node
    const usersRef = ref(database, "users/");
  
    // Get the data once
    get(usersRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                // Access the data from the snapshot directly
                const userData = snapshot.val();
  
                // Filter users based on selected values
                let matchingUsers = Object.values(userData).filter((user) => {
                    return (
                        selectedValues.includes(user.selectedProgram) &&
                        selectedValues.includes(user.section) &&
                        selectedValues.includes(user.year) &&
                        user.userType === "student"
                    );
                });
  
                console.log(matchingUsers);
                // Clear DataTable before adding new data
                $("#example").DataTable().clear().draw();
                var idnumber = 0;
                // Add matching users to the DataTable
                matchingUsers.forEach((user) => {
                    $("#example").DataTable().row.add([
                        ++idnumber,
                        user.firstname,
                        user.lastname,
                        user.email,
                        user.studentNumber,
                        user.contactNumber,
                        user.year,
                    ]);
                });
  
                // Redraw DataTable
                $("#example").DataTable().draw();
  
                // Log the retrieved data
                console.log(userData);
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
  


async function displayCharts() {
    const usersSnapshot = await get(ref(database, 'users/'));
    const userData = usersSnapshot.val();

    const programCounts = {}; // Initialize programCounts here

    Object.values(userData).forEach(user => {
        // Check if the user has a selectedProgram property
        if (user && user.userType === 'student' && user.selectedProgram) {
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


var idnumber = 0;
var table;

// Function to retrieve data from Firebase database
async function GetAllDataOnce() {
    const usersRef = ref(database, "users/");

    // Get the data once
    get(usersRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                // Access the data from the snapshot directly
                const userData = snapshot.val();
                var students = [];

                snapshot.forEach(childSnapshot => {
                    students.push(childSnapshot.val());
                });

                AddAllItemsToTable(students);
            } else {
                console.log("No data available");
            }
        })
        .catch((error) => {
            console.error("Error getting data:", error);
        });
}

function AddAllItemsToTable(students) {
    let idnumber = 0;
    const table = $('#example1').DataTable();

    if (table) {
        table.clear().draw();
    }

    students.forEach((element) => {
        const data = [
            ++idnumber,
            element.firstname,
            element.lastname,
            element.contactNumber,
            element.studentNumber,
            element.age,
            element.email,
            element.selectedProgram,
            element.section,
            element.userType,
            element.year,
            '<button class="btn btn-success edit-btn">Edit</button>',
            '<button class="btn btn-danger del-btn">Delete</button>'
        ];
        table.row.add(data).draw();
    });

    $('#example1').off('click', '.edit-btn').on('click', '.edit-btn', function () {
        const row = $(this).closest('tr');
        const rowData = table.row(row).data();
        populateModal(rowData);
        $('#editModal').modal('show');
    });
    $('#example1').off('click', '.del-btn').on('click', '.del-btn', function () {
    const row = $(this).closest('tr');
    const rowData1 = table.row(row).data();
    let name = rowData1[1];
    let lname = rowData1[2];

    const confirmDelete = window.confirm(`Are you sure you want to delete ${name} ${lname}?`);
    if (confirmDelete) {
        deleteUser(name, lname);
    } else {
        console.log("Deletion cancelled");
    }
});
}

function populateModal(rowData) {
    const fields = ['#firstName', '#lastName', '#contactNumber', '#studentNumber', '#age', '#email', '#modal_program', '#modal_section', '#user_type', '#modal_year'];
    fields.forEach((field, index) => {
        $(`#editModal ${field}`).val(rowData[index + 1]);
    });
}
function deleteUser(name, lname) {
    const usersRef = ref(database, 'users/');
    get(usersRef).then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            if (user.firstname === name && user.lastname === lname) {
                const userId = childSnapshot.key;
                remove(ref(database, `users/${userId}`))
                    .then(() => {
                        console.log("User deleted successfully");
                        GetAllDataOnce();
                    })
                    .catch((error) => {
                        console.error("Error deleting user:", error);
                    });
            }
        });
    });
}
function UpdateUserDetails() {
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;
    let age = document.getElementById('age').value;
    let email = document.getElementById('email').value;
    let selectedProgram = document.getElementById('modal_program').value;
    let section = document.getElementById('modal_section').value;
    let userType = document.getElementById('user_type').value;
    let contactNumber = document.getElementById('contactNumber').value;
    let studentNumber = document.getElementById('studentNumber').value;
    let year = document.getElementById('modal_year').value;

    const usersRef = ref(database, 'users/');
    get(usersRef).then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            if (user.firstname === firstName && user.lastname === lastName) {
                const userId = childSnapshot.key;
                set(ref(database, `users/${userId}`), {
                    firstname: firstName,
                    lastname: lastName,
                    contactNumber: contactNumber,
                    studentNumber: studentNumber,
                    age: age,
                    email: email,
                    selectedProgram: selectedProgram,
                    section: section,
                    userType: userType,
                    year: year
                }).then(() => {
                    console.log('User details updated successfully');
                    alert("Details Updated Successfully!");
                    $('#editModal').modal('hide');
                    GetAllDataOnce();

                }).catch((error) => {
                    console.error('Error updating user details: ', error);
                });
            }
        });
    }).catch((error) => {
        console.error('Error fetching users from Firebase: ', error);
    });
}

$('#editModal #saveChanges').on('click', UpdateUserDetails);
$('#editModal .btn-close, #editModal #closer').on('click', () => $('#editModal').modal('hide'));


// When the window is loaded, fetch data and populate DataTable
window.onload = function () {
    // Fetch data and populate DataTable
    GetAllDataOnce();
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
