import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './SentimentDashboard.css';
import { generateMockSentimentData } from './mockDataGenerator';

const SentimentDashboard = () => {
  // State for sentiment data
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('Blinkit');
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch data from the backend
  
  const fetchSentimentData = async (query) => {
    setLoading(true);
    setError(null);
    try {
      // Update endpoint to match the server.js API
      const response = await fetch(`/api/news/sentiment?query=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }
      
      const sentimentData = await response.json();
      setData(sentimentData);
    } catch (err) {
      console.warn('Error fetching data from API, using dynamically generated mock data:', err);
      
      // Use our dynamic mock data generator that creates unique data for each query
      const mockData = generateMockSentimentData(query);
      setData(mockData);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when search query changes
  useEffect(() => {
    fetchSentimentData(searchQuery);
  }, []); // Empty dependency array to fetch only on mount

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSentimentData(searchQuery);
  };

  const COLORS = ['#4caf50', '#9e9e9e', '#f44336'];
  const SENTIMENT_COLORS = {
    positive: '#4caf50',
    neutral: '#9e9e9e',
    negative: '#f44336'
  };

  // Loading state
  if (loading) {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>AI-Powered News Sentiment Analysis</h1>
          <p>Loading sentiment data...</p>
        </header>
        <div className="container loading-container">
          <div className="loading-spinner"></div>
          <p>Analyzing sentiment data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>AI-Powered News Sentiment Analysis</h1>
        </header>
        <div className="container error-container">
          <div className="error-message">
            <h2>Error Loading Data</h2>
            <p>{error}</p>
            <button onClick={() => fetchSentimentData(searchQuery)} className="retry-button">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If data is not yet available, show a placeholder
  if (!data) {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>AI-Powered News Sentiment Analysis</h1>
          <p>No data available</p>
        </header>
        <div className="container">
          <div className="search-form">
            <form onSubmit={handleSearch}>
              <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder="Enter search term..."
              />
              <button type="submit">Analyze</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Transform data for pie chart
  const pieData = [
    { name: 'Positive', value: data.overallSentiment.positive },
    { name: 'Neutral', value: data.overallSentiment.neutral },
    { name: 'Negative', value: data.overallSentiment.negative }
  ];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>AI-Powered Customer Sentiment Analysis</h1>
        <p>Business Insights By providing real-time sentiment analysis</p>
      </header>

      <div className="container">
        {/* Search Form */}
        <div className="search-form">
          <form onSubmit={handleSearch}>
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Enter brand or topic to analyze..."
            />
            <button type="submit">Analyze</button>
          </form>
        </div>


        {/* Navigation Tabs */}
        <div className="nav-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'trends' ? 'active' : ''}`}
            onClick={() => setActiveTab('trends')}
          >
            Trends
          </button>
          <button 
            className={`tab-button ${activeTab === 'topics' ? 'active' : ''}`}
            onClick={() => setActiveTab('topics')}
          >
            Key Topics
          </button>
          <button 
            className={`tab-button ${activeTab === 'comments' ? 'active' : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            Notable Comments
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className="overview-grid">
              <div className="card">
                <h2>Overall Sentiment</h2>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card">
                <h2>Sentiment by Source</h2>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.sentimentBySource}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                      <Bar dataKey="positive" stackId="a" fill={SENTIMENT_COLORS.positive} />
                      <Bar dataKey="neutral" stackId="a" fill={SENTIMENT_COLORS.neutral} />
                      <Bar dataKey="negative" stackId="a" fill={SENTIMENT_COLORS.negative} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card">
                <h2>Top Topics</h2>
                <ul className="topic-list">
                  {data.topTopics.slice(0, 5).map((topic, index) => (
                    <li key={index} className="topic-item">
                      <span className="topic-name">{topic.name}</span>
                      <div className="topic-stats">
                        <span className={`sentiment-indicator ${topic.sentiment > 0 ? 'positive' : topic.sentiment < 0 ? 'negative' : 'neutral'}`}></span>
                        <span className="mention-count">{topic.count} mentions</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card sentiment-trend-card">
              <h2>Recent Sentiment Trends</h2>
              <div className="chart-container-large">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data.sentimentTrend}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Line type="monotone" dataKey="positive" stroke={SENTIMENT_COLORS.positive} activeDot={{ r: 8 }} strokeWidth={2} />
                    <Line type="monotone" dataKey="neutral" stroke={SENTIMENT_COLORS.neutral} strokeWidth={2} />
                    <Line type="monotone" dataKey="negative" stroke={SENTIMENT_COLORS.negative} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div className="card">
            <h2 className="section-title">Sentiment Trends Over Time</h2>
            <div className="chart-container-xlarge">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data.sentimentTrend}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="positive" 
                    name="Positive" 
                    stroke={SENTIMENT_COLORS.positive} 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="neutral" 
                    name="Neutral" 
                    stroke={SENTIMENT_COLORS.neutral} 
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="negative" 
                    name="Negative" 
                    stroke={SENTIMENT_COLORS.negative} 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="insights-section">
              <h3>Insights</h3>
              
              {/* Dynamic insights based on the data */}
              {data.sentimentTrend.length > 1 && (
                <>
                  <div className="insight-card positive">
                    {(() => {
                      // Calculate trends
                      const firstMonth = data.sentimentTrend[0];
                      const lastMonth = data.sentimentTrend[data.sentimentTrend.length - 1];
                      const positiveTrend = lastMonth.positive - firstMonth.positive;
                      
                      if (positiveTrend > 0) {
                        return (
                          <p>
                            Positive sentiment has increased by {Math.abs(positiveTrend)}% from {firstMonth.month} to {lastMonth.month}.
                          </p>
                        );
                      } else if (positiveTrend < 0) {
                        return (
                          <p>
                            Positive sentiment has decreased by {Math.abs(positiveTrend)}% from {firstMonth.month} to {lastMonth.month}.
                            Consider reviewing recent changes or events that might have affected public perception.
                          </p>
                        );
                      } else {
                        return (
                          <p>
                            Positive sentiment has remained stable at {lastMonth.positive}% throughout the period.
                          </p>
                        );
                      }
                    })()}
                  </div>
                  
                  <div className="insight-card negative">
                    {(() => {
                      // Calculate trends
                      const firstMonth = data.sentimentTrend[0];
                      const lastMonth = data.sentimentTrend[data.sentimentTrend.length - 1];
                      const negativeTrend = lastMonth.negative - firstMonth.negative;
                      
                      if (negativeTrend < 0) {
                        return (
                          <p>
                            Negative sentiment has decreased by {Math.abs(negativeTrend)}% from {firstMonth.month} to {lastMonth.month},
                            suggesting improved public perception.
                          </p>
                        );
                      } else if (negativeTrend > 0) {
                        return (
                          <p>
                            Negative sentiment has increased by {Math.abs(negativeTrend)}% from {firstMonth.month} to {lastMonth.month}.
                            This may warrant further investigation into potential issues.
                          </p>
                        );
                      } else {
                        return (
                          <p>
                            Negative sentiment has remained stable at {lastMonth.negative}% throughout the period.
                          </p>
                        );
                      }
                    })()}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Topics Tab */}
        {activeTab === 'topics' && (
          <div className="card">
            <h2 className="section-title">Key Topics in News Articles</h2>
            <div className="two-column-grid">
              <div>
                <h3>Topic Distribution</h3>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.topTopics}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#4285F4" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h3>Topic Sentiment</h3>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.topTopics}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[-1, 1]} />
                      <Tooltip />
                      <Bar 
                        dataKey="sentiment" 
                        fill={(entry) => entry.sentiment > 0 ? '#4caf50' : entry.sentiment < 0 ? '#f44336' : '#9e9e9e'} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="insights-section">
              <h3>Topic Insights</h3>
              <div className="insight-topics">
                {data.topTopics.slice(0, 2).map((topic, index) => (
                  <div key={index} className="topic-insight-card">
                    <div className="topic-header">
                      <h4>{topic.name}</h4>
                      <span className={`topic-badge ${topic.sentiment > 0 ? 'positive' : topic.sentiment < 0 ? 'negative' : 'neutral'}`}>
                        {topic.sentiment > 0 ? 'Positive' : topic.sentiment < 0 ? 'Negative' : 'Neutral'}
                      </span>
                    </div>
                    <p>
                      {topic.sentiment > 0.5 ? 
                        `This topic is viewed very positively with a sentiment score of ${topic.sentiment.toFixed(2)}. It's mentioned ${topic.count} times.` :
                        topic.sentiment > 0 ?
                        `This topic is viewed somewhat positively with a sentiment score of ${topic.sentiment.toFixed(2)}. It's mentioned ${topic.count} times.` :
                        topic.sentiment < -0.5 ?
                        `This topic is viewed very negatively with a sentiment score of ${topic.sentiment.toFixed(2)}. It's mentioned ${topic.count} times and may require attention.` :
                        topic.sentiment < 0 ?
                        `This topic is viewed somewhat negatively with a sentiment score of ${topic.sentiment.toFixed(2)}. It's mentioned ${topic.count} times.` :
                        `This topic has neutral sentiment with a score of ${topic.sentiment.toFixed(2)}. It's mentioned ${topic.count} times.`
                      }
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div className="card">
            <h2 className="section-title">Notable Article Comments</h2>
            <div className="two-column-grid">
              <div>
                <h3 className="comments-title positive">Most Positive Comments</h3>
                <div className="comments-container">
                  {data.mostPositiveComments.map((comment, index) => (
                    <div key={index} className="comment-card positive">
                      <p className="comment-text">"{comment.text}"</p>
                      <div className="comment-meta">
                        <span>Source: {comment.source}</span>
                        <span>Sentiment: +{comment.score.toFixed(2)}</span>
                        {comment.username && <span>Author: {comment.username}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="comments-title negative">Most Negative Comments</h3>
                <div className="comments-container">
                  {data.mostNegativeComments.map((comment, index) => (
                    <div key={index} className="comment-card negative">
                      <p className="comment-text">"{comment.text}"</p>
                      <div className="comment-meta">
                        <span>Source: {comment.source}</span>
                        <span>Sentiment: {comment.score.toFixed(2)}</span>
                        {comment.username && <span>Author: {comment.username}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="action-section">
              <h3>Action Items</h3>
              <div className="action-items-card">
                <ul className="action-items-list">
                  {/* Generate action items based on negative comments and topics */}
                  {(() => {
                    const actionItems = [];
                    
                    // Add action items from negative topics
                    data.topTopics
                      .filter(topic => topic.sentiment < 0)
                      .slice(0, 2)
                      .forEach(topic => {
                        actionItems.push(`Investigate issues related to "${topic.name}" - mentioned ${topic.count} times with negative sentiment`);
                      });
                    
                    // Add action from most negative comment
                    if (data.mostNegativeComments.length > 0) {
                      const worstComment = data.mostNegativeComments[0];
                      actionItems.push(`Address feedback about "${worstComment.text.substring(0, 30)}..." (sentiment: ${worstComment.score.toFixed(2)})`);
                    }
                    
                    // Add general action items if list is short
                    if (actionItems.length < 3) {
                      actionItems.push("Schedule team review of sentiment trends for next quarter planning");
                      actionItems.push("Share positive news coverage with team to boost morale");
                    }
                    
                    return actionItems.map((item, index) => <li key={index}>{item}</li>);
                  })()}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <footer className="dashboard-footer">
        <div className="container">
          <p>AI-Powered Customer Sentiment Analysis Platform | Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </footer>
    </div>
  );
};

export default SentimentDashboard;