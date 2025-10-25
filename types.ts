import React from 'react';

export interface Project {
  name: string;
  description: string;
  language: string;
  languageColor: string;
  url: string;
  stats: {
    codeSize: number;
    forks: number;
    stars: number;
  };
  technologies?: string[];
}

export interface Tech {
  name:string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  description: string;
}

export interface ExpertiseItem {
    title: string;
    description: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    color: string;
}

export type FileSystemNode = {
    type: 'file';
    content: string;
} | {
    type: 'directory';
    children: { [key: string]: FileSystemNode };
};
