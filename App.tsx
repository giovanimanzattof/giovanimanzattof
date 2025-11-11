import React, { useState, useEffect, useRef, useCallback } from 'react';
import { UserProfile, Goal, ActivityLevel, MealPlan, ChatMessage } from './types';
import { generateMealPlan, getChatResponse, analyzeLabel } from './services/geminiService';
import { UserIcon, PlateIcon, ChatBubbleLeftRightIcon, ChartBarIcon, SparklesIcon, CameraIcon, CheckIcon, HeartIcon, LeafIcon, TargetIcon, BrainCircuitIcon } from './components/icons';
import ProgressChart from './components/ProgressChart';

// =================================================================================
// Helper Components & Functions
// =================================================================================

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
};

// =================================================================================
// Paywall Modal Component
// =================================================================================

const PaywallModal: React.FC<{ onClose: () => void; onUpgrade: () => void; }> = ({ onClose, onUpgrade }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full transform transition-all animate-fade-in-up">
            <div className="text-center">
                <SparklesIcon className="w-12 h-12 text-yellow-500 mx-auto" />
                <h2 className="text-2xl font-bold text-green-800 mt-4">Desbloqueie o Plano Premium</h2>
                <p className="mt-2 text-gray-600">Tenha acesso total e transforme sua saúde com a ajuda da IA.</p>
            </div>
            <ul className="mt-6 space-y-3 text-left">
                {[
                    "Cardápio 100% personalizado e atualizado semanalmente.",
                    "Consultas ilimitadas com a Nutricionista IA via chat.",
                    "Relatórios de progresso com gráficos detalhados.",
                    "Acesso ao exclusivo 'Coach de Hábitos Saudáveis IA'.",
                    "Modo Viagem, Scanner de Rótulos e Desafios."
                ].map((feature) => (
                    <li key={feature} className="flex items-start">
                        <CheckIcon className="w-5 h-5 text-lime-600 flex-shrink-0 mr-3 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                    </li>
                ))}
            </ul>
            <div className="mt-8 text-center">
                 <div className="text-5xl font-extrabold text-green-800">
                    R$ 29<span className="text-3xl">,90</span><span className="text-lg font-medium text-gray-500">/mês</span>
                </div>
                <button 
                    onClick={onUpgrade} 
                    className="mt-6 w-full px-8 py-4 bg-green-600 text-white font-bold rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 text-lg"
                >
                    Pagar e Desbloquear Recursos
                </button>
                <button 
                    onClick={onClose} 
                    className="mt-3 text-sm text-gray-500 hover:text-gray-700"
                >
                    Agora não
                </button>
            </div>
        </div>
    </div>
);

// =================================================================================
// New Landing Page Component (cal.com/ai inspired)
// =================================================================================

const AnimatedHero: React.FC = () => (
    <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center">
        {/* Floating text elements */}
        <span className="absolute text-green-800 bg-lime-200/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm float-text-1" style={{ top: '15%', left: '10%' }}>Analisando perfil...</span>
        <span className="absolute text-green-800 bg-lime-200/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm float-text-2" style={{ top: '30%', right: '5%' }}>Calculando calorias...</span>
        <span className="absolute text-green-800 bg-lime-200/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm float-text-3" style={{ bottom: '20%', left: '5%' }}>Meta: Perder peso</span>
        <span className="absolute text-green-800 bg-lime-200/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm float-text-4" style={{ bottom: '10%', right: '15%' }}>Gerando cardápio...</span>

        {/* Animated rings */}
        <div className="absolute w-[200px] h-[200px] md:w-[300px] md:h-[300px] border-2 border-lime-400/50 rounded-full animate-spin-slow"></div>
        <div className="absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px] border border-dashed border-lime-500/40 rounded-full animate-spin-reverse-slow"></div>
        <div className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] border border-lime-600/30 rounded-full animate-spin-slower"></div>

        {/* Central Core */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white/70 backdrop-blur-md rounded-full flex items-center justify-center animate-pulse-glow">
            <BrainCircuitIcon className="w-20 h-20 md:w-24 md:h-24 text-lime-600" />
        </div>
    </div>
);

