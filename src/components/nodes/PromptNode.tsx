'use client';

import { Handle, type Node, type NodeProps, Position } from '@xyflow/react';
import { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { PromptEditorModal } from '@/components/modals/PromptEditorModal';
import { useWorkflowStore } from '@/store/workflowStore';
import type { PromptNodeData } from '@/types';
import { BaseNode } from './BaseNode';

type PromptNodeType = Node<PromptNodeData, 'prompt'>;

export function PromptNode({ id, data, selected }: NodeProps<PromptNodeType>) {
  const nodeData = data;
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const incrementModalCount = useWorkflowStore((state) => state.incrementModalCount);
  const decrementModalCount = useWorkflowStore((state) => state.decrementModalCount);
  const [isModalOpenLocal, setIsModalOpenLocal] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateNodeData(id, { prompt: e.target.value });
    },
    [id, updateNodeData]
  );

  const handleOpenModal = useCallback(() => {
    setIsModalOpenLocal(true);
    incrementModalCount();
  }, [incrementModalCount]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpenLocal(false);
    decrementModalCount();
  }, [decrementModalCount]);

  const handleSubmitModal = useCallback(
    (prompt: string) => {
      updateNodeData(id, { prompt });
    },
    [id, updateNodeData]
  );

  return (
    <>
      <BaseNode
        id={id}
        title="Prompt"
        customTitle={nodeData.customTitle}
        comment={nodeData.comment}
        onCustomTitleChange={(title) => updateNodeData(id, { customTitle: title || undefined })}
        onCommentChange={(comment) => updateNodeData(id, { comment: comment || undefined })}
        onExpand={handleOpenModal}
        selected={selected}
      >
        <textarea
          value={nodeData.prompt}
          onChange={handleChange}
          placeholder="Describe what to generate..."
          className="nodrag nopan nowheel w-full flex-1 min-h-[70px] p-2 text-xs leading-relaxed text-neutral-100 border border-neutral-700 rounded bg-neutral-900/50 resize-none focus:outline-none focus:ring-1 focus:ring-neutral-600 focus:border-neutral-600 placeholder:text-neutral-500"
        />

        <Handle type="source" position={Position.Right} id="text" data-handletype="text" />
      </BaseNode>

      {/* Modal - rendered via portal to escape React Flow stacking context */}
      {isModalOpenLocal &&
        createPortal(
          <PromptEditorModal
            isOpen={isModalOpenLocal}
            initialPrompt={nodeData.prompt}
            onSubmit={handleSubmitModal}
            onClose={handleCloseModal}
          />,
          document.body
        )}
    </>
  );
}
