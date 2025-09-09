import { ContentMetadata, Section, SubSection, SubSubSection } from '../types';

// Average reading speed: 200-250 words per minute for complex academic content
const WORDS_PER_MINUTE = 225;

/**
 * Calculate word count from HTML content
 */
export function calculateWordCount(content: string[]): number {
  return content.reduce((total, paragraph) => {
    // Remove HTML tags and count words
    const textOnly = paragraph.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = textOnly.split(' ').filter(word => word.length > 0);
    return total + words.length;
  }, 0);
}

/**
 * Calculate reading time based on word count
 */
export function calculateReadingTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

/**
 * Extract keywords from content using simple heuristics
 */
export function extractKeywords(content: string[], title: string): string[] {
  const text = [title, ...content].join(' ').toLowerCase();
  
  // Remove HTML tags
  const cleanText = text.replace(/<[^>]*>/g, ' ');
  
  // Common philosophical and scientific terms that indicate key concepts
  const philosophicalTerms = [
    'homodynamics', 'equilibrium', 'dynamic', 'systems', 'feedback', 'plato', 'buddhism', 
    'consciousness', 'wisdom', 'philosophy', 'ancient', 'modern', 'science', 'theory',
    'dharma', 'artha', 'kama', 'moksha', 'prana', 'qi', 'energy', 'balance', 'harmony',
    'suffering', 'liberation', 'enlightenment', 'meditation', 'mindfulness', 'awareness',
    'thermodynamics', 'information', 'neuroscience', 'biology', 'metabolism', 'dopamine',
    'serotonin', 'attractor', 'phase', 'transition', 'complexity', 'emergence', 'adaptation'
  ];
  
  const foundKeywords = philosophicalTerms.filter(term => 
    cleanText.includes(term) || cleanText.includes(term + 's')
  );
  
  // Add title-based keywords
  const titleWords = title.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(' ')
    .filter(word => word.length > 3 && !['the', 'and', 'for', 'with', 'from'].includes(word));
  
  return [...new Set([...foundKeywords, ...titleWords])].slice(0, 8);
}

/**
 * Determine content complexity based on various factors
 */
export function determineComplexity(content: string[], keywords: string[]): ContentMetadata['complexity'] {
  const text = content.join(' ').toLowerCase();
  
  // Advanced indicators
  const advancedTerms = [
    'thermodynamics', 'differential equations', 'phase transitions', 'attractor landscapes',
    'information theory', 'free energy minimization', 'neurotransmitter', 'metabolism',
    'mathematical', 'scientific', 'empirical', 'quantitative', 'theoretical framework'
  ];
  
  // Foundational indicators
  const foundationalTerms = [
    'introduction', 'basic', 'fundamental', 'overview', 'what is', 'about', 'simple',
    'beginning', 'start', 'first', 'core concept', 'definition'
  ];
  
  const advancedCount = advancedTerms.filter(term => text.includes(term)).length;
  const foundationalCount = foundationalTerms.filter(term => text.includes(term)).length;
  
  // Calculate average sentence length as complexity indicator
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / sentences.length;
  
  if (advancedCount >= 2 || avgSentenceLength > 25) {
    return 'advanced';
  } else if (foundationalCount >= 2 || avgSentenceLength < 15) {
    return 'foundational';
  } else {
    return 'intermediate';
  }
}

/**
 * Extract key concepts from content
 */
export function extractConcepts(content: string[], keywords: string[]): string[] {
  const text = content.join(' ').toLowerCase();
  
  const conceptPatterns = [
    // Philosophical concepts
    /dynamic equilibrium/g,
    /feedback loops?/g,
    /systems? theory/g,
    /tripartite soul/g,
    /four noble truths/g,
    /eightfold path/g,
    /predictive processing/g,
    /attractor states?/g,
    
    // Scientific concepts
    /non-equilibrium thermodynamics/g,
    /dissipative structures?/g,
    /phase transitions?/g,
    /information theory/g,
    /free energy/g,
    /neural networks?/g,
    /neurotransmitters?/g,
    
    // Homodynamic concepts
    /energy domain/g,
    /space domain/g,
    /time domain/g,
    /fortitude/g,
    /adaptability/g,
    /resilience/g,
  ];
  
  const concepts: string[] = [];
  conceptPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const concept = match.replace(/s$/, ''); // Remove plural
        if (!concepts.includes(concept)) {
          concepts.push(concept);
        }
      });
    }
  });
  
  return concepts.slice(0, 6);
}

