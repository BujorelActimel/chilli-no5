// scripts/userDataAudit.js
require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

const API_BASE_URL = process.env.API_BASE_URL;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const BATCH_SIZE = 100;
const DELAY_BETWEEN_BATCHES = 1000;
const MAX_CONTACTS = process.env.MAX_CONTACTS ? parseInt(process.env.MAX_CONTACTS) : Infinity;
const MAX_API_CALLS = process.env.MAX_API_CALLS ? parseInt(process.env.MAX_API_CALLS) : Infinity;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getContactsBatch(after = undefined) {
  try {
    const response = await axios.get(`${API_BASE_URL}/crm/v3/objects/contacts`, {
      params: {
        limit: BATCH_SIZE,
        after,
        properties: ['*'],
        sorts: [{ propertyName: 'createdate', direction: 'DESCENDING' }]
      },
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching contacts:', error.message);
    return null;
  }
}

async function auditUserData() {
  let allUserData = [];
  let hasMore = true;
  let after = undefined;
  let totalCalls = 0;
  let startTime = Date.now();

  while (hasMore) {
    if (totalCalls >= MAX_API_CALLS) {
      console.log(`Reached maximum number of API calls (${MAX_API_CALLS}). Stopping.`);
      break;
    }

    if (allUserData.length >= MAX_CONTACTS) {
      console.log(`Reached maximum number of contacts (${MAX_CONTACTS}). Stopping.`);
      break;
    }

    const contactsData = await getContactsBatch(after);
    if (!contactsData) {
      console.log('Error occurred while fetching contacts. Stopping.');
      break;
    }

    totalCalls++;
    allUserData = allUserData.concat(contactsData.results.map(contact => ({
      id: contact.id,
      properties: contact.properties
    })));

    console.log(`Fetched data for ${contactsData.results.length} contacts. Total contacts: ${allUserData.length}. API calls: ${totalCalls}`);

    hasMore = contactsData.paging?.next?.after !== undefined;
    after = contactsData.paging?.next?.after;

    if (hasMore) {
      await delay(DELAY_BETWEEN_BATCHES);
    }
  }

  fs.writeFileSync('user_data_audit.json', JSON.stringify(allUserData, null, 2));
  let endTime = Date.now();
  console.log(`User data audit completed. Results written to user_data_audit.json`);
  console.log(`Total contacts processed: ${allUserData.length}`);
  console.log(`Total API calls made: ${totalCalls}`);
  console.log(`Time taken: ${(endTime - startTime) / 1000} seconds`);
}

auditUserData();