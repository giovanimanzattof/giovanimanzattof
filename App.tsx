
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Goal, ActivityLevel } from './types.ts';
import { generateMealPlan, getChatResponse, analyzeLabel } from './services/geminiService.ts';
import { UserIcon, PlateIcon, ChatBubbleLeftRightIcon, ChartBarIcon, SparklesIcon, CameraIcon, CheckIcon, HeartIcon, LeafIcon, TargetIcon, BrainCircuitIcon } from './components/icons.tsx';
import ProgressChart from './components/ProgressChart.tsx';

const e = React.createElement;

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

const PaywallModal = ({ onClose, onUpgrade }) => e('div', { className: "fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" },
    e('div', { className: "bg-white rounded-2xl shadow-xl p-8 max-w-md w-full transform transition-all animate-fade-in-up" },
        e('div', { className: "text-center" },
            e(SparklesIcon, { className: "w-12 h-12 text-yellow-500 mx-auto" }),
            e('h2', { className: "text-2xl font-bold text-green-800 mt-4" }, "Desbloqueie o Plano Premium"),
            e('p', { className: "mt-2 text-gray-600" }, "Tenha acesso total e transforme sua saúde com a ajuda da IA.")
        ),
        e('ul', { className: "mt-6 space-y-3 text-left" },
            [
                "Cardápio 100% personalizado e atualizado semanalmente.",
                "Consultas ilimitadas com a Nutricionista IA via chat.",
                "Relatórios de progresso com gráficos detalhados.",
                "Acesso ao exclusivo 'Coach de Hábitos Saudáveis IA'.",
                "Modo Viagem, Scanner de Rótulos e Desafios."
            ].map((feature) => e('li', { key: feature, className: "flex items-start" },
                e(CheckIcon, { className: "w-5 h-5 text-lime-600 flex-shrink-0 mr-3 mt-0.5" }),
                e('span', { className: "text-gray-700" }, feature)
            ))
        ),
        e('div', { className: "mt-8 text-center" },
            e('div', { className: "text-5xl font-extrabold text-green-800" },
                "R$ 29",
                e('span', { className: "text-3xl" }, ",90"),
                e('span', { className: "text-lg font-medium text-gray-500" }, "/mês")
            ),
            e('button', {
                onClick: onUpgrade,
                className: "mt-6 w-full px-8 py-4 bg-green-600 text-white font-bold rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 text-lg"
            }, "Pagar e Desbloquear Recursos"),
            e('button', {
                onClick: onClose,
                className: "mt-3 text-sm text-gray-500 hover:text-gray-700"
            }, "Agora não")
        )
    )
);

// =================================================================================
// New Landing Page Component
// =================================================================================

const AnimatedHero = () => e('div', { className: "relative w-full h-[400px] md:h-[500px] flex items-center justify-center" },
    e('span', { className: "absolute text-green-800 bg-lime-200/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm float-text-1", style: { top: '15%', left: '10%' } }, "Analisando perfil..."),
    e('span', { className: "absolute text-green-800 bg-lime-200/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm float-text-2", style: { top: '30%', right: '5%' } }, "Calculando calorias..."),
    e('span', { className: "absolute text-green-800 bg-lime-200/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm float-text-3", style: { bottom: '20%', left: '5%' } }, "Meta: Perder peso"),
    e('span', { className: "absolute text-green-800 bg-lime-200/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm float-text-4", style: { bottom: '10%', right: '15%' } }, "Gerando cardápio..."),
    e('div', { className: "absolute w-[200px] h-[200px] md:w-[300px] md:h-[300px] border-2 border-lime-400/50 rounded-full animate-spin-slow" }),
    e('div', { className: "absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px] border border-dashed border-lime-500/40 rounded-full animate-spin-reverse-slow" }),
    e('div', { className: "absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] border border-lime-600/30 rounded-full animate-spin-slower" }),
    e('div', { className: "relative w-32 h-32 md:w-40 md:h-40 bg-white/70 backdrop-blur-md rounded-full flex items-center justify-center animate-pulse-glow" },
        e(BrainCircuitIcon, { className: "w-20 h-20 md:w-24 md:h-24 text-lime-600" })
    )
);

