

async function seedBroker() {
  const url = 'http://localhost:5000/api/auth/register';
  const brokerData = {
    name: 'Admin Broker',
    email: 'admin.broker@estatex.com',
    phone: '1234567890',
    password: 'password123',
    role: 'BROKER',
    brokerId: 'BRK-0001',
    businessName: 'EstateX Internal',
    experienceYears: 5
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(brokerData)
    });

    const data = await res.json();
    if (res.ok) {
      console.log('✅ Successfully seeded broker BRK-0001');
      console.log('Token:', data.token);
    } else {
      console.error('❌ Failed to seed broker:', data.message);
    }
  } catch (error) {
    console.error('Error seeding broker. Make sure the backend is running on port 5000.', error);
  }
}

seedBroker();
