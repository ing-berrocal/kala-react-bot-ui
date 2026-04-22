# Documento Técnico - Kala Bot Response UI

**Versión:** 1.0  
**Fecha:** 22 de abril de 2026  
**Estado:** Borrador

---

## 1. Arquitectura del Sistema

### 1.1 Visión General
```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Browser   │◄───────►│  React SPA   │◄───────►│  REST API   │
│  (Cliente)  │   HTTP  │   (Vite)     │  HTTP   │  (Backend)  │
└─────────────┘         └──────────────┘         └─────────────┘
```

### 1.2 Stack Tecnológico
- **Framework:** React 18+
- **Build Tool:** Vite
- **Compiler:** React Compiler (vía Babel)
- **UI Library:** RSuite
- **HTTP Client:** Fetch API / Axios (a definir)
- **Routing:** React Router (a implementar)
- **State Management:** Context API / Redux (a definir)
- **Linting:** ESLint (flat config)

### 1.3 Estructura de Proyecto
```
kala-react-bot/
├── public/                    # Assets estáticos
├── src/
│   ├── main.jsx              # Entry point
│   ├── App.jsx               # Componente raíz
│   ├── index.css             # Estilos globales
│   ├── assets/               # Imágenes y recursos
│   ├── components/           # Componentes reutilizables
│   │   └── MainMenu.jsx      # Navegación principal
│   ├── pages/                # Páginas principales (a crear)
│   │   ├── Index/            # Dashboard de comentarios
│   │   ├── Posts/            # Gestión de publicaciones
│   │   └── Chat/             # Interfaz de chat
│   ├── services/             # Servicios API (a crear)
│   │   ├── api.js            # Cliente HTTP base
│   │   ├── comments.js       # Endpoints de comentarios
│   │   ├── posts.js          # Endpoints de posts
│   │   └── chat.js           # Endpoints de chat
│   ├── hooks/                # Custom hooks (a crear)
│   │   ├── useComments.js
│   │   ├── usePosts.js
│   │   └── useChat.js
│   ├── utils/                # Utilidades (a crear)
│   │   ├── formatters.js     # Formateo de datos
│   │   └── validators.js     # Validaciones
│   └── constants/            # Constantes (a crear)
│       └── statuses.js       # Estados del sistema
├── sdd/                      # Documentación
│   ├── mission.md            # Documento de misión
│   └── tech.md               # Este documento
├── eslint.config.js          # Configuración ESLint
├── vite.config.js            # Configuración Vite
└── package.json              # Dependencias
```

---

## 2. Requisitos Funcionales Detallados

- [RF-001.md](./req/RF-001.md)
- [RF-002.md](./req/RF-002.md)
- [RF-003.md](./req/RF-003.md)


---


## 3. Diseño de Componentes

### 3.1 Jerarquía de Componentes

```
App
├── MainMenu
└── Routes
    ├── IndexPage
    │   └── CommentsDashboard
    │       ├── CommentsFilter
    │       └── CommentsTable
    │           └── CommentRow[]
    ├── PostsPage
    │   └── PostsManager
    │       ├── PostsTable
    │       │   └── PostRow[]
    │       ├── EditPostModal
    │       └── DeactivateConfirmation
    └── ChatPage
        └── ChatInterface
            ├── MessageList
            │   └── Message[]
            ├── TypingIndicator
            └── MessageInput
```

### 3.2 Props Interface (TypeScript-style)

```javascript
// CommentRow
{
  comment: {
    id: string,
    userName: string,
    message: string,
    response: string,
    status: 'PENDING' | 'WAITING' | 'PROCESSED'
  }
}

// PostRow
{
  post: {
    post_id: string,
    plataforma: 'Facebook' | 'Instagram',
    fecha_creacion: string,
    producto: string,
    estado: 'ACTIVE' | 'INACTIVE'
  },
  onEdit: (postId) => void,
  onDeactivate: (postId) => void
}

// Message
{
  message: {
    id: string,
    sender: 'user' | 'agent',
    content: string,
    timestamp: string
  }
}
```

---

## 4. Servicios API

### 4.1 Cliente HTTP Base

```javascript
// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      ...options.headers
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new ApiError(response.status, await response.text());
    }

    return response.json();
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }
}

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const apiClient = new ApiClient();
```

### 4.2 Servicio de Comentarios

```javascript
// src/services/comments.js
import { apiClient } from './api';

export const commentsService = {
  getComments(date, status) {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (status && status !== 'ALL') params.append('status', status);
    
    return apiClient.get(`/comments?${params}`);
  },

  getCommentById(id) {
    return apiClient.get(`/comments/${id}`);
  }
};
```

### 4.3 Servicio de Posts

```javascript
// src/services/posts.js
import { apiClient } from './api';

export const postsService = {
  getPosts() {
    return apiClient.get('/posts');
  },

  getPostById(id) {
    return apiClient.get(`/posts/${id}`);
  },

  updatePost(id, data) {
    return apiClient.put(`/posts/${id}`, data);
  },

  deactivatePost(id) {
    return apiClient.patch(`/posts/${id}/deactivate`);
  }
};
```