const LandingPage = ({ onStart }) => e('div', { className: "bg-slate-900 text-white overflow-x-hidden" },
    e('div', { className: "absolute top-0 left-0 w-full h-full bg-grid-slate-800/40 [mask-image:linear-gradient(0deg,transparent,black)]" }),
    e('div', { className: "absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-950 via-slate-900 to-slate-900 opacity-80" }),
    e('nav', { className: "sticky top-0 z-40" },
        e('div', { className: "relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
            e('div', { className: "absolute inset-0 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50" }),
            e('div', { className: "relative flex items-center justify-between h-16" },
                e('div', { className: "flex items-center" },
                    e(LeafIcon, { className: "h-8 w-8 text-lime-500" }),
                    e('span', { className: "ml-2 text-2xl font-bold" }, "Nutricionista IA")
                ),
                e('button', { onClick: onStart, className: "px-5 py-2 bg-lime-600 text-white font-semibold rounded-full shadow-md hover:bg-lime-700 transition-all duration-300 transform hover:scale-105" }, "Começar Agora")
            )
        )
    ),
    e('main', { className: "relative" },
        e('section', { className: "text-center pt-20 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 lg:px-8" },
            e('h1', { className: "text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-slate-100 to-slate-400" }, "Conheça a Nutricionista IA."),
            e('h2', { className: "text-4xl md:text-6xl font-extrabold tracking-tight text-lime-400 mt-2" }, "Sua assistente para uma vida saudável."),
            e('p', { className: "mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-400" }, "A IA cria seu plano alimentar, acompanha seu progresso e responde suas dúvidas. Foque nos seus objetivos, nós cuidamos do planejamento."),
            e('button', { onClick: onStart, className: "mt-10 px-8 py-4 bg-lime-600 text-white font-bold rounded-full shadow-lg hover:bg-lime-700 transition-all duration-300 transform hover:scale-105 text-lg" }, "Criar meu plano personalizado"),
            e(AnimatedHero, null)
        ),
        e('section', { className: "py-20" },
            e('div', { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
                e('div', { className: "text-center" },
                    e('h2', { className: "text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-slate-100 to-slate-400" }, "Como funciona"),
                    e('p', { className: "mt-4 text-lg text-slate-400" }, "Sua jornada saudável em 3 passos simples.")
                ),
                e('div', { className: "mt-16 grid md:grid-cols-3 gap-8 text-center" },
                    e('div', { className: "border border-slate-800 bg-slate-900/50 p-8 rounded-2xl" },
                        e('div', { className: "text-4xl font-bold text-lime-500 mb-4" }, "1"),
                        e('h3', { className: "text-xl font-bold text-white mb-2" }, "Crie seu Perfil"),
                        e('p', { className: "text-slate-400" }, "Informe suas metas, preferências e restrições alimentares para uma personalização completa.")
                    ),
                    e('div', { className: "border border-slate-800 bg-slate-900/50 p-8 rounded-2xl" },
                        e('div', { className: "text-4xl font-bold text-lime-500 mb-4" }, "2"),
                        e('h3', { className: "text-xl font-bold text-white mb-2" }, "Receba seu Plano"),
                        e('p', { className: "text-slate-400" }, "Nossa IA gera um cardápio delicioso e balanceado, feito sob medida para você, todos os dias.")
                    ),
                    e('div', { className: "border border-slate-800 bg-slate-900/50 p-8 rounded-2xl" },
                        e('div', { className: "text-4xl font-bold text-lime-500 mb-4" }, "3"),
                        e('h3', { className: "text-xl font-bold text-white mb-2" }, "Atinga seus Objetivos"),
                        e('p', { className: "text-slate-400" }, "Acompanhe seu progresso, converse com a IA e ajuste seu plano a qualquer momento.")
                    )
                )
            )
        ),
        e('section', { className: "py-20" },
            e('div', { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" },
                e('blockquote', { className: "text-2xl md:text-3xl font-semibold text-white leading-snug" }, "“A Nutricionista IA mudou minha relação com a comida. É como ter um especialista no bolso o tempo todo, me dando a confiança que eu precisava para finalmente alcançar meus objetivos.”"),
                e('cite', { className: "mt-6 block font-semibold text-slate-300 not-italic" }, "- Ana Silva, Usuária Premium")
            )
        ),
        e('section', { id: "pricing", className: "py-20" },
            e('div', { className: "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center" },
                e('h2', { className: "text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-slate-100 to-slate-400" }, "Plano Premium"),
                e('p', { className: "mt-4 text-lg text-slate-400" }, "Acesso ilimitado a todos os recursos para acelerar seus resultados."),
                e('div', { className: "mt-10 border border-lime-500/50 bg-slate-900/50 rounded-2xl shadow-2xl shadow-lime-900/20 p-8 transform hover:scale-105 transition-transform duration-300" },
                    e('div', { className: "text-5xl font-extrabold text-white" },
                        "R$ 29",
                        e('span', { className: "text-3xl" }, ",90"),
                        e('span', { className: "text-lg font-medium text-slate-400" }, "/mês")
                    ),
                    e('ul', { className: "mt-8 space-y-4 text-left" },
                        [
                            "Cardápio 100% personalizado e atualizado semanalmente.",
                            "Consultas ilimitadas com a Nutricionista IA via chat.",
                            "Relatórios de progresso com gráficos detalhados.",
                            "Scanner de Rótulos e Análise de Alimentos.",
                            "Desafios e 'Coach de Hábitos Saudáveis'."
                        ].map((feature) => e('li', { key: feature, className: "flex items-start" },
                            e(CheckIcon, { className: "w-6 h-6 text-lime-500 flex-shrink-0 mr-3" }),
                            e('span', { className: "text-slate-300" }, feature)
                        ))
                    ),
                    e('button', { onClick: onStart, className: "mt-10 w-full px-8 py-4 bg-lime-600 text-white font-bold rounded-full shadow-lg hover:bg-lime-700 transition-colors duration-300 text-lg" }, "Quero ser Premium")
                )
            )
        ),
        e('section', { className: "text-center py-20 md:py-32 px-4 sm:px-6 lg:px-8" },
            e('h2', { className: "text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-slate-100 to-slate-400" }, "Comece sua jornada saudável hoje."),
            e('p', { className: "mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-400" }, "Cadastre-se gratuitamente e descubra como a inteligência artificial pode transformar sua vida."),
            e('button', { onClick: onStart, className: "mt-10 px-8 py-4 bg-white text-slate-900 font-bold rounded-full shadow-lg hover:bg-slate-200 transition-all duration-300 transform hover:scale-105 text-lg" }, "Começar Agora")
        )
    ),
    e('footer', { className: "border-t border-slate-800" },
        e('div', { className: "max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500" },
            e('p', null, `© ${new Date().getFullYear()} Nutricionista IA. Todos os direitos reservados.`)
        )
    )
);

// =================================================================================
// Onboarding Component
// =================================================================================

const ProfileSetup = ({ onProfileCreate }) => {
    const [profile, setProfile] = useState({
        sex: 'Feminino',
        activityLevel: ActivityLevel.LIGHT,
        goal: Goal.LOSE_WEIGHT,
        dietaryRestrictions: []
    });
    const [step, setStep] = useState(1);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: name === 'age' || name === 'weight' || name === 'height' ? Number(value) : value }));
    };

    const handleRestrictionChange = (e) => {
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
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onProfileCreate(profile);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return e('div', null,
                    e('h2', { className: "text-2xl font-bold text-green-800 mb-1" }, "Vamos começar!"),
                    e('p', { className: "text-gray-600 mb-6" }, "Conte-nos um pouco sobre você."),
                    e('div', { className: "space-y-4" },
                        e('div', null,
                            e('label', { className: "block text-sm font-medium text-gray-700" }, "Seu nome"),
                            e('input', { type: "text", name: "name", onChange: handleChange, className: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500", required: true })
                        ),
                        e('div', { className: "grid grid-cols-2 gap-4" },
                            e('div', null,
                                e('label', { className: "block text-sm font-medium text-gray-700" }, "Idade"),
                                e('input', { type: "number", name: "age", onChange: handleChange, className: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500", required: true })
                            ),
                            e('div', null,
                                e('label', { className: "block text-sm font-medium text-gray-700" }, "Sexo"),
                                e('select', { name: "sex", onChange: handleChange, value: profile.sex, className: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500" },
                                    e('option', null, "Feminino"),
                                    e('option', null, "Masculino")
                                )
                            )
                        ),
                        e('div', { className: "grid grid-cols-2 gap-4" },
                            e('div', null,
                                e('label', { className: "block text-sm font-medium text-gray-700" }, "Peso (kg)"),
                                e('input', { type: "number", name: "weight", step: "0.1", onChange: handleChange, className: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500", required: true })
                            ),
                            e('div', null,
                                e('label', { className: "block text-sm font-medium text-gray-700" }, "Altura (cm)"),
                                e('input', { type: "number", name: "height", onChange: handleChange, className: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500", required: true })
                            )
                        )
                    )
                );
            case 2:
                return e('div', null,
                    e('h2', { className: "text-2xl font-bold text-green-800 mb-1" }, "Qual é o seu objetivo?"),
                    e('p', { className: "text-gray-600 mb-6" }, "Isso nos ajuda a personalizar sua experiência."),
                    e('div', { className: "space-y-3" },
                        Object.values(Goal).map(goal => e('label', { key: goal, className: `flex items-center p-4 border rounded-lg cursor-pointer transition-all ${profile.goal === goal ? 'bg-lime-100 border-lime-500 ring-2 ring-lime-500' : 'bg-white hover:bg-lime-50'}` },
                            e('input', { type: "radio", name: "goal", value: goal, checked: profile.goal === goal, onChange: handleChange, className: "h-4 w-4 text-lime-600 border-gray-300 focus:ring-lime-500" }),
                            e('span', { className: "ml-3 text-gray-700 font-medium" }, goal)
                        ))
                    )
                );
            case 3:
                 return e('div', null,
                    e('h2', { className: "text-2xl font-bold text-green-800 mb-1" }, "Restrições e Preferências"),
                    e('p', { className: "text-gray-600 mb-6" }, "Marque o que se aplica a você."),
                    e('div', { className: "space-y-4" },
                        e('div', null,
                            e('label', { className: "block text-sm font-medium text-gray-700 mb-2" }, "Restrições Alimentares"),
                            e('div', { className: "grid grid-cols-2 gap-2" },
                                ['Sem Glúten', 'Sem Lactose', 'Vegetariano', 'Vegano'].map(item => e('label', { key: item, className: `flex items-center p-3 border rounded-lg cursor-pointer transition-all ${profile.dietaryRestrictions?.includes(item) ? 'bg-lime-100 border-lime-500 ring-2 ring-lime-500' : 'bg-white hover:bg-lime-50'}` },
                                    e('input', { type: "checkbox", value: item, onChange: handleRestrictionChange, checked: profile.dietaryRestrictions?.includes(item), className: "h-4 w-4 text-lime-600 border-gray-300 rounded focus:ring-lime-500" }),
                                    e('span', { className: "ml-2 text-sm text-gray-700" }, item)
                                ))
                            )
                        ),
                        e('div', null,
                            e('label', { className: "block text-sm font-medium text-gray-700" }, "Preferências ou Alergias"),
                            e('textarea', { name: "preferences", onChange: handleChange, rows: 3, className: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500", placeholder: "Ex: prefiro low carb, tenho alergia a amendoim..." })
                        )
                    )
                );
        }
    };
    
    return e('div', { className: "min-h-screen bg-yellow-50 flex items-center justify-center p-4" },
        e('div', { className: "max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-8" },
            e('div', { className: "text-center" },
                e('h1', { className: "text-3xl font-bold text-green-800" }, "Bem-vindo(a) ao"),
                e('h2', { className: "text-4xl font-extrabold text-lime-600" }, "Nutricionista IA")
            ),
            e('form', { onSubmit: handleSubmit },
                renderStep(),
                e('div', { className: "flex justify-between items-center mt-8" },
                    step > 1 ? e('button', { type: "button", onClick: () => setStep(s => s - 1), className: "text-sm font-medium text-gray-600 hover:text-gray-900" }, "Voltar") : e('div', null),
                    step < 3 && e('button', { type: "button", onClick: () => setStep(s => s + 1), className: "ml-auto px-6 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500" }, "Próximo"),
                    step === 3 && e('button', { type: "submit", className: "ml-auto w-full px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" }, "Criar meu Plano!")
                )
            )
        )
    );
};

// =================================================================================
// Main Application Component
// =================================================================================

const MealCard = ({ title, meal, icon }) => e('div', { className: "bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow" },
    e('h3', { className: "text-lg font-bold text-green-700 flex items-center mb-2" },
        e('span', { className: "text-2xl mr-2" }, icon),
        ` ${title}`
    ),
    e('p', { className: "font-semibold text-gray-800" }, meal.name),
    e('p', { className: "text-sm text-yellow-600 font-medium" }, `${meal.calories} kcal`),
    e('p', { className: "text-sm text-gray-600 mt-2" }, meal.description),
    e('div', { className: "mt-3" },
        e('p', { className: "text-xs font-bold text-gray-500" }, "Sugestões de troca:"),
        e('ul', { className: "list-disc list-inside text-xs text-gray-500 pl-2" },
            meal.substitutions.map((sub, i) => e('li', { key: i }, sub))
        )
    )
);

const MainApp = ({ userProfile, isPremium, onUpgrade }) => {
    const [view, setView] = useState('dashboard');
    const [mealPlan, setMealPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPaywall, setShowPaywall] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    const chatEndRef = useRef(null);
    const [labelScannerResult, setLabelScannerResult] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const fileInputRef = useRef(null);

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
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [userProfile, isPremium]);

    useEffect(() => { fetchMealPlan(); }, [fetchMealPlan]);
    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);
    
    const handleUpgrade = () => {
        onUpgrade();
        setShowPaywall(false);
    };

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!isPremium) {
            setShowPaywall(true);
            return;
        }
        if (!chatInput.trim() || isChatLoading) return;
        const newUserMessage = { role: 'user', content: chatInput };
        setChatMessages(prev => [...prev, newUserMessage]);
        setChatInput('');
        setIsChatLoading(true);
        try {
            const response = await getChatResponse([...chatMessages, newUserMessage], chatInput, userProfile);
            const modelMessage = { role: 'model', content: response };
            setChatMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            const errorMessage = { role: 'model', content: error.message };
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

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setIsScanning(true);
        setLabelScannerResult('Analisando imagem... 🧐');
        const reader = new FileReader();
        reader.onloadend = async () => {
            // FIX: Add a type guard to ensure reader.result is a string before calling .split().
            if (typeof reader.result === 'string') {
                const base64String = reader.result.split(',')[1];
                try {
                    const result = await analyzeLabel(base64String, file.type);
                    setLabelScannerResult(result);
                } catch (error) {
                    setLabelScannerResult(error.message);
                } finally {
                    setIsScanning(false);
                }
            } else {
                setLabelScannerResult("Não foi possível ler o arquivo de imagem.");
                setIsScanning(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const renderDashboard = () => e('div', { className: "p-4 md:p-6 space-y-6" },
        e('header', null,
            e('h1', { className: "text-3xl font-bold text-green-800" }, `${getGreeting()}, ${userProfile.name}!`),
            e('p', { className: "text-gray-600" }, "Pronto(a) para um dia mais saudável? ☀️")
        ),
        e('div', { className: "bg-gradient-to-r from-lime-500 to-green-500 text-white p-6 rounded-2xl shadow-lg flex items-center justify-between" },
            e('div', null,
                e('h2', { className: "text-xl font-bold" }, "Converse com sua Nutricionista IA"),
                e('p', { className: "text-sm opacity-90 mt-1" }, "Tire dúvidas, peça dicas e receba motivação!")
            ),
            e('button', { onClick: handleChatNavigation, className: "bg-white text-green-600 font-bold py-2 px-4 rounded-full shadow-md hover:bg-green-50 transition-colors flex items-center" },
                e(ChatBubbleLeftRightIcon, { className: "w-5 h-5 mr-2" }),
                "Conversar"
            )
        ),
        e('section', null,
            e('h2', { className: "text-2xl font-bold text-gray-800 mb-4 flex items-center" }, e(PlateIcon, { className: "w-6 h-6 mr-2 text-lime-600" }), " Meu Cardápio de Hoje"),
            loading && e('div', { className: "text-center p-8" }, "Carregando seu plano personalizado..."),
            error && e('div', { className: "text-center p-8 bg-white rounded-xl shadow-md" },
                e('p', { className: "text-red-500 mb-4 font-medium" }, error),
                e('button', { onClick: () => setShowPaywall(true), className: "px-6 py-2 bg-lime-600 text-white font-semibold rounded-full shadow-md hover:bg-lime-700 transition-transform transform hover:scale-105" }, "✨ Fazer Upgrade Agora")
            ),
            mealPlan && e('div', { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4" },
                e(MealCard, { title: "Café da Manhã", meal: mealPlan.breakfast, icon: "☕" }),
                e(MealCard, { title: "Lanche", meal: mealPlan.morning_snack, icon: "🍎" }),
                e(MealCard, { title: "Almoço", meal: mealPlan.lunch, icon: "🍽️" }),
                e(MealCard, { title: "Lanche da Tarde", meal: mealPlan.afternoon_snack, icon: "🍌" }),
                e(MealCard, { title: "Jantar", meal: mealPlan.dinner, icon: "🥗" }),
                e('div', { className: "bg-yellow-100 p-4 rounded-xl shadow-md flex flex-col justify-center items-center text-center" },
                    e('h3', { className: "text-lg font-bold text-yellow-800" }, "Dica do Dia ✨"),
                    e('p', { className: "text-sm text-yellow-700 mt-2" }, "Lembre-se de beber pelo menos 2L de água hoje! A hidratação é a chave para a energia. 💧")
                )
            )
        ),
        e('div', { className: "grid lg:grid-cols-2 gap-6" },
            e('section', null,
                e('h2', { className: "text-2xl font-bold text-gray-800 mb-4 flex items-center" }, e(ChartBarIcon, { className: "w-6 h-6 mr-2 text-lime-600" }), " Minha Evolução"),
                e('div', { className: "bg-white p-4 rounded-xl shadow-md" }, e(ProgressChart, null))
            ),
            e('section', null,
                e('h2', { className: "text-2xl font-bold text-gray-800 mb-4 flex items-center" }, e(SparklesIcon, { className: "w-6 h-6 mr-2 text-lime-600" }), " Ferramentas Extras"),
                e('div', { className: "space-y-4" },
                    e('div', { className: "bg-white p-4 rounded-xl shadow-md" },
                        e('h3', { className: "font-bold text-green-700" }, "Scanner de Rótulos 📸"),
                        e('p', { className: "text-sm text-gray-600 my-2" }, "Fotografe um rótulo e a IA te dirá se o alimento é saudável."),
                        e('input', { type: "file", accept: "image/*", ref: fileInputRef, onChange: handleFileChange, className: "hidden" }),
                        e('button', { onClick: handleScanClick, disabled: isScanning, className: "w-full bg-lime-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-lime-600 transition-colors disabled:bg-gray-400 flex items-center justify-center" },
                            e(CameraIcon, { className: "w-5 h-5 mr-2" }),
                            isScanning ? 'Analisando...' : 'Escanear Rótulo'
                        ),
                        labelScannerResult && e('div', { className: "mt-4 p-3 bg-lime-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap" }, labelScannerResult)
                    ),
                    e('div', { className: "bg-white p-4 rounded-xl shadow-md" },
                        e('h3', { className: "font-bold text-green-700" }, "Desafios Semanais 🔥"),
                        e('p', { className: "text-sm text-gray-600 my-2" }, "Participe de desafios e crie novos hábitos!"),
                        e('div', { className: "bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-3 rounded-md" },
                            e('p', { className: "font-bold" }, "Desafio Ativo: \"Sem Açúcar por 7 dias\""),
                            e('p', { className: "text-xs" }, "Você está no dia 3 de 7. Continue firme!")
                        )
                    )
                )
            )
        )
    );

    const renderChat = () => e('div', { className: "h-screen flex flex-col bg-white" },
        e('header', { className: "flex items-center p-4 border-b bg-lime-50" },
            e('button', { onClick: () => setView('dashboard'), className: "text-lime-700 hover:text-lime-900 mr-4" }, "← Voltar"),
            e('h1', { className: "text-xl font-bold text-green-800" }, "Nutricionista IA"),
            e(SparklesIcon, { className: "w-5 h-5 ml-2 text-yellow-500" })
        ),
        e('main', { className: "flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" },
            chatMessages.map((msg, index) => e('div', { key: index, className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}` },
                e('div', { className: `max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-lime-500 text-white rounded-br-none' : 'bg-white text-gray-800 border rounded-bl-none'}` }, msg.content)
            )),
            isChatLoading && e('div', { className: "flex justify-start" },
                e('div', { className: "max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl bg-white text-gray-800 border rounded-bl-none" },
                    e('div', { className: "flex items-center space-x-2" },
                        e('div', { className: "w-2 h-2 bg-gray-400 rounded-full animate-pulse" }),
                        e('div', { className: "w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75" }),
                        e('div', { className: "w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150" })
                    )
                )
            ),
            e('div', { ref: chatEndRef })
        ),
        e('footer', { className: "p-4 border-t bg-white" },
            e('form', { onSubmit: handleChatSubmit, className: "flex items-center" },
                e('input', {
                    type: "text",
                    value: chatInput,
                    onChange: (e) => setChatInput(e.target.value),
                    placeholder: "Digite sua mensagem...",
                    className: "flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-500",
                    disabled: isChatLoading
                }),
                e('button', { type: "submit", disabled: isChatLoading || !chatInput.trim(), className: "ml-3 bg-lime-600 text-white rounded-full p-3 hover:bg-lime-700 disabled:bg-gray-400 transition-colors" },
                    e('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6 transform rotate-90", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, e('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" }))
                )
            )
        )
    );

    return e('div', { className: "max-w-7xl mx-auto bg-green-50 min-h-screen" },
        showPaywall && e(PaywallModal, { onClose: () => setShowPaywall(false), onUpgrade: handleUpgrade }),
        view === 'dashboard' ? renderDashboard() : renderChat()
    );
};

// =================================================================================
// App Entry Point
// =================================================================================
const App = () => {
    const [appState, setAppState] = useState('landing');
    const [userProfile, setUserProfile] = useState(null);
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

    const handleProfileCreate = (profile) => {
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
        return e('div', { className: "min-h-screen flex items-center justify-center bg-green-50" }, "Carregando...");
    }

    const startFlow = () => setShowInitialPaywall(true);
    
    const renderLanding = () => e(React.Fragment, null,
        e(LandingPage, { onStart: startFlow }),
        showInitialPaywall && e(PaywallModal, { onClose: () => setShowInitialPaywall(false), onUpgrade: handleStartOnboarding })
    );

    switch (appState) {
        case 'landing':
            return renderLanding();
        case 'onboarding':
            return e(ProfileSetup, { onProfileCreate: handleProfileCreate });
        case 'app':
            if (userProfile) {
                return e(MainApp, { userProfile: userProfile, isPremium: isPremium, onUpgrade: handlePremiumUpgrade });
            }
            return renderLanding();
        default:
             return renderLanding();
    }
}

export default App;
