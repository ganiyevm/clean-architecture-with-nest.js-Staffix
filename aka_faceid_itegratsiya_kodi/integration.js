// aka bu kodni alohida shu yerga yozib qoydim ozimizga tushunarli bolishi uchun 



const http = require('http');
const crypto = require('crypto');


const username = 'admin';
const password = 'Apteka999m44';
const deviceIP = '192.168.100.14';
const devicePort = 80;

// Digest Authentication
function calculateDigestResponse(method, uri, realm, nonce, username, password) {
  const ha1 = crypto.createHash('md5').update(`${username}:${realm}:${password}`).digest('hex');
  const ha2 = crypto.createHash('md5').update(`${method}:${uri}`).digest('hex');
  const response = crypto.createHash('md5').update(`${ha1}:${nonce}:${ha2}`).digest('hex');
  return response;
}

// Функция: HTTP сўров юбориш (Digest Authentication билан)
const sendRequest = (path, method, body = '') => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: deviceIP,
      port: devicePort,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 401) {
          const authHeader = res.headers['www-authenticate'];
          if (authHeader) {
            const realmMatch = authHeader.match(/realm="([^"]+)"/);
            const nonceMatch = authHeader.match(/nonce="([^"]+)"/);
            const realm = realmMatch ? realmMatch[1] : '';
            const nonce = nonceMatch ? nonceMatch[1] : '';

            const digestResponse = calculateDigestResponse(method, path, realm, nonce, username, password);
            const auth = `Digest username="${username}", realm="${realm}", nonce="${nonce}", uri="${path}", response="${digestResponse}"`;

            // Янги сўровни Digest Authentication билан қайта юбориш
            const newOptions = {
              ...options,
              headers: {
                ...options.headers,
                Authorization: auth,
              },
            };

            const retryReq = http.request(newOptions, (retryRes) => {
              let retryData = '';

              retryRes.on('data', (chunk) => {
                retryData += chunk;
              });

              retryRes.on('end', () => {
                resolve({ status: retryRes.statusCode, data: retryData });
              });
            });

            retryReq.on('error', (err) => {
              reject(err);
            });

            retryReq.write(body);
            retryReq.end();
          } else {
            reject(new Error('Authentication header not found'));
          }
        } else {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(body);
    req.end();
  });
};

// Create: Фойдаланувчи қўшиш (JSON)
async function addUser(employeeNo, name) {
  const jsonBody = JSON.stringify({
    UserInfo: {
      employeeNo: employeeNo,
      name: name,
      userType: "normal",
      Valid: {
        enable: true,
        beginTime: "2020-01-01T00:00:00",
        endTime: "2030-12-31T23:59:59",
      },
      doorRight: "1",
      RightPlan: [
        {
          doorNo: 1,
          planTemplateNo: "1",
        },
      ],
    },
  });

  try {
    const result = await sendRequest('/ISAPI/AccessControl/UserInfo/Record?format=json', 'POST', jsonBody);
    console.log('Фойдаланувчи қўшилди:', result.data);
    return result;
  } catch (error) {
    console.error(' Хатолик (Add User):', error.message);
    throw error;
  }
}

// Read: Фойдаланувчилар сонини олиш (JSON)
async function getUserCount() {
  try {
    const result = await sendRequest('/ISAPI/AccessControl/UserInfo/Count?format=json', 'GET', '');
    console.log('Фойдаланувчилар сони:', result.data);
    return result;
  } catch (error) {
    console.error(' Хатолик (Get User Count):', error.message);
    throw error;
  }
}

// Update: Фойдаланувчи маълумотларини ўзгартириш (JSON)
async function updateUser(employeeNo, name) {
  const jsonBody = JSON.stringify({
    UserInfo: {
      employeeNo: employeeNo,
      name: name,
      userType: "normal",
      Valid: {
        enable: true,
        beginTime: "2020-01-01T00:00:00",
        endTime: "2035-12-31T23:59:59",
      },
      doorRight: "1",
      RightPlan: [
        {
          doorNo: 1,
          planTemplateNo: "1",
        },
      ],
    },
  });

  try {
    const result = await sendRequest('/ISAPI/AccessControl/UserInfo/Modify?format=json', 'PUT', jsonBody);
    console.log(' Фойдаланувчи ўзгартирилди:', result.data);
    return result;
  } catch (error) {
    console.error('Хатолик (Update User):', error.message);
    throw error;
  }
}

// Delete: Фойдаланувчини ўчириш (JSON)
async function deleteUser(employeeNo) {
  const jsonBody = JSON.stringify({
    UserInfoDelCond: {
      EmployeeNoList: [
        {
          employeeNo: employeeNo,
        },
      ],
    },
  });

  try {
    const result = await sendRequest('/ISAPI/AccessControl/UserInfo/Delete?format=json', 'PUT', jsonBody);
    console.log(' Фойдаланувчи ўчирилди:', result.data);
    return result;
  } catch (error) {
    console.error('Хатолик (Delete User):', error.message);
    throw error;
  }
}

async function getAllUsers() {
  const jsonBody = JSON.stringify({
    UserInfoSearchCond: {
      searchID: "1",
      maxResults: 100, // Максимал фойдаланувчилар сони (ўзгартириш мумкин)
      searchResultPosition: 0, // Бошланғич позиция
    },
  });

  try {
    const result = await sendRequest('/ISAPI/AccessControl/UserInfo/Search?format=json', 'POST', jsonBody);
    const parsedData = JSON.parse(result.data);

    if (parsedData.UserInfoSearch && parsedData.UserInfoSearch.UserInfo) {
      const users = parsedData.UserInfoSearch.UserInfo;
      console.log(' Барча фойдаланувчилар:');
      users.forEach((user, index) => {
        console.log(`#${index + 1} | ID: ${user.employeeNo} | Исм: ${user.name}`);
      });
    } else {
      console.log('Фойдаланувчилар топилмади: 0');
    }

    return result;
  } catch (error) {
    console.error('Хатолик (Get All Users):', error.message);
    throw error;
  }
}

// Функцияларни синаш учун мисол
(async () => {
  try {
    // Фойдаланувчи қўшиш
    await addUser('141', 'test1');
    // Фойдаланувчилар сонини олиш
    // await getUserCount();
    // Фойдаланувчи маълумотларини ўзгартириш
    // await updateUser('14', 'test1_updated');
    // Фойдаланувчини ўчириш
    // await deleteUser('14');
    // await getAllUsers();
  } catch (error) {
    console.error('Тестда хатолик:', error.message);
  }
})();
