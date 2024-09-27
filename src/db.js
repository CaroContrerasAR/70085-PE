import mongoose from 'mongoose'
const MONGOOSE_URL = 'mongodb+srv://acccarolina:qSDoqtjEi0cl76v2@cluster0.5cwsly0.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0'
try {
  await mongoose.connect(MONGOOSE_URL);
  console.log(`Backend connected to MongoDB`);
} catch (error) {
  console.log(`Couldn't connect to MongoDB, (${error.message})`);
}