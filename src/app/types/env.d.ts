
declare namespace NodeJS {
  interface ProcessEnv {
    GOOGLE_GEMINI_API_KEY: string;
    OPENAI_API_KEY?: string;
    LOCAL_LLM_ENDPOINT?: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}