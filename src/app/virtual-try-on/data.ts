import { Background, Model, Prompt } from './types';

export const backgrounds: Background[] = [
  { id: "studio", name: "Studio", preview: "bg-gradient-to-br from-gray-100 to-gray-200" },
  { id: "outdoor", name: "Outdoor", preview: "bg-gradient-to-br from-green-100 to-blue-200" },
  { id: "beach", name: "Beach", preview: "bg-gradient-to-br from-yellow-100 to-blue-300" },
  { id: "urban", name: "Urban", preview: "bg-gradient-to-br from-gray-300 to-slate-400" },
  { id: "sunset", name: "Sunset", preview: "bg-gradient-to-br from-orange-200 to-red-300" },
  { id: "forest", name: "Forest", preview: "bg-gradient-to-br from-green-200 to-green-400" },
  { id: "desert", name: "Desert", preview: "bg-gradient-to-br from-yellow-200 to-orange-300" },
  { id: "arctic", name: "Arctic", preview: "bg-gradient-to-br from-blue-100 to-cyan-200" },
  { id: "nightclub", name: "Nightclub", preview: "bg-gradient-to-br from-purple-300 to-pink-400" },
  { id: "office", name: "Office", preview: "bg-gradient-to-br from-blue-100 to-gray-200" },
  { id: "cafe", name: "Cafe", preview: "bg-gradient-to-br from-amber-100 to-orange-200" },
  { id: "gym", name: "Gym", preview: "bg-gradient-to-br from-red-100 to-red-200" },
  { id: "rooftop", name: "Rooftop", preview: "bg-gradient-to-br from-indigo-200 to-purple-300" },
  { id: "garden", name: "Garden", preview: "bg-gradient-to-br from-emerald-100 to-green-200" },
  { id: "industrial", name: "Industrial", preview: "bg-gradient-to-br from-gray-400 to-zinc-500" }
];

export const models: Model[] = [
  { id: "default", name: "Default Model", avatar: "👤" },
  { id: "athletic", name: "Athletic", avatar: "🏃" },
  { id: "casual", name: "Casual", avatar: "👕" },
  { id: "formal", name: "Formal", avatar: "👔" },
  { id: "female", name: "Female Model", avatar: "👩" },
  { id: "male", name: "Male Model", avatar: "👨" },
  { id: "young", name: "Young Adult", avatar: "🧑" },
  { id: "mature", name: "Mature Adult", avatar: "👴" },
  { id: "plus-size", name: "Plus Size", avatar: "🧑‍🦲" },
  { id: "tall", name: "Tall Model", avatar: "🧍" },
  { id: "petite", name: "Petite Model", avatar: "🙋" },
  { id: "dancer", name: "Dancer", avatar: "💃" },
  { id: "business", name: "Business Pro", avatar: "👩‍💼" },
  { id: "student", name: "Student", avatar: "🧑‍🎓" },
  { id: "artist", name: "Artist", avatar: "🧑‍🎨" },
  { id: "fitness", name: "Fitness Model", avatar: "🏋️" },
  { id: "trendy", name: "Trendy Model", avatar: "🕺" },
  { id: "classic", name: "Classic Model", avatar: "👩‍🦳" }
];

export const prompts: Prompt[] = [
  { id: "casual", name: "Casual Wear", description: "Comfortable everyday clothing" },
  { id: "formal", name: "Formal Attire", description: "Professional business wear" },
  { id: "summer", name: "Summer Style", description: "Light, breathable fabrics" },
  { id: "winter", name: "Winter Collection", description: "Warm, layered clothing" }
]; 