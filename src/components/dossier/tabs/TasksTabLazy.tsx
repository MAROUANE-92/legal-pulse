
import React from 'react';
import { TasksTab } from '../TasksTab';
import { useParams } from 'react-router-dom';

const TasksTabLazy = () => {
  const { id } = useParams<{ id: string }>();
  
  return <TasksTab dossierId={id || ''} />;
};

export default TasksTabLazy;
