import { GoogleGenAI } from "@google/genai";
import { HealthMetric, Habit, Budget, Insight } from '@/context/NexusContext';

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeUserData = async (
  healthData: HealthMetric[],
  habits: Habit[],
  budgets: Budget[]
): Promise<Insight[]> => {
  try {
    const ai = getAI();
    const prompt = `
      Analyze the following user data for the "Nexus" personal intelligence system.
      Identify patterns, anomalies, and actionable recommendations.
      
      Data Context:
      Health (Last 7 days): ${JSON.stringify(healthData)}
      Habits: ${JSON.stringify(habits)}
      Budgets: ${JSON.stringify(budgets)}

      Output JSON format:
      [
        {
          "type": "pattern" | "anomaly" | "recommendation",
          "title": "Short Title",
          "description": "Concise explanation",
          "actionable": boolean
        }
      ]
      
      Keep it strictly JSON. No markdown.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) return [];
    
    const rawInsights = JSON.parse(text);
    
    return rawInsights.map((insight: any, index: number) => ({
      id: `ai-${Date.now()}-${index}`,
      date: new Date().toISOString(),
      ...insight
    }));

  } catch (error) {
    console.error("AI Analysis Failed:", error);
    return [{
      id: 'error',
      type: 'anomaly',
      title: 'Analysis Failed',
      description: 'Could not connect to Nexus Intelligence Engine.',
      actionable: false,
      date: new Date().toISOString()
    }];
  }
};

export const generateHabitSuggestions = async (
  currentHabits: Habit[],
  goals: string
): Promise<Habit[]> => {
  try {
    const ai = getAI();
    const prompt = `
      You are the Nexus Intelligence Engine. 
      
      User's Current Habits: ${JSON.stringify(currentHabits)}
      User's Optimization Goals: "${goals}"
      
      Tasks:
      1. Suggest 2-3 NEW micro-habits that align with their goals.
      2. Suggest REFINEMENTS for 1-2 existing habits (e.g., adding specific micro-goals or adjusting frequency).
      
      Return a combined list of habits. For refinements, use the existing habit's title but update the microGoals or description.
      
      Return JSON format:
      [
        {
          "title": "Habit Title",
          "category": "Health" | "Focus" | "Learning" | "Finance",
          "microGoals": [{"title": "Micro goal text", "completed": false}],
          "isRefinement": boolean,
          "refinementNote": "Why this refinement was suggested"
        }
      ]
      
      Keep it strictly JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) return [];

    const suggestions = JSON.parse(text);
    return suggestions.map((s: any, i: number) => ({
      id: `suggested-${Date.now()}-${i}`,
      streak: 0,
      completed: false,
      aiRecommended: true,
      ...s
    }));

  } catch (error) {
    console.error("Habit Generation Failed:", error);
    return [];
  }
};

export const generateDailyBlueprint = async (
  healthData: HealthMetric[],
  habits: Habit[]
): Promise<any> => {
  try {
    const ai = getAI();
    const prompt = `
      Generate a personalized daily health and productivity blueprint based on the user's past behavior.
      
      Recent Health Data: ${JSON.stringify(healthData.slice(-3))}
      Current Habits: ${JSON.stringify(habits)}
      
      Create a schedule with 4-5 key blocks (e.g., Morning Routine, Deep Work, Active Recovery, Evening Wind Down).
      Adapt the schedule based on their recent sleep and activity. If sleep is low, suggest more recovery.
      
      Return JSON format:
      {
        "summary": "A brief motivational summary of today's focus.",
        "blocks": [
          {
            "time": "e.g., 08:00 AM - 09:00 AM",
            "title": "Block Title",
            "description": "What to do and why it helps today.",
            "type": "focus" | "recovery" | "health" | "routine"
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Blueprint Generation Failed:", error);
    return null;
  }
};

export const analyzeJournalEntry = async (entry: string): Promise<any> => {
  try {
    const ai = getAI();
    const prompt = `
      Analyze the following journal entry for emotional distress, sentiment, and actionable wellness tips.
      Maintain strict privacy and ethical standards. If severe distress is detected, suggest seeking professional support gently.
      
      Journal Entry: "${entry}"
      
      Return JSON format:
      {
        "sentiment": "positive" | "neutral" | "negative" | "distressed",
        "analysis": "Brief empathetic analysis of the emotional state.",
        "suggestions": ["Actionable wellness tip 1", "Actionable wellness tip 2"],
        "requiresSupport": boolean
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Journal Analysis Failed:", error);
    return null;
  }
};

export const analyzeFinancialHealth = async (

  financeData: any
): Promise<any> => {
  try {
    const ai = getAI();
    const prompt = `
      Design an AI-powered financial health scoring feature. Analyze the following user financial data:
      ${JSON.stringify(financeData)}
      
      Tasks:
      1. Generate a Financial Health Score (0-100).
      2. Predict end-of-month financial stability (e.g., "Stable", "At Risk", "Surplus").
      3. Provide an adaptive budget recommendation logic (suggest personalized adjustments).
      4. Detect anomalies for unusual spending and create predictive alerts.
      
      Return JSON format:
      {
        "score": 85,
        "stability": "Stable",
        "recommendations": ["Reduce entertainment by 10% to hit savings goal", "Great job on food budget"],
        "anomalies": [{"category": "Food", "amount": 85, "alert": "Unusual spike in dining out"}],
        "architectureNote": "Data inputs required: Income, Spending, Savings. Model type: Time-Series Forecasting (e.g., LSTM) + Anomaly Detection (Isolation Forest). Privacy: On-device processing with federated learning."
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Financial Health Analysis Failed:", error);
    return null;
  }
};

export const analyzeFinancialAnxiety = async (
  financeData: any,
  healthData: any
): Promise<any> => {
  try {
    const ai = getAI();
    const prompt = `
      Correlate financial data with mood and stress levels to detect financial anxiety risk.
      
      Finance Data: ${JSON.stringify(financeData.budgets)}
      Health/Mood Data: ${JSON.stringify(healthData.slice(-7))}
      
      Tasks:
      1. Determine Financial Anxiety Risk (Low, Medium, High).
      2. Suggest preventive financial planning and wellness strategies.
      
      Return JSON format:
      {
        "riskLevel": "Medium",
        "correlationInsight": "Mood drops on days with high spending.",
        "wellnessStrategies": ["Practice mindful spending", "Review budget weekly to reduce uncertainty"]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Financial Anxiety Analysis Failed:", error);
    return null;
  }
};

export const recommendIncomeGrowth = async (
  profile: any
): Promise<any> => {
  try {
    const ai = getAI();
    const prompt = `
      Create an AI-based income growth recommendation system for students.
      
      User Profile:
      Skills: ${profile.skills.join(', ')}
      Time Availability: ${profile.timeAvailability}
      Financial Goals: ${profile.financialGoals}
      
      Tasks:
      Suggest realistic income opportunities and savings targets based on skills and time.
      
      Return JSON format:
      {
        "opportunities": [
          {"title": "Freelance Web Dev", "effort": "Medium", "potential": "$200/week"}
        ],
        "savingsTarget": "Save $100/week to hit $5000 goal in 1 year."
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Income Growth Analysis Failed:", error);
    return null;
  }
};
