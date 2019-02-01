import React, { Component } from "react";
import {
  DialogContentText,
  TextField,
  IconButton,
  Button,
  Checkbox,
  Paper,
  Typography,
  Icon,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  withStyles,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Chip,
  Fab
} from "@material-ui/core";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";

const style = theme => ({
  container: { padding: "20px" },
  paper: {
    padding: "20px"
  },
  fp: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText
  },
  fab: {
    position: "absolute",
    bottom: "20px",
    right: "20px"
  },
  addFp: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText
  },
  fabCol: {
    backgroundColor: theme.palette.primary.main
  }
});

const Transition = props => {
  return <Slide direction="up" {...props} />;
};

class ListContainer extends Component {
  state = {
    editFields: false,
    hidden: false,
    checked: false,
    open: false,
    fullWidth: true,
    maxWidth: "sm",
    task: { updatedBy: "", editedOn: "", follow: [] },
    subtask: {
      id: 0,
      name: "",
      reason: "",
      timestamp: "",
      createdBy: "Person"
    }
  };

  toggleEditMode = () => {
    this.setState({
      editFields: !this.state.editFields
    });
  };

  updateTaskStatus = task => e => {
    setTimeout(() => {
      this.props.updateTask(task, true);
    }, 250);
  };

  handleClick = () => {
    this.setState({ checked: !this.state.checked });
  };

  handleOpen = () => {
    this.setState({ checked: true });
  };

  handleClose = () => {
    this.setState({ checked: false });
  };

  openDialog = item => {
    this.setState({ open: true, task: item });
  };

  closeDialog = () => {
    this.setState({ open: false });
    this.hideAddSubtask();
  };

  showAddSubtask = () => {
    this.setState({ hidden: true });
  };

  hideAddSubtask = () => {
    this.setState({ hidden: false });
  };

  deleteTask = task => {
    this.props.deleteTask(task);
    this.closeDialog();
  };

  handleTaskUpdate = e => {
    let target = e.target;
    this.setState(state => ({
      task: { ...state.task, [target.id]: target.value }
    }));
  };

  handleChange = e => {
    let target = e.target;

    this.setState(prevState => ({
      subtask: { ...prevState.subtask, [target.id]: target.value }
    }));
  };

  handleSubmit = () => {
    this.setState(state => {
      let subtask = state.subtask;
      if (state.task.follow.length > 0) {
        subtask.id = state.task.follow[state.task.follow.length - 1].id + 1;
      } else {
        subtask.id = 1;
      }
      let timestamp = new Date();
      subtask.timestamp = timestamp.toString();
      return {
        subtask
      };
    });

    this.setState(
      state => {
        let subtasks = [...state.task.follow, state.subtask];
        return {
          task: { ...state.task, follow: subtasks }
        };
      },
      () => {
        this.props.updateTask(this.state.task, false);
      }
    );

    this.hideAddSubtask();
  };

  updateTask = () => {
    this.toggleEditMode();
    this.props.updateTask(this.state.task, false);
  };

  deleteSubtask = subtask => {
    this.setState(
      state => {
        let subtasks = state.task.follow.filter(item => item.id !== subtask.id);
        return {
          task: { ...state.task, follow: subtasks }
        };
      },
      () => {
        this.props.updateTask(this.state.task, false);
      }
    );
  };

