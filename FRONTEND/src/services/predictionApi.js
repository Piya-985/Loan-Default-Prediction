const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001';

export const getModels = async () => {
  try {
    const response = await fetch(`${API_URL}/api/models`);
    if (!response.ok) throw new Error('Failed to fetch models');
    return await response.json();
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
};

export const getModelDetails = async (modelId) => {
  try {
    const response = await fetch(`${API_URL}/api/models/${modelId}/details`);
    if (!response.ok) throw new Error('Failed to fetch model details');
    return await response.json();
  } catch (error) {
    console.error('Error fetching model details:', error);
    throw error;
  }
};

export const getSampleData = async (limit = 10, offset = 0) => {
  try {
    const response = await fetch(
      `${API_URL}/api/dataset/samples?limit=${limit}&offset=${offset}`
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || 'Failed to fetch sample data'
      );
    }

    return await response.json();

  } catch (error) {
    console.error('Error fetching sample data:', error);
    throw error;
  }
};

export const predictLoanRisk = async (modelId, features) => {
  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelId,
        features: features
      })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Prediction failed');
    }
    return await response.json();
  } catch (error) {
    console.error('Error predicting loan risk:', error);
    throw error;
  }
};
