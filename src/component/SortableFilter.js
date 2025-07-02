// components/SortableFilter.js


import { useState } from "react";
import { Card, Button, Input } from "antd";
import TextArea from "antd/es/input/TextArea";


export default function SortableFilter({ onApply, brnLoading, isDisabled }) {

  const [mcare_limit, setMcareLimit] = useState("30");
  const [bcbs_limit, setBcbsLimit] = useState("30");
  const [other_limit, setOtherLimit] = useState("15");
  const [high_aging_threshold, setHighAging] = useState("2000");
  const [priority_ar_threshold, setPriorityAr] = useState("2000");
  const [total_user_limit, setTotalUserLimit] = useState("25");
  const [users, setUsers] = useState("");
  const [userError, setUserError] = useState(false)

  return (
    <Card
      title="Filter"
      className="w-full rounded-xl shadow-md border border-gray-200"
    >
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="mb-2 col-span-3">
          <label className="block text-sm font-medium mb-1">MCARE limit per user</label>
          <Input
            type="number"
            value={mcare_limit}
            onChange={e => setMcareLimit(e.target.value)}
            placeholder="Enter MCARE limit"
          />
        </div>
        <div className="mb-2 col-span-3">
          <label className="block text-sm font-medium mb-1">BCBS limit per user</label>
          <Input
            type="number"
            value={bcbs_limit}
            onChange={e => setBcbsLimit(e.target.value)}
            placeholder="Enter BCBS limit"
          />
        </div>
        <div className="mb-2 col-span-3">
          <label className="block text-sm font-medium mb-1">OTHER limit per user</label>
          <Input
            type="number"
            value={other_limit}
            onChange={e => setOtherLimit(e.target.value)}
            placeholder="Enter OTHER limit"
          />
        </div>
        <div className="mb-2 col-span-3">
          <label className="block text-sm font-medium mb-1">High Aging</label>
          <Input
            type="number"
            value={high_aging_threshold}
            onChange={e => setHighAging(e.target.value)}
            placeholder="Enter High Aging Threshold"
          />
        </div>
        <div className="mb-2 col-span-3">
          <label className="block text-sm font-medium mb-1">Priority A/R</label>
          <Input
            type="number"
            value={priority_ar_threshold}
            onChange={e => setPriorityAr(e.target.value)}
            placeholder="Enter Priority A/R Threshold"
          />
        </div>
        <div className="mb-2 col-span-3">
          <label className="block text-sm font-medium mb-1">Total User limit</label>
          <Input
            type="number"
            value={total_user_limit}
            onChange={e => setTotalUserLimit(e.target.value)}
            placeholder="Enter Total User Limit"
          />
        </div>
        <div className="mb-2 flex items-end col-span-6 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">User(seprate the user by comma)</label>
            <TextArea
              rows={1}
              value={users}
              onChange={e => setUsers(e.target.value)}
              placeholder="Enter the User Name"
            />
          </div>
          <div>
            {userError && <p className="text-red-500">Total user limit and user count not match</p>}
          </div>
        </div>

      </div>
      <Button
        type="primary"
        block
        className="mt-2"
        loading={brnLoading}
        disabled={isDisabled}
        onClick={() => {
          if (users.split(",").length != total_user_limit)
            setUserError(true);
          else {
            setUserError(false)
            onApply?.({
              mcare_limit,
              bcbs_limit,
              other_limit,
              high_aging_threshold,
              priority_ar_threshold,
              total_user_limit,
              users,
            })
          }
        }}
      >
        Apply Filter and Upload File
      </Button>
    </Card>
  );
}
