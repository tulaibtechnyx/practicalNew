let cachedResponse = null;
let lastCacheTime = null;

export default function handler(req, res) {
  const now = new Date();

  // Return cached response if it was generated less than 1.5 second ago
  if (lastCacheTime && now - lastCacheTime < 1500) {
    return res.status(200).json(cachedResponse);
  }

  // Generate new response
  try {
    const response = {
      datetime: now.toISOString(),
    };

    cachedResponse = response;
    lastCacheTime = now;

    res.status(200).json(response);
  } catch (error) {
    console.error("Error generating server time:", error);
    res.status(500).json({
      error: "Failed to generate server time",
    });
  }
}