### 4.4 Servicio de Chat

```javascript
// src/services/chat.js
import { apiClient } from './api';

export const chatService = {
  sendMessage(message, sessionId = null) {
    return apiClient.post('/chat/messages', { message, sessionId });
  },

  getHistory(sessionId) {
    return apiClient.get(`/chat/history?sessionId=${sessionId}`);
  }
};
```

---

## 5. Custom Hooks

### 5.1 useComments

```javascript
// src/hooks/useComments.js
import { useState, useEffect } from 'react';
import { commentsService } from '../services/comments';

export function useComments(initialDate = new Date(), initialStatus = 'ALL') {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    date: initialDate,
    status: initialStatus
  });

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await commentsService.getComments(
        filters.date,
        filters.status
      );
      setComments(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [filters]);

  return {
    comments,
    loading,
    error,
    filters,
    setFilters,
    refetch: fetchComments
  };
}
```

### 5.2 usePosts

```javascript
// src/hooks/usePosts.js
import { useState, useEffect } from 'react';
import { postsService } from '../services/posts';

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await postsService.getPosts();
      setPosts(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (id, data) => {
    try {
      await postsService.updatePost(id, data);
      await fetchPosts();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deactivatePost = async (id) => {
    try {
      await postsService.deactivatePost(id);
      await fetchPosts();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    error,
    updatePost,
    deactivatePost,
    refetch: fetchPosts
  };
}
```

### 5.3 useChat

```javascript
// src/hooks/useChat.js
import { useState, useEffect, useRef } from 'react';
import { chatService } from '../services/chat';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content) => {
    if (!content.trim()) return;

    const userMessage = {
      id: `temp_${Date.now()}`,
      sender: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setSending(true);
    setError(null);

    try {
      const response = await chatService.sendMessage(content, sessionId);
      
      if (!sessionId) {
        setSessionId(response.sessionId);
      }

      const agentMessage = {
        id: `agent_${Date.now()}`,
        sender: 'agent',
        content: response.reply,
        timestamp: response.timestamp
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const loadHistory = async (sid) => {
    try {
      const response = await chatService.getHistory(sid);
      setMessages(response.messages);
      setSessionId(sid);
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    messages,
    sending,
    error,
    sessionId,
    sendMessage,
    loadHistory,
    messagesEndRef
  };
}
```

---

## 6. Constantes del Sistema

```javascript
// src/constants/statuses.js

export const COMMENT_STATUS = {
  PENDING: {
    value: 'PENDING',
    label: 'Pendiente',
    color: 'orange'
  },
  WAITING: {
    value: 'WAITING',
    label: 'En espera',
    color: 'blue'
  },
  PROCESSED: {
    value: 'PROCESSED',
    label: 'Procesado',
    color: 'green'
  }
};

export const POST_STATUS = {
  ACTIVE: {
    value: 'ACTIVE',
    label: 'Activo',
    color: 'green'
  },
  INACTIVE: {
    value: 'INACTIVE',
    label: 'Inactivo',
    color: 'gray'
  }
};

export const PLATFORMS = {
  FACEBOOK: 'Facebook',
  INSTAGRAM: 'Instagram'
};

export const MESSAGE_SENDER = {
  USER: 'user',
  AGENT: 'agent'
};
```

---

## 7. Gestión de Errores

### 7.1 ErrorBoundary Component

```javascript
// src/components/ErrorBoundary.jsx
import { Component } from 'react';
import { Message } from 'rsuite';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Message type="error" showIcon>
          <h4>Algo salió mal</h4>
          <p>{this.state.error?.message || 'Error desconocido'}</p>
        </Message>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### 7.2 Utilidad de Manejo de Errores

```javascript
// src/utils/errorHandler.js

export function handleApiError(error) {
  if (error.status === 401) {
    return 'Sesión expirada. Por favor, inicia sesión nuevamente.';
  }
  
  if (error.status === 403) {
    return 'No tienes permisos para realizar esta acción.';
  }
  
  if (error.status === 404) {
    return 'El recurso solicitado no existe.';
  }
  
  if (error.status >= 500) {
    return 'Error del servidor. Por favor, intenta más tarde.';
  }
  
  if (!navigator.onLine) {
    return 'No hay conexión a internet. Verifica tu conexión.';
  }
  
  return error.message || 'Ocurrió un error inesperado.';
}

