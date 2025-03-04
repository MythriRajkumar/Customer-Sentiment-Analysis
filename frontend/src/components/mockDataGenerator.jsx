import { hashString } from './utils'; 
export const generateMockSentimentData = (query) => {
  const seed = hashString(query);
  
  const getRandomNumber = (min, max, offset = 0) => {
    const randomValue = ((seed + offset) * 9301 + 49297) % 233280;
    return min + (randomValue / 233280) * (max - min);
  };
  const basePositive = Math.min(90, Math.max(30, getRandomNumber(40, 80, 1)));
  const baseNegative = Math.min(50, Math.max(5, getRandomNumber(10, 40, 2)));
  const baseNeutral = Math.min(100 - basePositive - baseNegative, Math.max(5, getRandomNumber(10, 30, 3)));
  
  const total = basePositive + baseNeutral + baseNegative;
  const positive = Math.round((basePositive / total) * 100);
  const negative = Math.round((baseNegative / total) * 100);
  const neutral = 100 - positive - negative;

  const generateTopics = () => {
    const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 3);
    
    const commonTopics = ['price', 'quality', 'service', 'delivery', 'support', 
                         'product', 'innovation', 'technology', 'value', 'performance',
                         'reliability', 'design', 'features', 'responsiveness', 'availability'];
    
    // Create a mix of query-specific and common topics
    let topicPool = [...new Set([...queryWords, ...commonTopics])];
    
    // Select 5-8 topics
    const topicCount = Math.floor(getRandomNumber(5, 8, 10));
    let selectedTopics = [];
    
    for (let i = 0; i < topicCount && topicPool.length > 0; i++) {
      const index = Math.floor(getRandomNumber(0, topicPool.length, i * 10));
      selectedTopics.push(topicPool[index]);
      topicPool.splice(index, 1); // Remove selected topic from pool
    }
    
    // Generate topic stats
    return selectedTopics.map((topic, index) => {
      // Some topics will align with overall sentiment, others will contrast
      let topicSentiment;
      if (index % 3 === 0) {
        // Contrasting sentiment
        topicSentiment = positive > negative ? 
          -getRandomNumber(0.1, 0.8, index * 5) : 
          getRandomNumber(0.1, 0.8, index * 5);
      } else {
        // Aligning sentiment
        topicSentiment = positive > negative ? 
          getRandomNumber(0.1, 0.8, index * 5) : 
          -getRandomNumber(0.1, 0.8, index * 5);
      }
      
      return {
        name: topic,
        count: Math.floor(getRandomNumber(30, 150, index * 3)),
        sentiment: parseFloat(topicSentiment.toFixed(2))
      };
    }).sort((a, b) => b.count - a.count); // Sort by count descending
  };

  // Generate sentiment trend over 6 months
  const generateTrend = () => {
    const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
    let trend = [];
    
    // Create a trend with some variance but following a pattern
    let currentPositive = Math.round(getRandomNumber(positive - 15, positive + 15, 20));
    let currentNegative = Math.round(getRandomNumber(negative - 10, negative + 10, 30));
    
    for (let i = 0; i < 6; i++) {
      const patternType = seed % 3; 
      
      if (patternType === 0) {
        currentPositive = Math.min(90, Math.max(30, currentPositive + getRandomNumber(-3, 5, i * 7)));
        currentNegative = Math.max(5, Math.min(40, currentNegative + getRandomNumber(-5, 2, i * 9)));
      } else if (patternType === 1) {
        currentPositive = Math.min(90, Math.max(30, currentPositive + getRandomNumber(-5, 2, i * 7)));
        currentNegative = Math.max(5, Math.min(40, currentNegative + getRandomNumber(-2, 5, i * 9)));
      } else {
        // Fluctuating pattern: goes up and down
        currentPositive = Math.min(90, Math.max(30, currentPositive + getRandomNumber(-8, 8, i * 7)));
        currentNegative = Math.max(5, Math.min(40, currentNegative + getRandomNumber(-6, 6, i * 9)));
      }
      
      // Ensure values are integers and neutral is calculated to sum to 100
      currentPositive = Math.round(currentPositive);
      currentNegative = Math.round(currentNegative);
      let currentNeutral = 100 - currentPositive - currentNegative;
      
      // Correct any potential issues with neutral
      if (currentNeutral < 0) {
        // Redistribute the excess
        const excess = Math.abs(currentNeutral);
        if (currentPositive > currentNegative) {
          currentPositive -= excess;
        } else {
          currentNegative -= excess;
        }
        currentNeutral = 0;
      }
      
      trend.push({
        month: months[i],
        positive: currentPositive,
        neutral: currentNeutral,
        negative: currentNegative
      });
    }
    
    return trend;
  };

  // Generate sources and their sentiment breakdown
  const generateSources = () => {
    const sourceNames = [
      "News Media", "Industry Press", "Social Media", "Blog Posts", 
      "Financial Reports", "Tech Journals", "Customer Reviews"
    ];
    
    // Select 1-3 sources based on seed
    const sourceCount = Math.floor(getRandomNumber(1, 4, 40));
    const selectedSources = [];
    
    for (let i = 0; i < sourceCount; i++) {
      const sourceIndex = Math.floor(getRandomNumber(0, sourceNames.length, i * 5)) % sourceNames.length;
      
      // Each source will have slightly different sentiment profile
      let sourcePositive = Math.round(getRandomNumber(positive - 10, positive + 10, i * 7));
      let sourceNegative = Math.round(getRandomNumber(negative - 8, negative + 8, i * 9));
      let sourceNeutral = 100 - sourcePositive - sourceNegative;
      
      // Ensure values are valid
      if (sourceNeutral < 0) {
        // Redistribute the excess
        const excess = Math.abs(sourceNeutral);
        if (sourcePositive > sourceNegative) {
          sourcePositive -= excess;
        } else {
          sourceNegative -= excess;
        }
        sourceNeutral = 0;
      }
      
      selectedSources.push({
        name: sourceNames[sourceIndex],
        positive: sourcePositive,
        neutral: sourceNeutral,
        negative: sourceNegative
      });
    }
    
    return selectedSources;
  };

  // Generate realistic comments based on sentiment
  const generateComments = () => {
    // Comment templates with placeholders
    const positiveTemplates = [
      "[COMPANY]'s [TOPIC] is outstanding! I've been [VERB] it for months and couldn't be happier.",
      "The [TOPIC] of [COMPANY]'s [PRODUCT] exceeds all expectations. Worth every penny!",
      "Great [TOPIC] team at [COMPANY]. They resolved my issue within minutes!",
      "I'm impressed with how [COMPANY] handles [TOPIC]. It's rare to see such attention to detail.",
      "The new [PRODUCT] from [COMPANY] is revolutionary. Their [TOPIC] is top-notch."
    ];
    
    const negativeTemplates = [
      "Disappointed with [COMPANY]'s [TOPIC]. Had to wait much longer than promised.",
      "The [TOPIC] increased again? [COMPANY] is getting too expensive for what they offer.",
      "[COMPANY]'s [TOPIC] team took days to respond. Not acceptable for a premium service.",
      "I've been a loyal customer, but [COMPANY]'s recent [TOPIC] changes are making me reconsider.",
      "The [PRODUCT] I received from [COMPANY] had quality issues. Their [TOPIC] needs improvement."
    ];
    
    // Words to fill in templates
    const companies = [query, "they", "the company", "their team"];
    const topics = generateTopics().map(t => t.name);
    const products = ["product", "service", "offering", "solution", "platform"];
    const verbs = ["using", "recommending", "enjoying", "testing", "evaluating"];
    
    // Sources and authors
    const sources = ["News Media", "Industry Press", "Social Media", "Blog Posts", "Customer Review"];
    const authors = ["Industry Analyst", "Customer", "Tech Expert", "Business Reviewer", "Anonymous User"];
    
    // Generate positive comments
    const positiveComments = [];
    for (let i = 0; i < 3; i++) {
      const template = positiveTemplates[Math.floor(getRandomNumber(0, positiveTemplates.length, i * 3))];
      const company = companies[Math.floor(getRandomNumber(0, companies.length, i * 5))];
      const topic = topics[Math.floor(getRandomNumber(0, topics.length, i * 7))] || "service";
      const product = products[Math.floor(getRandomNumber(0, products.length, i * 9))];
      const verb = verbs[Math.floor(getRandomNumber(0, verbs.length, i * 11))];
      
      let text = template
        .replace("[COMPANY]", company)
        .replace("[TOPIC]", topic)
        .replace("[PRODUCT]", product)
        .replace("[VERB]", verb);
        
      positiveComments.push({
        text,
        score: parseFloat((0.7 + getRandomNumber(0, 0.3, i * 13)).toFixed(2)),
        source: sources[Math.floor(getRandomNumber(0, sources.length, i * 15))],
        username: authors[Math.floor(getRandomNumber(0, authors.length, i * 17))]
      });
    }
    
    // Generate negative comments
    const negativeComments = [];
    for (let i = 0; i < 3; i++) {
      const template = negativeTemplates[Math.floor(getRandomNumber(0, negativeTemplates.length, i * 4))];
      const company = companies[Math.floor(getRandomNumber(0, companies.length, i * 6))];
      const topic = topics[Math.floor(getRandomNumber(0, topics.length, i * 8))] || "service";
      const product = products[Math.floor(getRandomNumber(0, products.length, i * 10))];
      
      let text = template
        .replace("[COMPANY]", company)
        .replace("[TOPIC]", topic)
        .replace("[PRODUCT]", product);
        
      negativeComments.push({
        text,
        score: parseFloat((-0.5 - getRandomNumber(0, 0.3, i * 12)).toFixed(2)),
        source: sources[Math.floor(getRandomNumber(0, sources.length, i * 14))],
        username: authors[Math.floor(getRandomNumber(0, authors.length, i * 16))]
      });
    }
    
    return { positiveComments, negativeComments };
  };

  // Calculate total number of articles based on search query
  const totalArticles = Math.floor(getRandomNumber(50, 500, 50));
  
  // Generate all the required data components
  const topics = generateTopics();
  const { positiveComments, negativeComments } = generateComments();
  
  // Assemble the complete mock data structure
  return {
    overallSentiment: {
      positive,
      neutral,
      negative
    },
    sentimentBySource: generateSources(),
    sentimentTrend: generateTrend(),
    topTopics: topics,
    mostPositiveComments: positiveComments,
    mostNegativeComments: negativeComments,
    totalArticles
  };
};