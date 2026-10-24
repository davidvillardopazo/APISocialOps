import {
  Activity,
  ArrowUpRight,
  Bot,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Command,
  FileText,
  LayoutDashboard,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import "./App.css";
import { Sun, Moon } from "lucide-react";

type Section =
  | "Dashboard"
  | "Clientes"
  | "Publicaciones"
  | "Calendario"
  | "Aprobaciones"
  | "Agentes IA"
  | "Configuración";
type ClientStatus = "Activo" | "Inactivo";

type Client = {
  id: number;
  name: string;
  sector: string;
  contactPerson: string;
  email: string;
  phone: string;
  platforms: string[];
  status: ClientStatus;
  notes: string;
  logo?: string;
  brandColors?: string[];
  communicationTone?: string;
  aiInstructions?: string;
};

type PostStatus =
  | "Borrador"
  | "Pendiente"
  | "Aprobada"
  | "Rechazada"
  | "Publicada";

type Post = {
  id: number;
  clientId?:number;
  client: string;
  initials: string;
  platform: string;
  title: string;
  date: string;
  status: PostStatus;
};

const initialPosts: Post[] = [
  {
    id: 1,
    client: "Café Central",
    initials: "CC",
    platform: "Instagram",
    title: "El desayuno perfecto empieza aquí ☕",
    date: "Hoy · 12:30",
    status: "Pendiente",
  },
  {
    id: 2,
    client: "Gora Instalaciones",
    initials: "GI",
    platform: "Facebook",
    title: "Renueva tus ventanas y mejora el aislamiento",
    date: "Hoy · 17:00",
    status: "Pendiente",
  },
  {
    id: 3,
    client: "Clínica Norte",
    initials: "CN",
    platform: "Instagram",
    title: "Consejos para cuidar tu sonrisa",
    date: "Mañana · 10:00",
    status: "Borrador",
  },
  {
    id: 4,
    client: "Café Central",
    initials: "CC",
    platform: "Google",
    title: "Esta semana tenemos novedades en nuestra carta",
    date: "Mañana · 13:00",
    status: "Aprobada",
  },
];
const initialClients: Client[] = [
  {
    id: 1,
    name: "Café Central",
    sector: "Hostelería",
    contactPerson: "",
    email: "",
    phone: "",
    platforms: ["Instagram", "Facebook", "Google Business Profile"],
    status: "Activo",
    notes: "",
  },
  {
    id: 2,
    name: "Gora Instalaciones",
    sector: "Instalaciones",
    contactPerson: "",
    email: "",
    phone: "",
    platforms: ["Facebook", "Instagram"],
    status: "Activo",
    notes: "",
  },
  {
    id: 3,
    name: "Clínica Norte",
    sector: "Salud",
    contactPerson: "",
    email: "",
    phone: "",
    platforms: ["Instagram"],
    status: "Activo",
    notes: "",
  },
];
const navigation: { label: Section; icon: typeof LayoutDashboard }[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Clientes", icon: Users },
  { label: "Publicaciones", icon: FileText },
  { label: "Calendario", icon: CalendarDays },
  { label: "Aprobaciones", icon: ShieldCheck },
  { label: "Agentes IA", icon: Bot },
];

const clients = [
  {
    name: "Café Central",
    category: "Hostelería",
    initials: "CC",
    color: "orange",
    platforms: ["Instagram", "Facebook", "Google"],
    posts: 12,
    engagement: "+12,8%",
  },
  {
    name: "Gora Instalaciones",
    category: "Construcción",
    initials: "GI",
    color: "blue",
    platforms: ["Facebook", "Instagram"],
    posts: 8,
    engagement: "+8,4%",
  },
  {
    name: "Clínica Norte",
    category: "Salud",
    initials: "CN",
    color: "purple",
    platforms: ["Instagram", "Google"],
    posts: 10,
    engagement: "+15,2%",
  },
];

function App() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
  return localStorage.getItem("social-ops-theme") === "light"
    ? "light"
    : "dark";
});
const [clients, setClients] = useState<Client[]>(() => {
  const savedClients = localStorage.getItem("social-ops-clients");

  if (savedClients) {
    try {
      return JSON.parse(savedClients) as Client[];
    } catch {
      return initialClients;
    }
  }

  return initialClients;
});
const [showNewClientForm, setShowNewClientForm] = useState(false);
const [editingClientId, setEditingClientId] = useState<number | null>(null);
const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
const [newClientForm, setNewClientForm] = useState({
  name: "",
  sector: "",
  contactPerson: "",
  email: "",
  phone: "",
  platforms: [] as string[],
  notes: "",

  // Identidad de marca
  brandColors: ["#6366f1", "#ffffff"],
  communicationTone: "",
  aiInstructions: "",
  logo: "",
});
const saveNewClient = () => {
  const name = newClientForm.name.trim();

  if (!name) {
    alert("Introduce el nombre del negocio.");
    return;
  }

 const clientData = {
  name,
  sector: newClientForm.sector.trim(),
  contactPerson: newClientForm.contactPerson.trim(),
  email: newClientForm.email.trim(),
  phone: newClientForm.phone.trim(),
  platforms: [...newClientForm.platforms],
  notes: newClientForm.notes.trim(),
  logo: newClientForm.logo,

  // Identidad de marca
  brandColors: [...newClientForm.brandColors],
  communicationTone: newClientForm.communicationTone,
  aiInstructions: newClientForm.aiInstructions.trim(),
};

  let updatedClients: Client[];

  if (editingClientId !== null) {
  // Actualizar la ficha del cliente
  updatedClients = clients.map((client) =>
    client.id === editingClientId
      ? { ...client, ...clientData }
      : client
  );

  // Buscar el nombre anterior del cliente
  const previousClient = clients.find(
    (client) => client.id === editingClientId
  );

  // Actualizar las publicaciones vinculadas
  if (previousClient) {
    setPosts((current) =>
      current.map((post) =>
        post.clientId === editingClientId ||
        (post.clientId === undefined && post.client === previousClient.name)
          ? {
              ...post,
              client: name,
              clientId: editingClientId,
              initials: name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase(),
            }
          : post
      )
    );
  }
} else {
  // Crear un cliente nuevo
  const client: Client = {
    id: Date.now(),
    ...clientData,
    status: "Activo",
  };

  updatedClients = [...clients, client];
}

  setClients(updatedClients);
  localStorage.setItem(
    "social-ops-clients",
    JSON.stringify(updatedClients)
  );

setNewClientForm({
  name: "",
  sector: "",
  contactPerson: "",
  email: "",
  phone: "",
  platforms: [],
  notes: "",
  brandColors: ["#6366f1", "#ffffff"],
  communicationTone: "",
  aiInstructions: "",
  logo:"",
});

  setEditingClientId(null);
  setShowNewClientForm(false);
};

