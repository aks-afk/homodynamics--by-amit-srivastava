import React from 'react';

export interface ContentMetadata {
  readingTime: number; // in minutes
  complexity: 'foundational' | 'intermediate' | 'advanced';
  keywords: string[];
  concepts: string[];
  wordCount: number;
}

export interface SubSubSection {
  id: string;
  title: string;
  content: string[];
  component?: React.ComponentType;
  metadata?: ContentMetadata;
}

export interface SubSection {
  id: string;
  title: string;
  content: string[];
  subSections?: SubSubSection[];
  component?: React.ComponentType;
  metadata?: ContentMetadata;
}

export interface Section {
  id: string;
  title: string;
  shortTitle: string;
  type?: 'header';
  component: React.ComponentType;
  subSections: SubSection[];
  metadata?: ContentMetadata;
}