export function showErrorNotification(error, toaster) {
  const message = handleApiError(error);
  toaster.push(
    <Message type="error" showIcon closable>
      {message}
    </Message>,
    { duration: 5000 }
  );
}
```

---

## 8. Configuración de Routing

```javascript
// src/routes.jsx
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import IndexPage from './pages/Index/IndexPage';
import PostsPage from './pages/Posts/PostsPage';
import ChatPage from './pages/Chat/ChatPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <IndexPage />
      },
      {
        path: 'posts',
        element: <PostsPage />
      },
      {
        path: 'chat',
        element: <ChatPage />
      }
    ]
  }
]);
```

---

## 9. Requisitos No Funcionales

### 9.1 Rendimiento
- Lazy loading de rutas con `React.lazy()`
- Memoización de componentes con `React.memo` donde aplique
- Debounce en filtros de búsqueda (300ms)
- Virtualización para listas largas (react-window)

### 9.2 Seguridad
- Token JWT en header `Authorization: Bearer {token}`
- No almacenar credenciales en localStorage sin cifrar
- Sanitizar inputs de usuario
- Implementar rate limiting en cliente (evitar spam)

### 9.3 Accesibilidad
- Navegación por teclado completa
- Labels en todos los inputs
- ARIA attributes en componentes interactivos
- Contraste de colores WCAG 2.1 AA

### 9.4 SEO (Opcional)
- Meta tags apropiados
- Server-Side Rendering considerado para futuro
- URLs semánticas

---

## 10. Variables de Entorno

```bash
# .env.development
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
VITE_ENV=development

# .env.production
VITE_API_URL=https://api.kala.com/api
VITE_WS_URL=wss://api.kala.com
VITE_ENV=production
```

---

## 11. Dependencias a Instalar

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "rsuite": "^5.53.0",
    "date-fns": "^3.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.1.0",
    "eslint": "^8.56.0"
  }
}
```

---

## 12. Plan de Implementación

### Fase 1: Configuración Base (Semana 1)
- [x] Inicializar proyecto con Vite + React
- [x] Configurar ESLint y estructura base
- [ ] Instalar React Router
- [ ] Configurar servicios API
- [ ] Crear estructura de carpetas
- [ ] Implementar ErrorBoundary

### Fase 2: Página Index (Semana 2)
- [ ] Crear componentes de Comments
- [ ] Implementar useComments hook
- [ ] Integrar filtros con RSuite
- [ ] Conectar con API de comentarios
- [ ] Pruebas unitarias básicas

### Fase 3: Página Posts (Semana 3)
- [ ] Crear componentes de Posts
- [ ] Implementar usePosts hook
- [ ] Crear modales de edición
- [ ] Implementar confirmaciones
- [ ] Conectar con API de posts

### Fase 4: Página Chat (Semana 4)
- [ ] Crear componentes de Chat
- [ ] Implementar useChat hook
- [ ] Diseñar UI de mensajes
- [ ] Implementar auto-scroll
- [ ] Conectar con API de chat

### Fase 5: Pulido y Optimización (Semana 5)
- [ ] Optimizar rendimiento
- [ ] Agregar loading states
- [ ] Mejorar manejo de errores
- [ ] Implementar accesibilidad
- [ ] Documentación de componentes

---

## 13. Casos de Prueba

### TC-001: Cargar comentarios del día
**Given:** Usuario abre la aplicación  
**When:** Accede a la página Index  
**Then:** Se muestran los comentarios del día actual con todos los estados

### TC-002: Filtrar por estado PENDING
**Given:** Usuario está en página Index  
**When:** Selecciona estado "Pendiente" en el filtro  
**Then:** Solo se muestran comentarios con estado PENDING

### TC-003: Editar publicación
**Given:** Usuario está en página Posts  
**When:** Hace clic en "Editar" y modifica el producto  
**Then:** La publicación se actualiza correctamente

### TC-004: Desactivar publicación
**Given:** Usuario está en página Posts con publicación ACTIVE  
**When:** Hace clic en "Desactivar" y confirma  
**Then:** El estado cambia a INACTIVE

### TC-005: Enviar mensaje en chat
**Given:** Usuario está en página Chat  
**When:** Escribe un mensaje y presiona Enter  
**Then:** El mensaje se envía y aparece la respuesta del agente

### TC-006: Manejo de error de red
**Given:** Usuario realiza una acción que requiere API  
**When:** No hay conexión a internet  
**Then:** Se muestra un mensaje de error apropiado

---

## 14. Métricas de Calidad

### Code Coverage
- Objetivo: >80% de cobertura en servicios y hooks
- Herramienta: Vitest + Istanbul

### Performance
- First Contentful Paint: <1.5s
- Time to Interactive: <3.0s
- Bundle size: <500KB (gzipped)

### Accesibilidad
- Lighthouse Accessibility Score: >90
- Todas las páginas navegables por teclado
- Screen reader compatible

---

## 15. Mantenimiento y Evolución

### Mejoras Futuras
- Implementar WebSocket para actualizaciones en tiempo real
- Agregar notificaciones push
- Dashboard con gráficas y estadísticas
- Exportación de datos a Excel/PDF
- Búsqueda avanzada y filtros múltiples
- Modo oscuro
- Internacionalización (i18n)

### Deuda Técnica
- Migrar a TypeScript para mayor type safety
- Implementar tests E2E con Playwright
- Agregar Storybook para documentación de componentes
- Considerar SSR para mejor SEO

---

**Última actualización:** 22 de abril de 2026  
**Mantenido por:** Equipo de Desarrollo Kala Bot