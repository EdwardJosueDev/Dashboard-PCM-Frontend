// src/components/Dashboard.tsx (o donde esté)
import { useEffect, useState } from "react";
import { MetabaseService } from "../services/metabase.service";

export default function Dashboard() {
  const [iframeUrl, setIframeUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const {url} = await MetabaseService.getDashboard(); // Asumiendo que devuelve string con la URL firmada
        setIframeUrl(url);
      } catch (err) {
        console.error("Error cargando dashboard Metabase:", err);
        setError("No se pudo cargar el dashboard. Intenta iniciar sesión nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando dashboard...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center p-8">{error}</div>;
  }

  return (
    <div className="w-full h-screen">
      <iframe
        src={iframeUrl}
        title="Dashboard Metabase"
        className="w-full h-full border-0"
        allowFullScreen
      />
    </div>
  );
}