const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => {
    return (
        <div className="bg-slate-900 text-white overflow-x-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-800/40 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-950 via-slate-900 to-slate-900 opacity-80"></div>
            
            <nav className="sticky top-0 z-40">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50"></div>
                    <div className="relative flex items-center justify-between h-16">
                        <div className="flex items-center">
                             <LeafIcon className="h-8 w-8 text-lime-500" />
                             <span className="ml-2 text-2xl font-bold">Nutricionista IA</span>
                        </div>
                         <button onClick={onStart} className="px-5 py-2 bg-lime-600 text-white font-semibold rounded-full shadow-md hover:bg-lime-700 transition-all duration-300 transform hover:scale-105">
                            Começar Agora
                        </button>
                    </div>
                </div>
            </nav>

            <main className="relative">
                {/* Hero Section */}
                <section className="text-center pt-20 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-slate-100 to-slate-400">
                        Conheça a Nutricionista IA.
                    </h1>
                     <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-lime-400 mt-2">Sua assistente para uma vida saudável.</h2>
                    <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-400">
                        A IA cria seu plano alimentar, acompanha seu progresso e responde suas dúvidas. Foque nos seus objetivos, nós cuidamos do planejamento.
                    </p>
                    <button onClick={onStart} className="mt-10 px-8 py-4 bg-lime-600 text-white font-bold rounded-full shadow-lg hover:bg-lime-700 transition-all duration-300 transform hover:scale-105 text-lg">
                        Criar meu plano personalizado
                    </button>
                    <AnimatedHero />
                </section>
                
                {/* How it works */}
                 <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-slate-100 to-slate-400">Como funciona</h2>
                             <p className="mt-4 text-lg text-slate-400">Sua jornada saudável em 3 passos simples.</p>
                        </div>
                        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
                            <div className="border border-slate-800 bg-slate-900/50 p-8 rounded-2xl">
                                <div className="text-4xl font-bold text-lime-500 mb-4">1</div>
                                <h3 className="text-xl font-bold text-white mb-2">Crie seu Perfil</h3>
                                <p className="text-slate-400">Informe suas metas, preferências e restrições alimentares para uma personalização completa.</p>
                            </div>
                            <div className="border border-slate-800 bg-slate-900/50 p-8 rounded-2xl">
                                <div className="text-4xl font-bold text-lime-500 mb-4">2</div>
                                <h3 className="text-xl font-bold text-white mb-2">Receba seu Plano</h3>
                                <p className="text-slate-400">Nossa IA gera um cardápio delicioso e balanceado, feito sob medida para você, todos os dias.</p>
                            </div>
                            <div className="border border-slate-800 bg-slate-900/50 p-8 rounded-2xl">
                                <div className="text-4xl font-bold text-lime-500 mb-4">3</div>
                                <h3 className="text-xl font-bold text-white mb-2">Atinga seus Objetivos</h3>
                                <p className="text-slate-400">Acompanhe seu progresso, converse com a IA e ajuste seu plano a qualquer momento.</p>
                            </div>
                        </div>
                    </div>
                 </section>

                {/* Testimonial Section */}
                <section className="py-20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <blockquote className="text-2xl md:text-3xl font-semibold text-white leading-snug">
                            “A Nutricionista IA mudou minha relação com a comida. É como ter um especialista no bolso o tempo todo, me dando a confiança que eu precisava para finalmente alcançar meus objetivos.”
                        </blockquote>
                        <cite className="mt-6 block font-semibold text-slate-300 not-italic">
                            - Ana Silva, Usuária Premium
                        </cite>
                    </div>
                </section>
                
                {/* Pricing Section */}
                <section id="pricing" className="py-20">
                    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-slate-100 to-slate-400">Plano Premium</h2>
                        <p className="mt-4 text-lg text-slate-400">Acesso ilimitado a todos os recursos para acelerar seus resultados.</p>
                        <div className="mt-10 border border-lime-500/50 bg-slate-900/50 rounded-2xl shadow-2xl shadow-lime-900/20 p-8 transform hover:scale-105 transition-transform duration-300">
                             <div className="text-5xl font-extrabold text-white">
                                R$ 29<span className="text-3xl">,90</span><span className="text-lg font-medium text-slate-400">/mês</span>
                            </div>
                             <ul className="mt-8 space-y-4 text-left">
                                {[
                                    "Cardápio 100% personalizado e atualizado semanalmente.",
                                    "Consultas ilimitadas com a Nutricionista IA via chat.",
                                    "Relatórios de progresso com gráficos detalhados.",
                                    "Scanner de Rótulos e Análise de Alimentos.",
                                    "Desafios e 'Coach de Hábitos Saudáveis'."
                                ].map((feature) => (
                                    <li key={feature} className="flex items-start">
                                        <CheckIcon className="w-6 h-6 text-lime-500 flex-shrink-0 mr-3" />
                                        <span className="text-slate-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button onClick={onStart} className="mt-10 w-full px-8 py-4 bg-lime-600 text-white font-bold rounded-full shadow-lg hover:bg-lime-700 transition-colors duration-300 text-lg">
                                Quero ser Premium
                            </button>
                        </div>
                    </div>
                </section>

                 {/* Final CTA */}
                <section className="text-center py-20 md:py-32 px-4 sm:px-6 lg:px-8">
                     <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-slate-100 to-slate-400">
                        Comece sua jornada saudável hoje.
                    </h2>
                     <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-400">
                        Cadastre-se gratuitamente e descubra como a inteligência artificial pode transformar sua vida.
                    </p>
                    <button onClick={onStart} className="mt-10 px-8 py-4 bg-white text-slate-900 font-bold rounded-full shadow-lg hover:bg-slate-200 transition-all duration-300 transform hover:scale-105 text-lg">
                        Começar Agora
                    </button>
                </section>
            </main>

            <footer className="border-t border-slate-800">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} Nutricionista IA. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
};


// =================================================================================
// Onboarding Component
// =================================================================================

const ProfileSetup: React.FC<{ onProfileCreate: (profile: UserProfile) => void }> = ({ onProfileCreate }) => {
    const [profile, setProfile] = useState<Partial<UserProfile>>({
        sex: 'Feminino',
        activityLevel: ActivityLevel.LIGHT,
        goal: Goal.LOSE_WEIGHT,
        dietaryRestrictions: []
    });
    const [step, setStep] = useState(1);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: name === 'age' || name === 'weight' || name === 'height' ? Number(value) : value }));
    };

    const handleRestrictionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setProfile(prev => {
            const current = prev.dietaryRestrictions || [];
            if (checked) {
                return { ...prev, dietaryRestrictions: [...current, value] };
            } else {
                return { ...prev, dietaryRestrictions: current.filter(item => item !== value) };
            }
        });
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onProfileCreate(profile as UserProfile);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-green-800 mb-1">Vamos começar!</h2>
                        <p className="text-gray-600 mb-6">Conte-nos um pouco sobre você.</p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Seu nome</label>
                                <input type="text" name="name" onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Idade</label>
                                    <input type="number" name="age" onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Sexo</label>
                                    <select name="sex" onChange={handleChange} value={profile.sex} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500">
                                        <option>Feminino</option>
                                        <option>Masculino</option>
                                    </select>
                                </div>
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Peso (kg)</label>
                                    <input type="number" name="weight" step="0.1" onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Altura (cm)</label>
                                    <input type="number" name="height" onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500" required />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                     <div>
                        <h2 className="text-2xl font-bold text-green-800 mb-1">Qual é o seu objetivo?</h2>
                        <p className="text-gray-600 mb-6">Isso nos ajuda a personalizar sua experiência.</p>
                        <div className="space-y-3">
                            {Object.values(Goal).map(goal => (
                                <label key={goal} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${profile.goal === goal ? 'bg-lime-100 border-lime-500 ring-2 ring-lime-500' : 'bg-white hover:bg-lime-50'}`}>
                                    <input type="radio" name="goal" value={goal} checked={profile.goal === goal} onChange={handleChange} className="h-4 w-4 text-lime-600 border-gray-300 focus:ring-lime-500" />
                                    <span className="ml-3 text-gray-700 font-medium">{goal}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );
            case 3:
                 return (
                    <div>
                        <h2 className="text-2xl font-bold text-green-800 mb-1">Restrições e Preferências</h2>
                        <p className="text-gray-600 mb-6">Marque o que se aplica a você.</p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Restrições Alimentares</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Sem Glúten', 'Sem Lactose', 'Vegetariano', 'Vegano'].map(item => (
                                        <label key={item} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${profile.dietaryRestrictions?.includes(item) ? 'bg-lime-100 border-lime-500 ring-2 ring-lime-500' : 'bg-white hover:bg-lime-50'}`}>
                                            <input type="checkbox" value={item} onChange={handleRestrictionChange} checked={profile.dietaryRestrictions?.includes(item)} className="h-4 w-4 text-lime-600 border-gray-300 rounded focus:ring-lime-500" />
                                            <span className="ml-2 text-sm text-gray-700">{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Preferências ou Alergias</label>
                                <textarea name="preferences" onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500" placeholder="Ex: prefiro low carb, tenho alergia a amendoim..."></textarea>
                            </div>
                        </div>
                    </div>
                );
        }
    };
    
    return (
        <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-green-800">Bem-vindo(a) ao</h1>
                    <h2 className="text-4xl font-extrabold text-lime-600">Nutricionista IA</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    {renderStep()}
                    <div className="flex justify-between items-center mt-8">
                        {step > 1 ? (
                           <button type="button" onClick={() => setStep(s => s - 1)} className="text-sm font-medium text-gray-600 hover:text-gray-900">Voltar</button>
                        ) : <div />}
                        {step < 3 && <button type="button" onClick={() => setStep(s => s + 1)} className="ml-auto px-6 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500">Próximo</button>}
                        {step === 3 && <button type="submit" className="ml-auto w-full px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Criar meu Plano!</button>}
                    </div>
                </form>
            </div>
        </div>
    );
};

