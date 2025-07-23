import { useEffect, useState } from 'react';
import { contentAPI } from '../lib/api';
import type { Content } from '../types';

const PAGE_SIZE = 10;

const ContentPage = () => {
  const [content, setContent] = useState<Content[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContent(page);
    // eslint-disable-next-line
  }, [page]);

  const fetchContent = async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await contentAPI.getAll({ page: pageNum, pageSize: PAGE_SIZE });
      if (res.data) {
        setContent(res.data.content || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
      } else {
        setContent([]);
        setTotalPages(1);
      }
    } catch (e) {
      setContent([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Generador de Contenido
        </h1>
        <div className="card p-8">
          {loading ? (
            <div className="flex justify-center items-center h-32">Cargando...</div>
          ) : content.length === 0 ? (
            <p className="text-gray-600">No hay contenido generado aún.</p>
          ) : (
            <div>
              <ul className="divide-y divide-gray-200">
                {content.map((item) => (
                  <li key={item.id} className="py-4">
                    <div className="font-semibold text-gray-900">{item.title}</div>
                    <div className="text-xs text-gray-500 mb-1">{item.type} | {item.status}</div>
                    <div className="text-gray-700 text-sm line-clamp-2">{item.body}</div>
                  </li>
                ))}
              </ul>
              {/* Controles de paginación */}
              <div className="flex justify-center gap-2 mt-6">
                <button
                  className="btn btn-secondary px-3 py-1"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >Anterior</button>
                <span className="px-2 py-1">Página {page} de {totalPages}</span>
                <button
                  className="btn btn-secondary px-3 py-1"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >Siguiente</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentPage;