const editClient = (client: Client) => {
  setEditingClientId(client.id);

setNewClientForm({
  name: client.name,
  sector: client.sector,
  contactPerson: client.contactPerson,
  email: client.email,
  phone: client.phone,
  platforms: [...client.platforms],
  notes: client.notes,
  brandColors: client.brandColors ?? ["#6366f1", "#ffffff"],
  communicationTone: client.communicationTone ?? "",
  aiInstructions: client.aiInstructions ?? "",
  logo:"",
});

  setShowNewClientForm(true);
};
const createPostForClient = (client: Client) => {
  setNewClient(client.name);
  setSelectedClientId(null);
  setSection("Publicaciones");
  setShowNewPost(true);
};

const deleteClient = (client: Client) => {
  const confirmed = window.confirm(
    `¿Seguro que quieres eliminar a "${client.name}"?`
  );

  if (!confirmed) return;

  const updatedClients = clients.filter(
    (item) => item.id !== client.id
  );

  setClients(updatedClients);
  localStorage.setItem(
    "social-ops-clients",
    JSON.stringify(updatedClients)
  );

  if (editingClientId === client.id) {
    setEditingClientId(null);
    setShowNewClientForm(false);
  }
};
  type TaskPriority = "Alta" | "Media" | "Baja";
  type TaskStatus = "Pendiente" | "Completada";

  type Task = {
    id: number;
    time: string;
    client: string;
    title: string;
    priority: TaskPriority;
    status: TaskStatus;
  };

  const initialTasks: Task[] = [
    {
      id: 1,
      time: "09:30",
      client: "Café Central",
      title: "Preparar publicación para Instagram",
      priority: "Alta",
      status: "Pendiente",
    },
    {
      id: 2,
      time: "11:00",
      client: "Gora Instalaciones",
      title: "Revisar diseños de la semana",
      priority: "Media",
      status: "Pendiente",
    },
    {
      id: 3,
      time: "12:30",
      client: "Restaurante O Pino",
      title: "Programar contenido",
      priority: "Baja",
      status: "Pendiente",
    },
  ];

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const savedTasks = localStorage.getItem("social-ops-tasks");
      return savedTasks ? (JSON.parse(savedTasks) as Task[]) : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  const [taskFilter, setTaskFilter] = useState<
    "Todas" | "Pendientes" | "Completadas"
  >("Pendientes");
  const [showTaskForm, setShowTaskForm] = useState(false);

  const [newTask, setNewTask] = useState<Omit<Task, "id" | "status">>({
    time: "09:00",
    client: "",
    title: "",
    priority: "Media",
  });

  const createTask = () => {
    if (!newTask.title.trim() || !newTask.client.trim()) {
      return;
    }

    const taskToAdd: Task = {
      ...newTask,
      id: Date.now(),
      status: "Pendiente",
    };

    setTasks((currentTasks) => {
      const updatedTasks = [...currentTasks, taskToAdd];

      localStorage.setItem(
        "social-ops-tasks",
        JSON.stringify(updatedTasks)
      );

      return updatedTasks;
    });

    setTaskFilter("Pendientes");
    setShowTaskForm(false);

    setNewTask({
      time: "09:00",
      client: "",
      title: "",
      priority: "Media",
    });
  };
 const toggleTask = (id: number) => {
  setTasks((currentTasks) => {
    const updatedTasks: Task[] = currentTasks.map((task) => {
      if (task.id !== id) {
        return task;
      }

      const newStatus: TaskStatus =
        task.status === "Pendiente" ? "Completada" : "Pendiente";

      return {
        ...task,
        status: newStatus,
      };
    });

    localStorage.setItem(
      "social-ops-tasks",
      JSON.stringify(updatedTasks)
    );

    return updatedTasks;
  });
};

  const visibleTasks = tasks
    .filter((task) => {
      if (taskFilter === "Pendientes") {
        return task.status === "Pendiente";
      }

      if (taskFilter === "Completadas") {
        return task.status === "Completada";
      }

      return true;
    })
    .sort((a, b) => a.time.localeCompare(b.time));
