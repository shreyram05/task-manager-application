import { useContext, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { AuthContext } from "./contexts/AuthContext";

const statusOptions = ["To Do", "In Progress", "Done"];

function TaskManager() {
  const { user } = useContext(AuthContext);

  const storageKey = user
    ? `task-manager-tasks:${user.username.toLowerCase()}`
    : "task-manager-tasks";

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem(storageKey);
      const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];
      return Array.isArray(parsedTasks) ? parsedTasks : [];
    } catch {
      return [];
    }
  });

  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState("All Tasks");

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(tasks));
    } catch {
      console.log("Could not save tasks.");
    }
  }, [tasks, storageKey]);

  function addTask(event) {
    event.preventDefault();

    const trimmedTask = task.trim();

    if (!trimmedTask) {
      return;
    }

    if (editId !== null) {
      setTasks((previousTasks) =>
        previousTasks.map((item) =>
          item.id === editId ? { ...item, title: trimmedTask } : item,
        ),
      );

      setEditId(null);
    } else {
      const newTask = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: trimmedTask,
        status: "To Do",
      };

      setTasks((previousTasks) => [...previousTasks, newTask]);
    }
    setTask("");
  }

  function deleteTask(taskId) {
    setTasks((previousTasks) =>
      previousTasks.filter((item) => item.id !== taskId),
    );

    if (editId === taskId) {
      setEditId(null);
      setTask("");
    }
  }

  function editTask(taskId) {
    const selectedTask = tasks.find((item) => item.id === taskId);

    if (selectedTask) {
      setTask(selectedTask.title);
      setEditId(selectedTask.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function cancelEdit() {
    setEditId(null);
    setTask("");
  }

  function updateStatus(taskId, newStatus) {
    setTasks((previousTasks) =>
      previousTasks.map((item) =>
        item.id === taskId ? { ...item, status: newStatus } : item,
      ),
    );
  }

  // Reorder tasks using the visible filtered list.
  function handleDragEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.source.index === result.destination.index) {
      return;
    }

    const sourceTask = filteredTasks[result.source.index];
    const targetTask = filteredTasks[result.destination.index];

    if (!sourceTask || !targetTask) {
      return;
    }

    setTasks((previousTasks) => {
      const reorderedTasks = [...previousTasks];
      const sourceIndex = reorderedTasks.findIndex(
        (item) => item.id === sourceTask.id,
      );

      const [movedTask] = reorderedTasks.splice(sourceIndex, 1);

      // Find the target again after removing the moved task.
      const targetIndex = reorderedTasks.findIndex(
        (item) => item.id === targetTask.id,
      );

      // Moving downward means inserting after the target.
      const insertIndex =
        result.source.index < result.destination.index
          ? targetIndex + 1
          : targetIndex;

      reorderedTasks.splice(insertIndex, 0, movedTask);

      return reorderedTasks;
    });
  }

  const filteredTasks =
    activeTab === "All Tasks"
      ? tasks
      : tasks.filter((item) => item.status === activeTab);

  const todoCount = tasks.filter((item) => item.status === "To Do").length;

  const progressCount = tasks.filter(
    (item) => item.status === "In Progress",
  ).length;

  const completedCount = tasks.filter((item) => item.status === "Done").length;

  const tabs = [
    { label: "All Tasks", count: tasks.length },
    { label: "To Do", count: todoCount },
    { label: "In Progress", count: progressCount },
    { label: "Done", count: completedCount },
  ];

  function statusStyle(status) {
    if (status === "Done") {
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
    }

    if (status === "In Progress") {
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
    }

    return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
  }

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
          YOUR WORKSPACE
        </p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight">My Tasks</h2>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">To Do</p>
          <p className="mt-2 text-3xl font-bold">{todoCount}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            In Progress
          </p>
          <p className="mt-2 text-3xl font-bold">{progressCount}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Completed
          </p>
          <p className="mt-2 text-3xl font-bold">{completedCount}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-semibold">
          {editId !== null ? "Edit task" : "Add a new task"}
        </h3>

        <form
          onSubmit={addTask}
          className="mt-4 flex flex-col gap-3 sm:flex-row"
        >
          <input
            value={task}
            onChange={(event) => setTask(event.target.value)}
            placeholder="What do you need to do?"
            aria-label="Task title"
            className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-indigo-950"
          />

          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            {editId !== null ? "Save changes" : "+ Add task"}
          </button>

          {editId !== null && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-slate-300 px-4 py-3 font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
          )}
        </form>
      </section>

      <section>
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActiveTab(tab.label)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.label
                  ? "bg-indigo-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {tab.label}
              <span className="ml-2 opacity-75">{tab.count}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-semibold">{activeTab}</h3>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Drag a task onto another task to reorder it.
          </p>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-12 text-center dark:border-slate-700">
            <p className="text-lg font-semibold">No tasks here yet</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Add a task or choose another filter.
            </p>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="task-list">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-3"
                >
                  {filteredTasks.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={String(item.id)}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            ...provided.draggableProps.style,
                          }}
                          className={`rounded-xl border bg-white p-4 transition dark:bg-slate-900 ${
                            snapshot.isDragging
                              ? "border-indigo-400 shadow-lg"
                              : "border-slate-200 hover:border-indigo-300 dark:border-slate-800 dark:hover:border-indigo-700"
                          }`}
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 flex-1 items-start gap-3">
                              <span
                                {...provided.dragHandleProps}
                                className="mt-1 cursor-grab select-none text-slate-400 active:cursor-grabbing"
                                title="Drag to reorder"
                                aria-label={`Drag ${item.title} to reorder`}
                              >
                                ⠿
                              </span>

                              <div className="min-w-0 flex-1">
                                <p
                                  className={`break-words font-semibold ${
                                    item.status === "Done"
                                      ? "text-slate-400 line-through"
                                      : "text-slate-800 dark:text-slate-100"
                                  }`}
                                >
                                  {item.title}
                                </p>

                                <span
                                  className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(item.status)}`}
                                >
                                  {item.status}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <select
                                value={item.status}
                                onChange={(event) =>
                                  updateStatus(item.id, event.target.value)
                                }
                                aria-label={`Status for ${item.title}`}
                                className="max-w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                              >
                                {statusOptions.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>

                              <button
                                type="button"
                                onClick={() => editTask(item.id)}
                                className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300 dark:hover:bg-amber-900"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => deleteTask(item.id)}
                                className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-300 dark:hover:bg-rose-900"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </section>
    </div>
  );
}

export default TaskManager;
