import axios from 'axios';

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

// Limites de seguridad para IA
const MAX_PROMPT_LENGTH = 1000;
const MAX_CONTEXT_LENGTH = 2000;
const MAX_RESPONSE_LENGTH = 2000;

export class OllamaService {
  private baseUrl: string;
  private model: string;

  constructor() {
    this.baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'mistral:7b';
  }

  async generateText(prompt: string, context?: any): Promise<string> {
    try {
      // Limitar tamaño de prompt/context
      let safePrompt = prompt;
      if (safePrompt.length > MAX_PROMPT_LENGTH) {
        safePrompt = safePrompt.slice(0, MAX_PROMPT_LENGTH);
      }
      let safeContext = context;
      if (safeContext && typeof safeContext === 'string' && safeContext.length > MAX_CONTEXT_LENGTH) {
        safeContext = safeContext.slice(0, MAX_CONTEXT_LENGTH);
      } else if (safeContext && typeof safeContext === 'object') {
        const strContext = JSON.stringify(safeContext);
        if (strContext.length > MAX_CONTEXT_LENGTH) {
          safeContext = JSON.parse(strContext.slice(0, MAX_CONTEXT_LENGTH));
        }
      }
      const response = await axios.post(`${this.baseUrl}/api/generate`, {
        model: this.model,
        prompt: this.buildPrompt(safePrompt, safeContext),
        stream: false
      });
      // Limitar tamaño de respuesta
      let aiResponse = response.data.response;
      if (typeof aiResponse === 'string' && aiResponse.length > MAX_RESPONSE_LENGTH) {
        aiResponse = aiResponse.slice(0, MAX_RESPONSE_LENGTH);
      }
      return aiResponse;
    } catch (error) {
      console.error('Ollama API error:', error);
      throw new Error('Failed to generate content with AI');
    }
  }

  async generateContentForMarketing(
    type: string,
    prompt: string,
    profile?: any
  ): Promise<string> {
    const marketingPrompt = this.buildMarketingPrompt(type, prompt, profile);
    return this.generateText(marketingPrompt);
  }

  private buildPrompt(prompt: string, context?: any): string {
    let fullPrompt = prompt;
    
    if (context) {
      fullPrompt = `Context: ${JSON.stringify(context)}\n\nPrompt: ${prompt}`;
    }

    return fullPrompt;
  }

  private buildMarketingPrompt(type: string, prompt: string, profile?: any): string {
    let systemPrompt = '';

    switch (type) {
      case 'SOCIAL_POST':
        systemPrompt = 'You are a social media marketing expert. Create engaging, concise social media posts that drive engagement and conversions.';
        break;
      case 'BLOG_POST':
        systemPrompt = 'You are a content marketing expert. Write informative, SEO-friendly blog posts that provide value to readers.';
        break;
      case 'EMAIL':
        systemPrompt = 'You are an email marketing expert. Create compelling email content that drives opens, clicks, and conversions.';
        break;
      case 'AD_COPY':
        systemPrompt = 'You are an advertising copywriter. Create persuasive ad copy that converts viewers into customers.';
        break;
      case 'WEBSITE_COPY':
        systemPrompt = 'You are a website copywriter. Create clear, compelling website copy that converts visitors into customers.';
        break;
      default:
        systemPrompt = 'You are a digital marketing expert. Create effective marketing content.';
    }

    let fullPrompt = `${systemPrompt}\n\nTask: ${prompt}`;

    if (profile) {
      fullPrompt += `\n\nBusiness Context:
- Business Type: ${profile.businessType}
- Business Name: ${profile.businessName || 'Not specified'}
- Target Audience: ${profile.targetAudience || 'General audience'}
- Tone: ${profile.tone || 'professional'}
- Description: ${profile.description || 'Not provided'}`;

      if (profile.goals && profile.goals.length > 0) {
        fullPrompt += `\n- Goals: ${profile.goals.join(', ')}`;
      }
    }

    fullPrompt += '\n\nPlease provide ONLY the marketing content, without any explanations or meta-commentary.';

    return fullPrompt;
  }

  async chatWithAI(message: string, context?: any): Promise<string> {
    const chatPrompt = `You are Zoi, a helpful AI marketing assistant. You help users improve their digital marketing strategies, create content, and grow their businesses.

User message: ${message}

${context ? `Context: ${JSON.stringify(context)}` : ''}

Respond in a helpful, friendly, and professional tone. Provide actionable marketing advice when appropriate.`;

    return this.generateText(chatPrompt);
  }

  async generateContentSuggestions(profile: any): Promise<string[]> {
    const prompt = `Based on the following business profile, suggest 5 specific marketing content ideas:

Business Type: ${profile.businessType}
Business Name: ${profile.businessName || 'Not specified'}
Target Audience: ${profile.targetAudience || 'General audience'}
Goals: ${profile.goals?.join(', ') || 'Not specified'}

Provide 5 specific, actionable content ideas that would help this business achieve their marketing goals. Format as a numbered list with brief descriptions.`;

    const response = await this.generateText(prompt);
    
    // Parse the response to extract suggestions
    const suggestions = response
      .split('\n')
      .filter(line => line.trim().match(/^\d+\./))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(suggestion => suggestion.length > 0);

    return suggestions.slice(0, 5); // Ensure we return max 5 suggestions
  }
}

export const ollamaService = new OllamaService();
