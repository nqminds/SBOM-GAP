import React, { useState, useEffect } from 'react';
import Markdown from 'markdown-to-jsx'

export default function ExternalContent({link}) {
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(link);
        const data = await response.text();

        setContent(data);
      } catch (error) {
        console.error('Error fetching external content:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Markdown>{content}</Markdown>
  );
};

