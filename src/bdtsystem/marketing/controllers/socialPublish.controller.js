let nangoClient = null;
let nangoLoadError = null;

const getNangoClient = async () => {
  if (nangoClient) return nangoClient;
  if (nangoLoadError) return null;

  try {
    const { Nango } = await import('@nangahq/node');
    nangoClient = new Nango({ secretKey: process.env.NANGO_SECRET_KEY });
    return nangoClient;
  } catch (error) {
    nangoLoadError = error;
    return null;
  }
};

const normalizePlatform = (platform, providerConfigKey) => {
  const value = (platform || providerConfigKey || '').toString().trim();
  const normalized = value.toLowerCase();

  if (normalized === 'twitter (v2)' || normalized === 'twitter-v2' || normalized === 'twitter') {
    return { displayName: 'Twitter (v2)', providerConfigKey: 'twitter-v2' };
  }

  if (normalized === 'tiktok' || normalized === 'tiktok accounts' || normalized === 'tiktok-accounts') {
    return { displayName: 'TikTok', providerConfigKey: 'tiktok-accounts' };
  }

  if (normalized === 'linkedin') {
    return { displayName: 'LinkedIn', providerConfigKey: 'linkedin' };
  }

  if (normalized === 'google') {
    return { displayName: 'Google', providerConfigKey: 'google' };
  }

  if (normalized === 'pinterest') {
    return { displayName: 'Pinterest', providerConfigKey: 'pinterest' };
  }

  if (normalized === 'instagram') {
    return { displayName: 'Instagram', providerConfigKey: 'instagram' };
  }

  if (normalized === 'youtube') {
    return { displayName: 'YouTube', providerConfigKey: 'youtube' };
  }

  if (normalized === 'facebook') {
    return { displayName: 'Facebook', providerConfigKey: 'facebook' };
  }

  return { displayName: value || 'Social Platform', providerConfigKey: value ? value.toLowerCase().replace(/\s+/g, '-') : 'social-platform' };
};

const buildProxyPayload = (providerConfigKey, text, extra = {}) => {
  switch (providerConfigKey) {
    case 'facebook':
      return {
        endpoint: '/v18.0/me/feed',
        data: { message: text }
      };
    case 'instagram':
      return {
        endpoint: '/v20.0/me/media',
        data: { caption: text, media_type: 'TEXT' }
      };
    case 'linkedin':
      return {
        endpoint: '/v2/ugcPosts',
        data: {
          author: `urn:li:person:${extra.connectionId || 'unknown'}`,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: { text },
              shareMediaCategory: 'NONE'
            }
          },
          visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
        }
      };
    case 'pinterest':
      if (!extra.boardId) {
        throw new Error('Pinterest publishing requires a boardId.');
      }
      return {
        endpoint: '/v5/pins',
        data: {
          title: 'CRM social post',
          description: text,
          board_id: extra.boardId,
          media_source: {
            source_type: 'image_url',
            url: extra.mediaUrl || 'https://example.com/placeholder.png'
          }
        }
      };
    case 'twitter-v2':
      return {
        endpoint: '/2/tweets',
        data: { text }
      };
    default:
      throw new Error(`Dynamic routing tunnel is not configured for ${providerConfigKey} yet.`);
  }
};

export const publishToPlatform = async (req, res) => {
  try {
    const { userId, platform, text, providerConfigKey, connectionId, boardId, mediaUrl } = req.body;

    if (!userId || !text) {
      return res.status(400).json({ success: false, message: 'Invalid payload details.' });
    }

    if (!process.env.NANGO_SECRET_KEY) {
      return res.status(503).json({
        success: false,
        message: 'Nango secret key is not configured for the backend environment.'
      });
    }

    const meta = normalizePlatform(platform, providerConfigKey);
    const resolvedProviderConfigKey = providerConfigKey || meta.providerConfigKey;
    const dynamicConnectionId = connectionId || `user_${userId}_${resolvedProviderConfigKey}`;

    const proxyPayload = buildProxyPayload(resolvedProviderConfigKey, text, { connectionId: dynamicConnectionId, boardId, mediaUrl });
    const nango = await getNangoClient();

    if (!nango) {
      return res.status(503).json({
        success: false,
        message: 'Nango is not available in this backend runtime. Install the dependency and restart the server.'
      });
    }

    const responseData = await nango.proxy({
      method: 'POST',
      endpoint: proxyPayload.endpoint,
      providerConfigKey: resolvedProviderConfigKey,
      connectionId: dynamicConnectionId,
      data: proxyPayload.data
    });

    return res.status(200).json({
      success: true,
      message: `Content dispatched safely onto official ${meta.displayName} servers!`,
      data: responseData
    });
  } catch (error) {
    console.error('Publish transaction engine broke down:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'API Proxy pipeline communication dropped.'
    });
  }
};