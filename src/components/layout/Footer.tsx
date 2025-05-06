
import React from 'react';

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground p-4 text-center text-sm border-t mt-auto">
      Love at first deploy – Firebase Studio x {' '}
      <a
        href="https://linkedin.com/in/pratikbutani"
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        Pratik Butani
      </a>
      {' '}💘👨‍💻
    </footer>
  );
}

