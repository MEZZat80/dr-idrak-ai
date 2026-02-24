import axios from 'axios';

// PubMed E-utilities API
const PUBMED_BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';

// Semantic Scholar API (free tier)
const SEMANTIC_SCHOLAR_URL = 'https://api.semanticscholar.org/graph/v1';

export interface LiteratureResult {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  abstract: string;
  url: string;
  relevanceScore: number;
}

/**
 * Search PubMed for medical literature
 * Free tier: 3 requests/second without API key, 10 with key
 */
export async function searchPubMed(
  query: string,
  maxResults: number = 5
): Promise<LiteratureResult[]> {
  try {
    // Step 1: Search for IDs
    const searchUrl = `${PUBMED_BASE_URL}/esearch.fcgi`;
    const searchParams = new URLSearchParams({
      db: 'pubmed',
      term: query,
      retmax: maxResults.toString(),
      retmode: 'json',
      sort: 'relevance'
    });

    const searchResponse = await axios.get(`${searchUrl}?${searchParams}`);
    const ids = searchResponse.data.esearchresult.idlist;

    if (!ids || ids.length === 0) {
      return [];
    }

    // Step 2: Fetch details for each ID
    const summaryUrl = `${PUBMED_BASE_URL}/esummary.fcgi`;
    const summaryParams = new URLSearchParams({
      db: 'pubmed',
      id: ids.join(','),
      retmode: 'json'
    });

    const summaryResponse = await axios.get(`${summaryUrl}?${summaryParams}`);
    const results = summaryResponse.data.result;

    // Step 3: Format results
    return ids.map((id: string, index: number) => {
      const article = results[id];
      return {
        id,
        title: article?.title || 'Unknown Title',
        authors: article?.authors?.map((a: any) => a.name) || [],
        journal: article?.source || 'Unknown Journal',
        year: article?.pubdate ? parseInt(article.pubdate) : new Date().getFullYear(),
        abstract: '', // PubMed summary doesn't include abstract, need separate call
        url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
        relevanceScore: 1 - (index * 0.1)
      };
    });
  } catch (error) {
    console.error('PubMed search error:', error);
    return [];
  }
}

/**
 * Search Semantic Scholar for papers with abstracts
 * Free tier: 100 requests/5 minutes
 */
export async function searchSemanticScholar(
  query: string,
  maxResults: number = 5
): Promise<LiteratureResult[]> {
  try {
    const response = await axios.get(`${SEMANTIC_SCHOLAR_URL}/paper/search`, {
      params: {
        query: query,
        limit: maxResults,
        fields: 'title,authors,year,abstract,url,journal'
      },
      headers: {
        // No API key needed for basic tier
      }
    });

    const papers = response.data.data || [];

    return papers.map((paper: any, index: number) => ({
      id: paper.paperId || `ss-${index}`,
      title: paper.title || 'Unknown Title',
      authors: paper.authors?.map((a: any) => a.name) || [],
      journal: paper.journal?.name || 'Unknown Journal',
      year: paper.year || new Date().getFullYear(),
      abstract: paper.abstract || '',
      url: paper.url || `https://www.semanticscholar.org/paper/${paper.paperId}`,
      relevanceScore: paper.citationCount ? Math.min(paper.citationCount / 100, 1) : 0.5
    }));
  } catch (error) {
    console.error('Semantic Scholar search error:', error);
    return [];
  }
}

/**
 * Search both sources and merge results
 */
export async function searchMedicalLiterature(
  query: string,
  maxResults: number = 5
): Promise<LiteratureResult[]> {
  // Run both searches in parallel
  const [pubMedResults, semanticResults] = await Promise.all([
    searchPubMed(query, maxResults),
    searchSemanticScholar(query, maxResults)
  ]);

  // Merge and deduplicate by title similarity
  const allResults = [...pubMedResults, ...semanticResults];
  
  // Sort by relevance
  allResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Return top results
  return allResults.slice(0, maxResults);
}

/**
 * Generate search query from product name and health goal
 */
export function generateLiteratureQuery(productName: string, healthGoal: string): string {
  const queries: Record<string, string> = {
    'Neuro-Blue': 'methylene blue cognitive enhancement mitochondrial function clinical trial',
    'NeuroForge': 'nootropic cognitive enhancement memory clinical study',
    'AgeCore NAD+': 'NAD+ supplementation aging longevity clinical trial',
    'Rest Atlas': 'magnesium glycinate sleep quality insomnia clinical study',
    'Zen Mode': 'ashwagandha cortisol stress reduction clinical trial',
    'Dermalux': 'collagen supplementation skin health clinical study',
    'FlexiCore': 'joint support glucosamine chondroitin clinical trial',
    'InnerGlow Logic': 'probiotic gut health microbiome clinical study',
    'Longevity Core': 'ayurvedic herbs longevity cellular health'
  };

  return queries[productName] || `${productName} ${healthGoal} clinical study`;
}