/**
 * RSS Feed Service for Ransomware Threat Intelligence
 * 
 * Aggregates threat intelligence from multiple healthcare security feeds
 */

export interface RSSFeed {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
  category: 'government' | 'news' | 'security' | 'healthcare';
}

export interface RSSItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  author?: string;
  categories?: string[];
  source: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  relevance?: 'healthcare' | 'general';
}

export interface AggregatedThreatData {
  items: RSSItem[];
  totalCount: number;
  lastUpdated: Date;
  sources: string[];
  healthcareBreaches: RSSItem[];
  criticalThreats: RSSItem[];
  recentThreats: RSSItem[];
}

/**
 * Pre-configured RSS feeds for healthcare security intelligence
 */
const RSS_FEEDS: RSSFeed[] = [
  {
    id: 'cisa',
    name: 'CISA Advisories',
    url: 'https://www.cisa.gov/news/rss.xml',
    enabled: true,
    category: 'government'
  },
  {
    id: 'cisa-aa',
    name: 'CISA Security Advisories',
    url: 'https://www.cisa.gov/news-events/cybersecurity-advisories/rss.xml',
    enabled: true,
    category: 'government'
  },
  {
    id: 'krebs',
    name: 'Krebs on Security',
    url: 'https://krebsonsecurity.com/feed/',
    enabled: true,
    category: 'news'
  },
  {
    id: 'bleeping-computer',
    name: 'Bleeping Computer Security',
    url: 'https://www.bleepingcomputer.com/feed/',
    enabled: true,
    category: 'news'
  },
  {
    id: 'malwarebytes',
    name: 'Malwarebytes Labs',
    url: 'https://www.malwarebytes.com/blog/feed',
    enabled: true,
    category: 'security'
  },
  {
    id: 'darkreading',
    name: 'Dark Reading',
    url: 'https://www.darkreading.com/rss.xml',
    enabled: true,
    category: 'security'
  }
];

/**
 * Parse RSS feed from URL
 */
async function parseRSSFeed(feedUrl: string): Promise<RSSItem[]> {
  try {
    // Use CORS proxy for client-side RSS parsing
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
    }
    
    const data = await response.json();
    const xmlText = data.contents;
    
    // Parse XML using DOMParser
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    const items = xmlDoc.querySelectorAll('item');
    const parsedItems: RSSItem[] = [];
    
    items.forEach((item, index) => {
      const title = item.querySelector('title')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      
      // Extract categories
      const categoryElements = item.querySelectorAll('category');
      const categories = Array.from(categoryElements).map(cat => cat.textContent || '');
      
      // Analyze content for relevance and severity
      const threatAnalysis = analyzeContentForThreats(title + ' ' + description);
      
      parsedItems.push({
        id: `${feedUrl}-${index}`,
        title: cleanText(title),
        description: cleanText(description),
        link,
        pubDate,
        categories,
        source: feedUrl,
        ...threatAnalysis
      });
    });
    
    return parsedItems;
  } catch (error) {
    console.error(`Error parsing RSS feed ${feedUrl}:`, error);
    return [];
  }
}

/**
 * Analyze content to determine relevance and severity
 */
function analyzeContentForThreats(content: string): { severity: 'low' | 'medium' | 'high' | 'critical', relevance: 'healthcare' | 'general' } {
  const contentLower = content.toLowerCase();
  
  // Healthcare keywords
  const healthcareKeywords = ['healthcare', 'hospital', 'medical', 'hipaa', 'patient data', 'health system', 'phr', 'ehr', 'electronic health'];
  const isHealthcare = healthcareKeywords.some(keyword => contentLower.includes(keyword));
  
  // Severity keywords
  const criticalKeywords = ['critical', 'emergency', 'active exploitation', '0-day', 'zero-day', 'widespread'];
  const highKeywords = ['ransomware', 'data breach', 'malware', 'exploit', 'vulnerability'];
  const mediumKeywords = ['advisory', 'update', 'patch', 'alert'];
  
  let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
  
  if (criticalKeywords.some(keyword => contentLower.includes(keyword))) {
    severity = 'critical';
  } else if (highKeywords.some(keyword => contentLower.includes(keyword))) {
    severity = 'high';
  } else if (mediumKeywords.some(keyword => contentLower.includes(keyword))) {
    severity = 'medium';
  }
  
  return {
    severity,
    relevance: isHealthcare ? 'healthcare' : 'general'
  };
}

