import useSWR from 'swr';

interface ExternalData {
  githubProjects: string;
  relevantKnowledge: string;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch external data');
  }
  return response.json();
};

export function useExternalData(message: string) {
  const { data, error, isLoading } = useSWR<ExternalData>(
    message
      ? `/api/external-data?message=${encodeURIComponent(message)}`
      : null,
    fetcher
  );

  return {
    externalData: data || { githubProjects: '', relevantKnowledge: '' },
    isLoading,
    isError: error,
  };
}
