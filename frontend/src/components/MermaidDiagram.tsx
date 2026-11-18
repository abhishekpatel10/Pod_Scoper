import React, { useEffect, useRef, useState, useId } from 'react';
import mermaid from 'mermaid';
import { 
  Copy, 
  Check, 
  Network, 
  Server, 
  Database, 
  Cpu, 
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Code2,
  Eye,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import type { ArchitectureDiagram } from '../types/scope';

interface MermaidDiagramProps {
  architecture: ArchitectureDiagram;
}

// Initialize mermaid once with resilient crisp light settings
try {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'neutral',
    themeVariables: {
      darkMode: false,
      background: '#f8fafc',
      primaryColor: '#e0e7ff',
      primaryTextColor: '#0f172a',
      primaryBorderColor: '#6366f1',
      lineColor: '#64748b',
      secondaryColor: '#f1f5f9',
      tertiaryColor: '#ffffff',
      mainBkg: '#ffffff',
      nodeBorder: '#6366f1',
      clusterBkg: '#f8fafc',
      clusterBorder: '#cbd5e1',
      titleColor: '#0f172a',
      edgeLabelBackground: '#ffffff',
    },
    flowchart: {
      useMaxWidth: false,
      htmlLabels: true,
      curve: 'basis',
    },
    securityLevel: 'loose',
  });
} catch (e) {
  console.warn('Mermaid initialization warning:', e);
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ architecture }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [renderError, setRenderError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'diagram' | 'code'>('diagram');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [renderAttempt, setRenderAttempt] = useState<number>(0);
  const baseId = useId().replace(/:/g, '');

  useEffect(() => {
    let isCancelled = false;
    const renderDiagram = async () => {
      if (!architecture.mermaid_code) return;
      
      try {
        setRenderError(null);
        // Use a strictly alphanumeric unique ID per attempt to prevent DOM collisions
        const uniqueId = `mermaid_${baseId}_${Date.now()}_${renderAttempt}`;
        
        // Clean up any lingering temporary DOM nodes Mermaid may have created in earlier renders
        const oldTemp = document.getElementById(`d${uniqueId}`);
        if (oldTemp) oldTemp.remove();

        const { svg } = await mermaid.render(uniqueId, architecture.mermaid_code);
        
        if (!isCancelled) {
          setSvgContent(svg);
          setRenderError(null);
        }
      } catch (err: any) {
        console.error('Mermaid render error caught gracefully:', err);
        if (!isCancelled) {
          setRenderError(err?.message || 'Syntax error in Mermaid diagram definition.');
        }
      }
    };

    renderDiagram();

    return () => {
      isCancelled = true;
    };
  }, [architecture.mermaid_code, renderAttempt, baseId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(architecture.mermaid_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.15, 2.0));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.15, 0.6));
  const handleResetZoom = () => setZoomLevel(1);
  const handleRetry = () => setRenderAttempt((prev) => prev + 1);

  const stack = architecture.tech_stack_summary;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-semibold mb-2">
            <Network className="w-3.5 h-3.5 text-cyan-600" />
            Live System Architecture
          </div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Target System Architecture & Enterprise Topology
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Auto-rendered Mermaid.js topology mapping data ingestion, vector/RAG layer, orchestration, and enterprise hooks.
          </p>
        </div>

        {/* View Toggle & Copy Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Toggle Button: View Diagram | Copy Mermaid Code */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('diagram')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'diagram'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              <span>View Diagram</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('code')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'code'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Raw Mermaid</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs text-slate-700 font-medium transition-colors cursor-pointer shadow-xs"
            title="Copy Raw Mermaid Code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden md:inline font-semibold text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline">Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tech Stack Summary Cards (4 Subgraph Architecture Pillars) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="text-[11px] font-semibold text-cyan-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
            <Server className="w-3.5 h-3.5 text-cyan-600" />
            1. Ingestion Layer
          </div>
          <p className="text-xs text-slate-700 font-mono leading-relaxed">
            {stack.ingestion}
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            2. Vector & RAG Layer
          </div>
          <p className="text-xs text-slate-700 font-mono leading-relaxed">
            {stack.vector_rag}
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="text-[11px] font-semibold text-violet-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
            <Cpu className="w-3.5 h-3.5 text-violet-600" />
            3. Orchestration Engine
          </div>
          <p className="text-xs text-slate-700 font-mono leading-relaxed">
            {stack.orchestration}
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
            <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
            4. Enterprise Hooks
          </div>
          <p className="text-xs text-slate-700 font-mono leading-relaxed">
            {stack.enterprise_hooks}
          </p>
        </div>
      </div>

      {/* Main Diagram & Code Canvas with Zoom Controls */}
      <div className="bg-slate-50/70 rounded-2xl border border-slate-200 relative overflow-hidden flex flex-col min-h-[360px]">
        {/* Floating Zoom / Pan Toolbar (only in diagram view) */}
        {viewMode === 'diagram' && !renderError && svgContent && (
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-white/95 border border-slate-200 rounded-xl p-1 shadow-md backdrop-blur-sm">
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="px-2 py-1 text-[11px] font-mono text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Reset Zoom"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Reset Fit"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content Container */}
        <div className="flex-1 p-6 flex items-center justify-center overflow-auto max-h-[600px]">
          {viewMode === 'code' ? (
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono text-indigo-700 font-semibold">Raw Mermaid.js Flowchart LR Syntax</span>
                <span>Editable in Mermaid Live Editor</span>
              </div>
              <pre className="text-xs font-mono text-slate-800 bg-white p-4 rounded-xl border border-slate-200 overflow-x-auto leading-relaxed whitespace-pre select-all shadow-xs">
                {architecture.mermaid_code}
              </pre>
            </div>
          ) : renderError ? (
            <div className="text-center p-6 space-y-4 max-w-lg mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Mermaid Syntax Fallback Mode
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                The diagram syntax could not be rendered directly into SVG. You can view the raw code below or retry rendering.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors cursor-pointer shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retry Render
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('code')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-colors cursor-pointer border border-slate-200"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  View Raw Code
                </button>
              </div>
              <pre className="text-[11px] font-mono text-slate-600 bg-white p-3.5 rounded-xl border border-slate-200 text-left overflow-x-auto max-h-48 shadow-xs">
                {architecture.mermaid_code}
              </pre>
            </div>
          ) : svgContent ? (
            <div
              ref={containerRef}
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: 'transform 0.15s ease-out',
              }}
              className="w-full flex justify-center [&>svg]:max-w-full [&>svg]:h-auto [&>svg]:mx-auto"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : (
            <div className="text-xs text-slate-500 animate-pulse font-mono flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
              Compiling live system architecture diagram...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
