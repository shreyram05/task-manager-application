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
      if (!Array.isArray(parsedTasks)) {
        return [];
      }
      return parsedTasks.map((item) => ({
        ...item,
        id: item.id ?? crypto.randomUUID(),
      }));
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

  // Adds a new task or updates an existing task
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
        id: crypto.randomUUID(),
        title: trimmedTask,
        status: "To Do",
      };

      setTasks((previousTasks) => [...previousTasks, newTask]);
    }
    setTask("");
  }

  // Deletes a task
  function deleteTask(taskId) {
    setTasks((previousTasks) =>
      previousTasks.filter((item) => item.id !== taskId),
    );

    if (editId === taskId) {
      setEditId(null);
      setTask("");
    }
  }

  // Loads the selected task into the input field for editing
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

  // Changes the status of a task
  function updateStatus(taskId, newStatus) {
    setTasks((previousTasks) =>
      previousTasks.map((item) =>
        item.id === taskId ? { ...item, status: newStatus } : item,
      ),
    );
  }

  // Handles the task drag-and-reorder operation and updates task order

  function handleDragEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.source.index === result.destination.index) {
      return;
    }

    const reorderedTasks = [...filteredTasks];

    const [movedTask] = reorderedTasks.splice(result.source.index, 1);

    reorderedTasks.splice(result.destination.index, 0, movedTask);

    setTasks((previousTasks) => {
      if (activeTab === "All Tasks") {
        return reorderedTasks;
      }

      let index = 0;

      return previousTasks.map((item) => {
        if (item.status === activeTab) {
          return reorderedTasks[index++];
        }

        return item;
      });
    });
  }

  const filteredTasks =
    activeTab === "All Tasks"
      ? tasks
      : tasks.filter((item) => item.status === activeTab);

  console.log(
    "Task IDs:",
    tasks.map((item) => ({ title: item.title, id: item.id })),
  );

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

  // Returns the appropriate Tailwind CSS classes for each task status badge
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
                          style={provided.draggableProps.style}
                          className={`rounded-lg border p-4 bg-white dark:bg-slate-900 ${
                            snapshot.isDragging
                              ? "border-indigo-500 shadow-lg"
                              : "border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          <span
                            {...provided.dragHandleProps}
                            style={{ touchAction: "none " }}
                          >
                            ⠿
                          </span>
                          <p
                            className={
                              item.status === "Done"
                                ? "line-through text-gray-400"
                                : "font-semibold"
                            }
                          >
                            {item.title}
                          </p>

                          <p className="my-2 text-sm">Status: {item.status}</p>

                          <select
                            value={item.status}
                            onChange={(event) =>
                              updateStatus(item.id, event.target.value)
                            }
                            className="border rounded bg-white p-2 text-black dark:text-black" 
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
                            className="ml-2 rounded bg-yellow-100 px-3 py-2 dark:text-black"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteTask(item.id)}
                            className="ml-2 rounded bg-red-100 px-3 py-2 dark:text-black"
                          >
                            Delete
                          </button>
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
