const http = require('http');

async function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 80,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data,
        });
      });
    });

    req.on('error', (err) => reject(err));
    req.end();
  });
}

function getCookieHeader(setCookieHeaders) {
  if (!setCookieHeaders) return '';
  return setCookieHeaders
    .map(c => c.split(';')[0])
    .join('; ');
}

async function runQA() {
  console.log('--- Starting Landing Page Redirect QA ---');
  const serverUrl = 'http://localhost:3000';
  const testPassword = 'Longevity3000';

  try {
    // 1. Access landing page / without cookies (should redirect to /login?from=/)
    console.log('[1] Accessing homepage / without cookies...');
    const homepageGet = await request(`${serverUrl}/`);
    console.log(`Status: ${homepageGet.status}`);
    console.log(`Redirect Location: ${homepageGet.headers.location || 'none'}`);
    if (homepageGet.status !== 307 || !homepageGet.headers.location.includes('/login?from=%2F')) {
      throw new Error(`Homepage is not protected! Status: ${homepageGet.status}`);
    }

    // 2. Perform correct password login
    console.log(`\n[2] Logging in with correct password: ${testPassword}...`);
    const loginRes = await new Promise((resolve) => {
      const req = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }, (res) => {
        let data = '';
        res.on('data', (c) => { data += c; });
        res.on('end', () => {
          resolve({ status: res.statusCode, headers: res.headers, data });
        });
      });
      req.write(JSON.stringify({ password: testPassword, type: 'gatekeeper' }));
      req.end();
    });

    console.log(`Status: ${loginRes.status}`);
    const cookies = loginRes.headers['set-cookie'];
    const cookieStr = getCookieHeader(cookies);
    console.log(`Received Cookies: ${cookieStr}`);

    if (loginRes.status !== 200) {
      throw new Error('Correct login failed!');
    }

    // 3. Verify that the user now visits the homepage / directly (no redirect)
    console.log('\n[3] Accessing homepage / with set cookies (expecting 200 - landing page)...');
    const landingRes = await request(`${serverUrl}/`, {
      headers: { 'Cookie': cookieStr }
    });
    console.log(`Status: ${landingRes.status}`);
    console.log(`Redirect Location: ${landingRes.headers.location || 'none'}`);
    if (landingRes.status !== 200) {
      throw new Error(`Landing page not accessible! Status: ${landingRes.status}`);
    }

    // 4. Verify that accessing the dashboard with these cookies is allowed (status 200)
    console.log('\n[4] Accessing /dashboard with set cookies (expecting 200 - dashboard)...');
    const dashboardRes = await request(`${serverUrl}/dashboard`, {
      headers: { 'Cookie': cookieStr }
    });
    console.log(`Status: ${dashboardRes.status}`);
    console.log(`Redirect Location: ${dashboardRes.headers.location || 'none'}`);
    if (dashboardRes.status !== 200) {
      throw new Error(`Dashboard not accessible! Status: ${dashboardRes.status}`);
    }

    console.log('\n--- QA Landing Page Redirect Test Complete: ALL TESTS PASSED! ---');
  } catch (err) {
    console.error('QA request failed:', err.message);
  }
}

runQA();
