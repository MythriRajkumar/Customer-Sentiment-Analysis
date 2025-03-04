// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const natural = require('natural');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// News API key
const NEWS_API_KEY = process.env.NEWS_API_KEY;

// Initialize sentiment analyzer
const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');

// Helper functions for data processing
const analyzeSentiment = (text) => {
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(text);
  const score = analyzer.getSentiment(tokens);
  
  if (score > 0.2) return 'positive';
  if (score < -0.2) return 'negative';
  return 'neutral';
};

const calculateSentimentDistribution = (articles) => {
  // Combine title and description for analysis
  const sentiments = articles.map(article => 
    analyzeSentiment((article.title || '') + ' ' + (article.description || ''))
  );
  
  const positive = sentiments.filter(s => s === 'positive').length;
  const negative = sentiments.filter(s => s === 'negative').length;
  const neutral = sentiments.filter(s => s === 'neutral').length;
  const total = sentiments.length || 1; // Avoid division by zero
  
  return {
    positive: Math.round((positive / total) * 100),
    neutral: Math.round((neutral / total) * 100),
    negative: Math.round((negative / total) * 100)
  };
};

const extractTopics = (articles, count = 5) => {
  const tfidf = new natural.TfIdf();
  
  // Remove common words
  const stopwords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 
                     'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 
                     'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 
                     'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 
                     'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 
                     'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 
                     'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 
                     'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 
                     'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 
                     'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 
                     'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 
                     'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'];
  
  // Add documents to TF-IDF - combine title and description
  articles.forEach(article => {
    const text = ((article.title || '') + ' ' + (article.description || '')).toLowerCase();
    tfidf.addDocument(text);
  });
  
  // Extract topics
  const topics = [];
  for (let i = 0; i < tfidf.documents.length; i++) {
    const items = tfidf.listTerms(i).slice(0, 10);
    items.forEach(item => {
      if (!stopwords.includes(item.term) && item.term.length > 3) {
        const existingTopic = topics.find(t => t.name === item.term);
        if (existingTopic) {
          existingTopic.count += item.tfidf;
        } else {
          topics.push({
            name: item.term,
            count: item.tfidf
          });
        }
      }
    });
  }
  
  // Sort by count and get top N
  const sortedTopics = topics.sort((a, b) => b.count - a.count).slice(0, count);
  
  // Calculate sentiment for each topic
  return sortedTopics.map(topic => {
    const topicArticles = articles.filter(article => 
      (article.title || '').toLowerCase().includes(topic.name.toLowerCase()) ||
      (article.description || '').toLowerCase().includes(topic.name.toLowerCase())
    );
    
    const sentiments = topicArticles.map(article => 
      analyzeSentiment((article.title || '') + ' ' + (article.description || ''))
    );
    
    const positive = sentiments.filter(s => s === 'positive').length;
    const negative = sentiments.filter(s => s === 'negative').length;
    const neutral = sentiments.filter(s => s === 'neutral').length;
    const total = sentiments.length || 1; // Avoid division by zero
    
    // Scale to -1 to 1 range
    const sentiment = (positive - negative) / total;
    
    return {
      ...topic,
      count: Math.round(topic.count * 10), // Scale for visualization
      sentiment
    };
  });
};

const getNotableComments = (articles, type = 'positive', count = 3) => {
  const scored = articles.map(article => {
    const text = (article.title || '') + ' ' + (article.description || '');
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(text);
    const score = analyzer.getSentiment(tokens);
    return {
      text: article.description || article.title,
      score,
      source: article.source.name || 'News',
      username: article.author || 'Editor'
    };
  });
  
  if (type === 'positive') {
    return scored.sort((a, b) => b.score - a.score).slice(0, count);
  } else {
    return scored.sort((a, b) => a.score - b.score).slice(0, count);
  }
};

// Aggregate data by month from articles
const aggregateByMonth = (articles) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthData = {};
  
  // Get articles from last 6 months
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);
  
  // Initialize monthData
  for (let i = 0; i < 6; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = months[date.getMonth()];
    monthData[monthKey] = { articles: [] };
  }
  
  // Group articles by month
  articles.forEach(article => {
    const articleDate = new Date(article.publishedAt);
    if (articleDate >= sixMonthsAgo) {
      const monthKey = months[articleDate.getMonth()];
      if (monthData[monthKey]) {
        monthData[monthKey].articles.push(article);
      }
    }
  });
  
  // Calculate sentiment for each month
  const result = [];
  for (const [month, data] of Object.entries(monthData)) {
    if (data.articles.length > 0) {
      const distribution = calculateSentimentDistribution(data.articles);
      result.push({
        month,
        positive: distribution.positive,
        neutral: distribution.neutral,
        negative: distribution.negative
      });
    } else {
      // If no articles for a month, use placeholder
      result.push({
        month,
        positive: 0,
        neutral: 0,
        negative: 0
      });
    }
  }
  
  // Sort by chronological order
  return result.reverse();
};

// Get sentiment by source
const getSentimentBySource = (articles) => {
  // Group articles by source
  const sourceGroups = {};
  
  articles.forEach(article => {
    const sourceName = article.source.name || 'Unknown';
    if (!sourceGroups[sourceName]) {
      sourceGroups[sourceName] = [];
    }
    sourceGroups[sourceName].push(article);
  });
  
  // Calculate sentiment for each source
  const result = [];
  for (const [source, articles] of Object.entries(sourceGroups)) {
    if (articles.length > 2) { // Only include sources with enough articles
      const distribution = calculateSentimentDistribution(articles);
      result.push({
        name: source,
        ...distribution
      });
    }
  }
  
  // Return top sources by article count
  return result.slice(0, 5);
};

// API Endpoints
app.get('/api/news/sentiment', async (req, res) => {
  try {
    const query = req.query.query || 'your company name';
    const maxResults = parseInt(req.query.max) || 100;
    
    // Use NewsAPI to search for articles
    // First search from past month (most recent)
    const recentResponse = await axios.get('https://newsapi.org/v2/products', {
      params: {
        q: query,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: Math.min(maxResults, 100), // API limit is 100 per request
        apiKey: NEWS_API_KEY
      }
    });
    
    // Then get some older articles for trend analysis (up to six months back)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const fromDate = sixMonthsAgo.toISOString().split('T')[0];
    const toDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // One month ago
    
    const historicalResponse = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        language: 'en',
        from: fromDate,
        to: toDate,
        sortBy: 'publishedAt',
        pageSize: Math.min(maxResults, 100), // API limit is 100 per request
        apiKey: NEWS_API_KEY
      }
    });
    
    // Combine the results
    const articles = [...recentResponse.data.articles, ...historicalResponse.data.articles];
    
    // Calculate overall sentiment
    const overallSentiment = calculateSentimentDistribution(articles);
    
    // Get sentiment by source
    const sentimentBySource = getSentimentBySource(articles);
    
    // Get sentiment trend
    const sentimentTrend = aggregateByMonth(articles);
    
    // Extract top topics
    const topTopics = extractTopics(articles);
    
    // Get notable comments (using article descriptions)
    const mostPositiveComments = getNotableComments(articles, 'positive');
    const mostNegativeComments = getNotableComments(articles, 'negative');
    
    // Send the processed data
    res.json({
      overallSentiment,
      sentimentBySource,
      sentimentTrend,
      topTopics,
      mostPositiveComments,
      mostNegativeComments,
      totalArticles: articles.length
    });
    
  } catch (error) {
    console.error('Error fetching News API data:', error);
    res.status(500).json({ error: 'Failed to fetch and analyze news data' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});