/**
 * Clean HTML/text content
 */
function cleanText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/**
 * Fetch and aggregate all RSS feeds
 */
export async function fetchAllFeeds(): Promise<AggregatedThreatData> {
  const allItems: RSSItem[] = [];
  const enabledFeeds = RSS_FEEDS.filter(feed => feed.enabled);
  
  // Fetch all feeds in parallel
  const feedPromises = enabledFeeds.map(feed => parseRSSFeed(feed.url));
  const results = await Promise.allSettled(feedPromises);
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value);
    } else {
      console.error(`Failed to fetch feed ${enabledFeeds[index].name}:`, result.reason);
    }
  });
  
  // Sort by date (newest first)
  allItems.sort((a, b) => {
    const dateA = new Date(a.pubDate).getTime();
    const dateB = new Date(b.pubDate).getTime();
    return dateB - dateA;
  });
  
  // Filter and categorize
  const healthcareBreaches = allItems.filter(item => 
    item.relevance === 'healthcare' && 
    (item.title.toLowerCase().includes('breach') || item.title.toLowerCase().includes('ransomware'))
  );
  
  const criticalThreats = allItems.filter(item => item.severity === 'critical' || item.severity === 'high');
  
  const recentThreats = allItems.slice(0, 20); // Most recent 20 items
  
  return {
    items: allItems,
    totalCount: allItems.length,
    lastUpdated: new Date(),
    sources: enabledFeeds.map(feed => feed.name),
    healthcareBreaches,
    criticalThreats,
    recentThreats
  };
}

/**
 * Fetch a single feed by ID
 */
export async function fetchFeedById(feedId: string): Promise<RSSItem[]> {
  const feed = RSS_FEEDS.find(f => f.id === feedId && f.enabled);
  if (!feed) {
    throw new Error(`Feed not found: ${feedId}`);
  }
  
  return parseRSSFeed(feed.url);
}

/**
 * Get all configured feeds
 */
export function getConfiguredFeeds(): RSSFeed[] {
  return RSS_FEEDS.filter(feed => feed.enabled);
}

/**
 * Search threats by keyword
 */
export async function searchThreats(keyword: string): Promise<RSSItem[]> {
  const data = await fetchAllFeeds();
  const keywordLower = keyword.toLowerCase();
  
  return data.items.filter(item => 
    item.title.toLowerCase().includes(keywordLower) ||
    item.description.toLowerCase().includes(keywordLower) ||
    item.categories?.some(cat => cat.toLowerCase().includes(keywordLower))
  );
}

/**
 * Get threat statistics
 */
export async function getThreatStatistics(): Promise<{
  totalThreats: number;
  healthcareBreaches: number;
  criticalThreats: number;
  highThreats: number;
  mediumThreats: number;
  lowThreats: number;
  last24Hours: number;
  last7Days: number;
}> {
  const data = await fetchAllFeeds();
  
  const now = Date.now();
  const last24Hours = 24 * 60 * 60 * 1000;
  const last7Days = 7 * 24 * 60 * 60 * 1000;
  
  const itemsLast24h = data.items.filter(item => {
    const pubDate = new Date(item.pubDate).getTime();
    return now - pubDate < last24Hours;
  });
  
  const itemsLast7d = data.items.filter(item => {
    const pubDate = new Date(item.pubDate).getTime();
    return now - pubDate < last7Days;
  });
  
  return {
    totalThreats: data.totalCount,
    healthcareBreaches: data.healthcareBreaches.length,
    criticalThreats: data.items.filter(item => item.severity === 'critical').length,
    highThreats: data.items.filter(item => item.severity === 'high').length,
    mediumThreats: data.items.filter(item => item.severity === 'medium').length,
    lowThreats: data.items.filter(item => item.severity === 'low').length,
    last24Hours: itemsLast24h.length,
    last7Days: itemsLast7d.length
  };
}

export default {
  fetchAllFeeds,
  fetchFeedById,
  getConfiguredFeeds,
  searchThreats,
  getThreatStatistics
};

