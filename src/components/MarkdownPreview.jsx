
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; 

function MarkdownPreview({ content }) {
  console.log("[DEBUG] Contenido recibido en MarkdownPreview:", content);

  if (!content) {
    return (
      <div className="p-4 text-slate-500 text-center">
        La vista previa aparecerá aquí...
      </div>
    );
  }

  return (
<ReactMarkdown remarkPlugins={[remarkGfm]}>
  {String(content)}
</ReactMarkdown>

  );
}


export default MarkdownPreview;