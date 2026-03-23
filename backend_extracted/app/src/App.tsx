import { useState, useEffect } from 'react';
import {
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  Smartphone,
  Battery,
  X,
  MoreVertical,
  RotateCcw,
  Trash2,
  Settings,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  LayoutGrid,
  List
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind class merging
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Types
interface Process {
  id: string;
  name: string;
  packageName: string;
  cpu: number;
  memory: number;
  pid: number;
  status: 'running' | 'suspended' | 'stopped';
  icon?: string;
}

interface PerformanceData {
  time: string;
  cpu: number;
  memory: number;
  network: number;
}

interface DeviceInfo {
  model: string;
  androidVersion: string;
  sdkVersion: string;
  totalRam: string;
  availableRam: string;
  totalStorage: string;
  availableStorage: string;
  batteryLevel: number;
  batteryStatus: string;
  cpuCores: number;
  cpuFreq: string;
  screenResolution: string;
  density: string;
}

// Mock data generators
const generateMockProcesses = (): Process[] => [
  { id: '1', name: 'System', packageName: 'android.system', cpu: 2.5, memory: 156, pid: 1, status: 'running' },
  { id: '2', name: 'System UI', packageName: 'com.android.systemui', cpu: 1.8, memory: 234, pid: 1234, status: 'running' },
  { id: '3', name: 'Chrome', packageName: 'com.android.chrome', cpu: 5.2, memory: 412, pid: 2345, status: 'running' },
  { id: '4', name: 'YouTube', packageName: 'com.google.android.youtube', cpu: 8.1, memory: 389, pid: 3456, status: 'running' },
  { id: '5', name: 'Gmail', packageName: 'com.google.android.gm', cpu: 1.2, memory: 178, pid: 4567, status: 'running' },
  { id: '6', name: 'Maps', packageName: 'com.google.android.apps.maps', cpu: 3.4, memory: 267, pid: 5678, status: 'running' },
  { id: '7', name: 'Photos', packageName: 'com.google.android.apps.photos', cpu: 2.1, memory: 198, pid: 6789, status: 'running' },
  { id: '8', name: 'Drive', packageName: 'com.google.android.apps.docs', cpu: 0.8, memory: 145, pid: 7890, status: 'running' },
  { id: '9', name: 'Play Store', packageName: 'com.android.vending', cpu: 4.5, memory: 234, pid: 8901, status: 'running' },
  { id: '10', name: 'Settings', packageName: 'com.android.settings', cpu: 1.5, memory: 123, pid: 9012, status: 'running' },
  { id: '11', name: 'Messages', packageName: 'com.google.android.apps.messaging', cpu: 0.9, memory: 89, pid: 1111, status: 'running' },
  { id: '12', name: 'Phone', packageName: 'com.android.dialer', cpu: 0.5, memory: 67, pid: 2222, status: 'running' },
  { id: '13', name: 'Contacts', packageName: 'com.android.contacts', cpu: 0.3, memory: 45, pid: 3333, status: 'running' },
  { id: '14', name: 'Calendar', packageName: 'com.google.android.calendar', cpu: 0.4, memory: 78, pid: 4444, status: 'running' },
  { id: '15', name: 'Clock', packageName: 'com.google.android.deskclock', cpu: 0.2, memory: 34, pid: 5555, status: 'running' },
];

const generatePerformanceHistory = (points: number = 60): PerformanceData[] => {
  const data: PerformanceData[] = [];
  const now = new Date();
  for (let i = points - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 1000);
    data.push({
      time: time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      cpu: Math.random() * 30 + 10,
      memory: Math.random() * 40 + 50,
      network: Math.random() * 20,
    });
  }
  return data;
};

