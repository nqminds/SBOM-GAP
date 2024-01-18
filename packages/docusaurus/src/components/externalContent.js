import React, { useState, useEffect } from 'react';
import {remark} from 'https://esm.sh/remark@15'
import remarkHTML from "remark-html";


export default function ExternalContent({link}) {
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(link);
        const data = await response.text();
        const markdownContent = await remark().use(remarkHTML).processSync(data);

        setContent(markdownContent);
      } catch (error) {
        console.error('Error fetching external content:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

