// components/Navigation.js
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navigation() {
  const router = useRouter();
  
  const navItems = [
    { href: '/qa-dashboard', label: 'Dashboard QA', icon: '📊' },
    { href: '/config-dashboard', label: 'Configuración', icon: '⚙️' },
    { href: '/reports', label: 'Reportes', icon: '📈' }
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8">
          {navItems.map(item => (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                router.pathname === item.href
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
