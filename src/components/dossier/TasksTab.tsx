
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/dossier';
import { Plus } from 'lucide-react';

interface TasksTabProps {
  dossierId: string;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Récupérer bulletins de paie manquants',
    assigneeId: 'user1',
    dueAt: '2024-07-20',
    status: 'Todo',
    dossierId: '1'
  },
  {
    id: '2',
    title: 'Rédiger conclusions principales',
    assigneeId: 'user1',
    status: 'Doing',
    dossierId: '1'
  },
  {
    id: '3',
    title: 'Déposer au greffe',
    status: 'Done',
    dossierId: '1'
  }
];

const statusLabels = {
  Todo: 'À faire',
  Doing: 'En cours',
  Done: 'Terminé'
};

export const TasksTab = ({ dossierId }: TasksTabProps) => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      status: 'Todo',
      dossierId
    };
    
    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle('');
  };

  const moveTask = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    
    // Log audit trail
    console.log('Audit: Task moved', { taskId, newStatus, dossierId });
  };

  const getTasksByStatus = (status: Task['status']) => 
    tasks.filter(task => task.status === status);

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'Todo': return 'bg-gray-100 text-gray-700';
      case 'Doing': return 'bg-blue-100 text-blue-700';
      case 'Done': return 'bg-green-100 text-green-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Add new task */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Nouvelle tâche..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              className="flex-1"
            />
            <Button onClick={addTask} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(['Todo', 'Doing', 'Done'] as const).map((status) => (
          <Card key={status} className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {statusLabels[status]}
                <Badge variant="secondary">
                  {getTasksByStatus(status).length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getTasksByStatus(status).map((task) => (
                  <div
                    key={task.id}
                    className="p-3 border rounded-lg bg-white hover:shadow-sm transition-shadow cursor-pointer"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('taskId', task.id);
                      e.dataTransfer.setData('currentStatus', task.status);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const draggedTaskId = e.dataTransfer.getData('taskId');
                      const currentStatus = e.dataTransfer.getData('currentStatus');
                      if (draggedTaskId && currentStatus !== status) {
                        moveTask(draggedTaskId, status);
                      }
                    }}
                  >
                    <h4 className="font-medium text-sm mb-2">{task.title}</h4>
                    {task.dueAt && (
                      <p className="text-xs text-muted-foreground">
                        Échéance: {new Date(task.dueAt).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                    <div className="flex gap-1 mt-2">
                      {status !== 'Todo' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveTask(task.id, 'Todo')}
                          className="text-xs h-6"
                        >
                          À faire
                        </Button>
                      )}
                      {status !== 'Doing' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveTask(task.id, 'Doing')}
                          className="text-xs h-6"
                        >
                          En cours
                        </Button>
                      )}
                      {status !== 'Done' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveTask(task.id, 'Done')}
                          className="text-xs h-6"
                        >
                          Terminé
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