const toggleTheme = () => {
  const newTheme = theme === "dark" ? "light" : "dark";

  setTheme(newTheme);
  localStorage.setItem("social-ops-theme", newTheme);
};
  const [section, setSection] = useState<Section>("Dashboard");
  const [posts, setPosts] = useState<Post[]>(() => {
  const savedPosts = localStorage.getItem("social-ops-posts");

  if (savedPosts) {
    try {
      const parsed = JSON.parse(savedPosts);

      if (Array.isArray(parsed)) {
        return parsed as Post[];
      }
    } catch {
      console.warn("No se pudieron recuperar las publicaciones.");
    }
  }

  return initialPosts;
});
useEffect(() => {
  localStorage.setItem("social-ops-posts", JSON.stringify(posts));
}, [posts]);
  const [search, setSearch] = useState("");
  const [showNewPost, setShowNewPost] = useState(false);
  const [notification, setNotification] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newClient, setNewClient] = useState("Café Central");
  const [newPlatform, setNewPlatform] = useState("Instagram");

  const pendingCount = posts.filter(
    (post) => post.status === "Pendiente",
  ).length;
const updatePostStatus = (
  postId: number,
  newStatus: PostStatus
) => {
  setPosts((currentPosts) =>
    currentPosts.map((post) =>
      post.id === postId
        ? { ...post, status: newStatus }
        : post
    )
  );
};
  function notify(message: string) {
    setNotification(message);
    window.setTimeout(() => setNotification(""), 3000);
  }

  function updatePost(id: number, status: Post["status"]) {
    setPosts((current) =>
      current.map((post) => (post.id === id ? { ...post, status } : post)),
    );
    notify(
      status === "Aprobada"
        ? "Publicación aprobada. No se ha publicado en redes."
        : "Publicación devuelta a borradores.",
    );
  }

  function createPost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!newTitle.trim()) return;

    const client = clients.find((item) => item.name === newClient);

    setPosts((current) => [
      {
        id: Date.now(),
        clientId: client?.id,
        client: newClient,
        initials: client?.name
  ? client.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  : "CL",
        platform: newPlatform,
        title: newTitle.trim(),
        date: "Sin programar",
        status: "Borrador",
      },
      ...current,
    ]);

    setNewTitle("");
    setShowNewPost(false);
    setSection("Publicaciones");
    notify("Borrador creado correctamente.");
  }

  const filteredPosts = posts.filter((post) => {
    const query = search.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.client.toLowerCase().includes(query)
    );
  });

  return (
    <div className={`app-shell ${theme}-theme`}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Command size={21} />
          </div>
          <div>
            <div className="brand-name">social<span>ops</span></div>
            <div className="brand-caption">WORKSPACE</div>
          </div>
        </div>

        <button className="workspace-switch" onClick={() => notify("Estás en tu espacio de trabajo local.")}>
          <div className="workspace-avatar">SO</div>
          <div className="workspace-text">
            <strong>Mi agencia</strong>
            <span>Plan local · Prototipo</span>
          </div>
          <ChevronDown size={16} />
        </button>

        <div className="nav-label">GESTIÓN</div>
        <nav className="navigation">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${section === label ? "active" : ""}`}
              onClick={() => setSection(label)}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {label === "Aprobaciones" && pendingCount > 0 && (
                <span className="nav-badge">{pendingCount}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="ai-card">
            <div className="ai-card-icon"><Sparkles size={17} /></div>
            <strong>Tu equipo de IA</strong>
            <p>Los agentes inteligentes llegarán en la siguiente fase.</p>
            <button onClick={() => setSection("Agentes IA")}>
              Explorar agentes <ArrowUpRight size={14} />
            </button>
          </div>
          <button
            className={`nav-item ${section === "Configuración" ? "active" : ""}`}
            onClick={() => setSection("Configuración")}
          >
            <Settings size={18} strokeWidth={1.8} />
            <span>Configuración</span>
          </button>
          <div className="user-profile">
            <div className="user-avatar">AD</div>
            <div className="user-details">
              <strong>Administrador</strong>
              <span>Propietario</span>
            </div>
            <MoreHorizontal size={19} />
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>Workspace</span>
            <span className="crumb-separator">/</span>
            <strong>{section}</strong>
          </div>
         <label className="theme-switch" title="Cambiar tema">
  <input
  type="checkbox"
  role="switch"
  aria-label="Activar modo oscuro"
  checked={theme === "dark"}
  onChange={toggleTheme}

  />

  <span className="theme-switch-track">
    <Sun size={15} className="switch-sun" />
    <Moon size={15} className="switch-moon" />
    <span className="theme-switch-thumb" />
  </span>

  <span className="theme-switch-label">
    {theme === "dark" ? "Oscuro" : "Claro"}
  </span>
</label>
          <div className="topbar-actions">
            <div className="system-status">
              <span className="status-dot" />
              Sistema local
            </div>
            <button
              className="icon-button"
              aria-label="Ayuda"
              onClick={() => notify("Social Ops: prototipo local en desarrollo.")}
            >
              <CircleHelp size={18} />
            </button>
            <div className="topbar-avatar">AD</div>
          </div>
        </header>

        <div className="page-content">
          {section === "Dashboard" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow"><Sparkles size={13} /> CENTRO DE OPERACIONES</div>
                  <h1>Buenos días<span className="heading-period">.</span></h1>
                  <p className="page-subtitle">
                    Aquí tienes el estado de tu agencia y lo que necesita tu atención.
                  </p>
                </div>
                <button className="primary-button" onClick={() => setShowNewPost(true)}>
                  <Plus size={17} /> Nueva publicación
                </button>
              </div>

              <section className="metrics-grid">
                <Metric
                  label="Clientes activos"
                  value="03"
                  detail="Espacios de trabajo"
                  icon={<Users size={19} />}
                  trend="+1 este mes"
                />
                <Metric
                  label="Publicaciones"
                  value={String(posts.length).padStart(2, "0")}
                  detail="En tu espacio local"
                  icon={<FileText size={19} />}
                  trend={`${posts.filter((p) => p.status === "Aprobada").length} aprobadas`}
                />
                <Metric
                  label="Por aprobar"
                  value={String(pendingCount).padStart(2, "0")}
                  detail="Requieren tu revisión"
                  icon={<ShieldCheck size={19} />}
                  trend={pendingCount > 0 ? "Acción necesaria" : "Todo al día"}
                  warning={pendingCount > 0}
                />
                <Metric
                  label="Agentes activos"
                  value="00"
                  detail="IA aún no conectada"
                  icon={<Bot size={19} />}
                  trend="Próxima fase"
                />
              </section>

              <div className="dashboard-grid">
                <section className="panel posts-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Revisión de contenido</h2>
                      <p>Publicaciones que esperan tu visto bueno.</p>
                    </div>
                    <button className="text-button" onClick={() => setSection("Aprobaciones")}>
                      Ver todas <ArrowUpRight size={15} />
                    </button>
                  </div>

                  <div className="post-list">
                    {posts.filter((post) => post.status === "Pendiente").length === 0 ? (
                      <div className="empty-state">No tienes publicaciones pendientes.</div>
                    ) : (
                      posts
                        .filter((post) => post.status === "Pendiente")
                        .map((post) => (
                          <PostRow
                            key={post.id}
                            post={post}
                            onApprove={() => updatePost(post.id, "Aprobada")}
                            onReject={() => updatePost(post.id, "Borrador")}
                          />
                        ))
                    )}
                  </div>
                </section>

                <section className="panel activity-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Actividad reciente</h2>
                      <p>Lo que sucede en tu espacio.</p>
                    </div>
                    <Activity size={18} className="muted-icon" />
                  </div>
                  <div className="activity-list">
                    <ActivityItem icon={<ShieldCheck size={16} />} title="Control de aprobación activo" description="Toda publicación necesita revisión humana." time="Siempre activo" />
                    <ActivityItem icon={<Users size={16} />} title="Espacio preparado" description="La estructura de clientes está lista." time="Ahora" />
                    <ActivityItem icon={<Bot size={16} />} title="Agentes IA" description="Pendientes de configurar." time="Próxima fase" />
                  </div>
                  <div className="activity-footer">
                    <span className="status-dot" />
                    Tu trabajo se guarda en esta sesión
                  </div>
                </section>
              </div>
              <section className="panel tasks-panel">
  <div className="panel-heading">
    <div>
      <h2>Tu día</h2>
      <p>Organiza y controla las tareas de tus clientes.</p>
    </div>

    <div className="task-heading-actions">
  <span className="task-counter">
    {tasks.filter((task) => task.status === "Pendiente").length} pendientes
  </span>

  <button
    className="new-task-button"
    onClick={() => setShowTaskForm(!showTaskForm)}
  >
    + Nueva tarea
  </button>
</div>
  </div>

  <div className="task-filters">
    {(["Todas", "Pendientes", "Completadas"] as const).map((filter) => (
      <button
        key={filter}
        className={`task-filter ${taskFilter === filter ? "active" : ""}`}
        onClick={() => setTaskFilter(filter)}
      >
        {filter}
      </button>
    ))}
  </div>
{showTaskForm && (
  <form
    className="task-form"
    onSubmit={(event) => {
      event.preventDefault();
      createTask();
    }}
  >
    <div className="task-form-heading">
      <h3>Nueva tarea</h3>
      <p>Organiza el próximo trabajo de tus clientes.</p>
    </div>

    <div className="task-form-grid">
      <label>
        Nombre de la tarea
        <input
          type="text"
          placeholder="Ej. Preparar publicación de Instagram"
          value={newTask.title}
          onChange={(event) =>
            setNewTask({ ...newTask, title: event.target.value })
          }
          required
        />
      </label>

      <label>
        Cliente
        <input
          type="text"
          placeholder="Ej. Café Central"
          value={newTask.client}
          onChange={(event) =>
            setNewTask({ ...newTask, client: event.target.value })
          }
          required
        />
      </label>

      <label>
        Hora
        <input
          type="time"
          value={newTask.time}
          onChange={(event) =>
            setNewTask({ ...newTask, time: event.target.value })
          }
          required
        />
      </label>

      <label>
        Prioridad
        <select
          value={newTask.priority}
          onChange={(event) =>
            setNewTask({
              ...newTask,
              priority: event.target.value as TaskPriority,
            })
          }
        >
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>
      </label>
    </div>

    <div className="task-form-actions">
      <button
        type="button"
        className="task-cancel-button"
        onClick={() => setShowTaskForm(false)}
      >
        Cancelar
      </button>

      <button type="submit" className="new-task-button">
  {editingClientId !== null ? "Guardar cambios" : "Guardar cliente"}
</button>
    </div>
  </form>
)}
  <div className="task-list">
    {visibleTasks.length === 0 ? (
      <div className="empty-state">
        No hay tareas en esta categoría.
      </div>
    ) : (
      visibleTasks.map((task) => (
        <div
          className={`task-row ${task.status === "Completada" ? "task-completed" : ""}`}
          key={task.id}
        >
          <div className="task-time">{task.time}</div>

          <div className="task-info">
            <strong>{task.title}</strong>
            <span>{task.client}</span>
          </div>

          <span
            className={`task-priority priority-${task.priority.toLowerCase()}`}
          >
            {task.priority}
          </span>

          <button
            className={`task-action ${task.status === "Completada" ? "task-undone" : ""}`}
            onClick={() => toggleTask(task.id)}
          >
            {task.status === "Pendiente" ? "Completar" : "Deshacer"}
          </button>
        </div>
      ))
    )}
  </div>
</section>
              <section className="panel clients-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Tus clientes</h2>
                    <p>Resumen de los negocios de tu agencia.</p>
                  </div>
                  <button className="text-button" onClick={() => setSection("Clientes")}>
                    Gestionar clientes <ArrowUpRight size={15} />
                  </button>
                </div>
                <ClientTable />
              </section>
            </>
          )}

          {section === "Clientes" && (
  <PageSection
    eyebrow="TU CARTERA"
    title="Clientes"
    subtitle="Los negocios cuyas redes sociales gestionas."
    action={
      <button
        className="primary-button"
        onClick={() => {
  setEditingClientId(null);
setNewClientForm({
  name: "",
  sector: "",
  contactPerson: "",
  email: "",
  phone: "",
  platforms: [],
  notes: "",
  brandColors: ["#6366f1", "#ffffff"],
  communicationTone: "",
  aiInstructions: "",
  logo:"",
});
  setShowNewClientForm(true);
}}
      >
        <Plus size={17} /> Nuevo cliente
      </button>
    }
  >
   {showNewClientForm && (
  <form
    className="panel client-form"
    onSubmit={(event) => {
  event.preventDefault();
  saveNewClient();
}}
  >
    <h2>{editingClientId !== null ? "Editar cliente" : "Nuevo cliente"}</h2>

    <div className="task-form-grid">
      <label>
        Nombre del negocio
        <input
          type="text"
          required
          value={newClientForm.name}
          onChange={(event) =>
            setNewClientForm({
              ...newClientForm,
              name: event.target.value,
            })
          }
          placeholder="Ej. Restaurante Central"
        />
      </label>

      <label>
        Sector
        <input
          type="text"
          value={newClientForm.sector}
          onChange={(event) =>
            setNewClientForm({
              ...newClientForm,
              sector: event.target.value,
            })
          }
          placeholder="Ej. Hostelería"
        />
      </label>

      <label>
        Persona de contacto
        <input
          type="text"
          value={newClientForm.contactPerson}
          onChange={(event) =>
            setNewClientForm({
              ...newClientForm,
              contactPerson: event.target.value,
            })
          }
        />
      </label>

      <label>
        Correo electrónico
        <input
          type="email"
          value={newClientForm.email}
          onChange={(event) =>
            setNewClientForm({
              ...newClientForm,
              email: event.target.value,
            })
          }
        />
      </label>

      <label>
        Teléfono
        <input
          type="tel"
          value={newClientForm.phone}
          onChange={(event) =>
            setNewClientForm({
              ...newClientForm,
              phone: event.target.value,
            })
          }
        />
      </label>
<div className="client-platform-selector">
  <strong>Redes sociales que gestionamos</strong>

  <div className="client-platform-options">
    {[
      "Instagram",
      "Facebook",
      "TikTok",
      "Google Business Profile",
      "LinkedIn",
      "YouTube",
    ].map((platform) => (
      <label key={platform} className="client-platform-option">
        <input
          type="checkbox"
          checked={newClientForm.platforms.includes(platform)}
          onChange={(event) => {
            const platforms = event.target.checked
              ? [...newClientForm.platforms, platform]
              : newClientForm.platforms.filter(
                  (item) => item !== platform
                );

            setNewClientForm({
              ...newClientForm,
              platforms,
            });
          }}
        />

        <span>{platform}</span>
      </label>
    ))}
  </div>
</div>
<div className="client-brand-section">
<div className="client-logo-upload">
  <label>
    Logotipo del negocio

    <input
      type="file"
      accept="image/png,image/jpeg,image/webp"
      onChange={(event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
          alert("Selecciona una imagen PNG, JPG o WEBP.");
          event.target.value = "";
          return;
        }

        if (file.size > 250 * 1024) {
          alert("El logotipo debe ocupar menos de 250 KB.");
          event.target.value = "";
          return;
        }

        const reader = new FileReader();

        reader.onload = () => {
          if (typeof reader.result === "string") {
            setNewClientForm((previous) => ({
              ...previous,
              logo: reader.result as string,
            }));
          }
        };

        reader.readAsDataURL(file);
      }}
    />
  </label>

  {newClientForm.logo && (
    <div className="client-logo-preview">
      <img src={newClientForm.logo} alt="Vista previa del logotipo" />

      <button
        type="button"
        onClick={() =>
          setNewClientForm((previous) => ({
            ...previous,
            logo: "",
          }))
        }
      >
        Quitar logotipo
      </button>
    </div>
  )}
</div>
  <h3>Identidad de marca</h3>

  <label>
    Color principal
    <input
      type="color"
      value={newClientForm.brandColors[0]}
      onChange={(event) =>
        setNewClientForm({
          ...newClientForm,
          brandColors: [
            event.target.value,
            newClientForm.brandColors[1],
          ],
        })
      }
    />
  </label>

  <label>
    Color secundario
    <input
      type="color"
      value={newClientForm.brandColors[1]}
      onChange={(event) =>
        setNewClientForm({
          ...newClientForm,
          brandColors: [
            newClientForm.brandColors[0],
            event.target.value,
          ],
        })
      }
    />
  </label>

  <label>
    Tono de comunicación
    <select
      value={newClientForm.communicationTone}
      onChange={(event) =>
        setNewClientForm({
          ...newClientForm,
          communicationTone: event.target.value,
        })
      }
    >
      <option value="">Seleccionar tono</option>
      <option value="Profesional">Profesional</option>
      <option value="Cercano">Cercano</option>
      <option value="Divertido">Divertido</option>
      <option value="Formal">Formal</option>
      <option value="Juvenil">Juvenil</option>
      <option value="Elegante">Elegante</option>
    </select>
  </label>

  <label>
    Instrucciones para la IA
    <textarea
      value={newClientForm.aiInstructions}
      onChange={(event) =>
        setNewClientForm({
          ...newClientForm,
          aiInstructions: event.target.value,
        })
      }
      placeholder="Ej. Destacar nuestros servicios, utilizar un lenguaje cercano y evitar referencias a la competencia."
      rows={4}
    />
  </label>
</div>
      <label>
        Observaciones
        <textarea
          value={newClientForm.notes}
          onChange={(event) =>
            setNewClientForm({
              ...newClientForm,
              notes: event.target.value,
            })
          }
        />
      </label>
    </div>

    <div className="task-form-actions">
      <button
        type="button"
        className="task-cancel-button"
        onClick={() => setShowNewClientForm(false)}
      >
        Cancelar
      </button>

      <button type="submit" className="new-task-button">
        Guardar cliente
      </button>
    </div>
  </form>
)} 
{selectedClientId !== null && (() => {
  const client = clients.find(
    (item) => item.id === selectedClientId
  );

  if (!client) return null;
  const clientPosts = posts.filter((post) =>
  post.clientId !== undefined
    ? post.clientId === client.id
    : post.client === client.name
);
const clientPostStats = {
  total: clientPosts.length,
  drafts: clientPosts.filter(
    (post) => post.status === "Borrador"
  ).length,
  pending: clientPosts.filter(
    (post) => post.status === "Pendiente"
  ).length,
  approved: clientPosts.filter(
    (post) => post.status === "Aprobada"
  ).length,
};

  return (
    <div className="panel client-detail-panel">
      <div className="client-detail-header">
        <div className="client-detail-identity">
  {client.logo && (
    <img
      src={client.logo}
      alt={`Logotipo de ${client.name}`}
      className="client-detail-logo"
    />
  )}

  <div>
    <h2>{client.name}</h2>
    <p>{client.sector || "Sector no especificado"}</p>
  </div>
</div>

        <button
          type="button"
          className="secondary-button"
          onClick={() => setSelectedClientId(null)}
        >
          Cerrar ficha
        </button>
      </div>

      <div className="client-detail-grid">
        <div>
          <h3>Información general</h3>

          <p>
            <strong>Contacto:</strong>{" "}
            {client.contactPerson || "No especificado"}
          </p>

          <p>
            <strong>Correo:</strong>{" "}
            {client.email || "No especificado"}
          </p>
<div className="client-brand-details">
          <p>
            <strong>Teléfono:</strong>{" "}
            {client.phone || "No especificado"}
          </p>

          <p>
            <strong>Estado:</strong> {client.status}
          </p>
        </div>

        <div>
          <h3>Redes sociales</h3>

          {client.platforms.length > 0 ? (
            <div className="platform-tags">
              {client.platforms.map((platform) => (
                <span key={platform}>{platform}</span>
              ))}
            </div>
          ) : (
            <p>No hay redes sociales configuradas.</p>
          )}
        </div>

        <div>
          <h3>Observaciones</h3>
          <p>{client.notes || "Sin observaciones."}</p>
        </div>

        <div>
          <h3>Identidad de marca e IA</h3>
          
  <p>
    <strong>Colores corporativos</strong>
  </p>

  <div className="client-brand-colors">
    {(client.brandColors ?? []).map((color, index) => (
      <div className="client-brand-color" key={index}>
        <span
          className="client-color-swatch"
          style={{ backgroundColor: color }}
        />
        <span>{color.toUpperCase()}</span>
      </div>
    ))}
  </div>

  <p>
    <strong>Tono de comunicación:</strong>{" "}
    {client.communicationTone || "No configurado"}
  </p>

  <p>
    <strong>Instrucciones para la IA:</strong>
  </p>

   <p className="client-ai-instructions">
    {client.aiInstructions || "No hay instrucciones configuradas."}
  </p>
</div>
        </div>
<div className="client-post-stats">
  <div className="panel client-post-stat">
    <span>Total publicaciones</span>
    <strong>{clientPostStats.total}</strong>
  </div>

  <div className="panel client-post-stat">
    <span>Borradores</span>
    <strong>{clientPostStats.drafts}</strong>
  </div>

  <div className="panel client-post-stat">
    <span>Pendientes</span>
    <strong>{clientPostStats.pending}</strong>
  </div>

  <div className="panel client-post-stat">
    <span>Aprobadas</span>
    <strong>{clientPostStats.approved}</strong>
  </div>
</div>
        <section className="client-detail-posts">
          <h3>Publicaciones del cliente</h3>
          <button
  type="button"
  className="primary-button"
  onClick={() => createPostForClient(client)}
>
  <Plus size={17} />
  Nueva publicación
</button>

          {clientPosts.length === 0 ? (
            <p className="client-posts-empty">
              Este cliente todavía no tiene publicaciones.
            </p>
          ) : (
            <div className="client-posts-list">
              {clientPosts.map((post) => (
                  <div className="client-post-item" key={post.id}>
                    <div>
                      <strong>{post.title}</strong>
                      <span>{post.platform} · {post.date}</span>
                    </div>

                    <StatusBadge status={post.status} />
                  </div>
                ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
})()}

  <section className="client-cards">
  {clients.map((client) => (
    <div className="panel client-card" key={client.id}>
     <div className="client-avatar">
  {client.logo ? (
    <img
      src={client.logo}
      alt={`Logotipo de ${client.name}`}
      className="client-avatar-logo"
    />
  ) : (
    client.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  )}
</div>

      <h3>{client.name}</h3>
      <p>{client.sector}</p>
      <div className="client-card-actions">
        <button
  type="button"
  className="client-view-button"
  onClick={() => setSelectedClientId(client.id)}
>
  Ver ficha
</button>
  <button
    type="button"
    className="client-edit-button"
    onClick={() => editClient(client)}
  >
    Editar
  </button>

  <button
    type="button"
    className="client-delete-button"
    onClick={() => deleteClient(client)}
  >
    Eliminar
  </button>
</div>

      <div className="client-card-stats">
        <span>
          <FileText size={15} /> {client.platforms.length} redes sociales
        </span>
        <span className={client.status === "Activo" ? "positive" : ""}>
          {client.status}
        </span>
      </div>

      <div className="platform-tags">
        {client.platforms.map((platform) => (
          <span key={platform}>{platform}</span>
        ))}
      </div>
    </div>
  ))}
</section>
              <div className="info-banner"><Activity size={18} /><span>Estos clientes son datos de demostración. Todavía no hay cuentas sociales conectadas.</span></div>
            </PageSection>
          )}

          {section === "Publicaciones" && (
            <PageSection
              eyebrow="CONTENIDO"
              title="Publicaciones"
              subtitle="Organiza los borradores y revisa el estado de cada contenido."
              action={<button className="primary-button" onClick={() => setShowNewPost(true)}><Plus size={17} /> Nueva publicación</button>}
            >
              <div className="table-toolbar">
                <div className="search-box"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar contenido o cliente..." /></div>
                <span className="results-count">{filteredPosts.length} publicaciones</span>
              </div>
              <section className="panel">
                {filteredPosts.length === 0 ? (
                  <div className="empty-state">No hay publicaciones que coincidan con la búsqueda.</div>
                ) : (
                  filteredPosts.map((post) => (
                    <PostRow
                      key={post.id}
                      post={post}
                      onApprove={() => updatePost(post.id, "Aprobada")}
                      onReject={() => updatePost(post.id, "Borrador")}
                      showActions
                    />
                  ))
                )}
              </section>
              <p className="disclaimer">Las aprobaciones son internas. Este prototipo no publica contenido en ninguna red social.</p>
            </PageSection>
          )}

          {section === "Aprobaciones" && (
            <PageSection eyebrow="CONTROL EDITORIAL" title="Aprobaciones" subtitle="Tú tienes la última palabra antes de publicar.">
              <div className="approval-summary">
                <div><ShieldCheck size={20} /><span><strong>{pendingCount} pendientes</strong><small>Esperando revisión humana</small></span></div>
                <span className="approval-rule">Publicación automática desactivada</span>
              </div>
              <section className="panel">
                {posts.filter((post) => post.status === "Pendiente").length === 0 ? (
                  <div className="empty-state">Todo revisado. No quedan publicaciones pendientes.</div>
                ) : (
                  posts.filter((post) => post.status === "Pendiente").map((post) => (
                    <PostRow key={post.id} post={post} onApprove={() => updatePost(post.id, "Aprobada")} onReject={() => updatePost(post.id, "Borrador")} showActions />
                  ))
                )}
              </section>
            </PageSection>
          )}

          {section === "Calendario" && (
            <PageSection eyebrow="PLANIFICACIÓN" title="Calendario editorial" subtitle="Una vista inicial de tus próximas publicaciones.">
              <section className="panel calendar-panel">
                {posts.map((post) => (
  <div className="calendar-entry" key={post.id}>
    <div className="calendar-date">
      <CalendarDays size={18} />
      <span>{post.date}</span>
    </div>

    <div className="calendar-entry-main">
      <strong>{post.title}</strong>
      <span>{post.client} · {post.platform}</span>
    </div>

    <StatusBadge status={post.status} />

    {post.status === "Pendiente" && (
      <div className="post-actions">
        <button
          type="button"
          onClick={() => updatePostStatus(post.id, "Aprobada")}
        >
          Aprobar
        </button>

        <button
          type="button"
          onClick={() => updatePostStatus(post.id, "Rechazada")}
        >
          Rechazar
        </button>
      </div>
    )}
  </div>
))}
                <button className="secondary-button calendar-add" onClick={() => setShowNewPost(true)}><Plus size={16} /> Añadir borrador</button>
              </section>
            </PageSection>
          )}

          {section === "Agentes IA" && (
            <PageSection eyebrow="AUTOMATIZACIÓN" title="Equipo de IA" subtitle="Prepara el equipo de asistentes para tu flujo de trabajo.">
              <section className="agent-grid">
                <AgentCard icon={<Sparkles size={21} />} title="Estratega de contenido" description="Propone ideas y temas adaptados a cada negocio." status="Planificado" />
                <AgentCard icon={<MessageSquare size={21} />} title="Redactor" description="Genera textos, llamadas a la acción y hashtags." status="Planificado" />
                <AgentCard icon={<FileText size={21} />} title="Revisor de calidad" description="Comprueba tono, ortografía y coherencia." status="Planificado" />
                <AgentCard icon={<CalendarDays size={21} />} title="Planificador" description="Sugiere fechas y distribuye el contenido." status="Planificado" />
              </section>
              <div className="info-banner"><Bot size={18} /><span>La IA todavía no está conectada. Primero construiremos el flujo de trabajo y después integraremos un modelo local.</span></div>
            </PageSection>
          )}

          {section === "Configuración" && (
            <PageSection eyebrow="PREFERENCIAS" title="Configuración" subtitle="Ajustes básicos de tu espacio de trabajo.">
              <section className="panel settings-panel">
                <div><div><strong>Espacio de trabajo</strong><p>Nombre del espacio de trabajo actual.</p></div><span className="settings-value">Mi agencia</span></div>
                <div><div><strong>Modo de publicación</strong><p>Se necesita aprobación humana para publicar.</p></div><span className="approval-rule">Aprobación obligatoria</span></div>
                <div><div><strong>Almacenamiento</strong><p>Los datos todavía no están conectados a una base persistente.</p></div><span className="settings-value">Solo sesión</span></div>
              </section>
            </PageSection>
          )}
        </div>
      </main>

      {showNewPost && (
        <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowNewPost(false); }}>
          <form className="modal" onSubmit={createPost}>
            <div className="modal-heading">
              <div><div className="eyebrow">CONTENIDO EDITORIAL</div><h2>Nueva publicación</h2></div>
              <button type="button" className="icon-button" onClick={() => setShowNewPost(false)} aria-label="Cerrar"><X size={19} /></button>
            </div>
            <label>Cliente<select value={newClient} onChange={(event) => setNewClient(event.target.value)}>{clients.map((client) => <option key={client.name}>{client.name}</option>)}</select></label>
            <label>Plataforma<select value={newPlatform} onChange={(event) => setNewPlatform(event.target.value)}><option>Instagram</option><option>Facebook</option><option>TikTok</option><option>Google</option></select></label>
            <label>Texto o idea<textarea autoFocus value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder="Describe el contenido que quieres preparar..." rows={4} required /></label>
            <div className="modal-note"><ShieldCheck size={16} /> Se guardará como borrador. No se publicará automáticamente.</div>
            <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowNewPost(false)}>Cancelar</button><button type="submit" className="primary-button"><Plus size={16} /> Crear borrador</button></div>
          </form>
        </div>
      )}

      {notification && <div className="toast"><Check size={17} /> {notification}</div>}
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
  icon,
  trend,
  warning = false,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
  trend: string;
  warning?: boolean;
}) {
  return (
    <div className="panel metric-card">
      <div className="metric-top"><span>{label}</span><div className={`metric-icon ${warning ? "warning" : ""}`}>{icon}</div></div>
      <div className="metric-value">{value}</div>
      <div className="metric-bottom"><span>{detail}</span><span className={warning ? "warning-text" : "metric-trend"}>{trend}</span></div>
    </div>
  );
}

function PostRow({
  post,
  onApprove,
  onReject,
  showActions = false,
}: {
  post: Post;
  onApprove: () => void;
  onReject: () => void;
  showActions?: boolean;
}) {
  return (
    <div className="post-row">
      <div className={`client-avatar small ${post.initials === "CC" ? "orange" : post.initials === "GI" ? "blue" : "purple"}`}>{post.initials}</div>
      <div className="post-main">
        <div className="post-title">{post.title}</div>
        <div className="post-meta"><span>{post.client}</span><span className="meta-dot">·</span><span>{post.platform}</span><span className="meta-dot">·</span><span>{post.date}</span></div>
      </div>
      <StatusBadge status={post.status} />
      {(showActions || post.status === "Pendiente") && (
        <div className="post-actions">
          {post.status === "Pendiente" && <button className="approve-button" onClick={onApprove} title="Aprobar"><Check size={16} /></button>}
          {post.status !== "Aprobada" && <button className="reject-button" onClick={onReject} title="Devolver a borrador"><X size={16} /></button>}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Post["status"] }) {
  return <span className={`status-badge ${status === "Pendiente" ? "pending" : status === "Aprobada" ? "approved" : "draft"}`}><span />{status}</span>;
}

function ActivityItem({ icon, title, description, time }: { icon: React.ReactNode; title: string; description: string; time: string }) {
  return (
    <div className="activity-item">
      <div className="activity-icon">{icon}</div>
      <div className="activity-copy"><strong>{title}</strong><p>{description}</p><span>{time}</span></div>
    </div>
  );
}

function ClientTable() {
  return (
    <div className="client-table">
      <div className="client-table-head"><span>CLIENTE</span><span>PLATAFORMAS</span><span>PUBLICACIONES</span><span>INTERACCIÓN*</span><span>ESTADO</span></div>
      {clients.map((client) => (
        <div className="client-table-row" key={client.name}>
          <div className="table-client"><div className={`client-avatar ${client.color}`}>{client.initials}</div><div><strong>{client.name}</strong><span>{client.category}</span></div></div>
          <div className="platform-list">{client.platforms.map((platform) => <span key={platform}>{platform}</span>)}</div>
          <span className="table-number">{client.posts}</span>
          <span className="engagement"><ArrowUpRight size={15} />{client.engagement}</span>
          <span className="client-status"><span /> Activo</span>
        </div>
      ))}
      <div className="table-foot">* Métricas ilustrativas de demostración, no datos reales.</div>
    </div>
  );
}

function PageSection({
  eyebrow,
  title,
  subtitle,
  action,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="page-heading">
        <div><div className="eyebrow">{eyebrow}</div><h1>{title}<span className="heading-period">.</span></h1><p className="page-subtitle">{subtitle}</p></div>
        {action}
      </div>
      {children}
    </>
  );
}

function AgentCard({ icon, title, description, status }: { icon: React.ReactNode; title: string; description: string; status: string }) {
  return (
    <div className="panel agent-card">
      <div className="agent-icon">{icon}</div><span className="planned-badge">{status}</span>
      <h3>{title}</h3><p>{description}</p>
      <div className="agent-card-foot"><span>Sin conectar</span><Clock3 size={15} /></div>
    </div>
  );
}

export default App;