/**
 * Generate metadata for a content section
 */
export function generateContentMetadata(content: string[], title: string): ContentMetadata {
  const wordCount = calculateWordCount(content);
  const readingTime = calculateReadingTime(wordCount);
  const keywords = extractKeywords(content, title);
  const complexity = determineComplexity(content, keywords);
  const concepts = extractConcepts(content, keywords);
  
  return {
    readingTime,
    complexity,
    keywords,
    concepts,
    wordCount,
  };
}

/**
 * Generate metadata for all sections in the content data
 */
export function generateAllMetadata(sections: Section[]): Section[] {
  return sections.map(section => {
    if (section.type === 'header') {
      return section; // Skip header sections
    }
    
    // Calculate section-level metadata
    const allContent = section.subSections.flatMap(sub => sub.content);
    const sectionMetadata = generateContentMetadata(allContent, section.title);
    
    // Generate metadata for subsections
    const enhancedSubSections = section.subSections.map(subSection => {
      const subMetadata = generateContentMetadata(subSection.content, subSection.title);
      
      // Generate metadata for sub-subsections if they exist
      const enhancedSubSubSections = subSection.subSections?.map(subSubSection => ({
        ...subSubSection,
        metadata: generateContentMetadata(subSubSection.content, subSubSection.title),
      }));
      
      return {
        ...subSection,
        metadata: subMetadata,
        subSections: enhancedSubSubSections,
      };
    });
    
    return {
      ...section,
      metadata: sectionMetadata,
      subSections: enhancedSubSections,
    };
  });
}

/**
 * Get reading time for entire section including all subsections
 */
export function getTotalReadingTime(section: Section): number {
  if (section.type === 'header') return 0;
  
  let total = 0;
  section.subSections.forEach(sub => {
    if (sub.metadata) total += sub.metadata.readingTime;
    if (sub.subSections) {
      sub.subSections.forEach(subSub => {
        if (subSub.metadata) total += subSub.metadata.readingTime;
      });
    }
  });
  
  return total;
}

/**
 * Search content by keywords
 */
export function searchContent(sections: Section[], query: string): Array<{
  section: Section;
  subSection?: SubSection;
  subSubSection?: SubSubSection;
  relevanceScore: number;
}> {
  const results: Array<{
    section: Section;
    subSection?: SubSection;
    subSubSection?: SubSubSection;
    relevanceScore: number;
  }> = [];
  
  const queryTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
  
  sections.forEach(section => {
    if (section.type === 'header') return;
    
    section.subSections.forEach(subSection => {
      // Check subsection
      const subKeywords = subSection.metadata?.keywords || [];
      const subConcepts = subSection.metadata?.concepts || [];
      const subText = [subSection.title, ...subSection.content].join(' ').toLowerCase();
      
      let relevanceScore = 0;
      queryTerms.forEach(term => {
        if (subKeywords.some(keyword => keyword.includes(term))) relevanceScore += 3;
        if (subConcepts.some(concept => concept.includes(term))) relevanceScore += 2;
        if (subText.includes(term)) relevanceScore += 1;
      });
      
      if (relevanceScore > 0) {
        results.push({ section, subSection, relevanceScore });
      }
      
      // Check sub-subsections
      subSection.subSections?.forEach(subSubSection => {
        const subSubKeywords = subSubSection.metadata?.keywords || [];
        const subSubConcepts = subSubSection.metadata?.concepts || [];
        const subSubText = [subSubSection.title, ...subSubSection.content].join(' ').toLowerCase();
        
        let subSubRelevanceScore = 0;
        queryTerms.forEach(term => {
          if (subSubKeywords.some(keyword => keyword.includes(term))) subSubRelevanceScore += 3;
          if (subSubConcepts.some(concept => concept.includes(term))) subSubRelevanceScore += 2;
          if (subSubText.includes(term)) subSubRelevanceScore += 1;
        });
        
        if (subSubRelevanceScore > 0) {
          results.push({ section, subSection, subSubSection, relevanceScore: subSubRelevanceScore });
        }
      });
    });
  });
  
  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}