  render() {
    const { classes } = this.props;
    const { task } = this.state;
    const list = this.props.list.filter(
      item => item.status === this.props.title
    );
    return (
      <div className={classes.container}>
        <Paper className={classes.paper}>
          <Typography variant="h4">{this.props.title}</Typography>
          <List>
            {list.map(item => {
              return (
                <ListItem
                  button
                  onClick={() => {
                    this.openDialog(item);
                  }}
                  key={item.id}
                >
                  <ListItemIcon>
                    <Icon>assignment</Icon>
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="body1">{item.name}</Typography>
                  </ListItemText>
                  {this.props.title !== "completed" ? (
                    <ListItemSecondaryAction>
                      <Checkbox onChange={this.updateTaskStatus(item)} />
                    </ListItemSecondaryAction>
                  ) : null}
                </ListItem>
              );
            })}
          </List>
        </Paper>
        {/* Task Information Dialog */}
        <Dialog
          fullWidth={this.state.fullWidth}
          maxWidth={this.state.maxWidth}
          open={this.state.open}
          TransitionComponent={Transition}
          onClose={this.closeDialog}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle disableTypography={true} id="form-dialog-title">
            <div hidden={this.state.editFields}>
              <Typography variant="h6" hidden={this.state.editFields}>
                {task.name}
              </Typography>
            </div>

            <div hidden={!this.state.editFields}>
              <TextField
                id="name"
                value={task.name}
                onChange={this.handleTaskUpdate}
                margin="dense"
                hidden={!this.state.editFields}
              />
            </div>
            <Typography variant="subtitle1">by {task.createdBy}</Typography>
            <Typography variant="subtitle1">{task.timestamp}</Typography>
            {task.editedOn !== "" ? (
              <Typography variant="overline">
                edited by {task.updatedBy} on {task.editedOn}
              </Typography>
            ) : null}
          </DialogTitle>
          <DialogContent>
            <div hidden={this.state.hidden}>
              <Typography variant="h6">Description</Typography>
              <div hidden={!this.state.editFields}>
                <TextField
                  id="description"
                  value={task.description}
                  onChange={this.handleTaskUpdate}
                  margin="dense"
                  fullWidth
                />
              </div>
              <div hidden={this.state.editFields}>
                <Typography variant="body2">{task.description}</Typography>
              </div>
              <Typography variant="h6">Status</Typography>
              <Chip label={task.status} color="secondary" />
              {task.follow.length > 0 ? (
                <Chip label="follow up" className={classes.fp} />
              ) : null}
              {task.follow.length > 0 ? (
                <div>
                  <Typography variant="h6">Follow Up</Typography>
                  <List>
                    {task.follow.map((subtask, index) => {
                      return (
                        <ListItem key={index}>
                          <ListItemText
                            primary={`${subtask.name} by ${subtask.createdBy}`}
                            secondary={
                              <React.Fragment>
                                <Typography component="span">
                                  {subtask.reason}
                                </Typography>
                                {subtask.timestamp}
                              </React.Fragment>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              aria-label="Delete"
                              onClick={() => {
                                this.deleteSubtask(subtask);
                              }}
                            >
                              <Icon>delete</Icon>
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    })}
                  </List>
                </div>
              ) : null}
            </div>
            <div hidden={!this.state.hidden}>
              <DialogContentText>
                Here you can add a follow up task!
              </DialogContentText>
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
                id="reason"
                label="Description"
                type="text"
                fullWidth
                onChange={this.handleChange}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  this.handleSubmit();
                }}
              >
                Add Task
              </Button>
            </div>
          </DialogContent>
          {this.state.editFields ? (
            <Fab
              className={classes.fab}
              color="secondary"
              onClick={() => {
                this.updateTask();
              }}
            >
              <Icon>done</Icon>
            </Fab>
          ) : null}
          {task.status !== "completed" && !this.state.editFields ? (
            <SpeedDial
              className={classes.fab}
              ariaLabel="SpeedDial example"
              icon={<Icon>edit</Icon>}
              onBlur={this.handleClose}
              onClick={this.handleClick}
              onClose={this.handleClose}
              onFocus={this.handleOpen}
              onMouseEnter={this.handleOpen}
              onMouseLeave={this.handleClose}
              open={this.state.checked}
              direction="up"
              classes={{
                fab: classes.fabCol
              }}
            >
              <SpeedDialAction
                classes={{
                  button: classes.addFp
                }}
                icon={<Icon>edit</Icon>}
                tooltipTitle="Edit task"
                onClick={() => {
                  this.toggleEditMode();
                }}
              />
              <SpeedDialAction
                classes={{
                  button: classes.addFp
                }}
                icon={<Icon>add</Icon>}
                tooltipTitle="Add follow up task"
                onClick={() => {
                  this.showAddSubtask();
                }}
              />
              <SpeedDialAction
                classes={{
                  button: classes.addFp
                }}
                icon={<Icon>delete</Icon>}
                tooltipTitle="Delete task"
                onClick={() => {
                  this.deleteTask(task);
                }}
              />
            </SpeedDial>
          ) : null}
        </Dialog>
      </div>
    );
  }
}
export default withStyles(style, { withTheme: true })(ListContainer);
