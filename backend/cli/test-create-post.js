// Test script for create-post CLI tool
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test function to create a post
async function testCreatePost() {
  console.log('Testing create-post CLI tool...');

  // Test 1: Create a valid post
  try {
    console.log('\n--- Test 1: Create valid post ---');
    const output = execSync('node cli/create-post.js -t "Test Post" -c "This is a test post content"', { encoding: 'utf8' });
    console.log('Output:', output);

    // Check if output contains success message
    if (output.includes('Post created successfully')) {
      console.log('✅ Test 1 passed: Post created successfully');
    } else {
      console.log('❌ Test 1 failed: Success message not found');
    }
  } catch (error) {
    console.error('❌ Test 1 failed:', error.message);
  }
}

// Run tests
testCreatePost().catch(console.error);