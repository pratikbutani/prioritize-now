
import React from 'react';

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground p-4 text-center text-sm border-t mt-auto">
      Love at first deploy –{' '}
      <a
        href="http://firebase.studio/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline hover:text-primary/80"
      >
        Firebase Studio
      </a>
      {' '}x {' '}
      <a
        href="https://linkedin.com/in/pratikbutani"
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline hover:text-primary/80"
      >
        Pratik Butani
      </a>
      {' '}💘👨‍💻
    </footer>
  );
}

