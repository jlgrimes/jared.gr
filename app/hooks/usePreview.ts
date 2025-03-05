import useSWR from 'swr';

interface PreviewData {
  title: string;
  description: string;
  image?: string;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch preview');
  }
  return response.json();
};

export function usePreview(href: string) {
  const { data, error, isLoading } = useSWR<PreviewData>(
    href ? `/api/preview?url=${encodeURIComponent(href)}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      revalidateOnMount: true,
      dedupingInterval: 24 * 60 * 60 * 1000, // Cache for 24 hours
      keepPreviousData: true,
      shouldRetryOnError: false, // Don't retry on error
      errorRetryCount: 0, // Don't retry on error
      loadingTimeout: 5000, // Timeout after 5 seconds
      suspense: false,
    }
  );

  return {
    preview: data || {
      title: new URL(href).hostname,
      description: error ? 'Failed to load preview' : 'Loading preview...',
    },
    isLoading,
    isError: error,
  };
}
