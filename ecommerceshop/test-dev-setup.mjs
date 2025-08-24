#!/usr/bin/env node

// Simple test script to verify development setup
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testSetup() {
    console.log('🧪 Testing Development Setup...\n');
    
    try {
        // Test backend health
        console.log('1️⃣ Testing Backend (localhost:5001)...');
        const { stdout: healthCheck } = await execAsync('curl -s http://localhost:5001/health || echo "Backend not running"');
        
        if (healthCheck.includes('"status":"healthy"')) {
            console.log('✅ Backend is running and healthy');
        } else {
            console.log('❌ Backend not responding');
        }
        
        // Test frontend
        console.log('\n2️⃣ Testing Frontend (localhost:5173)...');
        const { stdout: frontendCheck } = await execAsync('curl -s -I http://localhost:5173 | head -1 || echo "Frontend not running"');
        
        if (frontendCheck.includes('200 OK')) {
            console.log('✅ Frontend is running');
        } else {
            console.log('❌ Frontend not responding');
        }
        
        // Test proxy
        console.log('\n3️⃣ Testing API Proxy...');
        const { stdout: proxyCheck } = await execAsync('curl -s http://localhost:5173/health || echo "Proxy not working"');
        
        if (proxyCheck.includes('"status":"healthy"')) {
            console.log('✅ Vite proxy is working correctly');
        } else {
            console.log('❌ Proxy not working - frontend may not reach backend');
        }
        
        console.log('\n🎯 Development Setup Test Complete!');
        
    } catch (error) {
        console.error('Error during testing:', error.message);
    }
}

testSetup();
