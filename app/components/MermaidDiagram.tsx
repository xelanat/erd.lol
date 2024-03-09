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
    })
    if (mermaidRef.current) {
      // Trick the mermaid component into re-rendering
      mermaidRef.current.removeAttribute("data-processed")
      mermaid.contentLoaded()
      mermaid.init(undefined, mermaidRef.current)
    }
  }, [chart]);

  return chart ? <div ref={mermaidRef} className="mermaid">{chart}</div> : <div className="mermaid" />
};

export default MermaidDiagram;
