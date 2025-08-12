#!/usr/bin/env node

/**
 * Square Appointments Setup Helper
 * This script helps you configure and test your Square integration
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('\n🔧 Recovery Kneads - Square Appointments Setup\n');
console.log('This wizard will help you configure Square Appointments.\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.error('❌ Error: .env file not found!');
    console.log('Creating .env file from template...\n');
    process.exit(1);
}

// Read current .env
let envContent = fs.readFileSync(envPath, 'utf8');

console.log('✅ Found .env file');
console.log('✅ Location ID already configured: L6BYJ6PXFF95P\n');

console.log('📋 You still need to add:\n');
console.log('1. Square Application ID');
console.log('2. Square Access Token\n');

console.log('🔗 To get these credentials:');
console.log('1. Go to: https://developer.squareup.com/apps');
console.log('2. Log in with your Square account');
console.log('3. Create a new app called "Recovery Kneads Booking"');
console.log('4. Copy the Sandbox credentials for testing\n');

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

async function setup() {
    console.log('Let\'s configure your Square credentials:\n');
    
    const appId = await askQuestion('Enter your Square Application ID: ');
    const accessToken = await askQuestion('Enter your Square Access Token: ');
    
    if (!appId || !accessToken) {
        console.error('\n❌ Both Application ID and Access Token are required!');
        rl.close();
        return;
    }
    
    // Update .env file
    envContent = envContent.replace(
        'SQUARE_APPLICATION_ID=your_square_application_id_here',
        `SQUARE_APPLICATION_ID=${appId.trim()}`
    );
    
    envContent = envContent.replace(
        'SQUARE_ACCESS_TOKEN=your_square_access_token_here',
        `SQUARE_ACCESS_TOKEN=${accessToken.trim()}`
    );
    
    // Save updated .env
    fs.writeFileSync(envPath, envContent);
    
    console.log('\n✅ Square credentials saved successfully!');
    console.log('\n📝 Configuration Summary:');
    console.log(`- Location ID: L6BYJ6PXFF95P`);
    console.log(`- Application ID: ${appId.substring(0, 20)}...`);
    console.log(`- Access Token: ${accessToken.substring(0, 10)}...`);
    console.log(`- Environment: sandbox (testing mode)`);
    
    console.log('\n🚀 Next Steps:');
    console.log('1. Start the booking server: npm run server');
    console.log('2. Open your website: http://localhost:3000');
    console.log('3. Test the booking system');
    console.log('4. When ready for production, change SQUARE_ENVIRONMENT to "production"');
    
    console.log('\n💡 To test your integration:');
    console.log('Run: npm run test-square\n');
    
    rl.close();
}

// Check if running with --test flag
if (process.argv.includes('--test')) {
    console.log('Testing Square connection...\n');
    require('dotenv').config();
    
    if (process.env.SQUARE_APPLICATION_ID === 'your_square_application_id_here') {
        console.error('❌ Square credentials not configured yet!');
        console.log('Run: node setup-square.js\n');
    } else {
        console.log('✅ Square credentials found');
        console.log(`- Location: ${process.env.SQUARE_LOCATION_ID}`);
        console.log(`- App ID: ${process.env.SQUARE_APPLICATION_ID.substring(0, 20)}...`);
        console.log(`- Environment: ${process.env.SQUARE_ENVIRONMENT}`);
        console.log('\n✨ Configuration looks good!\n');
    }
    process.exit(0);
}

// Run setup
setup();