import os
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

class AIProvider(ABC):
    @abstractmethod
    def generate_response(self, prompt: str, user_context: Dict[str, Any]) -> str:
        pass

class GeminiProvider(AIProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key
        try:
            from google import genai
            self.client = genai.Client(api_key=api_key)
        except Exception:
            self.client = None

    def generate_response(self, prompt: str, user_context: Dict[str, Any]) -> str:
        if not self.client:
            raise RuntimeError("Gemini client not initialized")

        system_instruction = (
            "You are XemStreak's calm, motivating, and concise AI Study Companion. "
            "You are not a generic chatbot. You care about the user's focus, mental calm, and streak consistency. "
            f"Context: Username: {user_context.get('username')}, Current Streak: {user_context.get('streak')} days, "
            f"Today's Study Time: {user_context.get('today_minutes')} minutes (Goal: {user_context.get('goal_minutes')} min), "
            f"Tree Stage: Level {user_context.get('tree_level')} of 22 ({user_context.get('tree_name')}). "
            f"Active Room: {user_context.get('room_name') or 'Solo Garden'}. "
            "Keep answers focused, calm, supportive, and under 3-4 sentences. "
            "Encourage small steps if they feel unmotivated."
        )

        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config={"system_instruction": system_instruction}
        )
        return response.text.strip()

class GroqProvider(AIProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key
        try:
            from groq import Groq
            self.client = Groq(api_key=api_key)
        except Exception:
            self.client = None

    def generate_response(self, prompt: str, user_context: Dict[str, Any]) -> str:
        if not self.client:
            raise RuntimeError("Groq client not initialized")

        system_prompt = (
            "You are XemStreak's calm, motivating, and concise AI Study Companion. "
            "You are not a generic chatbot. You care deeply about the user's deep work, calm study habits, and streak consistency. "
            f"Context: Username: {user_context.get('username')}, Streak: {user_context.get('streak')} days, "
            f"Today's Study Time: {user_context.get('today_minutes')} min, "
            f"Tree Stage: Level {user_context.get('tree_level')} of 22 ({user_context.get('tree_name')}). "
            f"Active Room: {user_context.get('room_name') or 'Solo Garden'}. "
            "Keep answers concise (under 3 sentences), encouraging consistency over grind."
        )

        # Candidate models supported by Groq API
        models_to_try = [
            "openai/gpt-oss-120b",
            "qwen/qwen3.8-27b",
            "openai/gpt-oss-20b",
            "llama-3.3-70b-versatile"
        ]

        last_err = None
        for model_name in models_to_try:
            try:
                chat_completion = self.client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    model=model_name,
                    temperature=0.7,
                    max_tokens=250,
                )
                return chat_completion.choices[0].message.content.strip()
            except Exception as err:
                last_err = err
                continue

        raise last_err or RuntimeError("Failed to generate response from Groq")

class ContextualCompanionProvider(AIProvider):
    """
    Intelligent built-in companion ensuring 100% offline and zero-config reliability.
    Directly addresses Section 18 examples and user context dynamically.
    """
    def generate_response(self, prompt: str, user_context: Dict[str, Any]) -> str:
        p_lower = prompt.lower()
        streak = user_context.get("streak", 0)
        today_mins = user_context.get("today_minutes", 0)
        goal_mins = user_context.get("goal_minutes", 120)
        tree_level = user_context.get("tree_level", 1)
        tree_name = user_context.get("tree_name", "Seed")
        room_name = user_context.get("room_name")

        # Specific scenarios from Prompt.md Section 18
        if any(w in p_lower for w in ["don't feel like", "lazy", "tired", "unmotivated", "can't focus", "procrastinating"]):
            return (
                "Let's make it small. Start a 15-minute session. "
                "You only need to focus until the timer ends, and your tree will soak up every minute. 🌱"
            )

        if any(w in p_lower for w in ["studied for", "hours today", "minutes today", "finished", "done with session"]):
            return (
                f"That's fantastic work! You've logged {today_mins} minutes today towards your {goal_mins}m goal. "
                f"Your tree has reached Level {tree_level} ({tree_name}) and continues to flourish. 🍃"
            )

        if any(w in p_lower for w in ["streak", "how many days", "record"]):
            return (
                f"You're currently holding strong at a {streak}-day study streak! "
                "Consistency builds compound knowledge. Don't worry about perfection, just show up today."
            )

        if any(w in p_lower for w in ["tree", "leaves", "growth", "level"]):
            return (
                f"Your tree is currently a Level {tree_level} {tree_name} with vibrant foliage. "
                "Each 15-minute study block rewards your garden with fresh leaves and nourishment."
            )

        if any(w in p_lower for w in ["room", "group", "others", "people"]):
            if room_name:
                return f"You're currently in {room_name}. Seeing others show up daily reminds us we aren't alone on this journey. Take a deep breath and start when you're ready."
            return "Study rooms provide quiet shared accountability. You can join 'DSA Grind' or create your own private sanctuary whenever you'd like company."

        # Default supportive response
        return (
            f"I'm here with you for today's study journey. "
            f"You're at {today_mins}m / {goal_mins}m today with a {streak}-day streak. "
            "Would you like to start a 25-minute Pomodoro or dive into free study?"
        )

class CompanionManager:
    def __init__(self):
        self.reload_keys()

    def reload_keys(self):
        load_dotenv()
        self.gemini_key = os.getenv("GEMINI_API_KEY")
        self.groq_key = os.getenv("GROQ_API_KEY")

        if self.groq_key:
            self.provider = GroqProvider(self.groq_key)
            self.provider_name = "Groq AI"
        elif self.gemini_key:
            self.provider = GeminiProvider(self.gemini_key)
            self.provider_name = "Gemini 2.5"
        else:
            self.provider = ContextualCompanionProvider()
            self.provider_name = "XemStreak Companion (Built-in)"

    def get_reply(self, message: str, user_context: Dict[str, Any]) -> Dict[str, str]:
        # Refresh config in case key was updated
        if not hasattr(self, 'provider') or not self.provider:
            self.reload_keys()

        try:
            reply = self.provider.generate_response(message, user_context)
            return {"reply": reply, "provider": self.provider_name}
        except Exception as e:
            # Graceful fallback to ContextualCompanionProvider
            fallback = ContextualCompanionProvider()
            reply = fallback.generate_response(message, user_context)
            return {"reply": reply, "provider": "XemStreak Companion (Fallback)"}

companion_manager = CompanionManager()

