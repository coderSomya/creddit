// CLI tool to create posts via Creddit API
// Usage: node create-post.js --title "My Post Title" --content "Post content here"

const { program } = require('commander');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

program
  .name('create-post')
  .description('Create a new post in Creddit')
  .requiredOption('-t, --title <title>', 'Post title')
  .requiredOption('-c, --content <content>', 'Post content')
  .option('-h, --host <host>', 'API host', 'http://localhost:5000')
  .parse();

const options = program.opts();

async function createPost() {
  const token = process.env.JWT_TOKEN || process.env.JWT_SECRET;

  if (!token) {
    console.error('Error: JWT token not found. Set JWT_TOKEN or JWT_SECRET environment variable');
    process.exit(1);
  }

  const postData = {
    title: options.title,
    content: options.content
  };

  try {
    const response = await fetch(`${options.host}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(`Error ${response.status}: ${error.message || 'Failed to create post'}`);
      process.exit(1);
    }

    const post = await response.json();
    console.log('Post created successfully:');
    console.log(`ID: ${post._id}`);
    console.log(`Title: ${post.title}`);
    console.log(`Content: ${post.content}`);
    console.log(`Author: ${post.author.username}`);
    console.log(`Created at: ${post.createdAt}`);

  } catch (error) {
    console.error('Network error:', error.message);
    process.exit(1);
  }
}

createPost().catch(console.error);