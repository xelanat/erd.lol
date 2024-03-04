import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram = ({ chart }: MermaidDiagramProps) => {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      securityLevel: 'loose',
      theme: 'default',
    });
    if (mermaidRef.current) {
      mermaid.contentLoaded();
      mermaid.init(undefined, mermaidRef.current);
    }
  }, [chart]);

  return <div ref={mermaidRef} className="mermaid">{chart}</div>;
};

export default MermaidDiagram;
