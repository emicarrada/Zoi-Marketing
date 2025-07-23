import { useEffect, useState } from 'react';
import { siteAPI } from '../lib/api';
import type { Site } from '../types';

const PAGE_SIZE = 10;

const SitesPage = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSites(page);
    // eslint-disable-next-line
  }, [page]);

  const fetchSites = async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await siteAPI.getAll({ page: pageNum, pageSize: PAGE_SIZE });
      if (res.data) {
        setSites(res.data.sites || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
      } else {
        setSites([]);
        setTotalPages(1);
      }
    } catch (e) {
      setSites([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Constructor de Sitios Web
        </h1>
        <div className="card p-8">
          {loading ? (
            <div className="flex justify-center items-center h-32">Cargando...</div>
          ) : sites.length === 0 ? (
            <p className="text-gray-600">No tienes sitios creados aún.</p>
          ) : (
            <div>
              <ul className="divide-y divide-gray-200">
                {sites.map((site) => (
                  <li key={site.id} className="py-4">
                    <div className="font-semibold text-gray-900">{site.title}</div>
                    <div className="text-xs text-gray-500 mb-1">{site.slug || site.id}</div>
                    <div className="text-gray-700 text-sm line-clamp-2">{site.template || 'Sin plantilla'}</div>
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

export default SitesPage;
