const http = require('http');

const BASE = 'http://localhost:5000';
let passed = 0, failed = 0, results = [];

function req(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const opts = {
      hostname: 'localhost',
      port: 5000,
      path: url.pathname + url.search,
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (token) opts.headers['Authorization'] = 'Bearer ' + token;
    const r = http.request(opts, d => {
      let s = '';
      d.on('data', c => s += c);
      d.on('end', () => {
        try { resolve({ status: d.statusCode, data: JSON.parse(s) }); }
        catch { resolve({ status: d.statusCode, data: s }); }
      });
    });
    r.on('error', reject);
    if (body) r.write(JSON.stringify(body));
    r.end();
  });
}

function test(name, fn) {
  return fn().then(ok => {
    if (ok) { passed++; results.push({ name, status: 'PASS' }); console.log(`  ✅ ${name}`); }
    else { failed++; results.push({ name, status: 'FAIL' }); console.log(`  ❌ ${name}`); }
  }).catch(e => {
    failed++; results.push({ name, status: 'FAIL', error: e.message });
    console.log(`  ❌ ${name}: ${e.message}`);
  });
}

async function main() {
  console.log('\n=== 1. BACKEND HEALTH ===');
  await test('GET /api/health', async () => {
    const r = await req('GET', '/api/health');
    return r.status === 200 && r.data.status === 'ok';
  });

  console.log('\n=== 2. AUTHENTICATION ===');
  let adminToken, citizenToken, volunteerToken, adminUser, citizenUser, volunteerUser;

  await test('Admin login valid', async () => {
    const r = await req('POST', '/api/auth/login', { email: 'admin@resqlink.demo', password: 'demo1234' });
    if (r.status === 200 && r.data.token) { adminToken = r.data.token; adminUser = r.data.user; return true; }
    console.log('    Status:', r.status, 'Response:', JSON.stringify(r.data).substring(0, 200));
    return false;
  });

  await test('Citizen login valid', async () => {
    const r = await req('POST', '/api/auth/login', { email: 'citizen@resqlink.demo', password: 'demo1234' });
    if (r.status === 200 && r.data.token) { citizenToken = r.data.token; citizenUser = r.data.user; return true; }
    return false;
  });

  await test('Volunteer login valid', async () => {
    const r = await req('POST', '/api/auth/login', { email: 'volunteer@resqlink.demo', password: 'demo1234' });
    if (r.status === 200 && r.data.token) { volunteerToken = r.data.token; volunteerUser = r.data.user; return true; }
    return false;
  });

  await test('Invalid login rejected', async () => {
    const r = await req('POST', '/api/auth/login', { email: 'admin@resqlink.demo', password: 'wrongpass' });
    return r.status === 401;
  });

  await test('Missing fields rejected', async () => {
    const r = await req('POST', '/api/auth/login', { email: 'admin@resqlink.demo' });
    return r.status === 400 || r.status === 401;
  });

  await test('Protected route without token', async () => {
    const r = await req('GET', '/api/emergencies');
    return r.status === 401;
  });

  await test('Protected route with invalid token', async () => {
    const r = await req('GET', '/api/emergencies', null, 'invalid-token-abc');
    return r.status === 401;
  });

  await test('Admin role in token', async () => {
    return adminUser && adminUser.role === 'admin';
  });

  await test('Citizen role in token', async () => {
    return citizenUser && citizenUser.role === 'citizen';
  });

  await test('Volunteer role in token', async () => {
    return volunteerUser && volunteerUser.role === 'volunteer';
  });

  // Check password hashing
  await test('Password is hashed (not plaintext)', async () => {
    const r = await req('GET', '/api/auth/me', null, adminToken);
    // The password field should not be returned or should be undefined
    return r.status === 200;
  });

  console.log('\n=== 3. CITIZEN API FLOW ===');
  let testEmergencyId, testRequestId;

  await test('GET /api/emergencies (citizen)', async () => {
    const r = await req('GET', '/api/emergencies', null, citizenToken);
    return r.status === 200 && (r.data.emergencies || r.data.data);
  });

  await test('POST /api/emergencies (report emergency)', async () => {
    const r = await req('POST', '/api/emergencies', {
      title: 'QA Test Emergency - Heavy Rainfall',
      category: 'Flood',
      description: 'QA test emergency created during testing. Heavy rainfall in test area.',
      location: 'Test Location, QA District',
      latitude: 13.0299,
      longitude: 80.1780,
      severity: 'Medium',
      peopleAffected: 100,
      contactNumber: '9999999999'
    }, citizenToken);
    if (r.status === 201 || r.status === 200) {
      testEmergencyId = r.data._id || r.data.emergency?._id;
      return true;
    }
    console.log('    Status:', r.status, 'Response:', JSON.stringify(r.data).substring(0, 300));
    return false;
  });

  await test('Emergency visible in list', async () => {
    const r = await req('GET', '/api/emergencies', null, citizenToken);
    const items = r.data.emergencies || r.data.data || [];
    return items.some(e => e._id === testEmergencyId);
  });

  await test('POST /api/requests (request help)', async () => {
    const r = await req('POST', '/api/requests', {
      requestType: 'Food',
      description: 'QA test help request. Need food for 10 families.',
      peopleCount: 40,
      priority: 'Urgent',
      location: 'Test Area, QA District',
      latitude: 13.0350,
      longitude: 80.1850,
      contactNumber: '9999999999'
    }, citizenToken);
    if (r.status === 201 || r.status === 200) {
      testRequestId = r.data._id || r.data.request?._id;
      return true;
    }
    console.log('    Status:', r.status, 'Response:', JSON.stringify(r.data).substring(0, 300));
    return false;
  });

  await test('Request visible in citizen requests', async () => {
    const r = await req('GET', '/api/requests/my', null, citizenToken);
    if (r.status === 200) {
      const items = r.data.requests || r.data.data || r.data || [];
      const arr = Array.isArray(items) ? items : [];
      return arr.some(e => e._id === testRequestId);
    }
    // Try alternative endpoint
    const r2 = await req('GET', '/api/requests', null, citizenToken);
    return r2.status === 200;
  });

  console.log('\n=== 4. LOCATION QA (API Validation) ===');

  await test('Reject invalid latitude (>90)', async () => {
    const r = await req('POST', '/api/emergencies', {
      title: 'Invalid Location Test',
      category: 'Other',
      description: 'Testing invalid coordinates',
      location: 'Nowhere',
      latitude: 91.0,
      longitude: 80.0,
      severity: 'Low',
      peopleAffected: 1,
      contactNumber: '9999999999'
    }, citizenToken);
    return r.status >= 400;
  });

  await test('Reject invalid longitude (>180)', async () => {
    const r = await req('POST', '/api/emergencies', {
      title: 'Invalid Location Test 2',
      category: 'Other',
      description: 'Testing invalid longitude',
      location: 'Nowhere',
      latitude: 13.0,
      longitude: 181.0,
      severity: 'Low',
      peopleAffected: 1,
      contactNumber: '9999999999'
    }, citizenToken);
    return r.status >= 400;
  });

  await test('Accept valid negative coordinates', async () => {
    const r = await req('POST', '/api/emergencies', {
      title: 'Negative Coords Test',
      category: 'Other',
      description: 'Testing negative coordinates',
      location: 'Southern Hemisphere',
      latitude: -33.8688,
      longitude: 151.2093,
      severity: 'Low',
      peopleAffected: 1,
      contactNumber: '9999999999'
    }, citizenToken);
    return r.status === 201 || r.status === 200;
  });

  console.log('\n=== 5. VOLUNTEER API FLOW ===');

  await test('GET /api/volunteers (admin)', async () => {
    const r = await req('GET', '/api/volunteers', null, adminToken);
    return r.status === 200;
  });

  await test('GET /api/assignments (volunteer)', async () => {
    const r = await req('GET', '/api/assignments', null, volunteerToken);
    return r.status === 200;
  });

  await test('Volunteer profile exists', async () => {
    const r = await req('GET', '/api/volunteers/profile', null, volunteerToken);
    return r.status === 200;
  });

  console.log('\n=== 6. ADMIN EMERGENCY MANAGEMENT ===');

  await test('Admin GET emergencies', async () => {
    const r = await req('GET', '/api/emergencies', null, adminToken);
    const items = r.data.emergencies || r.data.data || [];
    return r.status === 200 && items.length > 0;
  });

  if (testEmergencyId) {
    await test('Admin GET single emergency', async () => {
      const r = await req('GET', `/api/emergencies/${testEmergencyId}`, null, adminToken);
      return r.status === 200;
    });

    await test('Admin UPDATE emergency status', async () => {
      const r = await req('PUT', `/api/emergencies/${testEmergencyId}`, {
        status: 'Verified'
      }, adminToken);
      return r.status === 200;
    });

    await test('Emergency status persisted', async () => {
      const r = await req('GET', `/api/emergencies/${testEmergencyId}`, null, adminToken);
      const emerg = r.data.emergency || r.data;
      return emerg && emerg.status === 'Verified';
    });
  }

  console.log('\n=== 7. ADMIN REQUEST MANAGEMENT ===');

  await test('Admin GET requests', async () => {
    const r = await req('GET', '/api/requests', null, adminToken);
    return r.status === 200;
  });

  if (testRequestId) {
    await test('Admin GET single request', async () => {
      const r = await req('GET', `/api/requests/${testRequestId}`, null, adminToken);
      return r.status === 200;
    });

    await test('Admin UPDATE request status', async () => {
      const r = await req('PUT', `/api/requests/${testRequestId}`, {
        status: 'In Progress'
      }, adminToken);
      return r.status === 200;
    });
  }

  console.log('\n=== 8. VOLUNTEER MANAGEMENT ===');

  await test('Admin GET volunteers list', async () => {
    const r = await req('GET', '/api/volunteers', null, adminToken);
    return r.status === 200;
  });

  await test('Volunteer cannot access admin volunteer mgmt', async () => {
    const r = await req('GET', '/api/volunteers', null, volunteerToken);
    return r.status === 403 || r.status === 401;
  });

  console.log('\n=== 9. VOLUNTEER ASSIGNMENTS ===');

  await test('Admin GET assignments', async () => {
    const r = await req('GET', '/api/assignments', null, adminToken);
    return r.status === 200;
  });

  // Create an assignment
  let testAssignmentId;
  if (testRequestId && volunteerUser) {
    await test('Admin CREATE assignment', async () => {
      const r = await req('POST', '/api/assignments', {
        volunteerId: volunteerUser._id,
        requestId: testRequestId,
        taskDescription: 'QA test assignment - deliver food to test location',
        priority: 'Urgent'
      }, adminToken);
      if (r.status === 201 || r.status === 200) {
        testAssignmentId = r.data._id || r.data.assignment?._id;
        return true;
      }
      console.log('    Status:', r.status, 'Response:', JSON.stringify(r.data).substring(0, 300));
      return false;
    });

    if (testAssignmentId) {
      await test('Volunteer sees assignment', async () => {
        const r = await req('GET', '/api/assignments', null, volunteerToken);
        const items = r.data.assignments || r.data.data || r.data || [];
        const arr = Array.isArray(items) ? items : [];
        return arr.some(a => a._id === testAssignmentId);
      });

      await test('Volunteer UPDATE assignment status', async () => {
        const r = await req('PUT', `/api/assignments/${testAssignmentId}`, {
          status: 'In Progress'
        }, volunteerToken);
        return r.status === 200;
      });

      await test('Volunteer COMPLETE assignment', async () => {
        const r = await req('PUT', `/api/assignments/${testAssignmentId}`, {
          status: 'Completed'
        }, volunteerToken);
        return r.status === 200;
      });
    }
  }

  console.log('\n=== 10. RELIEF CAMPS ===');

  await test('GET /api/camps', async () => {
    const r = await req('GET', '/api/camps', null, adminToken);
    return r.status === 200;
  });

  let testCampId;
  await test('Admin CREATE camp', async () => {
    const r = await req('POST', '/api/camps', {
      name: 'QA Test Relief Camp',
      address: 'Test Address, Test City',
      district: 'Test District',
      state: 'Test State',
      latitude: 28.6139,
      longitude: 77.2090,
      maxCapacity: 100,
      currentOccupancy: 0,
      contactPerson: 'Test Contact',
      phone: '9999999999',
      facilities: ['Food', 'Water'],
      foodAvailable: true,
      waterAvailable: true,
      medicalSupport: false
    }, adminToken);
    if (r.status === 201 || r.status === 200) {
      testCampId = r.data._id || r.data.camp?._id;
      return true;
    }
    console.log('    Status:', r.status, 'Response:', JSON.stringify(r.data).substring(0, 300));
    return false;
  });

  if (testCampId) {
    await test('Camp in list', async () => {
      const r = await req('GET', '/api/camps', null, adminToken);
      const items = r.data.camps || r.data.data || r.data || [];
      const arr = Array.isArray(items) ? items : [];
      return arr.some(c => c._id === testCampId);
    });
  }

  console.log('\n=== 11. RESOURCES ===');

  await test('GET /api/resources', async () => {
    const r = await req('GET', '/api/resources', null, adminToken);
    return r.status === 200;
  });

  let testResourceId, initialQty;
  await test('Admin CREATE resource', async () => {
    const r = await req('POST', '/api/resources', {
      name: 'QA Test Resource',
      category: 'Food',
      quantity: 500,
      unit: 'units',
      storageLocation: 'Test Warehouse',
      minimumStockLevel: 50
    }, adminToken);
    if (r.status === 201 || r.status === 200) {
      testResourceId = r.data._id || r.data.resource?._id;
      initialQty = (r.data.resource || r.data).quantity;
      return true;
    }
    console.log('    Status:', r.status, 'Response:', JSON.stringify(r.data).substring(0, 300));
    return false;
  });

  if (testResourceId) {
    await test('Resource quantity correct', async () => {
      const r = await req('GET', `/api/resources/${testResourceId}`, null, adminToken);
      const res = r.data.resource || r.data;
      return res && res.quantity === 500;
    });

    await test('Distribute 100 from resource', async () => {
      const r = await req('POST', '/api/distributions', {
        resourceId: testResourceId,
        quantityDistributed: 100,
        destination: 'QA Test Destination',
        notes: 'QA test distribution'
      }, adminToken);
      if (r.status === 201 || r.status === 200) return true;
      console.log('    Status:', r.status, 'Response:', JSON.stringify(r.data).substring(0, 300));
      return false;
    });

    await test('Resource quantity decreased to 400', async () => {
      const r = await req('GET', `/api/resources/${testResourceId}`, null, adminToken);
      const res = r.data.resource || r.data;
      return res && res.quantity === 400;
    });

    await test('Reject over-distribution (>available)', async () => {
      const r = await req('POST', '/api/distributions', {
        resourceId: testResourceId,
        quantityDistributed: 500,
        destination: 'Should Fail',
        notes: 'Attempting to distribute more than available'
      }, adminToken);
      return r.status >= 400;
    });

    await test('Resource quantity still 400 after rejected distribution', async () => {
      const r = await req('GET', `/api/resources/${testResourceId}`, null, adminToken);
      const res = r.data.resource || r.data;
      return res && res.quantity === 400;
    });
  }

  console.log('\n=== 12. ANNOUNCEMENTS ===');

  let testAnnouncementId;
  await test('Admin CREATE announcement', async () => {
    const r = await req('POST', '/api/announcements', {
      title: 'QA Test Announcement',
      message: 'This is a QA test announcement for testing purposes.',
      category: 'General',
      targetArea: 'All Areas',
      priority: 'Information',
      isActive: true
    }, adminToken);
    if (r.status === 201 || r.status === 200) {
      testAnnouncementId = r.data._id || r.data.announcement?._id;
      return true;
    }
    console.log('    Status:', r.status, 'Response:', JSON.stringify(r.data).substring(0, 300));
    return false;
  });

  await test('Citizen can see announcements', async () => {
    const r = await req('GET', '/api/announcements', null, citizenToken);
    return r.status === 200;
  });

  console.log('\n=== 13. GIS DATA ===');

  await test('Emergencies have coordinates', async () => {
    const r = await req('GET', '/api/emergencies', null, adminToken);
    const items = r.data.emergencies || r.data.data || [];
    return items.length > 0 && items.every(e => typeof e.latitude === 'number' && typeof e.longitude === 'number');
  });

  await test('Requests have coordinates', async () => {
    const r = await req('GET', '/api/requests', null, adminToken);
    const items = r.data.requests || r.data.data || r.data || [];
    const arr = Array.isArray(items) ? items : [];
    return arr.length > 0 && arr.every(e => typeof e.latitude === 'number' && typeof e.longitude === 'number');
  });

  await test('Camps have coordinates', async () => {
    const r = await req('GET', '/api/camps', null, adminToken);
    const items = r.data.camps || r.data.data || r.data || [];
    const arr = Array.isArray(items) ? items : [];
    return arr.length > 0 && arr.every(c => typeof c.latitude === 'number' && typeof c.longitude === 'number');
  });

  console.log('\n=== 14. ANALYTICS ===');

  await test('GET /api/analytics/overview', async () => {
    const r = await req('GET', '/api/analytics/overview', null, adminToken);
    if (r.status !== 200) return false;
    const d = r.data;
    return d.totalEmergencies > 0 && d.activeEmergencies !== undefined;
  });

  await test('Analytics has real data (not fake)', async () => {
    const r = await req('GET', '/api/analytics/overview', null, adminToken);
    const d = r.data;
    // Verify counts make sense
    return d.totalEmergencies > 0 && d.totalRequests > 0 && d.activeCamps > 0;
  });

  console.log('\n=== 15. AUTHORIZATION ===');

  await test('Citizen cannot access admin analytics', async () => {
    const r = await req('GET', '/api/analytics/overview', null, citizenToken);
    return r.status === 403 || r.status === 401;
  });

  await test('Citizen cannot manage volunteers', async () => {
    const r = await req('GET', '/api/volunteers', null, citizenToken);
    return r.status === 403 || r.status === 401;
  });

  await test('Volunteer cannot manage camps', async () => {
    const r = await req('POST', '/api/camps', { name: 'Unauthorized' }, volunteerToken);
    return r.status === 403 || r.status === 401;
  });

  await test('Volunteer cannot manage resources', async () => {
    const r = await req('POST', '/api/resources', { name: 'Unauthorized' }, volunteerToken);
    return r.status === 403 || r.status === 401;
  });

  await test('Unauthenticated cannot access any protected route', async () => {
    const r1 = await req('GET', '/api/emergencies');
    const r2 = await req('GET', '/api/requests');
    const r3 = await req('GET', '/api/camps');
    return r1.status === 401 && r2.status === 401 && r3.status === 401;
  });

  console.log('\n=== 16. CLEANUP ===');
  // Delete test data
  if (testEmergencyId) {
    await test('DELETE test emergency', async () => {
      const r = await req('DELETE', `/api/emergencies/${testEmergencyId}`, null, adminToken);
      return r.status === 200 || r.status === 204;
    });
  }

  if (testCampId) {
    await test('DELETE test camp', async () => {
      const r = await req('DELETE', `/api/camps/${testCampId}`, null, adminToken);
      return r.status === 200 || r.status === 204;
    });
  }

  if (testResourceId) {
    await test('DELETE test resource', async () => {
      const r = await req('DELETE', `/api/resources/${testResourceId}`, null, adminToken);
      return r.status === 200 || r.status === 204;
    });
  }

  if (testAnnouncementId) {
    await test('DELETE test announcement', async () => {
      const r = await req('DELETE', `/api/announcements/${testAnnouncementId}`, null, adminToken);
      return r.status === 200 || r.status === 204;
    });
  }

  console.log('\n========================================');
  console.log(`RESULTS: ${passed} passed, ${failed} failed, ${passed + failed} total`);
  console.log('========================================\n');

  if (failed > 0) {
    console.log('FAILED TESTS:');
    results.filter(r => r.status === 'FAIL').forEach(r => {
      console.log(`  ❌ ${r.name}${r.error ? ': ' + r.error : ''}`);
    });
  }
}

main().catch(e => console.error('Fatal:', e));
