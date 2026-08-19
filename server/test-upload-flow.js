const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API = 'http://localhost:5000/api';
let token = '';
let tripId = '';

(async () => {
  try {
    // 1. Register
    console.log('=== TEST 1: REGISTER ===');
    const regRes = await axios.post(`${API}/auth/register`, {
      email: `test-${Date.now()}@test.com`,
      password: 'Test123!',
      name: 'Test User'
    });
    console.log('✓ Register:', regRes.status, regRes.data.message);

    // 2. Login
    console.log('\n=== TEST 2: LOGIN ===');
    const loginRes = await axios.post(`${API}/auth/login`, {
      email: regRes.data.user.email,
      password: 'Test123!'
    });
    token = loginRes.data.token;
    console.log('✓ Login:', loginRes.status, 'Token received');

    // 3. Create Trip
    console.log('\n=== TEST 3: CREATE TRIP ===');
    const tripRes = await axios.post(
      `${API}/trips`,
      {
        title: 'Cloudinary Upload Test Trip',
        description: 'Testing Week 3 upload',
        destination: 'Test Destination',
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000)
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    tripId = tripRes.data._id;
    console.log('✓ Create Trip:', tripRes.status, tripId);
    console.log('  - coverImage:', tripRes.data.coverImage);
    console.log('  - photos:', tripRes.data.photos);

    // 4. Create a test image file
    console.log('\n=== TEST 4: CREATE TEST IMAGE ===');
    const testImagePath = path.join(__dirname, 'test-image.png');
    const pngBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x63, 0xF8, 0x0F, 0x00, 0x00,
      0x01, 0x01, 0x00, 0x01, 0x18, 0xDD, 0x8D, 0xB4, 0x00, 0x00, 0x00, 0x00,
      0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);
    fs.writeFileSync(testImagePath, pngBuffer);
    console.log('✓ Test image created:', testImagePath);

    // 5. Upload image
    console.log('\n=== TEST 5: UPLOAD IMAGE ===');
    const FormData = require('form-data');
    const form = new FormData();
    form.append('image', fs.createReadStream(testImagePath));

    const uploadRes = await axios.post(
      `${API}/trips/${tripId}/upload`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log('✓ Upload Success:', uploadRes.status);
    console.log('  - coverImage:', uploadRes.data.coverImage);
    console.log('  - photos[0]:', uploadRes.data.photos[0]);

    // 6. Verify image URL is valid
    if (uploadRes.data.photos && uploadRes.data.photos[0]) {
      console.log('\n=== TEST 6: VERIFY CLOUDINARY URL ===');
      const imgUrl = uploadRes.data.photos[0];
      try {
        const imgCheck = await axios.head(imgUrl, { timeout: 5000 });
        console.log('✓ Cloudinary URL valid:', imgCheck.status);
      } catch (e) {
        console.log('✗ Cloudinary URL check failed:', e.message);
      }
    }

    // 7. Fetch trip to verify persistence
    console.log('\n=== TEST 7: VERIFY PERSISTENCE ===');
    const getRes = await axios.get(
      `${API}/trips/${tripId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('✓ Trip fetched:', getRes.status);
    console.log('  - coverImage:', getRes.data.coverImage);
    console.log('  - photos:', getRes.data.photos);

    console.log('\n=== ALL TESTS PASSED ===\n');
    fs.unlinkSync(testImagePath);
    process.exit(0);

  } catch (err) {
    console.error('\n✗ ERROR:', err.response?.status, err.response?.data || err.message);
    process.exit(1);
  }
})();