// =================================================================================
// Main Application Component (Dashboard, Chat, etc.)
// =================================================================================

const MealCard: React.FC<{ title: string; meal: MealPlan[keyof MealPlan]; icon: string }> = ({ title, meal, icon }) => (
    <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-bold text-green-700 flex items-center mb-2">
            <span className="text-2xl mr-2">{icon}</span> {title}
        </h3>
        <p className="font-semibold text-gray-800">{meal.name}</p>
        <p className="text-sm text-yellow-600 font-medium">{meal.calories} kcal</p>
        <p className="text-sm text-gray-600 mt-2">{meal.description}</p>
        <div className="mt-3">
            <p className="text-xs font-bold text-gray-500">Sugestões de troca:</p>
            <ul className="list-disc list-inside text-xs text-gray-500 pl-2">
                {meal.substitutions.map((sub, i) => <li key={i}>{sub}</li>)}
            </ul>
        </div>
    </div>
);

interface MainAppProps {
    userProfile: UserProfile;
    isPremium: boolean;
    onUpgrade: () => void;
}

const MainApp: React.FC<MainAppProps> = ({ userProfile, isPremium, onUpgrade }) => {
    const [view, setView] = useState<'dashboard' | 'chat'>('dashboard');
    const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPaywall, setShowPaywall] = useState(false);

    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const [labelScannerResult, setLabelScannerResult] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchMealPlan = useCallback(async () => {
        if (!userProfile) return;
        setLoading(true);
        setError(null);

        if (!isPremium) {
            setError("Assine o plano Premium para gerar seu cardápio personalizado.");
            setLoading(false);
            return;
        }

        try {
            const plan = await generateMealPlan(userProfile);
            setMealPlan(plan);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [userProfile, isPremium]);

    useEffect(() => {
        fetchMealPlan();
    }, [fetchMealPlan]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);
    
    const handleUpgrade = () => {
        onUpgrade();
        setShowPaywall(false);
    };

    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isPremium) {
            setShowPaywall(true);
            return;
        }

        if (!chatInput.trim() || isChatLoading) return;

        const newUserMessage: ChatMessage = { role: 'user', content: chatInput };
        setChatMessages(prev => [...prev, newUserMessage]);
        setChatInput('');
        setIsChatLoading(true);

        try {
            const response = await getChatResponse([...chatMessages, newUserMessage], chatInput, userProfile);
            const modelMessage: ChatMessage = { role: 'model', content: response };
            setChatMessages(prev => [...prev, modelMessage]);
        } catch (error: any) {
            const errorMessage: ChatMessage = { role: 'model', content: error.message };
            setChatMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsChatLoading(false);
        }
    };
    
    const handleChatNavigation = () => {
        if (!isPremium) {
            setShowPaywall(true);
            return;
        }
        setView('chat');
    };

    const handleScanClick = () => {
        if (!isPremium) {
            setShowPaywall(true);
            return;
        }
        fileInputRef.current?.click();
    };


    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsScanning(true);
        setLabelScannerResult('Analisando imagem... 🧐');

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = (reader.result as string).split(',')[1];
            try {
                const result = await analyzeLabel(base64String, file.type);
                setLabelScannerResult(result);
            } catch (error: any) {
                setLabelScannerResult(error.message);
            } finally {
                setIsScanning(false);
            }
        };
        reader.readAsDataURL(file);
    };


    const renderDashboard = () => (
        <div className="p-4 md:p-6 space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-green-800">{getGreeting()}, {userProfile.name}!</h1>
                <p className="text-gray-600">Pronto(a) para um dia mais saudável? ☀️</p>
            </header>

            <div className="bg-gradient-to-r from-lime-500 to-green-500 text-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">Converse com sua Nutricionista IA</h2>
                    <p className="text-sm opacity-90 mt-1">Tire dúvidas, peça dicas e receba motivação!</p>
                </div>
                 <button onClick={handleChatNavigation} className="bg-white text-green-600 font-bold py-2 px-4 rounded-full shadow-md hover:bg-green-50 transition-colors flex items-center">
                    <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2"/>
                    Conversar
                 </button>
            </div>

            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><PlateIcon className="w-6 h-6 mr-2 text-lime-600" /> Meu Cardápio de Hoje</h2>
                {loading && <div className="text-center p-8">Carregando seu plano personalizado...</div>}
                {error && (
                    <div className="text-center p-8 bg-white rounded-xl shadow-md">
                        <p className="text-red-500 mb-4 font-medium">{error}</p>
                        <button onClick={() => setShowPaywall(true)} className="px-6 py-2 bg-lime-600 text-white font-semibold rounded-full shadow-md hover:bg-lime-700 transition-transform transform hover:scale-105">
                            ✨ Fazer Upgrade Agora
                        </button>
                    </div>
                )}
                {mealPlan && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <MealCard title="Café da Manhã" meal={mealPlan.breakfast} icon="☕" />
                        <MealCard title="Lanche" meal={mealPlan.morning_snack} icon="🍎" />
                        <MealCard title="Almoço" meal={mealPlan.lunch} icon="🍽️" />
                        <MealCard title="Lanche da Tarde" meal={mealPlan.afternoon_snack} icon="🍌" />
                        <MealCard title="Jantar" meal={mealPlan.dinner} icon="🥗" />
                         <div className="bg-yellow-100 p-4 rounded-xl shadow-md flex flex-col justify-center items-center text-center">
                            <h3 className="text-lg font-bold text-yellow-800">Dica do Dia ✨</h3>
                            <p className="text-sm text-yellow-700 mt-2">Lembre-se de beber pelo menos 2L de água hoje! A hidratação é a chave para a energia. 💧</p>
                        </div>
                    </div>
                )}
            </section>
            
            <div className="grid lg:grid-cols-2 gap-6">
                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><ChartBarIcon className="w-6 h-6 mr-2 text-lime-600" /> Minha Evolução</h2>
                    <div className="bg-white p-4 rounded-xl shadow-md">
                        <ProgressChart />
                    </div>
                </section>
                 <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><SparklesIcon className="w-6 h-6 mr-2 text-lime-600" /> Ferramentas Extras</h2>
                     <div className="space-y-4">
                        <div className="bg-white p-4 rounded-xl shadow-md">
                            <h3 className="font-bold text-green-700">Scanner de Rótulos 📸</h3>
                            <p className="text-sm text-gray-600 my-2">Fotografe um rótulo e a IA te dirá se o alimento é saudável.</p>
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                            <button onClick={handleScanClick} disabled={isScanning} className="w-full bg-lime-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-lime-600 transition-colors disabled:bg-gray-400 flex items-center justify-center">
                                <CameraIcon className="w-5 h-5 mr-2" />
                                {isScanning ? 'Analisando...' : 'Escanear Rótulo'}
                            </button>
                            {labelScannerResult && (
                                <div className="mt-4 p-3 bg-lime-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">{labelScannerResult}</div>
                            )}
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-md">
                            <h3 className="font-bold text-green-700">Desafios Semanais 🔥</h3>
                            <p className="text-sm text-gray-600 my-2">Participe de desafios e crie novos hábitos!</p>
                             <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-3 rounded-md">
                                <p className="font-bold">Desafio Ativo: "Sem Açúcar por 7 dias"</p>
                                <p className="text-xs">Você está no dia 3 de 7. Continue firme!</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );

    const renderChat = () => (
         <div className="h-screen flex flex-col bg-white">
            <header className="flex items-center p-4 border-b bg-lime-50">
                <button onClick={() => setView('dashboard')} className="text-lime-700 hover:text-lime-900 mr-4">&larr; Voltar</button>
                <h1 className="text-xl font-bold text-green-800">Nutricionista IA</h1>
                <SparklesIcon className="w-5 h-5 ml-2 text-yellow-500"/>
            </header>
            <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {chatMessages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-lime-500 text-white rounded-br-none' : 'bg-white text-gray-800 border rounded-bl-none'}`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isChatLoading && (
                    <div className="flex justify-start">
                         <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl bg-white text-gray-800 border rounded-bl-none">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                            </div>
                         </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </main>
            <footer className="p-4 border-t bg-white">
                <form onSubmit={handleChatSubmit} className="flex items-center">
                    <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-500"
                        disabled={isChatLoading}
                    />
                    <button type="submit" disabled={isChatLoading || !chatInput.trim()} className="ml-3 bg-lime-600 text-white rounded-full p-3 hover:bg-lime-700 disabled:bg-gray-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </button>
                </form>
            </footer>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto bg-green-50 min-h-screen">
             {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} onUpgrade={handleUpgrade} />}
             {view === 'dashboard' ? renderDashboard() : renderChat()}
        </div>
    );
};

