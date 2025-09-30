"use client";
import React, { useState } from "react";
import {
  KanbanComponent,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-react-kanban";

export default function TaskTracker() {
  // Local tasks state
  const [tasks, setTasks] = useState([
    {
      Id: "1",
      title: "Design Homepage",
      description: "UI/UX for homepage",
      status: "Planning",
    },
    {
      Id: "2",
      title: "API Setup",
      description: "Set up Next.js API routes",
      status: "Pending",
    },
    {
      Id: "3",
      title: "Database Schema",
      description: "Design MongoDB schema",
      status: "Completed",
    },
  ]);

  // Handle card drop (drag & drop between columns)
  const onCardDrop = (args) => {
    if (args.changedRecords && args.changedRecords.length > 0) {
      const updatedTasks = tasks.map((task) =>
        task.Id === args.changedRecords[0].Id
          ? { ...task, status: args.dropKey }
          : task,
      );
      setTasks(updatedTasks);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Team Task Tracker</h1>
      <KanbanComponent
        id="kanban"
        keyField="status"
        dataSource={tasks}
        cardSettings={{
          contentField: "description",
          headerField: "title",
        }}
        cardDrop={onCardDrop}
      >
        <ColumnsDirective>
          <ColumnDirective headerText="Planning" keyField="Planning" />
          <ColumnDirective headerText="Pending" keyField="Pending" />
          <ColumnDirective headerText="Completed" keyField="Completed" />
        </ColumnsDirective>
      </KanbanComponent>
    </div>
  );
}
