#!/bin/bash
# Setup environment for testing the create-post CLI
# This script generates a test JWT token and sets environment variables

# Generate a test JWT secret if not set
if [ -z "$JWT_SECRET" ]; then
  echo "Generating test JWT secret..."
  export JWT_SECRET=$(openssl rand -base64 32)
  echo "JWT_SECRET=$JWT_SECRET"
fi

# Generate a test user ID
export TEST_USER_ID=$(node -e "console.log(require('crypto').randomBytes(24).toString('hex'))")

# Generate a test JWT token
export JWT_TOKEN=$(node -e "const jwt=require('jsonwebtoken'); const secret=process.env.JWT_SECRET; const payload={_id:process.env.TEST_USER_ID,username:'testuser'}; console.log(jwt.sign(payload,secret,{expiresIn:'1h'}));")

echo "✅ Environment ready!"
echo "JWT_TOKEN=$JWT_TOKEN"
echo "Test user ID: $TEST_USER_ID"

# Instructions for manual testing
echo "\nTo test the CLI manually:"
echo "  node cli/create-post.js -t \"My Test Post\" -c \"This is test content\""
echo "  node cli/create-post.js --help"