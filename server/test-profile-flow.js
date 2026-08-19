const axios = require('axios');

const API = 'http://localhost:5000/api';

(async () => {
  try {
    const timestamp = Date.now();
    const testEmail = `profile-test-${timestamp}@test.com`;
    const testPassword = 'Password123!';
    const testName = 'Profile Tester';

    console.log('=== TEST 1: REGISTER USER ===');
    const regRes = await axios.post(`${API}/auth/register`, {
      email: testEmail,
      password: testPassword,
      name: testName,
    });
    console.log('✓ Registered:', regRes.data.user);
    const initialUsername = regRes.data.user.username;

    console.log('\n=== TEST 2: LOGIN USER ===');
    const loginRes = await axios.post(`${API}/auth/login`, {
      email: testEmail,
      password: testPassword,
    });
    const token = loginRes.data.token;
    console.log('✓ Logged in, token acquired.');

    console.log('\n=== TEST 3: CREATE A TRIP FOR USER ===');
    const tripRes = await axios.post(
      `${API}/trips`,
      {
        title: 'Manali Heights Adventure',
        destination: 'Manali',
        startDate: '2026-09-01',
        endDate: '2026-09-07',
        description: 'Trekking and camping in Himalayas',
        rating: 5,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('✓ Trip created:', tripRes.data._id);

    console.log('\n=== TEST 4: UPDATE USER PROFILE ===');
    const newUsername = `traveler_${timestamp}`;
    const newBio = 'Avid hiker and food enthusiast standardizing public trips!';
    const updateRes = await axios.put(
      `${API}/users/profile`,
      { username: newUsername, bio: newBio },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('✓ Profile updated:', updateRes.data.user);

    console.log('\n=== TEST 5: GET PUBLIC PROFILE (NO AUTH) ===');
    const publicRes = await axios.get(`${API}/users/${newUsername}/profile`);
    console.log('✓ Public profile fetched:', publicRes.data);

    console.log('\n=== TEST 6: VERIFY SENSITIVE DATA EXCLUSION ===');
    const userObj = publicRes.data.user;
    if (userObj.email || userObj.password || userObj.token) {
      console.error('✗ SENSITIVE DATA EXPOSED!');
      process.exit(1);
    } else {
      console.log('✓ Safe fields only (name, username, bio). Email & Password NOT exposed!');
    }

    if (Array.isArray(publicRes.data.trips) && publicRes.data.trips.length > 0) {
      console.log('✓ User trips returned:', publicRes.data.trips);
    } else {
      console.error('✗ Expected trips in public profile!');
      process.exit(1);
    }

    console.log('\n=== ALL PUBLIC PROFILE TESTS PASSED ===\n');
    process.exit(0);
  } catch (err) {
    console.error('✗ Test failed:', err.response?.data || err.message);
    process.exit(1);
  }
})();
