# Sentiment Analysis Dashboard

A full-stack application for analyzing and visualizing sentiment data with a React frontend and Node.js backend.
## Description

This application provides sentiment analysis capabilities for text data. The dashboard visualizes sentiment trends and metrics to help users understand emotional patterns in their data.

## Features

- Real-time sentiment analysis of text input
- Visual dashboard with sentiment metrics
- Historical data tracking and visualization
- Mock data generation for testing and demonstration

## Setup and Installation

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
cd SENTIMENT_ANALYSIS/backend
Copy
2. Install dependencies:
npm install
Copy
3. Create a `.env` file with the following variables:
PORT=5000
NEWS_API_KEY=your_api_key_here
Copy
4. Start the server:
npm start
Copy
### Frontend Setup

1. Navigate to the frontend directory:
cd SENTIMENT_ANALYSIS/frontend
Copy
2. Install dependencies:
npm install
Copy
3. Start the development server:
npm start
Copy
## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Use the HomePage to navigate to the SentimentDashboard
3. Enter text or upload data for sentiment analysis
4. View the sentiment metrics and visualizations on the dashboard

## Technology Stack

- **Frontend**: React.js, CSS
- **Backend**: Node.js, Express
- **API**: Integrated with news API for data collection

## Testing

Run tests with:
npm test
Copy
## License

MIT
