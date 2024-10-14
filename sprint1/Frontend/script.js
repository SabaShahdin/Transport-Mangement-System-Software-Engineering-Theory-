const firebaseConfig = {
    apiKey: "AIzaSyCqMmaRCvBoo61LxWaqpqnlnbrj436RU28",
    authDomain: "transport-management-sys-ce9dd.firebaseapp.com",
    projectId: "transport-management-sys-ce9dd",
    storageBucket: "transport-management-sys-ce9dd.appspot.com",
    messagingSenderId: "679430301511",
    appId: "1:679430301511:web:d40d99ce37e9352bb94e62",
    measurementId: "G-04MT0ECCZ5"
  };

  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Get Firebase Auth reference
  const auth = firebase.auth();
  
  // Toggle between sign-up and sign-in views
  const signUpButton = document.getElementById("signUp");
  const signInButton = document.getElementById("signIn");
  const container = document.getElementById("container");
  
  signUpButton.addEventListener("click", () => {
      container.classList.add("right-panel-active");
  });
  
  signInButton.addEventListener("click", () => {
      container.classList.remove("right-panel-active");
  });
  
  document.getElementById('google-signin-btn').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default action
    console.log("Google Sign-In button clicked");
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(async (result) => {
            const user = result.user;
            console.log("User logged in:", user);
            const data = {
                email: user.email,
                username: user.displayName,
                contact_number: user.phoneNumber || null,
                role: 'Passenger'
            };
            const response = await fetch('http://localhost:8081/check-user-sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            if (responseData.exists) {
                // User exists, redirect to home page
                alert(`Welcome back, ${user.displayName}!`);
                window.location.href = '/home'; // Adjust as needed
            } 
        })
        .catch((error) => {
            console.error("Error during sign-in:", error);
            alert("Login failed. Please try again.");
        });
});

  // Correct the sign-up form event listener
  document.getElementById("signUpForm").addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent the default form submission
  
      const username = document.getElementById("signUpUsername").value;
      const email = document.getElementById("signUpEmail").value;
      const password = document.getElementById("signUpPassword").value;
      const contactNumber = document.getElementById("signUpContact").value;
  
      const data = {
          username: username,
          email: email,
          password: password,
          contact_number: contactNumber,
          role: 'Passenger', // Optional field
      };
  
      // Send the data to the server
      fetch('http://localhost:8081/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(data => {
          if (data.error) {
              alert(data.error); // Show error message
          } else {
              alert(data.message); // Show success message
              document.getElementById("signUpForm").reset(); // Clear the form after successful submission
              // Switch to sign-in view after sign-up
              container.classList.remove("right-panel-active"); // Transition to sign-in view
          }
      })
      .catch((error) => {
          console.error('Error:', error); // Log any errors
      });
  });
  
  // Handle sign-in form submission
  document.getElementById('loginForm').addEventListener('submit', async function (event) {
      event.preventDefault(); // Prevent the form from submitting the default way
  
      // Get the email and password values
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
  
      // Send a POST request to the server
      const response = await fetch('http://localhost:8081/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }), // Send email and password in JSON format
      });
  
      const data = await response.json(); // Parse the JSON response
  
      if (response.ok) {
          // Sign-in successful
          alert(data.message); // Show success message
          window.location.href = '/dashboard'; // Redirect to dashboard or home
      } else {
          // Sign-in failed
          alert(data.error); // Show error message
      }
  });
  
  document.getElementById('google-signup-btn').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default action
    console.log("Google Sign-up button clicked");
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(async (result) => {
            const user = result.user;
            console.log("User signed up in:", user);
            const data = {
                email: user.email,
                username: user.displayName,
                contact_number: user.phoneNumber || null,
                role: 'Passenger'
            };
            const response = await fetch('http://localhost:8081/check-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            if (!responseData.exists) {
                alert('Account created successfully!');
            window.location.href = '/home'; // Redirect to home
            } 
        })
        .catch((error) => {
            console.error("Error during sign-up:", error);
            alert("Account Creation failed. Please try again.");
        });
});