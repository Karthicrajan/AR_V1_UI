// components/SortableFilter.js

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { Card, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";

function SortableItem({ id }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="flex items-center justify-between bg-white px-4 py-2 mb-2 border rounded shadow-sm cursor-move"
    >
      <span className="font-medium text-gray-700">{id}</span>
      <MenuOutlined className="text-gray-400" />
    </div>
  );
}

export default function SortableFilter({ onApply }) {
  const [items, setItems] = useState([
    "Active",
    "Pending",
    "Completed",
    "On Hold",
    "Draft",
  ]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setItems((prev) => {
        const oldIndex = prev.indexOf(active.id);
        const newIndex = prev.indexOf(over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <Card
      title="Sort Filters"
      className="w-full rounded-xl shadow-md border border-gray-200"
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableItem key={item} id={item} />
          ))}
        </SortableContext>
      </DndContext>

      <Button
        type="primary"
        block
        className="mt-4"
        onClick={() => onApply?.(items)}
      >
        Apply Filter Order
      </Button>
    </Card>
  );
}
