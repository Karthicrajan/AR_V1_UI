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
import { Card, Button, Input } from "antd";
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

export default function SortableFilter({ onApply, brnLoading, isDisabled }) {

  const [mcare_limit, setMcareLimit] = useState("30");
  const [bcbs_limit, setBcbsLimit] = useState("30");
  const [other_limit, setOtherLimit] = useState("15");
  const [high_aging_threshold, setHighAging] = useState("2000");
  const [priority_ar_threshold, setPriorityAr] = useState("2000");
  const [stop_when_limit_reached, setTotalUserLimit] = useState("25");
  const [stopWhenLimitReached, setStopWhenLimitReached] = useState(false);

  return (
    <Card
      title="Filter"
      className="w-full rounded-xl shadow-md border border-gray-200"
    >
      
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">MCARE limit per user</label>
        <Input
          type="number"
          value={mcare_limit}
          onChange={e => setMcareLimit(e.target.value)}
          placeholder="Enter MCARE limit"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">BCBS limit per user</label>
        <Input
          type="number"
          value={bcbs_limit}
          onChange={e => setBcbsLimit(e.target.value)}
          placeholder="Enter BCBS limit"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">OTHER limit per user</label>
        <Input
          type="number"
          value={other_limit}
          onChange={e => setOtherLimit(e.target.value)}
          placeholder="Enter OTHER limit"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">High Aging</label>
        <Input
          type="number"
          value={high_aging_threshold}
          onChange={e => setHighAging(e.target.value)}
          placeholder="Enter High Aging Threshold"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Priority A/R</label>
        <Input
          type="number"
          value={priority_ar_threshold}
          onChange={e => setPriorityAr(e.target.value)}
          placeholder="Enter Priority A/R Threshold"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Total User limit</label>
        <Input
          type="number"
          value={stop_when_limit_reached}
          onChange={e => setTotalUserLimit(e.target.value)}
          placeholder="Enter Total User Limit"
        />
      </div>
      <div className="mb-2 flex items-center">
        <input
          type="checkbox"
          id="stop_when_limit_reached"
          checked={stopWhenLimitReached}
          onChange={e => setStopWhenLimitReached(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="stop_when_limit_reached" className="text-sm font-medium">
          Stop when limit reached
        </label>
      </div>
      <Button
        type="primary"
        block
        className="mt-2"
        loading={brnLoading}
        disabled={isDisabled}
        onClick={() => onApply?.({
          mcare_limit,
          bcbs_limit,
          other_limit,
          high_aging_threshold,
          priority_ar_threshold,
          stop_when_limit_reached,
          stop_when_limit_reached: stopWhenLimitReached
        })}
      >
        Apply Filter and Upload File
      </Button>
    </Card>
  );
}