const getDeviceInfo = (): DeviceInfo => ({
  model: 'Android Device',
  androidVersion: '14',
  sdkVersion: '34',
  totalRam: '8.00 GB',
  availableRam: '3.24 GB',
  totalStorage: '128.00 GB',
  availableStorage: '45.67 GB',
  batteryLevel: 78,
  batteryStatus: 'Discharging',
  cpuCores: 8,
  cpuFreq: '2.84 GHz',
  screenResolution: '2400 x 1080',
  density: '400 dpi',
});



// Components
function ProcessTable({
  processes,
  selectedProcess,
  onSelectProcess,
  onEndTask,
  sortConfig,
  onSort
}: {
  processes: Process[];
  selectedProcess: string | null;
  onSelectProcess: (id: string) => void;
  onEndTask: (id: string) => void;
  sortConfig: { key: keyof Process; direction: 'asc' | 'desc' } | null;
  onSort: (key: keyof Process) => void;
}) {
  const getSortIcon = (key: keyof Process) => {
    if (sortConfig?.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
  };

  return (
    <div className="flex-1 overflow-auto">
      <table className="process-table">
        <thead>
          <tr>
            <th onClick={() => onSort('name')} className="flex items-center gap-1">
              Name {getSortIcon('name')}
            </th>
            <th onClick={() => onSort('pid')} className="text-right">
              PID {getSortIcon('pid')}
            </th>
            <th onClick={() => onSort('status')}>
              Status {getSortIcon('status')}
            </th>
            <th onClick={() => onSort('cpu')} className="text-right">
              CPU {getSortIcon('cpu')}
            </th>
            <th onClick={() => onSort('memory')} className="text-right">
              Memory {getSortIcon('memory')}
            </th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((process) => (
            <tr
              key={process.id}
              className={selectedProcess === process.id ? 'selected' : ''}
              onClick={() => onSelectProcess(process.id)}
            >
              <td>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {process.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{process.name}</div>
                    <div className="text-xs text-muted-foreground">{process.packageName}</div>
                  </div>
                </div>
              </td>
              <td className="text-right font-mono">{process.pid}</td>
              <td>
                <span className={cn(
                  'text-xs px-2 py-1 rounded-full',
                  process.status === 'running' && 'bg-green-500/20 text-green-400',
                  process.status === 'suspended' && 'bg-yellow-500/20 text-yellow-400',
                  process.status === 'stopped' && 'bg-red-500/20 text-red-400',
                )}>
                  {process.status}
                </span>
              </td>
              <td className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <div className="w-16 progress-bar">
                    <div
                      className={cn(
                        'progress-bar-fill',
                        process.cpu > 10 && 'high',
                        process.cpu > 5 && process.cpu <= 10 && 'medium'
                      )}
                      style={{ width: `${Math.min(process.cpu * 5, 100)}%` }}
                    />
                  </div>
                  <span className="font-mono w-12">{process.cpu.toFixed(1)}%</span>
                </div>
              </td>
              <td className="text-right font-mono">{process.memory} MB</td>
              <td className="text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEndTask(process.id);
                  }}
                  className="wm-button danger text-xs py-1 px-3"
                >
                  End Task
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PerformanceTab({
  performanceData,
  deviceInfo
}: {
  performanceData: PerformanceData[];
  deviceInfo: DeviceInfo;
}) {
  const currentData = performanceData[performanceData.length - 1];

  return (
    <div className="p-4 space-y-4 overflow-auto">
      {/* CPU Section */}
      <div className="performance-chart p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold">CPU</h3>
              <p className="text-xs text-muted-foreground">{deviceInfo.cpuCores} cores @ {deviceInfo.cpuFreq}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{currentData?.cpu.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Utilization</div>
          </div>
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0078d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0078d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis hide domain={[0, 100]} />
              <Area
                type="monotone"
                dataKey="cpu"
                stroke="#0078d4"
                fill="url(#cpuGradient)"
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Memory Section */}
      <div className="performance-chart p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold">Memory</h3>
              <p className="text-xs text-muted-foreground">{deviceInfo.availableRam} available of {deviceInfo.totalRam}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{currentData?.memory.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">In use</div>
          </div>
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00b294" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00b294" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis hide domain={[0, 100]} />
              <Area
                type="monotone"
                dataKey="memory"
                stroke="#00b294"
                fill="url(#memoryGradient)"
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500/50" />
            <span>In use: {(parseFloat(deviceInfo.totalRam) * (currentData?.memory || 0) / 100).toFixed(2)} GB</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-600" />
            <span>Available: {deviceInfo.availableRam}</span>
          </div>
        </div>
      </div>

      {/* Network Section */}
      <div className="performance-chart p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Wifi className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold">Network</h3>
              <p className="text-xs text-muted-foreground">Wi-Fi connected</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{currentData?.network.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Activity</div>
          </div>
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="networkGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#881798" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#881798" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis hide domain={[0, 100]} />
              <Area
                type="monotone"
                dataKey="network"
                stroke="#881798"
                fill="url(#networkGradient)"
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-purple-500" />
            <span>Send: 2.34 GB</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-purple-300" />
            <span>Receive: 8.91 GB</span>
          </div>
        </div>
      </div>

      {/* Battery Section */}
      <div className="performance-chart p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Battery className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-semibold">Battery</h3>
              <p className="text-xs text-muted-foreground">{deviceInfo.batteryStatus}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{deviceInfo.batteryLevel}%</div>
            <div className="text-xs text-muted-foreground">Remaining</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="progress-bar h-6 rounded-full">
            <div
              className={cn(
                'progress-bar-fill h-full rounded-full transition-all duration-500',
                deviceInfo.batteryLevel < 20 && 'bg-red-500',
                deviceInfo.batteryLevel >= 20 && deviceInfo.batteryLevel < 50 && 'bg-yellow-500',
                deviceInfo.batteryLevel >= 50 && 'bg-green-500'
              )}
              style={{ width: `${deviceInfo.batteryLevel}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function AppManagerTab({
  processes,
  onUninstall,
  onForceStop,
  onClearData
}: {
  processes: Process[];
  onUninstall: (id: string) => void;
  onForceStop: (id: string) => void;
  onClearData: (id: string) => void;
}) {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  return (
    <div className="flex-1 flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'p-2 rounded transition-colors',
              viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
            )}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'p-2 rounded transition-colors',
              viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          {selectedApp && (
            <>
              <button
                onClick={() => onForceStop(selectedApp)}
                className="wm-button danger text-sm"
              >
                <X className="w-4 h-4 inline mr-1" />
                Force Stop
              </button>
              <button
                onClick={() => onClearData(selectedApp)}
                className="wm-button text-sm"
              >
                <Trash2 className="w-4 h-4 inline mr-1" />
                Clear Data
              </button>
              <button
                onClick={() => onUninstall(selectedApp)}
                className="wm-button danger text-sm"
              >
                <Trash2 className="w-4 h-4 inline mr-1" />
                Uninstall
              </button>
            </>
          )}
        </div>
      </div>

      {/* App List/Grid */}
      <div className="flex-1 overflow-auto p-4">
        {viewMode === 'list' ? (
          <div className="space-y-2">
            {processes.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app.id)}
                className={cn(
                  'flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors',
                  selectedApp === app.id ? 'bg-primary/20 border border-primary/50' : 'bg-card hover:bg-secondary border border-transparent'
                )}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-xl font-bold text-primary">
                  {app.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{app.name}</h4>
                  <p className="text-xs text-muted-foreground">{app.packageName}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono">{app.memory} MB</div>
                  <div className="text-xs text-muted-foreground">{app.cpu.toFixed(1)}% CPU</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {processes.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app.id)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-lg cursor-pointer transition-colors',
                  selectedApp === app.id ? 'bg-primary/20 border border-primary/50' : 'bg-card hover:bg-secondary border border-transparent'
                )}
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                  {app.name.charAt(0)}
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-sm truncate max-w-[80px]">{app.name}</h4>
                  <p className="text-xs text-muted-foreground">{app.memory} MB</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DeviceInfoTab({ deviceInfo }: { deviceInfo: DeviceInfo }) {
  return (
    <div className="p-4 overflow-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="info-card">
          <div className="info-card-title">Device Model</div>
          <div className="info-card-value">{deviceInfo.model}</div>
          <div className="info-card-subtitle">Android {deviceInfo.androidVersion} (API {deviceInfo.sdkVersion})</div>
        </div>

        <div className="info-card">
          <div className="info-card-title">Processor</div>
          <div className="info-card-value">{deviceInfo.cpuCores} Cores</div>
          <div className="info-card-subtitle">{deviceInfo.cpuFreq} max frequency</div>
        </div>

        <div className="info-card">
          <div className="info-card-title">Total RAM</div>
          <div className="info-card-value">{deviceInfo.totalRam}</div>
          <div className="info-card-subtitle">{deviceInfo.availableRam} available</div>
        </div>

        <div className="info-card">
          <div className="info-card-title">Storage</div>
          <div className="info-card-value">{deviceInfo.totalStorage}</div>
          <div className="info-card-subtitle">{deviceInfo.availableStorage} free</div>
        </div>

        <div className="info-card">
          <div className="info-card-title">Screen Resolution</div>
          <div className="info-card-value">{deviceInfo.screenResolution}</div>
          <div className="info-card-subtitle">{deviceInfo.density} pixel density</div>
        </div>

        <div className="info-card">
          <div className="info-card-title">Battery</div>
          <div className="info-card-value">{deviceInfo.batteryLevel}%</div>
          <div className="info-card-subtitle">{deviceInfo.batteryStatus}</div>
        </div>
      </div>

      {/* Storage breakdown */}
      <div className="mt-6 performance-chart p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <HardDrive className="w-5 h-5" />
          Storage Breakdown
        </h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Apps</span>
              <span className="text-muted-foreground">45.2 GB</span>
            </div>
            <div className="progress-bar h-2">
              <div className="progress-bar-fill bg-blue-500" style={{ width: '45%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>System</span>
              <span className="text-muted-foreground">28.5 GB</span>
            </div>
            <div className="progress-bar h-2">
              <div className="progress-bar-fill bg-green-500" style={{ width: '28%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Media</span>
              <span className="text-muted-foreground">8.6 GB</span>
            </div>
            <div className="progress-bar h-2">
              <div className="progress-bar-fill bg-purple-500" style={{ width: '9%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Free</span>
              <span className="text-muted-foreground">45.7 GB</span>
            </div>
            <div className="progress-bar h-2">
              <div className="progress-bar-fill bg-gray-600" style={{ width: '18%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const [activeTab, setActiveTab] = useState<'processes' | 'performance' | 'apps' | 'device'>('processes');
  const [processes, setProcesses] = useState<Process[]>([]);
  const [filteredProcesses, setFilteredProcesses] = useState<Process[]>([]);
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [deviceInfo] = useState<DeviceInfo>(getDeviceInfo());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Process; direction: 'asc' | 'desc' } | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  // Initialize data
  useEffect(() => {
    const initialProcesses = generateMockProcesses();
    setProcesses(initialProcesses);
    setFilteredProcesses(initialProcesses);
    setPerformanceData(generatePerformanceHistory());
  }, []);

  // Update performance data every second
  useEffect(() => {
    const interval = setInterval(() => {
      setPerformanceData(prev => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          cpu: Math.random() * 30 + 10,
          memory: Math.random() * 40 + 50,
          network: Math.random() * 20,
        });
        return newData;
      });

      // Update process CPU/memory randomly
      setProcesses(prev => prev.map(p => ({
        ...p,
        cpu: Math.max(0.1, p.cpu + (Math.random() - 0.5) * 2),
        memory: Math.max(10, p.memory + Math.floor((Math.random() - 0.5) * 10)),
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Filter processes based on search
  useEffect(() => {
    let filtered = processes;
    if (searchQuery) {
      filtered = processes.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.packageName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue === undefined || bValue === undefined) return 0;
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredProcesses(filtered);
  }, [processes, searchQuery, sortConfig]);

  const handleSort = (key: keyof Process) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'desc' };
    });
  };

  const handleEndTask = (id: string) => {
    setProcesses(prev => prev.filter(p => p.id !== id));
    if (selectedProcess === id) {
      setSelectedProcess(null);
    }
  };

  const handleUninstall = (id: string) => {
    setProcesses(prev => prev.filter(p => p.id !== id));
    setSelectedProcess(null);
  };

  const handleForceStop = (id: string) => {
    setProcesses(prev => prev.map(p =>
      p.id === id ? { ...p, status: 'stopped' as const } : p
    ));
  };

  const handleClearData = (id: string) => {
    // Mock clear data
    alert(`Cleared data for app ${id}`);
  };

  const handleRefresh = () => {
    setProcesses(generateMockProcesses());
    setPerformanceData(generatePerformanceHistory());
  };

  return (
    <div className="task-manager min-h-screen flex flex-col">
      {/* Title Bar */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-primary" />
          <h1 className="text-lg font-semibold">Task Manager</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            title="Refresh"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[150px] z-50">
                <button className="w-full px-4 py-2 text-left hover:bg-secondary flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-secondary flex items-center gap-2 text-red-400">
                  <X className="w-4 h-4" />
                  Exit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="menu-bar">
        <span className="menu-item">File</span>
        <span className="menu-item">Options</span>
        <span className="menu-item">View</span>
        <span className="menu-item">Help</span>
      </div>

      {/* Tabs */}
      <div className="wm-tabs flex">
        <button
          onClick={() => setActiveTab('processes')}
          className={cn('wm-tab', activeTab === 'processes' && 'active')}
        >
          <List className="w-4 h-4 inline mr-2" />
          Processes
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={cn('wm-tab', activeTab === 'performance' && 'active')}
        >
          <Activity className="w-4 h-4 inline mr-2" />
          Performance
        </button>
        <button
          onClick={() => setActiveTab('apps')}
          className={cn('wm-tab', activeTab === 'apps' && 'active')}
        >
          <LayoutGrid className="w-4 h-4 inline mr-2" />
          App Manager
        </button>
        <button
          onClick={() => setActiveTab('device')}
          className={cn('wm-tab', activeTab === 'device' && 'active')}
        >
          <Smartphone className="w-4 h-4 inline mr-2" />
          Device Info
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Search bar for Processes and Apps tabs */}
        {(activeTab === 'processes' || activeTab === 'apps') && (
          <div className="p-3 border-b border-border flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search processes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'processes' && (
          <ProcessTable
            processes={filteredProcesses}
            selectedProcess={selectedProcess}
            onSelectProcess={setSelectedProcess}
            onEndTask={handleEndTask}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        )}

        {activeTab === 'performance' && (
          <PerformanceTab
            performanceData={performanceData}
            deviceInfo={deviceInfo}
          />
        )}

        {activeTab === 'apps' && (
          <AppManagerTab
            processes={filteredProcesses}
            onUninstall={handleUninstall}
            onForceStop={handleForceStop}
            onClearData={handleClearData}
          />
        )}

        {activeTab === 'device' && (
          <DeviceInfoTab deviceInfo={deviceInfo} />
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-card border-t border-border px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Processes: {processes.length}</span>
          <span>CPU: {performanceData[performanceData.length - 1]?.cpu.toFixed(1)}%</span>
          <span>Memory: {performanceData[performanceData.length - 1]?.memory.toFixed(1)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-2 h-2 rounded-full',
            performanceData[performanceData.length - 1]?.cpu > 80 ? 'bg-red-500' : 'bg-green-500'
          )} />
          <span>System Running</span>
        </div>
      </div>
    </div>
  );
}

export default App;
