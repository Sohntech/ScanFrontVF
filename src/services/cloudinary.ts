export const uploadPhoto = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('photo', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload photo');
  }

  const data = await response.json();
  return data.url;
}; 