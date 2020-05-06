import React, { Fragment, useState, useEffect } from "react";
import { ListGroup, ListGroupItem } from "reactstrap";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";

const SortableItem = SortableElement((task) => {
  return (
    <ListGroupItem>
      <h2>
        {task.sorting} - {task.title}
      </h2>
      <p>{task.description}</p>
      <p>{task._id}</p>
    </ListGroupItem>
  );
});

const SortableList = SortableContainer(({ items }) => {
  return (
    <ListGroup>
      {items.map((task, i) => (
        <SortableItem key={i} {...task} index={i} />
      ))}
    </ListGroup>
  );
});

const SortableComponent = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    const res = await fetch("http://localhost:4000/tasks");
    const data = await res.json();
    data.sort((a,b) => (a.sorting > b.sorting) ? 1 : ((b.sorting > a.sorting) ? -1 : 0)); 
    setTasks(data);
  };

  const changeItem = async ({ oldIndex, newIndex }) => {
    const tasksCopy = [...tasks];
    setTasks(arrayMove(tasksCopy, oldIndex, newIndex));
    const taskId = tasksCopy.map((t) => t._id);

    const res = await fetch("http://localhost:4000/tasks", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskId),
    });
    await res.json();
    getTasks();
   
  };

  return <SortableList items={tasks} onSortEnd={changeItem} />;
};

function App() {
  return (
    <Fragment>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-4 mx-auto text-center">
            <SortableComponent />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default App;
