import { useContext, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { AuthContext } from "./contexts/AuthContext";
import Button from "./components/Button";

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
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white p-4">
          My Tasks
        </h2>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3 px-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">To Do</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {todoCount}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            In Progress
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {progressCount}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Completed
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {completedCount}
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white sm:p-6 dark:border-slate-800 dark:bg-slate-900 px-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
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
            className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-indigo-950"
          />

          <Button type="submit">
            {editId !== null ? "Save changes" : "+ Add task"}
          </Button>

          {editId !== null && (
            <Button variant="secondary" onClick={cancelEdit}>
              Cancel
            </Button>
          )}
        </form>
      </section>

      <section>
        <div className="flex flex-wrap gap-2 px-4">
          {tabs.map((tab) => (
            <Button
              key={tab.label}
              type="button"
              variant={activeTab === tab.label ? "primary" : "secondary"}
              onClick={() => setActiveTab(tab.label)}
              className={`text-sm ${
                activeTab === tab.label
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  : "border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {tab.label}
              <span className="ml-2 opacity-75">{tab.count}</span>
            </Button>
          ))}
        </div>
      </section>

      <section className="space-y-3 px-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {activeTab}
          </h3>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-12 text-center dark:border-slate-700">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              No tasks here yet
            </p>
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
                          className={`rounded-lg border bg-white p-4 dark:bg-slate-900 ${
                            snapshot.isDragging
                              ? "border-indigo-500 shadow-lg"
                              : "border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          <span
                            {...provided.dragHandleProps}
                            className="text-slate-500 dark:text-slate-400"
                          >
                            ⠿
                          </span>

                          <p
                            className={`font-semibold ${
                              item.status === "Done"
                                ? "line-through text-slate-400 dark:text-slate-500"
                                : "text-slate-900 dark:text-white"
                            }`}
                          >
                            {item.title}
                          </p>

                          <p className="my-2 text-sm text-slate-600 dark:text-slate-300">
                            Status: {item.status}
                          </p>

                          <select
                            value={item.status}
                            onChange={(event) =>
                              updateStatus(item.id, event.target.value)
                            }
                            className="rounded-lg border border-slate-300 bg-white p-2 text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                          >
                            {statusOptions.map((status) => (
                              <option
                                key={status}
                                value={status}
                                className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-200"
                              >
                                {status}
                              </option>
                            ))}
                          </select>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <Button
                              variant="secondary"
                              onClick={() => editTask(item.id)}
                            >
                              Edit
                            </Button>

                            <Button
                              variant="danger"
                              onClick={() => deleteTask(item.id)}
                            >
                              Delete
                            </Button>
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