// =================================================================================
// App Entry Point
// =================================================================================
const App: React.FC = () => {
    type AppState = 'landing' | 'onboarding' | 'app';
    const [appState, setAppState] = useState<AppState>('landing');
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isPremium, setIsPremium] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [showInitialPaywall, setShowInitialPaywall] = useState(false);

    useEffect(() => {
        try {
            const savedProfile = localStorage.getItem('nutricionistaIAProfile');
            const savedPremium = localStorage.getItem('nutricionistaIAPremium');
            if (savedProfile) {
                setUserProfile(JSON.parse(savedProfile));
                if (savedPremium === 'true') {
                    setIsPremium(true);
                }
                setAppState('app');
            } else {
                setAppState('landing');
            }
        } catch (error) {
            console.error("Failed to parse user profile from localStorage", error);
            setAppState('landing');
        } finally {
            setIsInitializing(false);
        }
    }, []);

    const handleProfileCreate = (profile: UserProfile) => {
        try {
            localStorage.setItem('nutricionistaIAProfile', JSON.stringify(profile));
            setUserProfile(profile);
            setAppState('app');
        } catch (error) {
            console.error("Failed to save user profile to localStorage", error);
        }
    };
    
    const handlePremiumUpgrade = () => {
        try {
            localStorage.setItem('nutricionistaIAPremium', 'true');
            setIsPremium(true);
        } catch (error) {
            console.error("Failed to save premium status to localStorage", error);
        }
    };
    
    const handleStartOnboarding = () => {
        handlePremiumUpgrade();
        setShowInitialPaywall(false);
        setAppState('onboarding');
    };

    if (isInitializing) {
        return <div className="min-h-screen flex items-center justify-center bg-green-50">Carregando...</div>;
    }

    const startFlow = () => setShowInitialPaywall(true);

    switch (appState) {
        case 'landing':
            return (
                <>
                    <LandingPage onStart={startFlow} />
                    {showInitialPaywall && <PaywallModal onClose={() => setShowInitialPaywall(false)} onUpgrade={handleStartOnboarding} />}
                </>
            );
        case 'onboarding':
            return <ProfileSetup onProfileCreate={handleProfileCreate} />;
        case 'app':
            if (userProfile) {
                return <MainApp userProfile={userProfile} isPremium={isPremium} onUpgrade={handlePremiumUpgrade} />;
            }
            // Fallback if app state is inconsistent
            return (
                 <>
                    <LandingPage onStart={startFlow} />
                    {showInitialPaywall && <PaywallModal onClose={() => setShowInitialPaywall(false)} onUpgrade={handleStartOnboarding} />}
                </>
            );
        default:
             return (
                 <>
                    <LandingPage onStart={startFlow} />
                    {showInitialPaywall && <PaywallModal onClose={() => setShowInitialPaywall(false)} onUpgrade={handleStartOnboarding} />}
                </>
            );
    }
}


export default App;
