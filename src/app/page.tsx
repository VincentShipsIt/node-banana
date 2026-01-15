'use client';

import { ReactFlowProvider } from '@xyflow/react';
import { useEffect } from 'react';
import { AnnotationModal } from '@/components/AnnotationModal';
import { FloatingActionBar } from '@/components/FloatingActionBar';
import { Header } from '@/components/Header';
import { WorkflowCanvas } from '@/components/WorkflowCanvas';
import { useWorkflowStore } from '@/store/workflowStore';

export default function Home() {
  const initializeAutoSave = useWorkflowStore((state) => state.initializeAutoSave);
  const cleanupAutoSave = useWorkflowStore((state) => state.cleanupAutoSave);

  useEffect(() => {
    initializeAutoSave();
    return () => cleanupAutoSave();
  }, [initializeAutoSave, cleanupAutoSave]);

  return (
    <ReactFlowProvider>
      <div className="h-screen flex flex-col">
        <Header />
        <WorkflowCanvas />
        <FloatingActionBar />
        <AnnotationModal />
      </div>
    </ReactFlowProvider>
  );
}
