export const hashString = (str) => {
    let hash = 0;
    if (str.length === 0) return hash;
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Return a positive value between 0 and 9999 for easier use
    return Math.abs(hash % 10000);
  };
  export const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  export const getSentimentColor = (value, opacity = 1) => {
    if (value > 0) {
      // Positive - green with intensity based on value
      const intensity = Math.min(255, Math.round(value * 255));
      return `rgba(${76 - intensity * 0.2}, ${175 + intensity * 0.3}, ${80}, ${opacity})`;
    } else if (value < 0) {
      // Negative - red with intensity based on value
      const intensity = Math.min(255, Math.round(Math.abs(value) * 255));
      return `rgba(${244 + intensity * 0.04}, ${67 - intensity * 0.2}, ${54}, ${opacity})`;
    } else {
      // Neutral - gray
      return `rgba(158, 158, 158, ${opacity})`;
    }
  };