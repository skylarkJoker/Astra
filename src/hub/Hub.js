import React, { Component } from "react";
import {
  Fab,
  Grid,
  TextField,
  Icon,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  DialogContentText,
  Button
} from "@material-ui/core";
import ListContainer from "./ListContainer";

const Transition = props => {
  return <Slide direction="up" {...props} />;
};

class Hub extends Component {
  state = {
    open: false,
    fullWidth: true,
    maxWidth: "sm",
    task: {
      id: 0,
      name: "",
      description: "",
      status: "todo",
      timestamp: "",
      createdBy: "Person",
      deptID: "",
      follow: []
    },
    todo: [
      {
        id: 1,
        name: "Task 1",
        description: "Do this",
        status: "ongoing",
        timestamp: "",
        createdBy: "Peron",
        editedOn: "",
        deptID: "2",
        follow: []
      },
      {
        id: 2,
        name: "Task 2",
        description:
          "A full sentence about nothing. It exists only the fill the emptiness of the void.",
        status: "todo",
        timestamp: "30/01/2019 08:38:08AM",
        createdBy: "Person",
        deptID: "3",
        editedOn: "",
        follow: [
          {
            id: 1,
            name: "follow up",
            reason: "something blew up",
            timestamp: "30/01/2019 08:38:08AM",
            createdBy: "Person"
          },
          {
            id: 2,
            name: "follow up",
            reason: "it fixed itself. No further questions",
            timestamp: "01/02/2019 08:38:08AM",
            createdBy: "Person"
          }
        ]
      },
      {
        id: 3,
        name: "Task 3",
        description: "Whenever",
        status: "completed",
        editedOn: "",
        timestamp: "",
        createdBy: "Person",
        deptID: "4",
        follow: []
      },
      {
        id: 5,
        name: "Task 4",
        description: "Delegate",
        status: "todo",
        timestamp: "",
        editedOn: "",
        createdBy: "Person",
        deptID: "2",
        follow: []
      }
    ]
  };

  deleteTask = task => {
    this.setState(state => {
      let todo = state.todo.filter(i => i.id !== task.id);
      return {
        todo
      };
    });
  };

  openDialog = () => {
    this.setState({ open: true });
  };

  closeDialog = () => {
    this.setState({ open: false });
  };

  handleChange = e => {
    let target = e.target;

    this.setState(prevState => ({
      task: { ...prevState.task, [target.id]: target.value }
    }));
  };

  updateTask = (updatedTask, updateStatus) => {
    let newStat = updatedTask.status;
    if (updateStatus) {
      switch (updatedTask.status) {
        case "todo":
          newStat = "ongoing";
          updatedTask.startedOn = new Date().toString();
          break;
        case "ongoing":
          newStat = "completed";
          updatedTask.completedOn = new Date().toString();
          break;

        default:
          newStat = "todo";
          break;
      }
    }

    updatedTask.status = newStat;
    updatedTask.updatedBy = "Person";
    updatedTask.editedOn = new Date().toString();

    this.setState(state => {
      let todo = state.todo.map(task => {
        if (updatedTask.id === task.id) {
          return updatedTask;
        } else {
          return task;
        }
      });
      return {
        todo
      };
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState(state => {
      let task = state.task;
      task.id = state.todo[state.todo.length - 1].id + 1;
      let timestamp = new Date();
      task.timestamp = timestamp.toString();
      task.editedOn = "";
      return {
        task
      };
    });

    this.setState(state => {
      let todo = state.todo.concat(state.task);
      return {
        todo
      };
    });

    this.closeDialog();
  };
  render() {
    return (
      <div>
        <Grid container spacing={24} justify="center" alignItems="flex-start">
          <Grid item xs={12} md={4} lg={3}>
            <ListContainer
              title="todo"
              updateTask={this.updateTask}
              deleteTask={this.deleteTask}
              list={this.state.todo}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <ListContainer
              title="ongoing"
              updateTask={this.updateTask}
              deleteTask={this.deleteTask}
              list={this.state.todo}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <ListContainer
              title="completed"
              updateTask={this.updateTask}
              deleteTask={this.deleteTask}
              list={this.state.todo}
            />
          </Grid>
          <Grid container justify="center" item xs={12}>
            <Fab
              onClick={() => {
                this.openDialog();
              }}
              color="secondary"
              aria-label="Add"
            >
              <Icon>add</Icon>
            </Fab>
            <Dialog
              fullWidth={this.state.fullWidth}
              maxWidth={this.state.maxWidth}
              open={this.state.open}
              TransitionComponent={Transition}
              onClose={this.closeDialog}
              aria-labelledby="add-dialog-title"
            >
              <DialogTitle id="add-dialog-title">Create a new task</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Here you can create a new task!
                </DialogContentText>
                <form>
                  <TextField
                    margin="dense"
                    id="name"
                    label="Task Name"
                    type="text"
                    fullWidth
                    onChange={this.handleChange}
                  />
                  <TextField
                    margin="dense"
                    id="description"
                    label="Description"
                    type="text"
                    fullWidth
                    onChange={this.handleChange}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleSubmit}
                  >
                    Add Task
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Hub;
