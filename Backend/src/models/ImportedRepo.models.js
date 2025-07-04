import mongoose from 'mongoose';

const ImportedRepoSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  repoId: {
    type: Number,
    required: true
  },
  name: String,
  html_url: String,
  private: Boolean,
  owner: {
    login: String,
    id: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('ImportedRepo', ImportedRepoSchema);