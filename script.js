document.addEventListener('DOMContentLoaded', () => {
  const screenContainer = document.getElementById('screenContainer');
  const screens = document.querySelectorAll('.screen');
  const nextButton = document.querySelector('.next-button');
  const backButton = document.querySelector('.back-button');
  const progressBar = document.querySelector('.progress');
  const locationInput = document.getElementById('locationInput');
  const addLocationBtn = document.getElementById('addLocationBtn');
  const locationTags = document.getElementById('locationTags');
  const signInButton = document.getElementById('signInButton');
  const loginLink = document.getElementById('loginLink');
  const signUpForm = document.getElementById('signUpForm');
  const loginForm = document.getElementById('loginForm');

  let currentScreen = 5; // Start with login screen
  const screenOrder = [5,6,7,1,2,3,4,8];
  const totalScreens = screenOrder.length;

  let userPreferences = {
    moveInTime: '',
    lookingFor: [],
    roomType: [],
    locations: [],
    preferences: []
  };

  function updateProgressBar() {
    const progress = ((screenOrder.indexOf(currentScreen) + 1) / totalScreens) * 100;
    progressBar.style.width = `${progress}%`;
  }

  function showScreen(screenNumber) {
    screens.forEach(screen => {
      screen.style.display = 'none';
    });
    const screenToShow = document.querySelector(`[data-screen="${screenNumber}"]`);
    if (screenToShow) {
      screenToShow.style.display = 'block';
    }
    if (screenNumber <= 4) {
      updateProgressBar();
      if (nextButton) nextButton.style.display = 'block';
      if (progressBar) progressBar.parentElement.style.display = 'block';
    } else {
      if (nextButton) nextButton.style.display = 'none';
      if (progressBar) progressBar.parentElement.style.display = 'none';
    }

    currentScreen = screenNumber;
  }

  function showWelcomeScreen(firstName, lastName) {
    const userFullName = document.getElementById('userFullName');
    userFullName.textContent = `${firstName} ${lastName}`;
    showScreen(8);
  }

  function setupButtonListeners() {
    // Screen 1: Single selection
    document.querySelectorAll('[data-screen="1"] .button-group .button').forEach(button => {
      button.addEventListener('click', function() {
        document.querySelectorAll('[data-screen="1"] .button-group .button').forEach(btn => {
          btn.classList.remove('selected');
        });
        this.classList.add('selected');
        userPreferences.moveInTime = this.textContent.trim();
      });
    });

    // Screen 2: Multiple selection
    document.querySelectorAll('[data-screen="2"] .button-group .button, [data-screen="2"] .preference-group .preference-button').forEach(button => {
      button.addEventListener('click', function() {
        this.classList.toggle('selected');
        const value = this.textContent.trim();
        const category = this.closest('.button-group') ? 'lookingFor' : 'roomType';
        if (this.classList.contains('selected')) {
          userPreferences[category].push(value);
        } else {
          userPreferences[category] = userPreferences[category].filter(item => item !== value);
        }
      });
    });

    // Screen 4: Multiple selection
    document.querySelectorAll('[data-screen="4"] .preference-group .preference-button').forEach(button => {
      button.addEventListener('click', function() {
        this.classList.toggle('selected');
        const preference = this.textContent.trim();
        if (this.classList.contains('selected')) {
          userPreferences.preferences.push(preference);
        } else {
          userPreferences.preferences = userPreferences.preferences.filter(item => item !== preference);
        }
      });
    });
  }

  function setupLocationInput() {
    if (locationInput && addLocationBtn && locationTags) {
      addLocationBtn.addEventListener('click', addLocation);
      locationInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          addLocation();
        }
      });
    }
  }

  function addLocation() {
    const location = locationInput.value.trim();
    if (location && !userPreferences.locations.includes(location)) {
      userPreferences.locations.push(location);
      updateLocationTags();
      locationInput.value = '';
    }
  }

  function updateLocationTags() {
    locationTags.innerHTML = '';
    userPreferences.locations.forEach(location => {
      const tag = document.createElement('span');
      tag.classList.add('location-tag');
      tag.innerHTML = `${location} <button class="remove-tag">&times;</button>`;
      tag.querySelector('.remove-tag').addEventListener('click', () => removeLocation(location));
      locationTags.appendChild(tag);
    });
  }

  function removeLocation(location) {
    userPreferences.locations = userPreferences.locations.filter(item => item !== location);
    updateLocationTags();
  }

  function goToNextScreen() {
    const currentIndex = screenOrder.indexOf(currentScreen);
    if (currentIndex < screenOrder.length - 1) {
      if (currentScreen === 3 || currentScreen === 4) {
        // Save preferences to MongoDB when moving from screen 3 to 4 and after screen 4
        savePreferences();
      }
      showScreen(screenOrder[currentIndex + 1]);
    }
  }

  async function savePreferences() {
    try {
      const response = await fetch('/api/update-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          countryCode: document.getElementById('countryCode').value,
          phoneNumber: document.getElementById('phoneNumber').value,
          preferences: userPreferences
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences. Please try again.');
    }
  }

  if (nextButton) {
    nextButton.addEventListener('click', goToNextScreen);
  }

  if (backButton) {
    backButton.addEventListener('click', () => {
      const currentIndex = screenOrder.indexOf(currentScreen);
      if (currentIndex > 0) {
        showScreen(screenOrder[currentIndex - 1]);
      }
    });
  }

  if (signUpForm) {
    signUpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const firstName = document.getElementById('firstName');
      const lastName = document.getElementById('lastName');
      const countryCode = document.getElementById('countryCode');
      const phoneNumber = document.getElementById('phoneNumber');
      
      if (!firstName || !lastName || !countryCode || !phoneNumber) {
        console.error('One or more form elements are missing');
        alert('An error occurred. Please check the console for more information.');
        return;
      }

      try {
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: firstName.value,
            lastName: lastName.value,
            countryCode: countryCode.value,
            phoneNumber: phoneNumber.value,
            preferences: userPreferences
          }),
        });

        if (response.ok) {
          const data = await response.json();
          showScreen(1); // Go to first preference screen after signup
        } else {
          const errorData = await response.json();
          alert(`Sign up failed: ${errorData.message}`);
          console.error('Error details:', errorData.error);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during sign up. Please try again.');
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const countryCode = document.getElementById('loginCountryCode');
      const phoneNumber = document.getElementById('loginPhoneNumber');
      
      if (!countryCode || !phoneNumber) {
        console.error('Login form elements are missing');
        alert('An error occurred. Please check the console for more information.');
        return;
      }

      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            countryCode: countryCode.value,
            phoneNumber: phoneNumber.value
          }),
        });

        if (response.ok) {
          const data = await response.json();
          showScreen(1); // Go to first preference screen after login
        } else {
          const errorData = await response.json();
          alert(`Login failed: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during login. Please try again.');
      }
    });
  }

  if (signInButton) {
    signInButton.addEventListener('click', () => {
      showScreen(6);
    });
  }

  if (loginLink) {
    loginLink.addEventListener('click', () => {
      showScreen(7);
    });
  }

  setupButtonListeners();
  setupLocationInput();
  showScreen(currentScreen);
});