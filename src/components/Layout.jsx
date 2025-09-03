import React, { useState, useEffect, createContext, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User as UserEntity, ConviteUsuario } from "@/entities/all";
import { Home, Target, Package, Trophy, Activity, BarChart3, TrendingUp, User, Settings, Users, LogOut, Megaphone, Store, Calendar, Menu, X, Sun, Moon, ChevronsLeft, ChevronsRight, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const SidebarContext = React.createContext();

const useSidebar = () => React.useContext(SidebarContext);

const SidebarProvider = ({ children }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <SidebarContext.Provider value={{ isExpanded, setIsExpanded, isMobileOpen, setIsMobileOpen }}>
            {children}
        </SidebarContext.Provider>
    );
};

const baseNavigationItems = [
    { name: "Home", href: createPageUrl("Home"), icon: Home },
    { name: "Comunidade", href: createPageUrl("Comunidade"), icon: Users },
];

const userNavigationItems = [
    { name: "Home", href: createPageUrl("Home"), icon: Home },
    { name: "Dashboard", href: createPageUrl("Dashboard"), icon: BarChart3 },
    { name: "Acervo", href: createPageUrl("Acervo"), icon: Package },
    { name: "Atividades", href: createPageUrl("Atividades"), icon: Activity },
    { name: "Resultados", href: createPageUrl("Resultados"), icon: Trophy },
    { name: "Análise de Desempenho", href: createPageUrl("Analise"), icon: TrendingUp },
    { name: "Perfil", href: createPageUrl("Perfil"), icon: User },
    { name: "Comunidade", href: createPageUrl("Comunidade"), icon: Users },
];

const adminNavigationItems = [
    { name: "Gerenciar", href: createPageUrl("Gerenciar"), icon: Settings },
    { name: "Gerenciar Usuários", href: createPageUrl("GerenciarUsuarios"), icon: Users },
];

const parceiroNavigationItems = [
    { name: "Gerenciar", href: createPageUrl("Gerenciar"), icon: Settings },
];

function Sidebar({ className }) {
    const { isExpanded, setIsExpanded, isMobileOpen, setIsMobileOpen } = useSidebar();
    const { navigationItems, user, handleLogout, isLoggingOut } = useLayoutData();

    return (
        <>
            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden ${isMobileOpen ? 'block' : 'hidden'}`} onClick={() => setIsMobileOpen(false)}></div>
            <aside className={`fixed top-0 left-0 h-full bg-white z-40 w-64 transform transition-transform md:hidden ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <SidebarContent user={user} navigationItems={navigationItems} handleLogout={handleLogout} isLoggingOut={isLoggingOut} />
            </aside>

            {/* Desktop Sidebar */}
            <aside className={`hidden md:flex flex-col ${isExpanded ? 'w-64' : 'w-20'} transition-all duration-300 ${className}`}>
                <SidebarContent user={user} navigationItems={navigationItems} handleLogout={handleLogout} isLoggingOut={isLoggingOut} />
            </aside>
        </>
    );
}

function SidebarContent({ user, navigationItems, handleLogout, isLoggingOut }) {
    const { isExpanded } = useSidebar();
    const location = useLocation();

    return (
        <div className="flex flex-col h-full p-4 bg-white">
            <div className={`flex items-center ${isExpanded ? 'justify-between' : 'justify-center'} mb-8`}>
                {isExpanded && (
                    <div className="flex items-center space-x-2">
                        <Target className="h-8 w-8 text-blue-600" />
                        <h1 className="text-lg font-bold text-blue-600">TiroEsportivo</h1>
                    </div>
                )}
                {!isExpanded && <Target className="h-8 w-8 text-blue-600" />}
            </div>

            <nav className="flex-1 space-y-2">
                {navigationItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center p-2 rounded-lg transition-colors ${
                            location.pathname === item.href 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <item.icon className="h-5 w-5" />
                        {isExpanded && <span className="ml-4">{item.name}</span>}
                    </Link>
                ))}
            </nav>

            <div className="mt-auto">
                {user ? (
                    <div className="space-y-2">
                         <Link to={createPageUrl("Perfil")} className="flex items-center p-2 rounded-lg hover:bg-gray-100">
                             <img 
                                src={user.foto_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.email)}&background=0D89EC&color=fff`} 
                                alt="User" 
                                className="w-8 h-8 rounded-full" 
                             />
                             {isExpanded && <span className="ml-3 text-sm font-medium text-gray-700">{user.full_name || user.email}</span>}
                         </Link>
                         <Button onClick={handleLogout} disabled={isLoggingOut} variant="ghost" className="w-full flex justify-start items-center p-2 text-gray-600 hover:bg-gray-100">
                             <LogOut className="h-5 w-5" />
                             {isExpanded && <span className="ml-4">{isLoggingOut ? "Saindo..." : "Sair"}</span>}
                         </Button>
                    </div>
                ) : (
                    <Link to={createPageUrl("Login")} className="flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-100">
                        <LogIn className="h-5 w-5" />
                        {isExpanded && <span className="ml-4">Login</span>}
                    </Link>
                )}
            </div>
        </div>
    );
}

function useLayoutData() {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [navigationItems, setNavigationItems] = useState(baseNavigationItems);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        const fetchUserAndHandleInvite = async () => {
          try {
            // Mock user data for demonstration
            const mockUser = {
                id: 1,
                email: "usuario@exemplo.com",
                full_name: "João Silva",
                role: "user",
                tipo_conta: "user",
                foto_url: ""
            };
            
            setUser(mockUser);
          } catch (e) {
            setUser(null);
          }
        };
        fetchUserAndHandleInvite();
    }, [location.pathname]);

    useEffect(() => {
        if (user) {
            let items = [...userNavigationItems];
            if (user.role === 'admin') {
                items = [...items, ...adminNavigationItems];
            } else if (user.tipo_conta === 'parceiro') {
                items = [...items, ...parceiroNavigationItems];
            }
            setNavigationItems(items);
        } else {
            setNavigationItems(baseNavigationItems);
        }
    }, [user]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            // Mock logout
            setUser(null);
            navigate(createPageUrl("Home"));
        } catch (error) {
            console.error("Logout failed", error);
        }
        setIsLoggingOut(false);
    };

    return { user, navigationItems, handleLogout, isLoggingOut };
}

function LayoutContent({ children }) {
    const { setIsMobileOpen } = useSidebar();

    return (
        <div className="min-h-screen flex w-full bg-gray-50">
            <Sidebar className="border-r border-gray-200" />
            <div className="flex-1 flex flex-col">
                <header className="md:hidden flex items-center justify-between p-4 border-b bg-white">
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)}>
                        <Menu />
                    </Button>
                    <div className="flex items-center space-x-2">
                        <Target className="h-6 w-6 text-blue-600" />
                        <h1 className="text-lg font-bold text-blue-600">TiroEsportivo</h1>
                    </div>
                    <div></div>
                </header>
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function Layout({ children }) {
    return (
        <SidebarProvider>
            <LayoutContent>{children}</LayoutContent>
        </SidebarProvider>
    );
}

